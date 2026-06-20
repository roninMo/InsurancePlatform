// vite-plugin-devlog.ts
import { Plugin } from 'vite';
import { NodePath, PluginObj, types as t, BabelFile, PluginPass, transformAsync } from "@babel/core";

import { LogRenderData } from './Devlog';
import { devLogCompHierarchyBuilder } from './DevLogCompHierarchyBuilder_React';
import { 
  VariableDeclarator, FunctionDeclaration, 
  ArrowFunctionExpression, FunctionExpression, CallExpression, 
  ImportSpecifier, ImportDefaultSpecifier, ImportNamespaceSpecifier, 
  Node,
  
  isVariableDeclarator, isFunctionDeclaration, 
  isArrowFunctionExpression, isFunctionExpression, isCallExpression,
  isIdentifier, isObjectExpression, isArrayExpression, isBlockStatement, BlockStatement,
  
} from '@babel/types';
import fs from 'fs';
import fPath from 'path';



// #region Types
/** The specific Node types we're accessing react components from. 
 * 
 * ----
 * #### FunctionDeclaration
 * * Function = function myComponent() {}
 * 
 * ----
 * #### ArrowFunctionExpression 
 * * ArrowFunc - VarDecl.init = "const myComp = () => {}"
 * 
 * ----
 * #### FunctionExpression 
 * * const MyComponent = function(props) { return <div /> }
 * 
 * ----
 * #### CallExpression (IIFE or Memo)
 * * IIFE = (() => { return "hello"; })()
 * * Memo = "callee.name: memo, args: [firstItem: any of the above based on how you declared your component, secondItem: same except for the customRerenderProps function]"
*/
type ReactFCType = 
  | FunctionDeclaration 
  | ArrowFunctionExpression
  | FunctionExpression 
  | CallExpression
;


// TODO: component types to account for later: Capture these in one visitor function, and target their files in another, 
// ? This handles processing wrapper/hoc components that are declared in one file, and import another baseComponent (importDeclaration)
type ReactFCImportTypes = 
  | ImportSpecifier 
  | ImportDefaultSpecifier 
  | ImportNamespaceSpecifier
;


interface AstComponentInfo {
  /** this file had a React Component, we'll print logs for it and use it's safe function name for reference */
  componentName: string;
  
  /** An indexed history of this component's logs specifically. Minified for the console */
  componentLogs: Record<number, any>;
  
  /** Cached globally and initialized/cleared during Program -> enter()/exit() */
  fileName: string;
}


interface ComponentData<T extends Node = ReactFCType> {
  node: T;
  path: NodePath<T>;
  sourcePath: NodePath<VariableDeclarator | FunctionDeclaration | T>;
  componentName: string;
}


// #endregion
export function vitePluginDevlog(): Plugin {
  return {
    name: 'vite-plugin-devlog',
    // Enforce running this before standard Vite features so it captures raw source components
    // enforce: 'pre', // This apparently helps, but doesn't seem necessary or worthwhile
    
    async transform(code: string, id: string) {
      // #region File 
      // Look for jsx and tsx files
      const isTargetExtension = /\.(t|j)sx?$/.test(id);
      
      // Skip over test files
      const isTestFile = /\.(test|spec)\.[jt]sx?$/.test(id) || id.includes('__tests__');
      
      // Skip over node_modules
      const isNodeModules = id.includes('node_modules');
      
      // ? Skip if it's not a JS/TS file, OR if it belongs to node_modules or tests
      if (!isTargetExtension || isNodeModules || isTestFile) {
        return null; 
      }
      
      
      // () Add the devlog's contextual functions and props to all of our react components - Runs Babel transformations sequentially
      const result = await transformAsync(code, {
        filename: id,
        sourceMaps: true,
        plugins: [
          /** Adds the compId to every component for creating a component hierarchy, the compName, and renderLogs and component data capture for analyzing component efficiency and behavior. */
          devLogCompHierarchyBuilder()
          // pluginObj1(devLogUtils), // Finds the react components, and captures the location, and other contextual information needed
          // pluginObj2(devLogUtils) // Has a list of the react components found, and their files. Traverses those files, and does logic on them
        ],
      });
      
      return {
        code: result?.code ?? code,
        map: result?.map
      };
    }
  };
}




