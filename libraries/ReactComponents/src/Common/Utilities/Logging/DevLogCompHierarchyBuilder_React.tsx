import { NodePath, PluginObj, types as t, BabelFile, PluginPass } from "@babel/core";
import { addNamed } from "@babel/helper-module-imports";
import { ComponentLogConfig, Devlog, LogInfo, LogRenderData } from "./Devlog";
import { 
  ArrowFunctionExpression,   CallExpression,   FunctionDeclaration,   VariableDeclarator,   ClassExpression,  
  isArrowFunctionExpression, isCallExpression, isFunctionDeclaration, isVariableDeclarator, isClassExpression,
  
  BlockStatement, 
  expressionStatement, 
  
  assignmentExpression, 
  memberExpression, 
  Program, 
  valueToNode,
  isIdentifier,
  FunctionExpression,
  isFunctionExpression,
  Node,
  ImportSpecifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
} from "@babel/types";
import fs from 'fs';
import fPath from 'path';
import generate from "@babel/generator";
import { ReactComponentUtils } from "./vite-plugin-devlog";

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




/*
    DevLog Init
      - Add compId and componentName to each jsx component function.
        1. Loop through the components
        2. Find jsx components with function declarations, or arrow function declarations
        3. Attach the unique component name using a hashMap storing componentNames with a number representing the instanced component index counter
        4. When finished, all components should have these variables:
          * Component_A.__compId__ = "Component_A_1"
          * Component_A.__componentName = "Component_A" // ? in production, component's name variable is minified and unreliable (non-unique), so this is required
    
      This gives us access to these variables on the component at runtime, as well as React.Fiber access to these variables for reliable component hierarchy id references
        
    DevLog function
      - At runtime, we need to traverse the current page layout to build the component hierarchy the devlog console can traverse through at runtime. This is for:
        1. Access to a contextual log history, and the ability to attach a component's render information to each log.
        2. The ability to find out what causes a rerender for a component, and how other component's interact, combined rerender behavior, and easy troubleshooting for performant architecture
        3. A multi-functional console that displays log history from components, filtered logs per selected component, and opt-in/opt-out logging for each component
        4. A dynamic collapsable log layout with render and log information attached to each message, grouped logs via time to see what's causing component inefficiency and cascaded rerenders
        4. Console Tabs: All, Search, By Component, and Settings tabs for the logs 
          - All:  shows all logs (the standard console tab), with a smooth aesthetic for showing component history and user interaction, and navigation links to target specific component's log history
          - Search:  by name, or via a popover tree on the left side for quick navigation and filtering through the current page layout. Displaying a component and it's nested components information easily 
          - By Component:  that shows a specific component's layout in a more personalized way, with a separate layout and contextual information. tbd - 
          - Settings:  Enable/Disable logging for specific components to reduce clutter, as well as any other settings for the devlog in general, and extra additions we find along the way
    
    
    RenderLog Data Capture
      - We need to capture all state information that could cause a rerender, as well as a snapshot of the current state of the component when it's logged
        1. The props:  Find a way to handle structured (props), destructured props, and empty prop references
          - Store those values in a variable to pass to the RenderLog
        2. The hooks: useState, useContext, useReducer
          - Find a way through AST to target the values from each of these hooks, and capture them as dictionary keys passed into each hookType in renderLogs
            * We can use diffing to check what was changed, and could have caused the render
          - After we've built the componentTreeHierarchy, use it during runtime to find the parent of each component
            * If all props were unchanged, or the parent was rerendered, (account for memoComps) then check if the parent caused a rerender
          - Adds a separate function to return a descriptive object as to what caused the rerender.


    Creating the Custom Devlog as a plugin for the application
      - This is a dynamically rendered popover component that is accessible from the bottom of the page (either an icon or something of the sorts)
        1. Console Tabs: All, Search, By Component, and Settings tabs for the logs 
          - All:  shows all logs (the standard console tab), with a smooth aesthetic for showing component history and user interaction, and navigation links to target specific component's log history
          - Search:  by name, or via a popover tree on the left side for quick navigation and filtering through the current page layout. Displaying a component and it's nested components information easily 
          - By Component:  that shows a specific component's layout in a more personalized way, with a separate layout and contextual information. tbd - 
          - Settings:  Enable/Disable logging for specific components to reduce clutter, as well as any other settings for the devlog in general, and extra additions we find along the way
        // TODO - Start building this component and perhaps create a new library for this, to later create this for other frameworks, or as a plugin we create from a separate project


				Add devlog diagnostics for each component that tracks and calculates
					- first render, duplicate rerenders, nested rerenders (how many children and grandchildren, etc.) do these rerenders trigger on avg, and child rerenders
					
					capture the react hooks data, finding each declared hook, it's line location, and any other information needed for traversing back through it later quickly

*/

