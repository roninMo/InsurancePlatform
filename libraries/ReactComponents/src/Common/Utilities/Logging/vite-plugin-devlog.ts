// vite-plugin-devlog.ts
import { Plugin } from 'vite';
import { NodePath, PluginObj, types as t, BabelFile, PluginPass, transformAsync } from "@babel/core";

import { LogRenderData } from './Devlog';
import { 
  Node, Program,
  
  // ? react component declaration containers
  VariableDeclarator, FunctionDeclaration, Identifier,
  ImportSpecifier, ImportDefaultSpecifier, ImportNamespaceSpecifier, 
  ExportDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration,
  
  isVariableDeclarator, isFunctionDeclaration, isIdentifier, 
  isImportSpecifier, isImportDefaultSpecifier, isImportNamespaceSpecifier,
  isExportDeclaration, isExportDefaultDeclaration, isExportNamedDeclaration,
  
  // ? All react component's source should be in one of these
  ArrowFunctionExpression, FunctionExpression, CallExpression, 
  isArrowFunctionExpression, isFunctionExpression, isCallExpression,
  
  // ? Any and all code within functions, classes, etc.
  BlockStatement, isBlockStatement, 
  
  // ? function params / callExpression arguments are usually (ObjectProperty | RestElement)[]
  ObjectProperty, RestElement,
  isObjectProperty, isRestElement,
  isArrayPattern,
  isJSXElement,
  isJSXFragment,
  
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
;


// TODO: component types to account for later: Capture these in one visitor function, and target their files in another, 
// ? This handles processing wrapper/hoc components that are declared in one file, and import another baseComponent (importDeclaration)
type ReactFCImportTypes = 
  | ImportSpecifier 
  | ImportDefaultSpecifier 
  | ImportNamespaceSpecifier
;

/** Export name variables that come from VariableDeclarator. i.e:  export const componentA = () => { return(<div />); } */
type ReactFCExportTypes = 
  | ExportDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
;


/** 
 * The Node types that contain potential react components. We primarily search through {@link VariableDeclarator} and {@link FunctionDeclaration}, 
 * but *memoized* and *forwardRef* components are wrapped in {@link CallExpression|CallExpressions}. 
 */
type ReactFCContainerTypes = 
  | VariableDeclarator
  | FunctionDeclaration
  | CallExpression
;

/** 
 * An Id created from the `component's name`, the `parent's name`, and the `indexed number` of created components in the parent. 
 * > i.e. &nbsp; ***PageContentComp_HomePage_1***. 
 * * If there are multiple instances of the parent, the index *does not reset*.
 * @remarks There's too much ambiguity if we don't use the **parentName** with the indexed number. We're traversing via a *Depth-First Search*, so the actual numbering would be out of order as well.
 */
type ReactComponentId = string;

/** The literal component name. Stored on the component because in production the naming conventions are unsafe and could be the same as other components. TODO: eventually account for this scenario */
type ReactComponentName = string;

/** The hooks that we capture for validating each component's cause for rerendering. */
type ReactCompHookName = 'useState' | 'useContext' | 'useReducer' | (string & {});

/** A react component's data that's captured for implementing rerender functionality via the Abstract Syntax Tree. We additionally capture the props when we edit each of the components. */
interface ComponentRerenderInfo {
  componentName: ReactComponentName,
  data: ComponentInfo,
  hooks: ComponentHooks,
  filePath: string,
}

/** Cached component data use when traversing through the source code. */
interface ComponentInfo<T extends Node = ReactFCType> {
  node: T,
  path: NodePath<T>,
  sourcePath: NodePath<ReactFCContainerTypes | T>,
  componentName: ReactComponentName,
}

/** Captured variables of react hooks, and their locations within the component. */
interface ComponentHooks {
  stateHooks: ComponentHookData[],
  contextHooks: ComponentHookData[],
  reducerHooks: ComponentHookData[],
}

/** A declared react hook's variable name and location within the component. */
interface ComponentHookData {
  varName: ReactCompHookName,
  startLine: number,
  endLine: number,
}

interface ComponentRerenderMetadata {
  hasProps: boolean;
  hookCounts: false | {
    useStates: number,
    useContexts: number,
    useReducers: number,
  }
}

/** A specific component's history during the Abstract Syntax Tree's traversal. There's separate logs for both searching for and editing each of the components. */
interface AstComponentInfo {
  /** this file had a React Component, we'll print logs for it and use it's safe function name for reference */
  componentName: ReactComponentName,
  
  
  logs: {
    /** An indexed history of this component's logs while searching for react components */
    compRetrieval?: Record<number, any>,
    
    /** An indexed history of this component's logs while adding the render log's functionality */
    buildRenderLog?: Record<number, any>,
    
    /** An indexed history of this component's logs while adding the dev log's functionality */
    buildDevLog?: Record<number, any>,
    
    /** Fallback for any other custom string keys */
    [key: string]: Record<number, any> | undefined;
  },
  
  /** Cached globally and initialized/cleared during Program -> enter()/exit() */
  fileName: string,
  
  /** Cached globally and initialized/cleared during Program -> enter()/exit() */
  filePath: string,
}




// #endregion
// #region - Abstract Syntax Tree Plugin
export function vitePluginDevlog(): Plugin {
  const utils = new ReactComponentEditorUtils();
  utils.syntaxTreeLogs_clearFileHistory();
  
  return {
    name: 'vite-plugin-devlog',
    // Enforce running this before standard Vite features so it captures raw source components
    // enforce: 'pre', // This apparently helps, but doesn't seem necessary or worthwhile
    
    async transform(code: string, id: string) {
      // #region File search filter
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
      
      
      // #endregion
      // #region Ast plugin logic
      // () Add the devlog's contextual functions and props to all of our react components - Runs Babel transformations sequentially
      
      const result = await transformAsync(code, {
        filename: id,
        sourceMaps: true,
        plugins: [
          /** Adds the compId to every component for creating a component hierarchy, the compName, and renderLogs and component data capture for analyzing component efficiency and behavior. */
          reactComponentSearchPlugin(utils),
          // addRenderLoggingPlugin(utils),
        ],
      });
      
      return {
        code: result?.code ?? code,
        map: result?.map
      };
      // #endregion
    }
  };
}




// #endregion
// #region - ReactComponentSearchPlugin
/** 
 * ### *addRenderLogs()*
 * Adds a *{@link LogInfo|renderLog}* to every functional component in your project, attaching all prop and context information for tracking rerender functionality. 
 * This is used in the **{@link Devlog}** for:
 * ----
 * 
 * 
 * * This gives the **{@link Devlog}** access to their `component name`, and a unique component ref `id` for traceable logging and diagnostics.
 * * This allows ***react-fiber*** to have access to the values, for bridging component tree references on the fly.
 * * You can utilize filtering and searches to quickly extract which components are logging what, to help with troubleshooting
 * 
 * ----
 * * Capturing the *{@link Devlog._logs|log history}* of component's, in order to increase performance and remove bottlenecks in efficiency
 * * Combine brief sections of *rerendered information* in a custom ui that displays a **{@link Devlog.getComponentHierarchy|historical view}** of what just rerendered
 * * The ability to *search*, *select*, or *traverse* a **component hierarchy**, and opt into seeing and logging **specific component's** logs (including Dev/Render logs)
 * * Easy to read, calculated information based on rerenders, to find the source of a component's inefficiency between *multiple* components.
 * 
 * ----
 * @note In order to use this and the {@link Devlog} properly, **{@link createCompReferenceHierarchy()}** must first be ran.
 */
export function reactComponentSearchPlugin(utils: ReactComponentEditorUtils): PluginObj {
  utils.clearCachedComponentLogs();
  utils.logType = 'retrieval';
  
  // #region Component File Search and Traversal
  return {
    name: "react-component-search-plugin",
    visitor: {
      // #region FunctionDeclaration ->  Logic ran on Functions() {}
      /**
       * Is ran on every function within a file. It has direct access to things like
       * * These are stable, have a direct reference to the component's name, and no nested properties to access the code within it's *BlockStatement*.
       * 
       * ----
       * @example       // ? function MyComponent() {}
       * @param path    The current `function` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<FunctionDeclaration>
       */
      FunctionDeclaration(path: NodePath<FunctionDeclaration>, state: PluginPass) {
        const node = path.node;
        const name = node.id?.name;
        const filePath = state.filename;
        if (!name || !filePath) {
          if (!filePath) console.error(`Couldn't find the source file during visitor.VariableDeclarator! Data: `, { callExp: utils.getSafeNodeInfo(path) });
          return;
        }
        
        // ? Does it have a PascalCase name?
        if (!utils.isNamePascalCase(name)) {
          return false;
        }
        
        // Logging
        utils.setLogTarget(name, filePath);
        utils.addLog(`${name}(${path.node.type}) found. Checking if it's a react component. `);
        
        // Capture the component's contextual data
        const componentInfo = utils.getComponentInfo(path);
        if (!componentInfo || !utils.isReactComponent(componentInfo)) {
          utils.addLog(`Fail: ${name} wasn't a react component, data: `);
          utils.addLog(utils.getSafeNodeInfo(path), 'saveCompData');
          return; // <- We did not find a function, or a potential react component
        }
        
        // -> Store them in the utils for when the addRenderLoggingPlugin edits each of the components
        const hooks = utils.getHooks(componentInfo);
        const rerenderInformation: ComponentRerenderInfo = { componentName: name, data: componentInfo, hooks, filePath };
        utils.reactComponents[name] = rerenderInformation;
        
        // Logging - Store the logs for this specific component's instance
        utils.addLog(`Pass: ${name} was a valid react component, data: `);
        utils.addLog(utils.getSafeReactCompRerenderData(rerenderInformation), 'saveCompData');
      },
      
      
      
      
      // #endregion
      // #region ArrowFunctionExpression ->  Logic ran on Arrow functions () => {}
      /**
       * Is ran on every arrow function expression within a file.
       * * Arrow functions are *anonymous*, so you have to use the `parentNode` (VariableDeclarator) to find the name of the function.
       * 
       * ----
       * @example // ? const MyComponent = () => {}
       * @example // ? array.map(x => x * 2)
       * @param path The current `arrow function` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<ArrowFunctionExpression>
       */
      ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
        
      },
      
      
      
      
      // #endregion
      // #region VariableDeclarator ->  const str = 'val'; const num = 1; const dispData => {};  const theme = useContext(themeContext);
      /**
       * Is ran on every variable within a file. This contains the key-value pair of the variable, and it's contents.
       * * This covers every React Component Declaration except for *FunctionDeclarations*, and imported functions that are declared in another file.
       * 
       * ----
       * @example       // ? const MyComponent = () => {}
       * @example       // ? const variable = 'value';
       * @param path    The current `variable` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<VariableDeclaration>
       */
      VariableDeclarator(path: NodePath<t.VariableDeclarator>, state: PluginPass) {
        const varPath = path.get('init');
        const filePath = state.filename;
        if (!varPath || !varPath.node || !filePath) {
          if (!filePath) console.error(`Couldn't find the source file during visitor.VariableDeclarator! Data: `, { callExp: utils.getSafeNodeInfo(path) });
          return;
        }
				
        // ? Does it have a PascalCase name?
        let name: string = isIdentifier(path.node.id) ? path.node.id.name : '';
        if (!utils.isNamePascalCase(name)) {
          return false;
        }
        
        // ? Is this potentially a react component?
        const isFunctionValue = 
          varPath.isArrowFunctionExpression() || 
          varPath.isFunctionExpression() || 
          varPath.isCallExpression(); // Catch components wrapped in memo() or forwardRef()
        
        if (!isFunctionValue) {
          return;
        }
        
        // Logging
        utils.setLogTarget(name, filePath);
        utils.addLog(`${name}(${path.node.type}) found. Checking if it's a react component. `);
        
        // Capture the component's contextual data
        const componentInfo = utils.getComponentInfo(path);
        if (!componentInfo || !utils.isReactComponent(componentInfo)) { // TODO: useMemo -> ex: MemoizedCodeSnippet -> almost done
          utils.addLog(`Fail: ${name} wasn't a react component, data: `);
          utils.addLog(utils.getSafeNodeInfo(path), 'saveCompData');
          return; // <- We did not find a function, or a potential react component
          // TODO: "if undefined" - some declarations could be imports from another file. We don't account for this yet
        }
        
        
        // -> Store them in the utils for when the addRenderLoggingPlugin edits each of the components
        const hooks = utils.getHooks(componentInfo);
        const rerenderInformation: ComponentRerenderInfo = { componentName: name, data: componentInfo, hooks, filePath};
        utils.reactComponents[name] = rerenderInformation;
        
        // Logging - Store the logs for this specific component's instance
        utils.addLog(`Finished: ${name} was a valid react component, data: `);
        utils.addLog(utils.getSafeReactCompRerenderData(rerenderInformation), 'saveCompData');
        // TODO: Change the way we store logs so we can safely add to each cached component. 
        // Add a new var to handle adding data, and keep a cache of the current components we've already stored to the file
      },
      
      
      
      
      // #endregion
      // #region Program ->  Enter and Exit functionality
      Program: {
        exit(path: NodePath<Program>, state: PluginPass) {
          utils.storeComponentLogs();
        },
        enter(path: NodePath<Program>, state: PluginPass) {},
      },
      
      
      // #endregion
      // #region Other useful syntax targets
      // ImportDeclaration(path: NodePath<t.ImportDeclaration>, pass: PluginPass) {},
      // ExportDeclaration(path: NodePath<t.ExportDeclaration>, pass: PluginPass) {},
      // ReturnStatement(path: NodePath<t.ReturnStatement>, pass: PluginPass) {},
      
      // Ran on any html-like tag (e.g. <div className="custom-class" />)
      // JSXElement(path: NodePath<t.JSXElement>, pass: PluginPass) {},
      
      // ArrayExpression
      // ArrowFunctionExpression 
      
      // BlockParent
      // DeclareVariable
      
      
      // #endregion
    }, 
    
    // Ran once per file before and after the file is traversed 
    pre(state: BabelFile) {}, 
    post(state: BabelFile) {},
    
    
  };
  // #endregion
}