/** Utilities for finding/accessing data within `React` components. */
export class ReactComponentUtils {
  constructor() {}
  
  
  public getComponentInfo(sourcePath: babel.NodePath<VariableDeclarator | FunctionDeclaration | CallExpression>): ComponentData | undefined {
    const sourceNode = sourcePath?.node;
    let callPath: NodePath<Node | undefined | null> | undefined | null;
    if (!sourcePath || !sourceNode) {
      return undefined;
    } 
    
    // * function myComponent() { ... }
    if (sourcePath.isFunctionDeclaration()) {
      const node = sourcePath.node;
      const funcName = isIdentifier(node.id) ? node.id.name : 'Unknown';
      return { node, path: sourcePath, sourcePath, componentName: funcName };
    }
    
    // * Anything except actual function declarations, and component's wrapped in hooks/functions
    if (sourcePath.isVariableDeclarator()) {
      const initPath = sourcePath.get('init');
      const node = sourcePath.node;
      const varName = isIdentifier(node.id) ? node.id.name : 'Unknown';
      
      // Most of our components are arrow function syntax
      if (initPath.isArrowFunctionExpression()) {
        const arrFuncData: ComponentData<ArrowFunctionExpression> = { node: initPath.node, path: initPath, sourcePath, componentName: varName };
        return arrFuncData;
      }
      
      // For the component's that are declared like functions
      if (initPath.isFunctionExpression()) {
        const funcExpData: ComponentData<FunctionExpression> = { node: initPath.node, path: initPath, sourcePath, componentName: varName };
        return funcExpData;
      }
      
      // ? We can get declared component(const), which are wrapped in memo or forwardRef, which is also a callExpression()
      if (initPath.isCallExpression()) {
        callPath = initPath;
      }
      
      // If it was an identifier pointing to another component // ! If the component was imported, we will not find it here
      if (initPath.isIdentifier()) {
        const binding = initPath.scope.getBinding(initPath.node.name);
        if (binding && this.isValidReactFCType<NodePath>(binding.path)) {
          const refPath = binding.path;
          const isolatedCompData: ComponentData<ReactFCType> = { node: refPath.node, path: refPath, sourcePath, componentName: varName };
          return isolatedCompData;
        }
      }
      
    }
    
    // * Search for memo functions (We aren't using any other hooks, however divvying up the search specific hooks, and just checking arguments will fix this later)
    // ? We combine the callExpressions from the source and from variableDeclarators here
    callPath = callPath ? callPath : sourcePath;
    if (callPath.isCallExpression()) {
      // Find the component's name, check for var declarations
      let varName = isIdentifier((sourcePath as any)?.node?.id) ? (sourcePath as any)?.node?.id?.name : 'Unknown'; // hacky
      const varPath = callPath?.parentPath?.isVariableDeclarator() ? callPath.parentPath : undefined;
      if (varPath) varName = isIdentifier(varPath.node.id) ? varPath.node.id.name : varName;
      
      // The first argument is the component, and the second is the customRerenderPropsFunc or the ref
      const argumentsPath = callPath.get("arguments");
      const componentPath = argumentsPath?.[0];
      if (componentPath && this.isValidReactFCType<NodePath>(componentPath)) {
        const hookCompData: ComponentData<ReactFCType> = { node: componentPath.node, path: componentPath, sourcePath: callPath, componentName: varName };
        return hookCompData;
      }
      
      // If this callee was an identifier pointing to another component // ! If the component was imported, we will not find it here
      if (componentPath.isIdentifier()) {
        const binding = componentPath.scope.getBinding(componentPath.node.name);
        if (binding && this.isValidReactFCType<NodePath>(binding.path)) {
          const refPath = binding.path;
          const isolatedCompData: ComponentData<ReactFCType> = { node: refPath.node, path: refPath, sourcePath: callPath, componentName: varName };
          return isolatedCompData;
        }
      }
    }
    
    
    return undefined;
  }
  
  
  /** Convenience function to check if a path or a node is a valid react component node. */
  public isValidReactFCType
    <T extends NodePath<Node> | Node = Node>(pathOrNode: NodePath<Node> | Node): 
    pathOrNode is T extends NodePath ? NodePath<ReactFCType> : ReactFCType 
  {
    let node: Node;
    
    // It is a NodePath wrapper
    if (typeof pathOrNode === "object" && pathOrNode !== null && "node" in pathOrNode) node = pathOrNode.node;
    
    // It is a raw AST Node
    else if (typeof pathOrNode === "object" && pathOrNode !== null && "type" in pathOrNode) node = pathOrNode;
    
    // Safety fallback for unexpected inputs
    else return false; 
    
    // ? Check that we're dealing with a potential react component
    return (
      isFunctionDeclaration(node) ||
      isArrowFunctionExpression(node) ||
      isFunctionExpression(node) || 
      isCallExpression(node)
    );
  }
  
  
  // #region General Utils
  /** Retrieves the BlockStatement from `VariableDeclarators` and `FunctionDeclarations`. */
  public getCodeFromFuncTypes(path: babel.NodePath<FunctionDeclaration | ArrowFunctionExpression>): BlockStatement | undefined {
    const node = path.node;
    if (!node) return undefined;
    
    // Find out whether we're dealing with an arrow function, or a function declaration
    
    // ? Arrow Function: Check if it contains code, or is a one-liner
    if (t.isArrowFunctionExpression(node)) {
      if (t.isBlockStatement(node.body)) return node.body;
      else return undefined;
    }
    
    // ? Normal function syntax
    if (t.isFunctionDeclaration(node)) { // function myComponent() {}
      return node.body;
    }
    
    return undefined;
  }
  
  
  /** 
   * Checks whether this is a valid react jsx component, not just a function 
   * * Currently used for FunctionDeclaration and ArrowFunctionExpression nodes
   * 
   * ----
   * Validation Criteria:
   * 1. Does this function live on the root of the file, or is it nested within a component or another function?
   * 2. Does it only return JSX/HTML? (no brackets, just a return(<div> Content Component </div>)  // TODO - Should we account for Services and other non react jsx components?
   * 3. Does the component (with code) return JSX/HTML?
   * 
   * @returns true if it's a valid react component
  */
  public isReactComponent(path: babel.NodePath<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression | CallExpression | VariableDeclarator>): boolean {
    let name: string = isIdentifier((path as any)?.node?.id) ? (path as any)?.node?.id?.name || 'Unknown' : 'Unknown';
    const node = path.node;
    if (!node) {
      return false;
    }
    
    // TODO: first the todo below, but see if the type's are similar and safe enough to combine these funcs. So there's not multiple functions with redundant checks for different types 
    
    // ? Arrow Function: Check if it contains code, or is a one-liner
    if (path.isArrowFunctionExpression()) { // const MyComponent = () => 
      // if (logs) logs[Object.keys(logs).length] = { "${name}(ArrowFunctionExp)": JSON.stringify(path.getSource(), ['name', 'id', 'init', 'params', 'properties', 'key'], 2)  };
      // if (logs) logs[Object.keys(logs).length] = { [`${name}(ArrowFunctionExp)`]: { sourceCode: prettifySource(path) } };
      this.addLog({ [`${name}(ArrowFunctionExp)`]: this.getSafeNodeInfo(path) });
      return this.isJsxArrowComponent(path, this.logs);
    }
    
    // ? Normal function syntax
    if (path.isFunctionDeclaration()) { // function myComponent() {}
      this.addLog({ [`${name}(FunctionDeclaration)`]: this.getSafeNodeInfo(path) });
      return this.isJsxComponent(path);
    }
    
    // ? From VariableDeclarator: Find what type of component it is
    // TODO: Can we check this before we do the expression checks, and convert this as the used path?
    if (path.isVariableDeclarator()) {
      this.addLog({ [`${name}(VariableDeclarator)`]: this.getSafeNodeInfo(path) });
      
      // Check if this is a PascalCase component name
      const isPascalCase = /^[A-Z]/.test(name);
      if (!isPascalCase) return false;
      
      // Check that the function is a react component
      const initPath = path.get('init');
      if (initPath.isArrowFunctionExpression()) {
        return this.isJsxArrowComponent(initPath);
      }
    }
    
    return false;
  }
  
  
  /** 
   * Returns true if this is a memoized component. Don't try to access the nodes because we can't safely retrieve the `name` from the individual nodes inside the memo(node).
   * * Checks that the `VariableDeclarator`'s name is memo, and that the first argument is a valid function type.
  */
  public isMemoComponent(path: babel.NodePath<VariableDeclarator>): boolean {
    const varPath = path.get('init');
    if (!varPath) return false;
    
    // Retrieve the function name from the VariableDeclarator
    let callExpressionName: string = '';
    let args: (t.ArgumentPlaceholder | t.SpreadElement | t.Expression)[] | undefined;
    
    // If this the variableDeclarator defines a memo function
    if (varPath.isCallExpression() && isIdentifier(varPath.node.callee)) {
      const callee = varPath.node.callee;
      if (isIdentifier(callee)) { 
        callExpressionName = varPath.node.callee.name;
        args = varPath.node.arguments;
      }
    }
    
    // <- If it isn't a memo function, return
    if (callExpressionName !== 'memo' || !args) return false;
    
    // Check the function types
    const argsPaths = varPath.get('arguments'); // args?.[0]
    if (!Array.isArray(argsPaths) || argsPaths.length === 0) return false;
    
    const compRef = argsPaths[0]; // args?.[0]
    if (compRef.isArrowFunctionExpression()) return true;
    if (compRef.isFunctionExpression()) return true;
    if (compRef.isIdentifier()) {
      const binding = compRef.scope.getBinding(compRef.node.name);
      if (binding?.path?.isFunctionDeclaration()) return true;
    }
    return false;
  }
  
  
  /** 
   * Retrieves the **React component** from a memoized function in AST. Searches from `VariableDeclarators` because we need reliable access to the component's name inside the memo.
   * * If it doesn't safely find the react component, it will return undefined
   * * If we found an arrow function, we create a `VariableDeclarator`, so we can pass the function's proper name to it (only for the actual react-component)
   * 
   * ----
   * @returns         An object containing the component's name, the react component, and it's custom rerenderFunction.
  */
  public getReactComponentFromMemo(path: babel.NodePath<VariableDeclarator>):
    { 
      component: FunctionDeclaration | FunctionExpression | VariableDeclarator, 
      customRerenderFunc: ArrowFunctionExpression | FunctionDeclaration | FunctionExpression | undefined 
    } | undefined
  {
    const varPath = path.get('init');
    if (!varPath) return;
    
    // Retrieve the function name from the VariableDeclarator
    let functionName: string = isIdentifier(path.node.id) ? path.node.id.name : 'Unknown';
    let callExpressionName: string = '';
    let args: (t.ArgumentPlaceholder | t.SpreadElement | t.Expression)[] | undefined;
    
    // If this the variableDeclarator defines a memo function
    if (!varPath.isCallExpression() || !isIdentifier(varPath.node.callee)) return;
    const callee = varPath.node.callee;
    if (isIdentifier(callee)) { 
      callExpressionName = varPath.node.callee.name;
      args = varPath.node.arguments;
    }
    
    // <- If it isn't a memo function, return
    if (callExpressionName !== 'memo' || !args) return undefined;
    
    // {} We need to extract the actual function references from these. They can be: 
    //   - ArrowFunctionExpression: const ComponentA = memo((props) => {});
    //   - FunctionDeclaration(from Identifier): const MemoComponent = memo(ComponentA);
    //   - FunctionExpression: const MemoComponent = memo(function(props) {})
    // The same is true for the optional customRerenderFunction 
    
    const argsPaths = varPath.get('arguments'); // Check the function types
    if (!Array.isArray(argsPaths) || argsPaths.length === 0) return undefined;
    const compRef = argsPaths[0]; // args?.[0]
    const customRerenderFuncRef = argsPaths?.[1]; // args?.[1]
    let reactComponent: VariableDeclarator | FunctionDeclaration | FunctionExpression | undefined;
    let customRerenderFunc: ArrowFunctionExpression | FunctionDeclaration | FunctionExpression | undefined;
    for (let i = 0; i < [compRef, customRerenderFuncRef].length; i++) {
      const func = i === 0 ? compRef : customRerenderFuncRef;
      if (!func || Array.isArray(func) || !func.node) continue; // for the optional customRerenderProps function in a memo
      
      // If it's an arrow function inside the memo
      if (func.isArrowFunctionExpression()) { // TODO: if we want this function's name safely, we need to create a variableDeclarator return
        const compName = t.identifier(functionName);
        const arrowFuncExp = func.node;
        const varDeclarator = t.variableDeclarator(compName, arrowFuncExp);
        
        if (i === 0) reactComponent = varDeclarator;
        else customRerenderFunc = func.node;
      }
      // If the function is declared in the memo like const ComponentA = memo(function(props) {});
      else if (func.isFunctionExpression()) {
        // Add the component's name to FunctionExpressions where it's id reference is usually null
        func.node.id = t.identifier(functionName);
        
        if (i === 0) reactComponent = func.node;
        else customRerenderFunc = func.node;
      }
      // If it's a standard function declared outside of the - memo(ComponentA)
      else if (func.isIdentifier()) {
        const binding = func.scope.getBinding(func.node.name);
        if (binding?.path?.isFunctionDeclaration()) {        
          // Change it's identifier directly to the actual component's name, what's used in the jsx ->  const useThisName = memo(refFuncName)
          const funcDeclNode = binding.path.node as FunctionDeclaration;
          funcDeclNode.id = t.identifier(functionName);
          
          if (i === 0) reactComponent = binding.path.node;
          else customRerenderFunc = binding.path.node;
        }
      }
    }
    
    // -> Return the memoized Function/ArrowFunction
    if (!reactComponent) return undefined;
    return {
      component: reactComponent,
      customRerenderFunc
    }
  } 
  
  
  // #endregion
  // #region Visitor::FunctionDeclaration Search Utils
  /**
   * Determines if an FunctionDeclaration node is a valid React Component.
   * Criteria: Must live at the module root (un-nested) and must return a JSX Element.
   */
  protected isJsxComponent(path: babel.NodePath<FunctionDeclaration>): boolean {
    const node = path.node;
    if (!node) return false;
    
    // ? Does is have a PascalCase name?
    let name: string = isIdentifier(path.node.id) ? path.node.id.name : '';
    const isPascalCase = /^[A-Z]/.test(name);
    if (!isPascalCase) return false;
    
    // ? Is it nested?
    // Check the parent structure. If it is wrapped in an array map, an event handler, 
    // or another function, its immediate parent will NOT be the file root ("Program").
    // Using path.scope.parentBlock safely accounts for standard files AND direct 'export function' modules!
    if (path.scope.parentBlock && !t.isProgram(path.scope.parentBlock)) {
      return false; // Exit immediately if it's nested deep inside anything!
    }
    
    // ? Does it return JSX/HTML?
    const body = path.node.body;
    if (t.isJSXElement(body) || t.isJSXFragment(body)) {
      return true;
    }
    
    // Block Returns (e.g., () => { return <div />; })
    // ? We must scan the lines inside the brackets to see if a ReturnStatement outputs JSX.
    let returnsJsx = false;
    path.traverse({
      ReturnStatement(returnPath) {
        const arg = returnPath.node.argument;
        if (t.isJSXElement(arg) || t.isJSXFragment(arg)) {
          returnsJsx = true;
          returnPath.stop(); // Found it! Stop searching this function.
        }
      }
    });
    
    return returnsJsx;
  }
  