/** The specific Node types we're accessing react components from. 
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
export function devLogCompHierarchyBuilder(): PluginObj {
  // React utilities for finding jsx components, retrieving component information, and validating component's logic
  const utils = new ReactComponentUtils();
  utils.syntaxTreeLogs_clearFileHistory();
  
  // Helper object for the current component we're traversing through in the visitor function
  let componentInfo: ComponentData | undefined;
  
  // Counts how many of a specific component that's been rendered in every component's html
  let componentInstances: Record<string, number> = {};
  
  // #region Component Processing
  /** Checks that these are react components before running all the devlog's necessary functionality on the component. */
  function handleFunction(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>) {
    
  }
  
  
  // #endregion
  // #region Component File Search and Traversal
  return {
    name: "devlog-component-hierarchy-builder",
    
    // Ran once per file before the file is traversed 
    pre(state: BabelFile) {
      
    }, 
    
    
    // Targets specific code within a file
    visitor: {
      // #region FunctionDeclaration ->  Logic ran on Functions() {}
      /**
       * Is ran on every function within a file. It has direct access to things like:
       * * id.name   - The component name
       * * params    - The props array
       * * body      - The code block inside the function
       * * gen/async - Whether it's a normal or an async function. note: React components cannot be async!
       * 
       * ----
       * @example       // ? function MyComponent() {}
       * @param path    The current `function` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<FunctionDeclaration>
       */
      FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
        // processComponent(path, name, path.node);
      },
      
      
      // #endregion
      // #region ArrowFunctionExpression ->  Logic ran on Arrow functions () => {}
      /**
       * Is ran on every arrow function expression within a file.
       * * params - Array of parameter nodes passed to the function.
       * * params[0] - The first parameter node. Can be an Identifier (e.g., "props") or an "ObjectPattern" if destructured.
       * * body - The body of the arrow function. 
       * * init.body - If it uses brackets {}, then this is a BlockStatement, which you can access via "init.body.body". 
       * * body.type - If a single expression without brackets (e.g., `() => x`), this is the explicit expression node type (e.g., Identifier, BinaryExpression).
       * * typeParameters - The type parameter declaration matrix for generics (e.g., `<T>(props: T) => {}`).
       * * async - Boolean indicating if the arrow function is marked with the `async` keyword.
       * () => {} Arrow functions are *anonymous*, so you have to use the `parentNode` (VariableDeclarator) to find the name of the function.
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
       * Is ran on every variable within a file. This contains only the key-value pair of the variable. 
       * * id       - The name of the variable
       * * init     - The initial value of the variable
       * 
       * () Init Parameters:
       * * init.params    - The function's parameters?
       * * init.params[0] - The first parameter node. Can be an Identifier (e.g., "props") or an "ObjectPattern" if destructured.
       * * init.body      - If it uses brackets {}, then this is a BlockStatement, which you can access via "init.body.body". 
       * * typeParameters - The type parameter declaration matrix for generics (e.g., `<T>(props: T) => {}`).
       * () => {} Also useful in the event of arrow functions 
       * 
       * ----
       * @example       // ? const MyComponent = () => {}
       * @example       // ? const variable = 'value';
       * @param path    The current `variable` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<VariableDeclaration>
       */
      VariableDeclarator(path: NodePath<t.VariableDeclarator>, state: PluginPass) {
        const varPath = path.get('init');
        if (!varPath || !varPath.node) {
          return;
        }
        
        
				
				// TODO: Let's divide up the NodeType's extraction from the actual validity checks and searching for components
				/*
					Having one function that checks if it's a react component instead of multiple would help with speeding up the process and making everything faster
					However; each NodeType has different values, different ways of finding the component name, and looping through the component's html should be universal and the found instanced components should be tied to the parent component
					
					1. We need the NodeType, the blueprint component's name, and access to it's original path (e.x. from VarDeclarator)
						- Just check if the potential react component follows the proper naming convention
					2. We need to add the compName to all blueprints, and a compId to all instanced components found within all of each bp comp's html return statements
						- Start by finding all blueprint components within Visitor's VariableDeclarator and FunctionDeclaration. VarDecl should find all ArrowFuncExps, FuncExps, CallExps(memos => ArrowFunc, Func, etc Exp.), and anonymous/inline = FuncExp
							- ArrowFuncExp = VarDecl.init = "const myComp = () => {}"
							- Anonymous/inline = CallExp.args: "const myFunc = function() {}"
							- Func = "FuncDecl = function myComp()"
							- Memo = "CallExp = callee.name: memo, args: [firstItem: any of the above based on how you declared your component, secondItem: same except for the customRerenderProps function]"
							- Check with how imported components work because they might be an import type for things like export const myImportedFunction. I don't know how jsx instances of those components work in returnStatements, but we'll probably be dealing with an identifier, or it's just the JsxDev type and wee add the props
							
						3. Once we've gone through all the variableDeclarator items, we'll have a captured list of every unique react component name, 
                and an object containing it's node, path, and the source path we found it from.
							- Find a way to then loop through these before the Visitor return (set it to a const or something), 
                and then add the props for renderLogs (compId, and parentCompName). Add compName as a static var on the bp for react fiber to have access to it. 
                Find how to safely retrieve the compName for adding compId to the instanced component's props.
						4. At this point we should have everything complete, and the renderLogs() function should work


				{} Capturing the components:
					- If we have the raw node types, we can run through the logic for checking if it's a react component in one function
						1. Create a function to extract the target func's node, and create the object data of the potential react component
						2. have isReactComponent's argument the extracted object of the source and potential node. If it's a reactComponent, add it to the captured list.
						3. after we've found all the react components, THEN add the componentName to the source component's code for every component in a new func. 
						4. after that, loop through their return statements, and add the props to every comp (compId, parentName). 
                This should be safe even for found react component's that we're not actually adding the renderLog to (if it's solely a representational comp without state/hooks).
						
						
				*/
				
				// Grab the name of this component here (nested funcExps store their name on VarDecl), memo callExps and anonymous funcs would also have it stored here.
				
				// Find the actual component's code. Arrow and const func = function() are right here, memo's are in callee arguments, and wee need to loop through FuncDecl to find the rest. 
				// TODO: double check that imported funcs that aren't jsx elements are accounted for here! we may need to check for exportFunc... other import/export types (including export const...)
				
				// Use the created object { nodePath, componentName sourcePath } and pass it to isReactComponent
				
				// Add all functions that are reactComponents to a record using it's component name
				
				// Once the visitor function is done, store it's value to a variable and return it after these two steps
				// 1. loop through the record and add all compName's to the actual component code.
				// 2. loop through the returnStatements of each component blueprint, and find every instanced react component we've created, capture it's component name, create and pass a compId from it's name and the instanceCount using a hash, and finally pass it's parent name. 
				// 3. finally, go through all component blueprints again, and we need to safely extract it's props. grab them from the params:
				//		if it's not destructured, extract the renderLog values from it. 
				//		if it is destructured, we need to add those props to it
				//		if it doesn't have the props argument we need to add it, and then extract the required values
				// 4. Once that's done, add the renderLog function, capture the component's hooks, and place it before the first return statement (or better yet, after the location of the last hook declared in the code)
				
				// check that it works, log the conditional logic, and finish out the abstract tree function!
				
        
        // ? Does is have a PascalCase name?
        let name: string = isIdentifier(path.node.id) ? path.node.id.name : '';
        const isPascalCase = /^[A-Z]/.test(name);
        if (!isPascalCase) return false;
        
        
        // ? Is this potentially a react component?
        utils.logs.clear();
        const isFunctionValue = 
          varPath.isArrowFunctionExpression() || 
          varPath.isFunctionExpression() || 
          varPath.isCallExpression(); // Catch components wrapped in memo() or forwardRef()
        
        if (!isFunctionValue) {
          return;
        }
        
        // ? Store this within a list containing all the found react component instantiations
        utils.addLog(`${name}(${varPath.node.type}) found. Checking if it's a react component`);
        // const isReactComponent = utils.isReactComponent(varPath);
        // const isMemoComponent = utils.isMemoComponent(path);
        // if (isReactComponent || isMemoComponent) utils.addLog({ Pass: `It's a valid react function`, isReactComponent, isMemoComponent});
        // else utils.addLog({ Fail: `It isn't a react function`, isReactComponent, isMemoComponent});
        
        
        // Capture the component's contextual data
        componentInfo
        
        
        
				
        
        
        // Store the logs for this specific component's instance
        utils.addComponentLogData(name, state.filename);
      },
      
      
      // #endregion
      // #region CallExpression ->  A function call anywhere in the code
      /**
       * Is ran on every function within a file. It has direct access to things like:
       * * callee.name    - The props array
       * * callee.type    - The component name
       * * arguments      - This is an array of variable types "StringLiteral", "ObjectExpression", etc.
       * * gen/async - Whether it's a normal or an async function. note: React components cannot be async!
       * 
       * ----
       * @example       // ? foo(), or const val = useHook(), or const ComponentA = memo(() => { ...code });
       * @param path    The current `function` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<FunctionDeclaration>
       */
      CallExpression(path: NodePath<CallExpression>) {
        
      },
      
      
      // #endregion
      // #region Program ->  Enter and Exit functionality
      Program: {
        exit(path: NodePath<Program>, state: PluginPass) {
          // Add this component's logs the abstract syntax tree's log history
          // console.log('file: ', state.filename);
          utils.syntaxTreeLogs_addHistoryToFile<Record<string, AstComponentInfo>>(utils.fileComponentLogs);
          utils.clearFileComponentLogs();
          componentInfo = undefined;
        },
        
        
        enter(path: NodePath<Program>, state: PluginPass) {
        },
      },
      
      
      // #endregion
      // #region Other useful syntax targets
      ImportDeclaration(path: NodePath<t.ImportDeclaration>, pass: PluginPass) {},
      ExportDeclaration(path: NodePath<t.ExportDeclaration>, pass: PluginPass) {},
      ReturnStatement(path: NodePath<t.ReturnStatement>, pass: PluginPass) {},
      
      // Triggers whenever any function or method is executed in the code. You can intercept hooks with this?
      // CallExpression(path: NodePath<t.CallExpression>, pass: PluginPass) {},
      
      // Ran on any html-like tag (e.g. <div className="custom-class" />)
      JSXElement(path: NodePath<t.JSXElement>, pass: PluginPass) {},
      
      // ArrayExpression
      // ArrowFunctionExpression 
      
      // BlockParent
      // DeclareVariable
      
      
      // #endregion
    }, 
    
    
    // Ran once per file after the file is traversed 
    post(state: BabelFile) {
      
    },
  };
  // #endregion
}
// #region React Component Utils