// #endregion
// #region - AddRenderLoggingPlugin
export function addRenderLoggingPlugin(utils: ReactComponentEditorUtils): PluginObj {
  utils.clearCachedComponentLogs();
  utils.logType = 'render';
  
  const filesToSearch = new Set(
    Object.values(utils.reactComponents).map(data => data.filePath)
  );
  
  
  // #region Add render logging functionality to each of the react components
  return {
    name: "add-render-logging",
    visitor: {
      // #region FunctionDeclaration ->  Logic ran on Functions() {}
      /**
       * Is ran on every function within a file. It has direct access to things like
       * * These are stable, have a direct reference to the component's name, and no nested properties to access the code within it's *BlockStatement*.
       * 
       * ----
       * @example       // ? function MyComponent() {}
       * @param path    The current `function` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<FunctionDeclaration>
       */
      FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
        if (this.skipFile) return;
        // processComponent(path, name, path.node);
      },
      
      
      // #endregion
      // #region VariableDeclarator ->  const str = 'val'; const num = 1; const dispData => {};  const theme = useContext(themeContext);
      /**
       * Is ran on every variable within a file. This contains the key-value pair of the variable, and it's contents.
       * * This covers every React Component Declaration except for *FunctionDeclarations*, and imported functions that are declared in another file.
       * 
       * ----
       * @example       // ? const MyComponent = () => {}
       * @example       // ? const variable = 'value';
       * @param path    The current `variable` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<VariableDeclaration>
       */
      VariableDeclarator(path: NodePath<t.VariableDeclarator>, state: PluginPass) {
        if (this.skipFile) return;
        
        // Component information
        const varPath = path.get('init');
        let name: string = isIdentifier(path?.node?.id) ? path.node.id.name : '';
        if (!varPath || !varPath.node || !name) {
          return;
        }
				
        // TODO: we have a way to reverse the traversal, check if there's a way to just use our captured nodes as the return array.
        //   - If not, we need to loop through for specific source nodes
        //      1. VariableDeclarator     - const componentA = () => {}
        //      2. FunctionDeclaration    - function componentA() {}
        //      3. CallExpression         - memos/forwardRefs
        
        
        // 1. Should we add rerender logging, or is it just a representational component. (no props and hooks)
        // 2. Capture the component's props if it's defined, the destructure props, or create the props arg if it hasn't been defined
        // 3. Find the safe location to add the render log using the hook's context information
        // 4. Add the render log function, and finish out the component with creating it's metadata
        
        
        
				/*
          {} Capturing the components:
            - If we have the raw node types, we can run through the logic for checking if it's a react component in one function
              1. Create a function to extract the target func's node, and create the object data of the potential react component
              2. have isReactComponent's argument the extracted object of the source and potential node. If it's a reactComponent, add it to the captured list.
              3. after we've found all the react components, THEN add the componentName to the source component's code for every component in a new func. 
              4. after that, loop through their return statements, and add the props to every comp (compId, parentName). 
                  - This should be safe even for found react component's that we're not actually adding the renderLog to (if it's solely a representational comp without state/hooks).
            
            // TODO: double check that imported funcs that aren't jsx elements are accounted for here! we may need to check for exportFunc... other import/export types (including export const...)
				*/;
      },
      
      
      // #endregion
      // #region CallExpression ->  A function call anywhere in the code
      /**
       * These are function invocations within the file. For this plugin, it's primary use would be finding react components wrapped in `memo()` or `forwardRef()`
       * 
       * ----
       * @example       // ? foo(), or const val = useHook(), or const ComponentA = memo(() => { ...code });
       * @param path    The current `function` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<FunctionDeclaration>
       */
      CallExpression(path: NodePath<CallExpression>) {
        
      },
      
      
      // ImportDeclaration(path: NodePath<t.ImportDeclaration>, pass: PluginPass) {},
      // ExportDeclaration(path: NodePath<t.ExportDeclaration>, pass: PluginPass) {},
      // ReturnStatement(path: NodePath<t.ReturnStatement>, pass: PluginPass) {},
      
      // Ran on any html-like tag (e.g. <div className="custom-class" />)
      // JSXElement(path: NodePath<t.JSXElement>, pass: PluginPass) {},
      
      
      // #endregion
      // #region Program ->  Enter and Exit functionality
      Program: {
        exit(path: NodePath<Program>, state: PluginPass) {
          // Add this component's logs to the abstract syntax tree's log history
          utils.addComponentLogData(); // Previous component's data
          utils.syntaxTreeLogs_addHistoryToFile<Record<string, AstComponentInfo>>(utils.cachedComponentLogs);
          utils.clearCachedComponentLogs();
          utils.clearLogTarget();
        },
        
        
        // Filtering specific files
        enter(path: NodePath<Program>, state: PluginPass) {
          const currentFile = state.filename || 'unknown-fileName';
          if (!filesToSearch.has(currentFile)) {
            console.log(`Skipping file: ${currentFile}`);
            this.skipFile = true;
            return;
          }
          
          console.log(`Valid file: ${currentFile}`);
          this.skipFile = false;
        },
      },
      
      
      // #endregion
    }, 
    
    // Check that we're targeting the right files 
    pre(state: BabelFile) {}, 
    post(state: BabelFile) {},
    
    
  };
  // #endregion
}