  public functionHasNoArgs(): boolean {
    return true;
  }
  
  public functionHasNoDestructuredArgs(): boolean {
    return true;
  }
  
  
  
  
  // #endregion
  // #region Visitor::ArrowFunctionExpression Search Utils
  /**
   * Determines if an ArrowFunctionExpression node is a valid React Component.
   * Criteria: Must live at the module root (un-nested) and must return a JSX Element.
   */
  protected isJsxArrowComponent(path: babel.NodePath<ArrowFunctionExpression>, logs?: Record<number, any>): boolean {
    // ? Is it nested?
    // path.parentPath is the VariableDeclarator
    // path.parentPath.parentPath is what holds the statement (e.g. Program, ExportNamedDeclaration)
    const declarationPath = path?.parentPath?.parentPath?.parentPath; // ArrowFunc -> VarDeclarator -> VarDeclaration -> isRoot?
    const isRootLevel = 
      declarationPath?.isProgram() ||                 // This is at the root of the file, i.e. not a nested component.
      declarationPath?.isExportNamedDeclaration()     // e.x. export const myComponent = () => {};
      declarationPath?.isExportDefaultDeclaration();  // e.x. export default function myComponent() {}
    
    // ? If it isn't at the root of the file (isProgram), or an 
    if (!declarationPath || !isRootLevel) {
      this.addLog({ 
        "This was a nested function, or something happened with the declarationPath, data: ": {
          isProgram: declarationPath?.isProgram(),
          isExportNamedDeclaration: declarationPath?.isExportNamedDeclaration(),
          isExportDefaultDeclaration: declarationPath?.isExportDefaultDeclaration(),
        }
      });
      return false;
    }
    this.addLog({
      'isRootLevel data': {
        isProgram: declarationPath?.isProgram(),
        isExportNamedDeclaration: declarationPath?.isExportNamedDeclaration(),
        isExportDefaultDeclaration: declarationPath?.isExportDefaultDeclaration(),
        parentData: this.getSafeNodeInfo(path?.parentPath),
        declarationPathData: this.getSafeNodeInfo(declarationPath)
      }
    });
    
    // Implicit Return (e.g., () => <div />)
    // ? Does it return JSX/HTML?
    const body = path.node.body;
    if (t.isJSXElement(body) || t.isJSXFragment(body)) {
      this.addLog({ "Pass: implicitly returns html. e.g., () => <div />": path.node.type });
      return true;
    }
    
    // Block Returns (e.g., () => { return <div />; })
    // ? We must scan the lines inside the brackets to see if a ReturnStatement outputs JSX.
    const self = this;
    this.addLog(`checking if it's blockStatement has a jsx return statement. `);
    let returnsJsx = false;
    path.traverse({
      // Skip nested function's return statements
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(nestedPath) { nestedPath.skip(); },
      
      // ? Find the first jsx return statement
      ReturnStatement(returnPath) {
        self.addLog({ 'ReturnStatement': self.getSafeNodeInfo(returnPath.get('argument')) });
        const argNode = returnPath.node.argument;
        
        // Check for raw jsx elements
        returnsJsx = t.isJSXElement(argNode) || t.isJSXFragment(argNode);
        
        // Check for babel's compiled jsx code (JsxDev CallExpressions)
        if (!returnsJsx && t.isCallExpression(argNode)) {
          const callee = argNode.callee;
          if (t.isIdentifier(callee)) {
            returnsJsx = ['jsxDEV', 'jsx', 'jsxs', 'createElement'].includes(callee.name);
          }
        }
        
        if (returnsJsx) {
          self.addLog("Pass: Found a valid html return statement!");
          returnsJsx = true;
          returnPath.stop(); // Found it! Stop searching this function.
        }
      }
    });
    
    return returnsJsx;
  }
  
  
  public getArrowFunctionExpName(path: NodePath<ArrowFunctionExpression>): string {
    return '';
  }
  
  
  
  
  // #endregion
  // #region Visitor::VariableDeclarator Search Utils
  
  
  
  
  // #endregion
  // #region Component Props and React Hooks
  /**
   * Helper inside your custom React utility class.
   * Safely processes a function's parameters, regardless of whether 
   * it came from a FunctionDeclaration or a VariableDeclarator.
   */
  public getComponentProps(paramsArray: any[]): { type: string, name?: string, keys?: (string | null)[] } {
    if (!paramsArray || paramsArray.length === 0) return { type: "none" };
    
    const firstParam = paramsArray[0];
    if (t.isIdentifier(firstParam)) {
      return { type: "plain", name: firstParam.name }; // e.g., (props)
    }
    
    if (t.isObjectPattern(firstParam)) {
      const keys = firstParam.properties.map((prop) => {
        if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
          return prop.key.name; // Standard destructured keys
        }
        if (t.isRestElement(prop) && t.isIdentifier(prop.argument)) {
          return `...${prop.argument.name}`; // Rest assignments
        }
        return null;
      }).filter(Boolean);
      
      return { type: "destructured", keys };
    }
    
    return { type: "unknown" };
    
    /* 
      ? Example usage
      visitor: {
        FunctionDeclaration(path) {
          // Pass the function parameters directly
          const propsInfo = extractPropsMetadata(path.node.params);
        },
        VariableDeclarator(path) {
          const init = path.node.init;
          if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
            // Pass the inner expression parameters directly
            const propsInfo = extractPropsMetadata(init.params);
          }
        }
      }
    */
  }
  
  
  public getHooks(startPath: babel.NodePath<FunctionDeclaration | ArrowFunctionExpression>): Partial<LogRenderData> {
    if (!startPath || !startPath.node) return {};
    const code = this.getCodeFromFuncTypes(startPath);
    if (!code) return {};
    
    // Create the LogRenderData state hooks structs
    let renderInformation: Partial<LogRenderData> = {
      stateHooks: [],
      reducers: [],
      contexts: [],
    };
    startPath.traverse({
      VariableDeclarator(path) {
        const node = path.node;
        if (!node) return;
        
        // UseState and UseContext hooks
        const funcNode = node.init;
        if (t.isCallExpression(funcNode)) {
          const calleeNode = funcNode.callee;
          if (t.isIdentifier(calleeNode)) {
            // Capture the useState's state variable
            if (calleeNode.name === 'useState' && t.isArrayPattern(node.id)) {
              const stateHook = node.id.elements?.[0];
              if (t.isIdentifier(stateHook) && stateHook.name) renderInformation.stateHooks?.push(stateHook.name);
            }
            
            // Capture the useContext's variable name
            if (calleeNode.name === 'useContext' && t.isIdentifier(node.id)) {
              const contextHook = node.id.name;
              if (contextHook) renderInformation.contexts?.push(contextHook);
            }
            
            // Capture the useReducer's state variable
            if (calleeNode.name === 'useReducer' && t.isArrayPattern(node.id)) {
              const reducerHook = node.id.elements?.[0];
              if (t.isIdentifier(reducerHook) && reducerHook.name) renderInformation.reducers?.push(reducerHook.name);
            }
          }
        }
      }
    })
    
    return renderInformation;
  }
  
  
  public getStateHooks(path: babel.NodePath<FunctionDeclaration | ArrowFunctionExpression>): any[] {
    if (!path || !path.node) return [];
    const code = this.getCodeFromFuncTypes(path);
    if (!code) return [];
    
    const hooks: any[] = [];
    path.traverse({
      VariableDeclarator(path) {
        const node = path.node;
        if (!node) return;
        
        // Capture the useState's state variable
        const funcNode = node.init;
        if (t.isCallExpression(funcNode)) {
          const calleeNode = funcNode.callee;
          
          if (t.isIdentifier(calleeNode)) {
            if (calleeNode.name === 'useState' && t.isArrayPattern(node.id)) {
              const stateHook = node.id.elements?.[0];
              if (t.isIdentifier(stateHook) && stateHook.name) hooks.push(stateHook.name);
            }
          }
        }
      }
    })
    
    return hooks;
  }
  
  
  public getContextHooks(path: babel.NodePath<FunctionDeclaration | ArrowFunctionExpression>): any[] {
    if (!path || !path.node) return [];
    const code = this.getCodeFromFuncTypes(path);
    if (!code) return [];
    
    const contexts: any[] = [];
    path.traverse({
      VariableDeclarator(path) {
        const node = path.node;
        if (!node) return;
        
        // Capture the useContext's variable name
        const funcNode = node.init;
        if (t.isCallExpression(funcNode)) {
          
          const calleeNode = funcNode.callee;
          if (t.isIdentifier(calleeNode)) {
            if (calleeNode.name === 'useContext' && t.isIdentifier(node.id)) {
              const contextHook = node.id.name;
              if (contextHook) contexts.push(contextHook);
            }
          }
        }
      }
    })
    
    return contexts;
  }
  
  
  public getReducerHooks(path: babel.NodePath<FunctionDeclaration | ArrowFunctionExpression>): any[] {
    if (!path || !path.node) return [];
    const code = this.getCodeFromFuncTypes(path);
    if (!code) return [];
    
    const reducers: any[] = [];
    path.traverse({
      VariableDeclarator(path) {
        const node = path.node;
        if (!node) return;
        
        // Capture the useReducer's state variable
        const funcNode = node.init;
        if (t.isCallExpression(funcNode)) {
          const calleeNode = funcNode.callee;
          if (t.isIdentifier(calleeNode)) {
            
            // Capture the useReducer's state variable
            if (calleeNode.name === 'useReducer' && t.isArrayPattern(node.id)) {
              const reducerHook = node.id.elements?.[0];
              if (t.isIdentifier(reducerHook) && reducerHook.name) reducers?.push(reducerHook.name);
            }
          }
        }
      }
    })
    
    return reducers;
  }
  
  
  
  
  // #endregion
  // #region Logging in the dev console
  /** The relative path to where you want to store the log history for your project.  */
  public abstractSyntaxTreeLogHistoryLoc: string = './src/assets/astCompLogs.json';
  
  /** The cached logs of all components in a specific file. During **Program.exit()**, we store these in a file to display in google chrome's *dev console*. */
  public fileComponentLogs: Record<string, AstComponentInfo> = {};
  
  /** The stored logs for a specific component during one of the visitor functions */
  public logs = {
    data: {} as Record<number, any>,
    safeIncrementCounter: 0,
    
    /** Adds the log to the next index */
    add: (log: any) => {
      this.logs.data[this.logs.nextIndex] = log;
    },
    
    /** The next safe index */
    get nextIndex(): number {
      return Math.max(...Object.keys(this.data).map(Number)) + 1;
    },
    
    /** Getter for length */
    get len(): number {
      return Object.keys(this.data).length;
    },
    
    /** Clear the logs for the current component. */
    clear: () => {
      this.logs.data = {};
    }
  };
  
  /** Convenience function for adding a log to a component's cached logs during the Visitor function  */
  public addLog(log: any): void {
    this.logs.add(log);
  }
  
  
  /** 
   * Add a component's log history to the fileComponentLogs. 
   * * Each component is captured while traversing a file, and the data is stored locally to print out in the dev console on load. See *{@link syntaxTreeLogs_addHistoryToFile()}*.
   * 
   * ----
   * @note We use **{@link logs|The cached log history}** that's stored within this utils class.
   */
  public addComponentLogData(name: string, fileName: string = "Unknown"): void {
    this.fileComponentLogs[name] = {
      componentName: name,
      componentLogs: this.logs,
      fileName
    }
  }
  
  /** Call this after storing the abstract syntax tree's log history to a file via *{@link syntaxTreeLogs_addHistoryToFile()}*. */
  public clearFileComponentLogs(clearLogsVarCache: boolean = true): void {
    this.fileComponentLogs = {};
    if (clearLogsVarCache) this.logs.clear();
  }
  
  /** At the beginning of the plugin, clear the history before you run any logic. */
  public syntaxTreeLogs_clearFileHistory(): void {
    const cachedCompLogsFilePath = fPath.resolve(process.cwd(), this.abstractSyntaxTreeLogHistoryLoc);
    fs.writeFileSync(cachedCompLogsFilePath, "{}");
  }
  
  
  /** Adds log information to the specified file location from **{@link abstractSyntaxTreeLogHistoryLoc}**. */
  public syntaxTreeLogs_addHistoryToFile<T extends Record<string, any> = Record<string, any>>(logs: any): void {
    // ? Read existing accumulated logs from previous files (if any exist)
    let accumulatedLogs = {} as T;
    const cachedCompLogsFilePath = fPath.resolve(process.cwd(), this.abstractSyntaxTreeLogHistoryLoc);
    
    // try loading existing data
    if (fs.existsSync(cachedCompLogsFilePath)) { 
      try {
        accumulatedLogs = JSON.parse(fs.readFileSync(cachedCompLogsFilePath, 'utf-8'));
        // console.log(`added data to file: `, accumulatedLogs);
      } catch (e) {
        accumulatedLogs = {} as T;
        // console.log(`threw an error parsing the data: `, e);
      }
    } // else console.log('did not find current data in the file?');
    
    // Add the new data to the current
    accumulatedLogs = { ...accumulatedLogs, ...logs};
    fs.writeFileSync(cachedCompLogsFilePath, JSON.stringify(accumulatedLogs, null, 2)); // Persist the updated data right back down to disk
  }
  
  
  /**
   * Recursively extracts a safe, clean JSON object representation of a Babel AST NodePath.
   * Speeds up execution by swapping deep 'BlockStatement' bodies with fast source text strings
   * while maintaining the structural node type.
   */
  public getSafeNodeInfo(pathContext: babel.NodePath<any> | null | undefined): any {
    const node = pathContext?.node;
    if (!pathContext || !node) {
      return null;
    }
    
    // If it's a block statement, just pretty print the source code. It takes too much time to recursively return this information
    if (pathContext.isBlockStatement() && Array.isArray(node.body)) {
      return {
        type: node.type,
        // Retained your block statement changes: Split by newlines for Chrome DevTools
        sourceCodeBlock: typeof pathContext.getSource === 'function' 
          ? pathContext.getSource().split(/\r?\n/) 
          : "[Source Unavailable]"
      };
    }
    
    // Properties to skip to prevent circular loops, noise, and private fields
    const propertiesToSkip = new Set([
      'parent', 'parentPath', 'hub', 'state', 'container', '_container', 
      'loc', 'start', 'end', 'range', 'tokens', 'extra', 
      'leadingComments', 'trailingComments'
    ]);
    
    // Iterate over the keys of the current node
    const cleanNode: Record<string, any> = {};
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        if (propertiesToSkip.has(key)) continue;
        if (key.startsWith('_')) continue;
        
        // Handle child properties that are arrays (e.g., path.get('params'))
        const value = (node as any)[key];
        if (Array.isArray(value)) {
          const listPaths = pathContext.get(key);
          
          if (Array.isArray(listPaths)) {
            cleanNode[key] = listPaths.map(childPath => this.getSafeNodeInfo(childPath));
          } else {
            // Fallback if path.get didn't return an array matching the node data structure
            cleanNode[key] = [];
          }
        } 
        
        // Handle child properties that are nested nodes (e.g., path.get('body'))
        else if (value && typeof value === 'object' && typeof value.type === 'string') {
          const childPath = pathContext.get(key);
          // Ensure we successfully resolved a single NodePath before recursing
          if (childPath && !Array.isArray(childPath)) cleanNode[key] = this.getSafeNodeInfo(childPath);
          else cleanNode[key] = null;
        } 
        
        // Handle primitive values (strings, booleans, numbers) directly
        else {
          cleanNode[key] = value;
        }
      }
    }
    
    return cleanNode;
  }
  
  
  /** Quick convenience function that Attaches log information to an object for keeping abstract syntax tree history */
  public astLog(logs: any, message: any): void {
    if (typeof logs === 'object' && logs !== null && !Array.isArray(logs)) {
      logs[Object.keys(logs).length] = message;
    }
  }
  // #endregion
}