// #endregion
// #region - ReactComponentUtils
/** Utilities for finding/accessing data within `React` components. */
export class ReactComponentEditorUtils {
  constructor() {}
  // #region React Component State
  /** A list of the captured react components. Use this for filtering searches for components, and editing the react component's code. */
  public reactComponents: Record<ReactComponentName, ComponentRerenderInfo> = {};
  
  /** Used to create the {@link ReactComponentId}. Counts each instance of a component. @remarks parentName -> componentName -> componentCount */
  protected componentInstanceCount: Record<ReactComponentName, Record<ReactComponentName, number>> = {};
  
  /** Metadata that's specific to each react component. This is passed to the devlog later for handling context specific logic in a number of ways */
  public componentMetadata: Record<ReactComponentName, ComponentRerenderMetadata> = {};
  
  
  
  
  // #endregion
  // #region Dev Console Logging Functionality
  /** The relative path to where you want to store the log history for your project.  */
  public abstractSyntaxTreeLogHistoryLoc: string = './src/assets/astCompLogs.json';
  
  /** A stored reference of all the component logs. We use this in later plugins to combine data we write to the log file. */
  public allComponentLogs: Record<string, AstComponentInfo> = {};
  
  /** The cached logs of all components in a specific file. When we finished a component search via Visitor, we store these in a file to display in google chrome's *dev console*. */
  public cachedComponentLogs: Record<string, AstComponentInfo> = {};
  