// #endregion
// #region AST Return Type Examples (Understanding how the compiler captures and evaluates on code)
//----------------------------------------------------------------------------------//
// Component Return Type Examples                                                   //
//----------------------------------------------------------------------------------//
// #region - Pathing Help?
// * Most of the values in code are stored within VariableDeclarator, however there are some structures that are different. 
// * This is for help with node pathing, and how to find where it is within the file
/*
? You need to know what parent to search within a path to find the root file (Program)
{} VariableDeclarator
  [ Program ]  <-- The Grandparent (path.parentPath.parentPath)
      |
  [ VariableDeclaration ]  <-- The Parent Line (path.parentPath) e.g., "export const Badge = ..."
      |
  [ VariableDeclarator ]   <-- The Assignment Node (path) e.g., "Badge = () => {}"
      |
  [ ArrowFunctionExpression ] <-- The Function Node itself
  
// ? Is it nested?
  // Check the parent structure. If it is wrapped in an array map, an event handler, 
  // or another function, its immediate parent parent will NOT be the file root ("Program").
  const parentParent = path.parentPath?.parentPath;
  if (!parentParent || !BabelTypes.isProgram(parentParent as any)) {
    return false; // Exit immediately if it's nested inside loops, objects, or variables!
  }


{} FunctionDeclarator
  Path: NodePath (The entire compilation file stream)
  └── Path: NodePath (The file module root: Program node)
        └── Path: NodePath (The statement wrapper: ExportNamedDeclaration, if exported)
            └── Path: NodePath (Your current targeted component block!)
                  ├── .node: The raw data object { type: "FunctionDeclaration", id, body, params }
                  ├── .parentPath: Pointer moving up to the line or export statement wrapper
                  ├── .scope: Core manager tracking all active variables in this block space
                  │    └── .scope.block: Points to the body block of the function context
                  └── .scope.getProgramParent(): Utility jumping directly to the root file module scope
  
// ? Usecases?
  // 1. Access the raw data properties of the current function directly:
    const functionName = path.node.id?.name; // "App"
  
  // 2. Access the immediate outer statement wrapping this function line:
    const parentStatementLine = path.parentPath; 
  
  // 3. Jump completely to the top-level file root module ("Program" block)
  // This lets you append tracking arrays, caches, or global configs at the top of the file!
    const fileRootPath = path.findParent((p) => p.isProgram());
  
  // 4. Access the global scope manager to declare files without collisions:
    const globalScope = path.scope.getProgramParent();


{} ClassExpression
  [ Program ]  <-- The Grandparent (path.parentPath.parentPath)
      |
  [ VariableDeclaration ]  <-- The Parent Line (path.parentPath) e.g., "export const Badge = ..."
      |
  [ VariableDeclarator ]   <-- The Assignment Node (path) e.g., "Badge = () => {}"
      |
  [ ClassExpression ] <-- The Function Node itself
// ? Is it nested?
  // Check the parent structure. If it is wrapped in an array map, an event handler, 
  // or another function, its immediate parent parent will NOT be the file root ("Program").
  const parentParent = path.parentPath?.parentPath;
  if (!parentParent || !BabelTypes.isProgram(parentParent as any)) {
    return false; // Exit immediately if it's nested inside loops, objects, or variables!
  }


*/
// #endregion
// #region - VariableDeclarator
// {} VariableDeclarators carry the type, identifier (id), and another type for defining the variable within "init"
// * Normal Variables
// #region const value: string = 'foo' as any;
// ? const value: string = 'foo' as any;
/*
  node = {
    "type": "VariableDeclarator",
    "id": {
      "type": "Identifier",
      "name": "value",
      "typeAnnotation": {
        "type": "TSTypeAnnotation",
        "typeAnnotation": { "type": "TSStringKeyword" }
      }
    },
    "init": {
      "type": "TSAsExpression",
      "expression": { "type": "StringLiteral", "value": "foo" },
      "typeAnnotation": { "type": "TSAnyKeyword" }
    }
  }
*/


// #endregion 
// #region Arrow Functions
// -> Arrow functions are captured within VariableDeclarators, or via ArrowFunctionExpression() within Visitor/Traverse
// ? To check whether this is a block statement arrow Func:
/*
  if (t.isBlockStatement(init.body)) {
    // It has curly braces! It contains an array of statements: init.body.body
    console.log("Has brackets. Lines inside:", init.body.body.length);
  } else {
    // It is an implicit return! The body is the returned expression itself
    console.log("Implicit return. Returning a node of type:", init.body.type); // e.g., "JSXElement"
  }
*/
// #region Without Brackets
// ? Found an arrow function WITHOUT curly brackets
// * const ShortBadge = () => <span className="badge" />;
/*
  node = { // () Since there's no curly braces {}, the body points directly to the JSXElement node type
    "type": "ArrowFunctionExpression",
    "id": null,
    "generator": false,
    "async": false,
    "params": [],
    "body": {
      "type": "JSXElement",
      "openingElement": {
        "type": "JSXOpeningElement",
        "name": { "type": "JSXIdentifier", "name": "span" },
        "attributes": [
          {
            "type": "JSXAttribute",
            "name": { "type": "JSXIdentifier", "name": "className" },
            "value": { "type": "StringLiteral", "value": "badge" }
          }
        ],
        "selfClosing": true
      },
      "closingElement": null,
      "children": []
    }
  }
*/


// #endregion
// #region With Brackets
// ? Found an arrow function WITH curly brackets
// * const Badge = () => { return( <div><span>Span element</span></div> ); };
/*
  node = {
    "type": "VariableDeclarator",
    "id": {
      "type": "Identifier",
      "name": "Badge"
    },
    "init": {
      "type": "ArrowFunctionExpression",
      "id": null,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "ReturnStatement",
            "argument": {
              "type": "JSXElement",
              "openingElement": {
                "type": "JSXOpeningElement",
                "name": { "type": "JSXIdentifier", "name": "div" },
                "attributes": [],
                "selfClosing": false
              },
              "closingElement": {
                "type": "JSXClosingElement",
                "name": { "type": "JSXIdentifier", "name": "div" }
              },
              "children": [
                {
                  "type": "JSXElement",
                  "openingElement": {
                    "type": "JSXOpeningElement",
                    "name": { "type": "JSXIdentifier", "name": "span" },
                    "attributes": [],
                    "selfClosing": false
                  },
                  "closingElement": {
                    "type": "JSXClosingElement",
                    "name": { "type": "JSXIdentifier", "name": "span" }
                  },
                  "children": [
                    {
                      "type": "JSXText",
                      "value": "Span element",
                      "raw": "Span element"
                    }
                  ]
                }
              ]
            }
          }
        ],
        "directives": []
      }
    }
  }
*/


// #endregion
// #region With Content
// ? Arrow function with content
/*
const Badge = ({ name, styles }) => { 
  const strVal: string = 'foo';
  const [foo, setFoo] = useState<string>("bar");
  const theme = useContext(themeContext);
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  useEffect(() => {
    console.log(`foo was changed, ${strVal}:`, foo);
  }, [foo]);
  
  const fooFunction = () => {
    const nestedVar = 'nestedValue';
    console.log(`fooFunction was called`, { var: nestedVar });
  }
  
  return( 
    <div>
      <span>Span element</span>
    </div> 
  ); 
};

*/
/*
node = {
  "type": "VariableDeclarator",
  "id": { "type": "Identifier", "name": "Badge" },
  "init": {
    "type": "ArrowFunctionExpression",
    "params": [
      {
        "type": "ObjectPattern",
        "properties": [
          {
            "type": "ObjectProperty",
            "key": { "type": "Identifier", "name": "name" },
            "value": { "type": "Identifier", "name": "name" },
            "computed": false,
            "shorthand": true
          },
          {
            "type": "ObjectProperty",
            "key": { "type": "Identifier", "name": "styles" },
            "value": { "type": "Identifier", "name": "styles" },
            "computed": false,
            "shorthand": true
          }
        ]
      }
    ],
    "body": {
      "type": "BlockStatement",
      "body": [
        // =========================================================
        // Line 1: const strVal: string = 'foo';
        // =========================================================
        {
          "type": "VariableDeclaration",
          "kind": "const",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "id": {
                "type": "Identifier",
                "name": "strVal",
                "typeAnnotation": {
                  "type": "TSTypeAnnotation",
                  "typeAnnotation": { "type": "TSStringKeyword" }
                }
              },
              "init": { "type": "StringLiteral", "value": "foo" }
            }
          ]
        },

        // =========================================================
        // Line 2: const [foo, setFoo] = useState<string>("bar");
        // =========================================================
        {
          "type": "VariableDeclaration",
          "kind": "const",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "id": {
                "type": "ArrayPattern",
                "elements": [
                  { "type": "Identifier", "name": "foo" },
                  { "type": "Identifier", "name": "setFoo" }
                ]
              },
              "init": {
                "type": "CallExpression",
                "callee": { "type": "Identifier", "name": "useState" },
                "arguments": [{ "type": "StringLiteral", "value": "bar" }],
                "typeParameters": {
                  "type": "TSTypeParameterInstantiation",
                  "params": [{ "type": "TSStringKeyword" }]
                }
              }
            }
          ]
        },
        
        etc...

        // =========================================================
        // Line 3: const theme = useContext(themeContext);
        // =========================================================
        {
          "type": "VariableDeclaration",
          "kind": "const",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "id": { "type": "Identifier", "name": "theme" },
              "init": {
                "type": "CallExpression",
                "callee": { "type": "Identifier", "name": "useContext" },
                "arguments": [{ "type": "Identifier", "name": "themeContext" }]
              }
            }
          ]
        },

        // =========================================================
        // Line 4: const [state, dispatch] = useReducer(reducer, { count: 0 });
        // =========================================================
        {
          "type": "VariableDeclaration",
          "kind": "const",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "id": {
                "type": "ArrayPattern",
                "elements": [
                  { "type": "Identifier", "name": "state" },
                  { "type": "Identifier", "name": "dispatch" }
                ]
              },
              "init": {
                "type": "CallExpression",
                "callee": { "type": "Identifier", "name": "useReducer" },
                "arguments": [
                  { "type": "Identifier", "name": "reducer" },
                  {
                    "type": "ObjectExpression",
                    "properties": [
                      {
                        "type": "ObjectProperty",
                        "key": { "type": "Identifier", "name": "count" },
                        "value": { "type": "NumericLiteral", "value": 0 }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },

        // =========================================================
        // Line 5: useEffect(() => { console.log(...) }, [foo]);
        // =========================================================
        {
          "type": "ExpressionStatement",
          "expression": {
            "type": "CallExpression",
            "callee": { "type": "Identifier", "name": "useEffect" },
            "arguments": [
              {
                "type": "ArrowFunctionExpression",
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "expression": {
                        "type": "CallExpression",
                        "callee": {
                          "type": "MemberExpression",
                          "object": { "type": "Identifier", "name": "console" },
                          "property": { "type": "Identifier", "name": "log" },
                          "computed": false
                        },
                        "arguments": [
                          {
                            "type": "TemplateLiteral",
                            "quasis": [
                              { "type": "TemplateElement", "value": { "raw": "foo was changed, ", "cooked": "foo was changed, " }, "tail": false },
                              { "type": "TemplateElement", "value": { "raw": ":", "cooked": ":" }, "tail": false }, // ? strVal
                              { "type": "TemplateElement", "value": { "raw": "", "cooked": "" }, "tail": true } // ? foo
                            ],
                            "expressions": [
                              { "type": "Identifier", "name": "strVal" }, // ? ${strVal}
                              { "type": "Identifier", "name": "foo" } // ? ${foo}
                            ]
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "type": "ArrayExpression",
                "elements": [{ "type": "Identifier", "name": "foo" }]
              }
            ]
          }
        },

        // =========================================================
        // Line 6: const fooFunction = () => { ... }
        // =========================================================
        {
          "type": "VariableDeclaration",
          "kind": "const",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "id": { "type": "Identifier", "name": "fooFunction" },
              "init": {
                "type": "ArrowFunctionExpression",
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "body": [
                    {
                      "type": "VariableDeclaration",
                      "kind": "const",
                      "declarations": [
                        {
                          "type": "VariableDeclarator",
                          "id": { "type": "Identifier", "name": "nestedVar" },
                          "init": { "type": "StringLiteral", "value": "nestedValue" }
                        }
                      ]
                    },
                    {
                      "type": "ExpressionStatement",
                      "expression": {
                        "type": "CallExpression",
                        "callee": {
                          "type": "MemberExpression",
                          "object": { "type": "Identifier", "name": "console" },
                          "property": { "type": "Identifier", "name": "log" },
                          "computed": false
                        },
                        "arguments": [
                          { "type": "StringLiteral", "value": "fooFunction was called" },
                          {
                            "type": "ObjectExpression",
                            "properties": [
                              {
                                "type": "ObjectProperty",
                                "key": { "type": "Identifier", "name": "var" },
                                "value": { "type": "Identifier", "name": "nestedVar" },
                                "computed": false,
                                "shorthand": false
                              }
                            ]
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          ]
        },

        // =========================================================
        // Line 7: return ( <div>...</div> );
        // =========================================================
        {
          "type": "ReturnStatement",
          "argument": {
            "type": "JSXElement",
            "openingElement": {
              "type": "JSXOpeningElement",
              "name": { "type": "JSXIdentifier", "name": "div" },
              "attributes": [],
              "selfClosing": false
            },
            "closingElement": {
              "type": "JSXClosingElement",
              "name": { "type": "JSXIdentifier", "name": "div" }
            },
            "children": [
              { "type": "JSXText", "value": "\n ", "raw": "\n " },
              {
                "type": "JSXElement",
                "openingElement": {
                  "type": "JSXOpeningElement",
                  "name": { "type": "JSXIdentifier", "name": "span" },
                  "attributes": [],
                  "selfClosing": false
                },
                "closingElement": {
                  "type": "JSXClosingElement",
                  "name": { "type": "JSXIdentifier", "name": "span" }
                },
                "children": [
                  { "type": "JSXText", "value": "Span element", "raw": "Span element" }
                ]
              },
              { "type": "JSXText", "value": "\n ", "raw": "\n " }
            ]
          }
        }
      ] // init.body.body
    } // init.body
  } // init
} // node
*/


// #endregion
// #endregion
// #region const obj = { id: 1 };
// ? const data = { id: 1 };
/*
node = {
    "type": "VariableDeclarator",
    "id": { "type": "Identifier", "name": "data" },
    "init": {
      "type": "ObjectExpression",
      "properties": [
        {
          "type": "ObjectProperty",
          "key": { "type": "Identifier", "name": "id" },
          "value": { "type": "NumericLiteral", "value": 1 },
          "computed": false,
          "shorthand": false
        }
      ]
    }
  }
*/


// #endregion
// #region const list = [1, 2];
// ? const list = [1, 2];
/*
  node = {
    "type": "VariableDeclarator",
    "id": { "type": "Identifier", "name": "list" },
    "init": {
      "type": "ArrayExpression",
      "elements": [
        { "type": "NumericLiteral", "value": 1 },
        { "type": "NumericLiteral", "value": 2 }
      ]
    }
  }
*/


// #endregion
// #region Maps<key, value>();
// ? const cache = new Map<string, any>();
/*
node = {
  "type": "VariableDeclarator",
  "id": { "type": "Identifier", "name": "cache" },
  "init": {
    "type": "NewExpression",
    "callee": { "type": "Identifier", "name": "Map" },
    "arguments": [],
    "typeParameters": {
      "type": "TSTypeParameterInstantiation",
      "params": [
        { "type": "TSStringKeyword" },
        { "type": "TSAnyKeyword" }
      ]
    }
  }
}
*/




// #endregion
// #region ReactHooks (useState, useContext, useReducer)
// * React Hooks:  In source code, they're defined as structural CallExpression nodes (functions being executed). 
// ? They are typically captured inside a VariableDeclarator because they return arrays or objects that developers immediately destructure
// #region UseState
// ? const [user, setUser] = useState<UserObject>({ id: 1 });
/*
  node = {
    "type": "VariableDeclarator",
    "id": {
      "type": "ArrayPattern",
      "elements": [
        { "type": "Identifier", "name": "user" },
        { "type": "Identifier", "name": "setUser" }
      ]
    },
    "init": {
      "type": "CallExpression",
      "callee": { "type": "Identifier", "name": "useState" },
      "arguments": [
        {
          "type": "ObjectExpression",
          "properties": [
            {
              "type": "ObjectProperty",
              "key": { "type": "Identifier", "name": "id" },
              "value": { "type": "NumericLiteral", "value": 1 }
            }
          ]
        }
      ],
      "typeParameters": {
        "type": "TSTypeParameterInstantiation",
        "params": [
          {
            "type": "TSTypeReference",
            "typeName": { "type": "Identifier", "name": "UserObject" }
          }
        ]
      }
    }
  }
*/