  /** The type of logs we're populating right now. If we're searching for react components, then we add the logs to the search list */
  public logType: 'retrieval' | 'render' | 'dev' = 'retrieval';
  
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
      const keys = Object.keys(this.data).map(Number);
      return (keys.length ? Math.max(...keys) : -1) + 1;
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
  
  
  
  
  // #endregion
  // #region General Utils
  /** We use this on a couple of the visitor functions to extract the react component's node and keep a safe reference to it's component name and source component */
  public getComponentInfo(sourcePath: babel.NodePath<VariableDeclarator | FunctionDeclaration | CallExpression>): ComponentInfo | undefined {
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
        this.addLog({ [`getComponentInfo() Found an arrow function expression: `]: this.getSafeNodeInfo(sourcePath) });
        const arrFuncData: ComponentInfo<ArrowFunctionExpression> = { node: initPath.node, path: initPath, sourcePath, componentName: varName };
        return arrFuncData;
      }
      
      // For the component's that are declared like functions
      if (initPath.isFunctionExpression()) {
        this.addLog({ [`getComponentInfo() Found a function declaration: `]: this.getSafeNodeInfo(sourcePath) });
        const funcExpData: ComponentInfo<FunctionExpression> = { node: initPath.node, path: initPath, sourcePath, componentName: varName };
        return funcExpData;
      }
      