// ? const [text, setText] = useState<string>("default");
/*
  node = {
    "type": "VariableDeclarator",
    "id": {
      "type": "ArrayPattern",
      "elements": [
        { "type": "Identifier", "name": "text" },
        { "type": "Identifier", "name": "setText" }
      ]
    },
    "init": {
      "type": "CallExpression",
      "callee": { "type": "Identifier", "name": "useState" },
      "arguments": [
        { "type": "StringLiteral", "value": "default" }
      ],
      "typeParameters": {
        "type": "TSTypeParameterInstantiation",
        "params": [
          { "type": "TSStringKeyword" }
        ]
      }
    }
  }
*/


// #endregion
// #region UseContext
// ? const theme = useContext(ThemeService);
/*
  node = {
    "type": "VariableDeclarator",
    "id": { "type": "Identifier", "name": "theme" },
    "init": {
      "type": "CallExpression",
      "callee": { "type": "Identifier", "name": "useContext" },
      "arguments": [
        { "type": "Identifier", "name": "ThemeService" }
      ]
    }
  }
*/


// #endregion
// #region useReducer
// ? const [state, dispatch] = useReducer(reducer, { count: 0 });
/*
  node = {
    "type": "VariableDeclarator",
    "id": {
      "type": "ArrayPattern",
      "elements": [
        { "type": "Identifier", "name": "state" },
        { "type": "Identifier", "name": "dispatch" }
      ]
    },
    "init": {
      "type": "CallExpression",
      "callee": { "type": "Identifier", "name": "useReducer" },
      "arguments": [
        { "type": "Identifier", "name": "reducer" },
        {
          "type": "ObjectExpression",
          "properties": [
            {
              "type": "ObjectProperty",
              "key": { "type": "Identifier", "name": "count" },
              "value": { "type": "NumericLiteral", "value": 0 }
            }
          ]
        }
      ]
    }
  }
*/


// #endregion
// #endregion


// #endregion
// #region - FunctionDeclarator
// {} FunctionDeclarators are structurally stable, have the body containing the functions code you can "traverse" through just like "visitor", and other metadata specific to the function
/*
  ? Quick recap, functions are stable refs with access to specific variables out of the box
  * export async function* StreamLayout(props: LayoutProps) {}
    - node.id: Identifier { name: "StreamLayout" }
    - node.async: true (Flags it as an async execution runtime loop)
    - node.generator: true (Flags it as a generator function *)
    - node.params: An array containing your TypeScript-annotated LayoutProps object layout token.
    
  ? node.body contains the code within the function
*/
// #region Empty Function
// ? function InitializeApp() {}
/*
  node = {
    "type": "FunctionDeclaration",
    "id": { "type": "Identifier", "name": "InitializeApp" },
    "generator": false,
    "async": false,
    "params": [],
    "body": {
      "type": "BlockStatement",
      "body": []
    }
  }
*/


// #endregion 
// #region Function w/params
// ? function DevLog(message, level) {}
/*
  node = {
    "type": "FunctionDeclaration",
    "id": { "type": "Identifier", "name": "LoggerService" },
    "generator": false,
    "async": false,
    "params": [
      { "type": "Identifier", "name": "message" },
      { "type": "Identifier", "name": "level" }
    ],
    "body": {
      "type": "BlockStatement",
      "body": []
    }
  }
*/



// #endregion
// #region Function w/destructured params
// ? function Notification({ name, styles }) {}
/*
  node = {
    "type": "FunctionDeclaration",
    "id": { "type": "Identifier", "name": "Notification" },
    "generator": false,
    "async": false,
    "params": [
      {
        "type": "ObjectPattern",
        "properties": [
          {
            "type": "ObjectProperty",
            "key": { "type": "Identifier", "name": "name" },
            "value": { "type": "Identifier", "name": "name" },
            "computed": false,
            "shorthand": true
          },
          {
            "type": "ObjectProperty",
            "key": { "type": "Identifier", "name": "styles" },
            "value": { "type": "Identifier", "name": "styles" },
            "computed": false,
            "shorthand": true
          }
        ]
      }
    ],
    "body": {
      "type": "BlockStatement",
      "body": []
    }
  }
*/


// #endregion
// #region Function params with default values
// ? function Badge({ styles = "btn" }) {}
/*
  node = {
    "type": "FunctionDeclaration",
    "id": { "type": "Identifier", "name": "Badge" },
    "params": [
      {
        "type": "ObjectPattern",
        "properties": [
          {
            "type": "ObjectProperty",
            "key": { "type": "Identifier", "name": "styles" },
            "value": {
              "type": "AssignmentPattern",
              "left": { "type": "Identifier", "name": "styles" },
              "right": { "type": "StringLiteral", "value": "btn" }
            }
          }
        ]
      }
    ]
  }
*/


// #endregion
// #region Function with rest params
// ? function Card({ title, ...rest }) {}
/*
  node = {
    "type": "FunctionDeclaration",
    "id": { "type": "Identifier", "name": "Card" },
    "params": [
      {
        "type": "ObjectPattern",
        "properties": [
          {
            "type": "ObjectProperty",
            "key": { "type": "Identifier", "name": "title" },
            "value": { "type": "Identifier", "name": "title" }
          },
          {
            "type": "RestElement",
            "argument": { "type": "Identifier", "name": "rest" }
          }
        ]
      }
    ]
  }
*/

// #endregion
// #region Function with content
// ? Function with content
/*
  function Badge({ name, styles }) { 
    const strVal: string = 'foo';
    const [foo, setFoo] = useState<string>("bar");
    const theme = useContext(themeContext);
    const [state, dispatch] = useReducer(reducer, { count: 0 });
    
    useEffect(() => {
      console.log(`foo was changed, ${strVal}:`, foo);
    }, [foo]);
    
    const fooFunction = () => {
      const nestedVar = 'nestedValue';
      console.log(`fooFunction was called`, { var: nestedVar });
    }
    
    return( 
      <div>
        <span>Span element</span>
      </div> 
    ); 
  };
*/

/*
  node = {
    "type": "FunctionDeclaration",
    "id": {
      "type": "Identifier",
      "name": "Badge"
    },
    "generator": false,
    "async": false,
    "params": [
      {
        "type": "ObjectPattern",
        "properties": [
          {
            "type": "ObjectProperty",
            "key": { "type": "Identifier", "name": "name" },
            "value": { "type": "Identifier", "name": "name" },
            "computed": false,
            "shorthand": true
          },
          {
            "type": "ObjectProperty",
            "key": { "type": "Identifier", "name": "styles" },
            "value": { "type": "Identifier", "name": "styles" },
            "computed": false,
            "shorthand": true
          }
        ]
      }
    ],
    "body": {
      "type": "BlockStatement",
      "body": [] // ? This is the same as the VariableDeclarator's Arrow Function w/content block
    }
  }
*/


// #endregion


// #endregion
// #region - ArrowFunctionExpression
// () ArrowFunctionExpressions are always wrapped in "VariableDeclarators", and we have examples within VariableDeclarator for this!
// ? The arrow function is mapped to the node.init variable, and is pretty much the same as a FunctionDeclaration, except that the body can be a BlockStatement, or a return Expression


// #endregion
// #region - CallExpression
// () Within VariableDeclarator we have captured call expression examples for all of react's hook variables that are stored within components
// ? We're primarily using this for finding memoized components within the application
// #region function call from a variable
// ? const value = foo("bar", { valA: 1, valB: "strVal" });
/*
  node = {
    "type": "CallExpression",
    "callee": {
      "type": "Identifier",
      "name": "foo"
    },
    "arguments": [
      {
        "type": "StringLiteral",
        "value": "bar"
      },
      {
        "type": "ObjectExpression",
        "properties": [
          {
            "type": "ObjectProperty",
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "name": "valA"
            },
            "value": {
              "type": "NumericLiteral",
              "value": 1
            }
          },
          {
            "type": "ObjectProperty",
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "name": "valB"
            },
            "value": {
              "type": "StringLiteral",
              "value": "strVal"
            }
          }
        ]
      }
    ]
  }
*/


// #endregion
// #region Default Memo
// ? Default Memo
/*
const Badge = memo(({ name, styles }) => { 
  const strVal: string = 'foo';
  const [foo, setFoo] = useState<string>("bar");
  const theme = useContext(themeContext);
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  useEffect(() => {
    console.log(`foo was changed, ${strVal}:`, foo);
  }, [foo]);
  
  const fooFunction = () => {
    const nestedVar = 'nestedValue';
    console.log(`fooFunction was called`, { var: nestedVar });
  }
  
  return( 
    <div>
      <span>Span element</span>
    </div> 
  ); 
});

*/
/*
  node = {
    "type": "VariableDeclarator",
    "id": {
      "type": "Identifier",
      "name": "Badge"
    },
    "init": {
      "type": "CallExpression",
      "callee": {
        "type": "Identifier",
        "name": "memo"
      },
      "arguments": [
        {
          "type": "ArrowFunctionExpression",
          "params": [
            {
              "type": "ObjectPattern",
              "properties": [
                {
                  "type": "ObjectProperty",
                  "key": { "type": "Identifier", "name": "name" },
                  "value": { "type": "Identifier", "name": "name" },
                  "computed": false,
                  "shorthand": true
                },
                {
                  "type": "ObjectProperty",
                  "key": { "type": "Identifier", "name": "styles" },
                  "value": { "type": "Identifier", "name": "styles" },
                  "computed": false,
                  "shorthand": true
                }
              ]
            }
          ],
          "body": {
            "type": "BlockStatement",
            "body": [
              // Internal component lines (useState, useEffect, return statement) remain exactly the same here
              // ? Refer to VariableDeclarator - With Content
            ]
          }
        }
      ]
    }
  }
*/


// #endregion
// #region Memo w/prevProps and nextProps
// ? Default Memo
/*
const Badge = memo(({ name, styles }) => { 
  const strVal: string = 'foo';
  const [foo, setFoo] = useState<string>("bar");
  const theme = useContext(themeContext);
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  useEffect(() => {
    console.log(`foo was changed, ${strVal}:`, foo);
  }, [foo]);
  
  const fooFunction = () => {
    const nestedVar = 'nestedValue';
    console.log(`fooFunction was called`, { var: nestedVar });
  }
  
  return( 
    <div>
      <span>Span element</span>
    </div> 
  ); 
}, (prevProps, nextProps) => {});

*/
/*
  node = {
    "type": "VariableDeclarator",
    "id": {
      "type": "Identifier",
      "name": "Badge"
    },
    "init": {
      "type": "CallExpression",
      "callee": {
        "type": "Identifier",
        "name": "memo"
      },
      "arguments": [
        // * const Component = () => {}
        {
          "type": "ArrowFunctionExpression",
          "id": null, // Note: BadgeExample = () => {} inside memo assigns it here if named, or stays null
          "params": [], // Component props
          "body": { "type": "BlockStatement", "body": [ ComponentCode ] }
        },
        // * (prevProps, nextProps) => {}
        {
          "type": "ArrowFunctionExpression",
          "id": null,
          "params": [
            { "type": "Identifier", "name": "prevProps" },
            { "type": "Identifier", "name": "nextProps" }
          ],
          "body": {
            // ? Typically returns a BinaryExpression or boolean logic evaluating equality
            "type": "BinaryExpression", 
            "operator": "===",
            "left": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "prevProps" }, "property": { "type": "Identifier", "name": "name" } },
            "right": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "nextProps" }, "property": { "type": "Identifier", "name": "name" } }
          }
        }
      ]
    }
  }
*/


// #endregion
// #region (prevProps, nextProps) => Example
// ? (prevProps, nextProps) => Example
/*
  // custom rerender functionality
  }, (prevProps, nextProps) => {
    
    // If its selection status changed, rerender
    if (prevProps.isSelected !== nextProps.isSelected) {
      return false; 
    }
    
    // If the internal item selection flag changed, rerender (custom state handling)
    if (prevProps.item.checked !== nextProps.item.checked) {
      return false;
    }
    
    // Form / Validation
    if ( prevProps.disabled !== nextProps.disabled 
      || prevProps.required !== nextProps.required
      || prevProps.item.disabled !== nextProps.item.disabled
      || prevProps.error !== nextProps.error) {
      return false;
    }
    
    // If configurations change, rerender
    if (prevProps.name !== nextProps.name) {
      return false;
    }
    
    // If nothing changed, safely skip the rerender
    return true; 
  });

*/
/*
  node = {
    "type": "ArrowFunctionExpression",
    "id": null,
    "generator": false,
    "async": false,
    "params": [
      { "type": "Identifier", "name": "prevProps" },
      { "type": "Identifier", "name": "nextProps" }
    ],
    "body": {
      "type": "BlockStatement",
      "body": [
        // =========================================================
        // IF #1: if (prevProps.isSelected !== nextProps.isSelected) { return false; }
        // =========================================================
        {
          "type": "IfStatement",
          "test": {
            "type": "BinaryExpression",
            "operator": "!==",
            "left": {
              "type": "MemberExpression",
              "object": { "type": "Identifier", "name": "prevProps" },
              "property": { "type": "Identifier", "name": "isSelected" },
              "computed": false
            },
            "right": {
              "type": "MemberExpression",
              "object": { "type": "Identifier", "name": "nextProps" },
              "property": { "type": "Identifier", "name": "isSelected" },
              "computed": false
            }
          },
          "consequent": {
            "type": "BlockStatement",
            "body": [
              {
                "type": "ReturnStatement",
                "argument": { "type": "BooleanLiteral", "value": false }
              }
            ]
          },
          "alternate": null
        },
        // =========================================================
        // IF #2: if (prevProps.item.checked !== nextProps.item.checked) { return false; }
        // =========================================================
        {
          "type": "IfStatement",
          "test": {
            "type": "BinaryExpression",
            "operator": "!==",
            "left": {
              "type": "MemberExpression",
              "object": {
                "type": "MemberExpression",
                "object": { "type": "Identifier", "name": "prevProps" },
                "property": { "type": "Identifier", "name": "item" },
                "computed": false
              },
              "property": { "type": "Identifier", "name": "checked" },
              "computed": false
            },
            "right": {
              "type": "MemberExpression",
              "object": {
                "type": "MemberExpression",
                "object": { "type": "Identifier", "name": "nextProps" },
                "property": { "type": "Identifier", "name": "item" },
                "computed": false
              },
              "property": { "type": "Identifier", "name": "checked" },
              "computed": false
            }
          },
          "consequent": {
            "type": "BlockStatement",
            "body": [
              {
                "type": "ReturnStatement",
                "argument": { "type": "BooleanLiteral", "value": false }
              }
            ]
          },
          "alternate": null
        },
        // =========================================================
        // IF #3: Logical OR chain (disabled || required || ...)
        // =========================================================
        {
          "type": "IfStatement",
          "test": {
            "type": "LogicalExpression",
            "operator": "||",
            "left": {
              "type": "LogicalExpression",
              "operator": "||",
              "left": {
                "type": "LogicalExpression",
                "operator": "||",
                "left": {
                  "type": "BinaryExpression",
                  "operator": "!==",
                  "left": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "prevProps" }, "property": { "type": "Identifier", "name": "disabled" } },
                  "right": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "nextProps" }, "property": { "type": "Identifier", "name": "disabled" } }
                },
                "right": {
                  "type": "BinaryExpression",
                  "operator": "!==",
                  "left": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "prevProps" }, "property": { "type": "Identifier", "name": "required" } },
                  "right": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "nextProps" }, "property": { "type": "Identifier", "name": "required" } }
                }
              },
              "right": {
                "type": "BinaryExpression",
                "operator": "!==",
                "left": {
                  "type": "MemberExpression",
                  "object": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "prevProps" }, "property": { "type": "Identifier", "name": "item" } },
                  "property": { "type": "Identifier", "name": "disabled" }
                },
                "right": {
                  "type": "MemberExpression",
                  "object": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "nextProps" }, "property": { "type": "Identifier", "name": "item" } },
                  "property": { "type": "Identifier", "name": "disabled" }
                }
              }
            },
            "right": {
              "type": "BinaryExpression",
              "operator": "!==",
              "left": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "prevProps" }, "property": { "type": "Identifier", "name": "error" } },
              "right": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "nextProps" }, "property": { "type": "Identifier", "name": "error" } }
            }
          },
          "consequent": {
            "type": "BlockStatement",
            "body": [
              {
                "type": "ReturnStatement",
                "argument": { "type": "BooleanLiteral", "value": false }
              }
            ]
          },
          "alternate": null
        },
        // =========================================================
        // IF #4: if (prevProps.name !== nextProps.name) { return false; }
        // =========================================================
        {
          "type": "IfStatement",
          "test": {
            "type": "BinaryExpression",
            "operator": "!==",
            "left": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "prevProps" }, "property": { "type": "Identifier", "name": "name" } },
            "right": { "type": "MemberExpression", "object": { "type": "Identifier", "name": "nextProps" }, "property": { "type": "Identifier", "name": "name" } }
          },
          "consequent": {
            "type": "BlockStatement",
            "body": [
              {
                "type": "ReturnStatement",
                "argument": { "type": "BooleanLiteral", "value": false }
              }
            ]
          },
          "alternate": null
        },
        // =========================================================
        // FINAL LINE: return true;
        // =========================================================
        {
          "type": "ReturnStatement",
          "argument": {
            "type": "BooleanLiteral",
            "value": true
          }
        }
      ]
    }
  }
*/


// #endregion


// #endregion