      // ? We can get declared component(const), which are wrapped in memo or forwardRef, which is also a callExpression()
      if (initPath.isCallExpression()) {
        callPath = initPath;
        this.addLog({ [`getComponentInfo() Found a call expression declared in a var: `]: this.getSafeNodeInfo(sourcePath) });
        // -> Scroll to "if (callPath.isCallExpression())"
      }
      
      // If it was an identifier pointing to another component // ! If the component was imported, we will not find it here
      if (initPath.isIdentifier()) {
        const binding = initPath.scope.getBinding(initPath.node.name);
        if (binding && this.isValidReactFCType<NodePath>(binding.path)) {
          const refPath = binding.path;
          const isolatedCompData: ComponentInfo<ReactFCType> = { node: refPath.node, path: refPath, sourcePath, componentName: varName };
          return isolatedCompData;
        }
      }
      
    }
    
    // * Search for memo/forwardRef functions ->  we check if it's a react component during isReactComponent()
    // ? We combine the callExpressions from the source and from variableDeclarators here
    this.addLog({ 'getComponentInfo()': 'CallExpression', 'sourcePath': this.getSafeNodeInfo(sourcePath), 'callPath': this.getSafeNodeInfo(callPath) });
    callPath = callPath ? callPath : sourcePath;
    if (callPath.isCallExpression()) {
      // Find the component's name, check for var declarations
      const varPath = callPath?.parentPath?.isVariableDeclarator() ? callPath.parentPath : undefined;
      let varName = isIdentifier((sourcePath as any)?.node?.id) ? (sourcePath as any)?.node?.id?.name : 'Unknown'; // hacky
      if (varPath) varName = isIdentifier(varPath.node.id) ? varPath.node.id.name : varName;
      
      // The first argument is the component, and the second is the customRerenderPropsFunc or the ref
      const argumentsPath = callPath.get("arguments");
      const componentPath = argumentsPath?.[0];
      
      // Check if there's a valid react component wrapped in the memo()
      if (this.isValidReactFCType<NodePath>(componentPath)) {
        this.addLog(`getComponentInfo(): The function wrapped in the call expression was a valid react type!`);
        const hookCompData: ComponentInfo<ReactFCType> = { node: componentPath.node, path: componentPath, sourcePath: callPath, componentName: varName };
        return hookCompData;
      }
      
      // check if React Refresh / Hot Module Replacements cached our anonymous arrow function inside the memo( () => {...} ) and converted it to an AssignmentExpression
      if (componentPath.isAssignmentExpression() && componentPath.node.operator === '=') {
        const cachedCompPath = componentPath.get("right");
        if (this.isValidReactFCType<NodePath>(cachedCompPath)) {
          this.addLog(`getComponentInfo(): React HMR cached the anonymous function wrapped in a memo/forwardRef, returning a valid react type`);
          const hookCompData: ComponentInfo<ReactFCType> = { node: cachedCompPath.node, path: cachedCompPath, sourcePath: callPath, componentName: varName };
          return hookCompData;
        }
      }
      
      // If this callee was an identifier pointing to another component // ! If the component was imported, we will not find it here
      if (componentPath.isIdentifier()) {
        const binding = componentPath.scope.getBinding(componentPath.node.name);
        if (binding && this.isValidReactFCType<NodePath>(binding.path)) {
          this.addLog(`getComponentInfo(): The identity wrapped in the call expression linked to a valid react type!`);
          const refPath = binding.path;
          const isolatedCompData: ComponentInfo<ReactFCType> = { node: refPath.node, path: refPath, sourcePath: callPath, componentName: varName };
          return isolatedCompData;
        }
      }
      
      this.addLog(`getComponentInfo(): We found a call expression, but it didn't have a react component wrapped in it!`);
    }
    
    
    this.addLog(`getComponentInfo(): Did not find valid component information`);
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
   * 3. Does the component (with code) return JSX/HTML, or is it a memo/forwardRef component?
   * 
   * @returns true if it's a valid react component
  */
  public isReactComponent(data: ComponentInfo | undefined): boolean {
    if (!data || !data.node) {
      this.addLog(`isReactComponent(null)`);
      return false;
    }
    
    // ? Check if this has PascalCase component syntax 
    const isPascalCase = /^[A-Z]/.test(data.componentName);
    if (!isPascalCase) return false;
    
    // Log the data passed to isReactComponent
    this.addLog({[`isReactComponent(${data.componentName})`]: this.getSafeReactCompData(data) });
    
    // ? Only valid if this is defined on the root level of the file
    let searchPath = data.sourcePath; // For call expressions, let's check if it was defined in a variableDeclarator before continuing
    if (searchPath.isCallExpression() && searchPath.parentPath.isVariableDeclarator()) {
      searchPath = searchPath.parentPath;
    }
    
    // path.parentPath is the VariableDeclarator
    // path.parentPath.parentPath is what holds the statement (e.g. Program, ExportNamedDeclaration)
    const declarationPath = searchPath?.parentPath?.parentPath; // [() => {} / func() {}] -> VarDeclarator -> VarDeclaration -> isRoot?
    if (
      !( declarationPath?.isProgram()                   // This is at the root of the file, i.e. not a nested component.
      || declarationPath?.isExportNamedDeclaration()    // e.x. export const myComponent = () => {};
      || declarationPath?.isExportDefaultDeclaration()) // e.x. export default function myComponent() {}
    ) {
      this.addLog(`Fail: ${data.componentName} wasn't defined on the root.`)
      return false;
    }
    
    // ? Does this component explicitly implicitly return jsx/html?  (e.g., () => <div />)
    const body = data.node.body;
    if (isJSXElement(body) || isJSXFragment(body)) {
      this.addLog(`Pass: implicitly returns html. e.g., () => <div />`);
      return true;
    }
    
    // ? Is the CallExpression a memo'd component or a forwardRef
    if (data.sourcePath.isCallExpression()) {
      const callee = data.sourcePath.node.callee; // check if the function invoked was a memo wrapped around the react component.
      if (isIdentifier(callee) && ['memo', 'forwardRef'].includes(callee.name)) {
        this.addLog(`Pass: This is a memo'd component, or a forwardRef component.`);
        return true; 
      }
    }
    
    // If we have a useMemo that just returns html w/out brackets, the blockStatement is a callExpression ie. useMemoVar = (() => (<div />), []);
    // And we run this func twice to find it: 
    //    - return compWithUseMemoRet; ... -> Identifier (callExpression) -> arrow/functionExpression(myReactComponent).body( callExpression(jsxDev) | standard scenarios )
    //    - useMemoRet -> .body(CallExpression OR BlockStatement)
    const astHtmlCompiledTypes =  ['jsxDEV', 'jsx', 'jsxs', 'createElement'];
    const funcBody = data.node.body;
    if (isCallExpression(funcBody)) { // ? Rarely will we have a react component that only returns html that should be account for that would cause rerendering issues
      const callNode = funcBody.callee;
      if (isIdentifier(callNode) && astHtmlCompiledTypes.includes(callNode.name)) {
        this.addLog(`Pass: The useMemo only returned html code: useMemoVar = (() => (<div />), []);`)
        return true;
      }
    }
    
    // ? Does a ReturnStatement output JSX?  e.g., () => { return <div />; })
    const self = this;
    this.addLog(`checking if it's blockStatement(code) has a jsx return statement. `);
    let returnsJsx = false;
    data.path.traverse({
      // Skip nested function's return statements
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(nestedPath) { nestedPath.skip(); }, 
      
      // * Find the first jsx return statement
      ReturnStatement(returnPath) {
        const argNode = returnPath.node.argument;
        self.addLog({ 'ReturnStatement': self.getSafeNodeInfo(returnPath) });
        
        // Check for raw jsx elements
        returnsJsx = isJSXElement(argNode) || isJSXFragment(argNode);
        
        // Check for babel's compiled jsx code (JsxDev CallExpressions)
        if (!returnsJsx && isCallExpression(argNode)) {
          const callee = argNode.callee;
          if (isIdentifier(callee)) {
            returnsJsx = astHtmlCompiledTypes.includes(callee.name);
          }
        }
        
        // ? Check if they're returning a useMemo that returns html
        // return useMemoCode; ... -> Identifier (callExpression) -> arrow/functionExpression(myReactComponent).body( callExpression(ASTJsxDev) | standard scenarios )
        if (!returnsJsx && isIdentifier(argNode)) {
          const binding = returnPath.scope.getBinding(argNode.name);
          if (binding) {
            const useMemoVarPath = binding.path; 
            self.addLog({[`we found an identifier, and it's content within the same file. data: `]: self.getSafeNodeInfo(useMemoVarPath) });
            
            // TODO: This is checking a useMemo within a component, but we first need access to the useMemo content. Is there an easier way?
            const useMemoPath = useMemoVarPath.isVariableDeclarator() ? useMemoVarPath : undefined;
            const useMemoFuncPath = useMemoPath?.get("init");
            if (useMemoFuncPath && useMemoFuncPath.isCallExpression()) { 
              
              // These return some wily nested code, we made it to the 
              const useMemoFuncInfo = self.getComponentInfo(useMemoFuncPath); 
              self.addLog({ "useMemoFuncInfo": self.getSafeNodeInfo(useMemoFuncPath)});
              if (useMemoFuncInfo) {
                // We need to match for the name/source defined on the root. Check the return logic 
                useMemoFuncInfo.componentName = data.componentName;
                useMemoFuncInfo.sourcePath = data.sourcePath;
                const useMemoReturnedHTML = self.isReactComponent(useMemoFuncInfo);
                if (useMemoReturnedHTML) {
                  returnsJsx = true;
                  returnPath.stop();
                }
              }
            }
          }
        }
        
        // Did we find a valid return statement for a react component?
        if (returnsJsx) {
          self.addLog("Pass: Found a valid html return statement!");
          returnsJsx = true;
          returnPath.stop(); // Found it! Stop searching this function.
        }
      },
      
    });
    
    return returnsJsx;
  }
  
  
  /** Retrieves a react component's hooks. Pass in an with a reference to your array, and the hooks you want to retrieve */
  public getHooks(data: ComponentInfo, hooksToRetrieve: ReactCompHookName[] = ['useState', 'useContext', 'useReducer']): ComponentHooks {
    const hooksForRetrieval: Set<ReactCompHookName> = new Set(hooksToRetrieve);
    const capturedHooks: ComponentHooks = { stateHooks: [], contextHooks: [], reducerHooks: [] };
    const codePath = data?.path?.get('body');
    if (!data.node || !codePath || !codePath.isBlockStatement()) {
      return capturedHooks;
    }
    
    // <- Early out if it's not code within brackets, i.e an implicit return ->  const componentA = () => <div />;
    if (!codePath.isBlockStatement()) {
      return capturedHooks;
    }
    
    // Only loop through the component's code, not the component's construction/metadata
    const self = this;
    codePath.traverse({ // () startPath.get("body").traverse()  - fix
      // Only search for declared hooks, and skip their internal invocations or any nested function's content within this component.
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(nestedPath) {
        nestedPath.skip(); 
      },
      
      // Find all hook instantiations
      VariableDeclarator(varPath) {
        const path = varPath.get('init');
        const varNode = varPath?.node;
        if (!varNode || !path.isCallExpression()) {
          return;
        }
        
        // Search for a valid function invocation's name
        const callNode = path.node;
        if (!isIdentifier(callNode.callee)) {
          return;
        }
        
        // Retrieve the components line locations
        const callee = callNode.callee;
        const startLine = callNode.loc?.start?.line;
        const endLine = callNode.loc?.end?.line;
        if (!startLine || !endLine) {
          console.error(`Traversed through a programmatically generated CallExpression of a react hook inside ${data.componentName}. Skipping!`, { callExp: self.getSafeNodeInfo(varPath) });
          return;
        }
        
        // ? Target and retrieve the hooks we want to capture
        if (hooksForRetrieval.has('useState') && callee.name === 'useState') {
          if (isArrayPattern(varNode.id)) {
            const stateGetter = varNode.id.elements?.[0];
            if (isIdentifier(stateGetter) && stateGetter.name) {
              capturedHooks.stateHooks.push({ varName: stateGetter.name, startLine, endLine });
            }
          }
        }
        
        if (hooksForRetrieval.has('useContext') && callee.name === 'useContext') {
          if (isIdentifier(varNode.id) && varNode.id.name) {
            const contextHook = varNode.id.name;
            capturedHooks.contextHooks.push({ varName: contextHook, startLine, endLine });
          }
        }
        
        if (hooksForRetrieval.has('useReducer') && callee.name === 'useReducer') {
          if (isArrayPattern(varNode.id)) {
            const reducerHook = varNode.id.elements?.[0];
            if (isIdentifier(reducerHook) && reducerHook.name) {
              capturedHooks.reducerHooks.push({ varName: reducerHook.name, startLine, endLine });
            }
          }
        }
      }
    });
    
    return capturedHooks;
  }
  
  
  /** On the second pass, we specifically search through all valid react components we found, and add logging for rerender diagnostics. */
  public reactFC_addComponentRenderLogic(data: ComponentInfo, hooks: ComponentHooks): void {
    this.addLog("");
    this.addLog("addComponentRenderLogic() ->  Parsing the component's props, and adding the renderLog() function. Data: ");
    this.addLog(this.getSafeReactCompData(data));
    
    
  }
  
  
  
  // jsxEl_addParentNameAndCompId
  //    -> We may actually want to tie the parent name to the component's id because it's depth first search, and random indexes across the application will be confusing
  
  
  
  
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
  
  
  /** Whether the current function follows react's *Pascal Case* naming convention */
  public isNamePascalCase(name: string | undefined): boolean {
    if (!name) return false
    const isPascalCase = /^[A-Z]/.test(name);
    return isPascalCase;
  }
  
  
  public componentHasNoProps(): boolean {
    return true;
  }
  
  public componentHasNoDestructuredProps(): boolean {
    return true;
  }
  
  
  
  
  // #endregion
  // #region Visitor::FunctionDeclaration Search Utils
  
  
  
  
  // #endregion
  // #region Visitor::ArrowFunctionExpression Search Utils
  public getArrowFunctionExpName(path: NodePath<ArrowFunctionExpression>): string {
    return '';
  }
  
  
  
  
  // #endregion
  // #region Visitor::VariableDeclarator Search Utils
  public isOnRootLevel(path: NodePath<VariableDeclarator>): boolean {
    return false;
  }
  
  
  
  
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
    if (isIdentifier(firstParam)) {
      return { type: "plain", name: firstParam.name }; // e.g., (props)
    }
    
    if (t.isObjectPattern(firstParam)) {
      const keys = firstParam.properties.map((prop: ObjectProperty | RestElement) => {
        if (isObjectProperty(prop) && isIdentifier(prop.key)) {
          return prop.key.name; // Standard destructured keys
        }
        if (isRestElement(prop) && isIdentifier(prop.argument)) {
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
  
  
  
  
  // #endregion
  // #region var componentInstanceCount
  public getComponentCount(parentName: string, componentName: string): number {
    if (!this.componentInstanceCount[parentName]) {
      this.componentInstanceCount[parentName] = {};
    }
    
    if (!this.componentInstanceCount[parentName]?.[componentName]) {
      this.componentInstanceCount[parentName][componentName] = 1;
    }
    
    return this.componentInstanceCount[parentName][componentName];
  }
  
  
  public addToComponentCount(parentName: string, componentName: string): void {
    const currentCount = this.getComponentCount(parentName, componentName);
    this.componentInstanceCount[parentName][componentName] = currentCount + 1;
  }
  // #endregion
  // #region Misc
  public getFileNameFromPath(filePath: string): string {
    if (!filePath) return 'undefined';
    return filePath.match(/[^/\\]+$/)?.[0] || filePath; 
  }
  
  
  
  
  // #endregion
  // #region Logging in the dev console
  /** Stored references so when traverse finish a specific component, we can transition internally without losing reference to these values. */
  public log_compDataSourceFile: string | undefined;
  public log_compDataTarget: ReactComponentName | undefined;
  
  /** Convenience function for adding a log to a component's cached logs during the Visitor function  */
  public addLog(log: any, last: 'saveCompData' | 'addLog' = 'addLog'): void {
    // console.log(`(${this.log_compDataTarget}) log: `, log);
    this.logs.add(log);
    
    if (last === 'saveCompData') {
      this.addComponentLogData(true);
    }
  }
  
  
  /** 
   * Add a component's log history to the cachedComponentLogs. 
   * * Each component is captured while traversing a file, and the data is stored locally to print out in the dev console on load. See *{@link syntaxTreeLogs_addHistoryToFile()}*.
   * 
   * ----
   * @note We use **{@link logs|The cached log history}** that's stored within this utils class.
   */
  public addComponentLogData(clearCachedLogs: boolean = false): void {
    const filePath = this.log_compDataSourceFile || 'UnknownFileSource';
    const name = this.log_compDataTarget;
    if (!name) {
      if (clearCachedLogs) this.logs.clear();
      return;
    }
    
    // Find or create the component log information for this component
    let componentLogData: AstComponentInfo;
    const logCategory = this.getLogCategory();
    if (this.allComponentLogs[name]) componentLogData = this.allComponentLogs[name];
    else {
      componentLogData = {
        componentName: name,
        logs: {},
        fileName: this.getFileNameFromPath(filePath),
        filePath
      };
    }
    
    // Add the new logs to this specific component
    componentLogData.logs[logCategory] = this.logs.data;
    
    // Let's update the original reference? and then add this to the cached component logs to add
    this.allComponentLogs[name] = componentLogData;
    this.cachedComponentLogs[name] = componentLogData;
    
    // If we explicitly want to remove our cached logs from visitor's traverse functions.
    if (clearCachedLogs) {
      this.logs.clear();
    }
  }
  
  /** Once you've finished logging a component's information, call this. It stores the information to file, and clears the current target in prep for the next component */
  public storeComponentLogs(): void {
    const filePath = Object.values(this.cachedComponentLogs)?.[0]?.filePath || 'Unknown';
    console.log(`${this.getFileNameFromPath(filePath)}: storeComponentLogs(): `, Object.keys(this.cachedComponentLogs)?.filter((name, index) => index < 5).concat(', '));
    this.syntaxTreeLogs_addHistoryToFile<Record<string, AstComponentInfo>>(this.cachedComponentLogs);
    this.clearCachedComponentLogs(); // TODO: keep all component's logs, and combine retrieve/edit logs together
    this.clearLogTarget();
  }
  
  
  /** Call this after storing the abstract syntax tree's log history to a file via *{@link syntaxTreeLogs_addHistoryToFile()}*. */
  public clearCachedComponentLogs(clearLogsVarCache: boolean = true): void {
    this.cachedComponentLogs = {};
    if (clearLogsVarCache) this.logs.clear();
  }
  
  /** Update which component's history we're currently capturing internally. */
  public setLogTarget(name: string | undefined, filePath: string | undefined): void {
    this.log_compDataSourceFile = filePath;
    this.log_compDataTarget = name;
  }
  
  /** Update which component's history we're currently capturing internally. */
  public clearLogTarget(): void {
    this.log_compDataSourceFile = undefined;
    this.log_compDataTarget = undefined;
  }
  
  /** Convenience hack to prevent confusion when reading the logType (renderLog/devLog) while allowing us to use the {@link LogType} as a naming convention in {@link AstComponentInfo}. */
  private getLogCategory(): string {
    if (this.logType === 'dev') return 'buildDevLog';
    if (this.logType === 'render') return 'buildRenderLog';
    if (this.logType === 'retrieval') return 'compRetrieval';
    return this.logType;
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
  
  
  /**
   * Creates a safe contextual object of a React component's node and it's source.
   * uses {@link getSafeNode} to extract safe, clean JSON object representations of each Babel AST NodePath.
   */
  public getSafeReactCompData(data?: ComponentInfo): any {
    if (!data) return undefined;
    return {
      name: data.componentName,
      node: this.getSafeNodeInfo(data.path),
      source: this.getSafeNodeInfo(data.sourcePath),
    }
  }
  
  
  /**
   * Creates a safe contextual object of a React component's rerender info, and it's node/source information.
   * uses {@link getSafeNode} to extract safe, clean JSON object representations of each Babel AST NodePath.
   */
  public getSafeReactCompRerenderData(info?: ComponentRerenderInfo): any {
    if (!info) return undefined;
    return {
      componentName: info.componentName,
      componentInfo: {
        name: info.data.componentName,
        node: this.getSafeNodeInfo(info.data.path),
        source: this.getSafeNodeInfo(info.data.sourcePath),
      },
      hooks: info.hooks,
      fileName: this.getFileNameFromPath(info.filePath),
      filePath: info.filePath
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
// #endregion




// babel generate() options
const generateOpts = {
  retainLines: false,
  compact: false, // This forces the pretty-printed, object-like layout
  concise: false
};

// util for path.getSource()
const prettifySource = (path: NodePath<any>) => path.getSource().split(/\r?\n/);
// const prettifySource = (path: NodePath<any>) => path.getSource()
//   .replace(/(=>\s*\{)/g, "$1\n  ")
//   .replace(/(;)\s*/g, "$1\n  ")
//   .replace(/(\}\s*)$/g, "\n$1");
