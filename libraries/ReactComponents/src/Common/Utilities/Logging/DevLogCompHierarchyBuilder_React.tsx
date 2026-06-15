import { NodePath, PluginObj, types as BabelTypes, BabelFile, PluginPass } from "@babel/core";
import { addNamed } from "@babel/helper-module-imports";
import { Devlog, LogInfo, RenderLogData } from "./Devlog";
import { ArrowFunctionExpression, BlockStatement, BlockStatement, FunctionDeclaration, VariableDeclarator } from "@babel/types";



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
    


*/


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
export function devLogCompHierarchyBuilder({ types: t }: { types: typeof BabelTypes }): PluginObj {
  const devlogHelper = new ASTComponentHelper();
  
  // Keep track of how many times the component has been "created"
  const componentInstances = new Map<string, number>();
  
  
  /** Checks that these are react components before running all the devlog's necessary functionality on the component. */
  function handleFunction(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>) {
    const node = path.node;
    let name: string = "Unknown";
    if (!node) return;
    
    // Retrieve the function's code
    const code = devlogHelper.getCodeFromFuncTypes(path);
    if (!code) { // <- We found an arrow func that's only returns something, whether it be a function or just a displayed jsx element
      return;
    }
    
    // ? Is this a valid react component?
    if (!devlogHelper.isReactComponent(path)) {
      return;
    }
    
    // Add the necessary information and functionality to each component
    addCompIdAndName(path);
    addRenderLogAndData(path);
  }
  
  
  /** Attaches a unique component id and the component name to the component function for access from React.Fiber, and during runtime. */
  function addCompIdAndName(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>) {
    const node = path.node;
    let name: string = "Unknown";
    
    // Retrieve the component's name
    if (BabelTypes.isArrowFunctionExpression(node)) name = devlogHelper.getArrowFuncExpName(path as NodePath<ArrowFunctionExpression>) || name;
    if (BabelTypes.isFunctionDeclaration(node)) name = node.id?.name || name;
    
    // Manage counter safely with Map APIs
    const currentCount = componentInstances.get(name) ?? 0;
    const nextCount = currentCount + 1;
    componentInstances.set(name, nextCount);
    
    // Create the component's id // * assignment = ComponentA.__uniqueComponentId__ = "ComponentA_1";
    const compId = `${name}_${nextCount}`; // e.g., "ComponentA_1", "ComponentA_2"
    
    const addVar_CompId = t.expressionStatement(
      t.assignmentExpression(
        "=", // equals assignment operation
        t.memberExpression(t.identifier(name), t.identifier("__uniqueComponentId__")), // left side of the equals sign
        t.stringLiteral(compId) // the right side of the equals sign
      )
    );
    
    // Because component names are destroyed in production, let's just create another ref here:
    const addVar_CompName = t.expressionStatement(
      t.assignmentExpression(
        "=",
        t.memberExpression(t.identifier(name), t.identifier("__ComponentName__")),
        t.stringLiteral(name)
      )
    );
    
    // -> Complete: Insert these right after the function definition
    // If it's an arrow expression, this climbs up and grabs the outer 'const x = () => {}' statement line.
    // If it's a standard function declaration, it grabs the function statement line itself.
    const insertionPath = path.getStatementParent() || path; // ? add cleanly to new lines after the declaration
    insertionPath.insertAfter(addVar_CompId);
    insertionPath.insertAfter(addVar_CompName);
  }
  
  
  function addRenderLogAndData(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>) {
    const node = path.node;
    if (!node) return;
    
    // Check that the component has props / hooks. If it does not, it doesn't need to have renderLogs
    const props = devlogHelper.getComponentProps(node.params);
    const renderInformation: Partial<RenderLogData> = devlogHelper.getHooks(path);
    
    let hasProps = false; // Props either returns as "props", or an destructured object. Check both here
    let hasHooks = renderInformation?.stateHooks?.length || renderInformation?.contexts?.length || renderInformation?.reducers?.length;
    if (props.name === 'props' || props.keys?.length) hasProps = true;
    
    if (!hasProps && !hasHooks) {
      console.log(`component ${(node as any)?.id?.name} did not have any props(${props.type})! propName: ${props.name}, keys: `, props.keys);
      return;
    }
    
    // ? Add the render log function, and map the arguments to the function
    if (BabelTypes.isArrowFunctionExpression(node)) {
      
    }
    
    if (BabelTypes.isFunctionDeclaration(node)) {
      
    }
  }
  
  
  function createCompHierarchyRefMap() {
    // We need a hashmap of each compId with an object containing what kind of component it is
    // For devlog specific ui settings, etc.  (toggle on/off logging for a specific component)
    // Having access to each individual component with metadata specific to config, and even the captured values here might be helpful
  }
  
  
  function processComponent(path: NodePath<any>, name: string, functionBlock: any) {
    const component = functionBlock; // Use functionBlock parameter reference safely
    if (!component || !name) return;
    
    // <- Opt-in check: Only target uppercase names (React components)
    if (!/^[A-Z]/.test(name)) return;
    console.log(`functionDeclaration / arrowComponent was ran on: ${name}`)
    
    
    // #region Add The compId
    // Manage counter safely with Map APIs
    const currentCount = componentInstances.get(name) ?? 0;
    const nextCount = currentCount + 1;
    componentInstances.set(name, nextCount);
    
    // Create the component's id
    // * assignment = ComponentA.__uniqueComponentId__ = "ComponentA_1";
    const compId = `${name}_${nextCount}`; // e.g., "ComponentA_1", "ComponentA_2"
    
    const insertionPath = path.isVariableDeclarator() ? path.parentPath : path; // Direct statement line alignment
    const addVar_CompId = t.expressionStatement(
      t.assignmentExpression(
        "=", // equals assignment operation
        t.memberExpression(t.identifier(name), t.identifier("__uniqueComponentId__")), // left side of the equals sign
        t.stringLiteral(compId) // the right side of the equals sign
      )
    );
    
    // Because component names are destroyed in production, let's just create another ref here:
    const addVar_CompName = t.expressionStatement(
      t.assignmentExpression(
        "=",
        t.memberExpression(t.identifier(name), t.identifier("__ComponentName__")),
        t.stringLiteral(name)
      )
    );
    
    // -> Complete: Insert these right after the function definition
    insertionPath.insertAfter(addVar_CompId);
    insertionPath.insertAfter(addVar_CompName);
    // #endregion
    
    
    // 1. Core Injection: Automatically manage named library hook import statements securely
    const importUseRerenderStats = addNamed(
      path, 
      "useRerenderStats", 
      "@Project/ReactComponents/Common/Utilities/Logging/useRerenderStats"
    );
    
    // {} Gather and structure the props
    // ? Determine how props are named in the component parameters (usually the first param, e.g., 'props')
    const hasParams = Array.isArray(component.params) && component.params.length > 0;
    const firstParam = hasParams ? component.params[0] : null;
    
    let propsIdentifier: BabelTypes.Expression = t.objectExpression([]); // Fallback to an empty object if no props exist
    let destructuringRestorationNode: BabelTypes.Statement | null = null;
    
    if (firstParam) {
      // ? Case: function MyComponent(props) { ... }
      if (t.isIdentifier(firstParam)) {
        propsIdentifier = t.identifier(firstParam.name);
      }
      // ? Case Destructured: function MyComponent({ title, userId }) { ... }
      else if (t.isObjectPattern(firstParam)) {
        const tempPropsName = `_devlog_props_${name}`;
        
        // A. Create the props extractor pointer variable: _devlog_props_Home[0]
        propsIdentifier = t.memberExpression(
          t.identifier(tempPropsName),
          t.numericLiteral(0),
          true
        );
        
        // B. Create the restoration line statement: const { name, styles } = _devlog_props_Home[0];
        destructuringRestorationNode = t.variableDeclaration("const", [
          t.variableDeclarator(firstParam, propsIdentifier)
        ]);
        
        // C. Rewrite the function signature parameters to accept the rest expression capture array: (..._devlog_props_Home)
        component.params = [t.restElement(t.identifier(tempPropsName))];
      }
    }
    
    // 2. Build tracking hook execution: const _renderData = useRerenderStats("Comp_1", props);
    // const trackerHookCall = t.variableDeclaration("const", [
    //   t.variableDeclarator(
    //     t.identifier("_renderData"),
    //     t.callExpression(importUseRerenderStats, [
    //       t.stringLiteral(compId),
    //       propsIdentifier
    //     ])
    //   )
    // ]);
    
    // 3. Build master logging statement call expression: window._devlog_renderLog('rerender', "Comp_1", _renderData);
    const logCall = t.expressionStatement(
      t.callExpression(t.identifier("renderLog"), [
        t.stringLiteral("rerender"),
        t.stringLiteral(compId),
        t.identifier("_renderData")
      ])
    );
    
    // 4. Inject statements inside the block statement body safely
    if (component.body && Array.isArray(component.body.body)) {
      // If the component used destructuring, place the restoration statement at the absolute top first!
      if (destructuringRestorationNode) {
        component.body.body.unshift(destructuringRestorationNode, trackerHookCall, logCall);
      } else {
        component.body.body.unshift(trackerHookCall, logCall);
      }
    }
  }
  
  
  
  return {
    name: "devlog-component-hierarchy-builder",
    
    // Ran once per file before the file is traversed 
    pre(state: BabelFile) {
      
    }, 
    
    
    // Targets specific code within a file
    visitor: {
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
      
      
      ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
        
      },
      
      
      
      /**
       * Is ran on every variable within a file. This contains only the key-value pair of the variable. 
       * * id       - The name of the variable
       * * init     - The initial value of the variable
       * 
       * () Init Parameters:
       * * init.params    - The function's parameters?
       * * init.params[0] - The props node. It contains things like Identifier if written as "props", or "ObjectPattern" if destructured
       * * init.body      - If it uses brackets {}, then this is a BlockStatement, which you can access via "init.body.body". 
       * * init.typeParameters - The type matrix used for this templated variable declarations ( const Comp = <T,>(props: T) => {} )
       * () => {} Also useful in the event of arrow functions 
       * 
       * ----
       * @example       // ? const MyComponent = () => {}
       * @example       // ? const variable = 'value';
       * @param path    The current `variable` we're viewing.
       * @remarks At the bottom of the page are the different structures for NodePath<VariableDeclaration>
       */
      VariableDeclarator(path: NodePath<BabelTypes.VariableDeclarator>, pass: PluginPass) {
        const name = t.isIdentifier(path.node.id) ? path.node.id.name : null;
        if (!name) return;
        const init: BabelTypes.Expression = path.node.init as BabelTypes.Expression;
        
        if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
          // we're trying to avoid React.FC and other component only with visual purposes created without brackets: const MyComp = () => <div />;
          if (!t.isBlockStatement(init.body)) {
            return;
          }
          
          processComponent(path, name, init);
        }
      },
      
      // #region Other useful syntax targets
      ImportDeclaration(path: NodePath<BabelTypes.ImportDeclaration>, pass: PluginPass) {},
      ExportDeclaration(path: NodePath<BabelTypes.ExportDeclaration>, pass: PluginPass) {},
      ReturnStatement(path: NodePath<BabelTypes.ReturnStatement>, pass: PluginPass) {},
      
      // Triggers whenever any function or method is executed in the code. You can intercept hooks with this?
      CallExpression(path: NodePath<BabelTypes.CallExpression>, pass: PluginPass) {},
      
      // Ran on any html-like tag (e.g. <div className="custom-class" />)
      JSXElement(path: NodePath<BabelTypes.JSXElement>, pass: PluginPass) {},
      
      // ArrayExpression
      // ArrowFunctionExpression 
      
      // BlockParent
      // DeclareVariable
      
    }, 
    
    
    // Ran once per file after the file is traversed 
    post(state: BabelFile) {
      
    }
  };
}



/** Utilities for finding/accessing data within `React` components. */
export class ASTComponentHelper {
  
  
  constructor() {}
  
  
  // #region General Utils
  /** Retrieves the BlockStatement from `VariableDeclarators` and `FunctionDeclarations`. */
  public getCodeFromFuncTypes(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>): BlockStatement | undefined {
    const node = path.node;
    if (!node) return undefined;
    
    // Find out whether we're dealing with an arrow function, or a function declaration
    
    // ? Arrow Function: Check if it contains code, or is a one-liner
    if (BabelTypes.isArrowFunctionExpression(node)) {
      if (BabelTypes.isBlockStatement(node.body)) return node.body;
      else return undefined;
    }
    
    // if ('init' in node && node?.init?.type === "ArrowFunctionExpression") { // const MyComponent = () => 
    //   const arrowFuncNode = node.init;
    //   if (arrowFuncNode.body.type === 'BlockStatement') {
    //     return arrowFuncNode.body.body;
    //   }
    //   
    //   return undefined; // If there isn't code to parse, return undefined
    // }
    
    // ? Normal function syntax
    if (BabelTypes.isFunctionDeclaration(node)) { // function myComponent() {}
      return node.body;
    }
    
    return undefined;
  }
  
  
  /** Checks whether this is a valid react jsx component, not just a function */
  public isReactComponent(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>): boolean {
    const node = path.node;
    if (!node) return false;
    
    // ? Arrow Function: Check if it contains code, or is a one-liner
    if (BabelTypes.isArrowFunctionExpression(node)) { // const MyComponent = () => 
      return this.isJsxArrowComponent(path as NodePath<ArrowFunctionExpression>);
    }
    
    // ? Normal function syntax
    if (node.type === 'FunctionDeclaration') { // function myComponent() {}
      return this.isJsxComponent(path as NodePath<FunctionDeclaration>);
    }
    
    return false;
  }
  
  
  // #endregion
  // #region Visitor::FunctionDeclaration Search Utils
  public isJsxComponent(path: NodePath<FunctionDeclaration>): boolean {
    const node = path.node;
    if (!node) return false;
    
    // ? Is it nested?
    // Check the parent structure. If it is wrapped in an array map, an event handler, 
    // or another function, its immediate parent will NOT be the file root ("Program").
    // Using path.scope.parentBlock safely accounts for standard files AND direct 'export function' modules!
    if (path.scope.parentBlock && !BabelTypes.isProgram(path.scope.parentBlock)) {
      return false; // Exit immediately if it's nested deep inside anything!
    }
    
    // ? Does it return JSX/HTML?
    const body = path.node.body;
    if (BabelTypes.isJSXElement(body) || BabelTypes.isJSXFragment(body)) {
      return true;
    }
    
    // Block Returns (e.g., () => { return <div />; })
    // ? We must scan the lines inside the brackets to see if a ReturnStatement outputs JSX.
    let returnsJsx = false;
    path.traverse({
      ReturnStatement(returnPath) {
        const arg = returnPath.node.argument;
        if (BabelTypes.isJSXElement(arg) || BabelTypes.isJSXFragment(arg)) {
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
  public isJsxArrowComponent(path: NodePath<ArrowFunctionExpression>): boolean {
    // ? Is it nested?
    // Check the parent structure. If it is wrapped in an array map, an event handler, 
    // or another function, its immediate parent parent will NOT be the file root ("Program").
    const parentParent = path.parentPath?.parentPath;
    if (!parentParent || !BabelTypes.isProgram(parentParent as any)) {
      return false; // Exit immediately if it's nested inside loops, objects, or variables!
    }
    
    // Implicit Return (e.g., () => <div />)
    // ? Does it return JSX/HTML?
    const body = path.node.body;
    if (BabelTypes.isJSXElement(body) || BabelTypes.isJSXFragment(body)) {
      return true;
    }
    
    // Block Returns (e.g., () => { return <div />; })
    // ? We must scan the lines inside the brackets to see if a ReturnStatement outputs JSX.
    let returnsJsx = false;
    path.traverse({
      ReturnStatement(returnPath) {
        const arg = returnPath.node.argument;
        if (BabelTypes.isJSXElement(arg) || BabelTypes.isJSXFragment(arg)) {
          returnsJsx = true;
          returnPath.stop(); // Found it! Stop searching this function.
        }
      }
    });
    
    return returnsJsx;
  }
  
  
  /** Retrieves the name of the arrowFunctionExpression by accessing it from the parentNode (VariableDeclarator) */
  public getArrowFuncExpName(path: NodePath<ArrowFunctionExpression>): string | undefined {
    const parentPath = path.parentPath;
    
    if (parentPath && parentPath.isVariableDeclarator()) {
      const arrowDeclaratorNode = parentPath.node;
      if (BabelTypes.isIdentifier(arrowDeclaratorNode.id)) {
        const componentName =  arrowDeclaratorNode.id.name;
        return componentName;
      }
    }
    
    // ? Try capturing the name without proper typing, maybe this wasn't pulled from a VariableDeclarator?
    const name = (parentPath as any)?.node?.id?.name;
    return name || undefined;
  }
  
  
  
  
  // #endregion
  // #region Visitor::VariableDeclarator Search Utils
  public foundJsxComponentFromVarDeclarator(): boolean {
    return true;
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
    if (BabelTypes.isIdentifier(firstParam)) {
      return { type: "plain", name: firstParam.name }; // e.g., (props)
    }
    
    if (BabelTypes.isObjectPattern(firstParam)) {
      const keys = firstParam.properties.map((prop) => {
        if (BabelTypes.isObjectProperty(prop) && BabelTypes.isIdentifier(prop.key)) {
          return prop.key.name; // Standard destructured keys
        }
        if (BabelTypes.isRestElement(prop) && BabelTypes.isIdentifier(prop.argument)) {
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
  
  
  public getHooks(startPath: NodePath<FunctionDeclaration | ArrowFunctionExpression>): Partial<RenderLogData> {
    if (!startPath || !startPath.node) return {};
    const code = this.getCodeFromFuncTypes(startPath);
    if (!code) return {};
    
    // Create the renderLogData state hooks structs
    let renderInformation: Partial<RenderLogData> = {
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
        if (BabelTypes.isCallExpression(funcNode)) {
          const calleeNode = funcNode.callee;
          if (BabelTypes.isIdentifier(calleeNode)) {
            // Capture the useState's state variable
            if (calleeNode.name === 'useState' && BabelTypes.isArrayPattern(node.id)) {
              const stateHook = node.id.elements?.[0];
              if (BabelTypes.isIdentifier(stateHook) && stateHook.name) renderInformation.stateHooks?.push(stateHook.name);
            }
            
            // Capture the useContext's variable name
            if (calleeNode.name === 'useContext' && BabelTypes.isIdentifier(node.id)) {
              const contextHook = node.id.name;
              if (contextHook) renderInformation.contexts?.push(contextHook);
            }
            
            // Capture the useReducer's state variable
            if (calleeNode.name === 'useReducer' && BabelTypes.isArrayPattern(node.id)) {
              const reducerHook = node.id.elements?.[0];
              if (BabelTypes.isIdentifier(reducerHook) && reducerHook.name) renderInformation.reducers?.push(reducerHook.name);
            }
          }
        }
      }
    })
    
    return renderInformation;
  }
  
  
  public getStateHooks(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>): any[] {
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
        if (BabelTypes.isCallExpression(funcNode)) {
          const calleeNode = funcNode.callee;
          
          if (BabelTypes.isIdentifier(calleeNode)) {
            if (calleeNode.name === 'useState' && BabelTypes.isArrayPattern(node.id)) {
              const stateHook = node.id.elements?.[0];
              if (BabelTypes.isIdentifier(stateHook) && stateHook.name) hooks.push(stateHook.name);
            }
          }
        }
      }
    })
    
    return hooks;
  }
  
  
  public getContextHooks(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>): any[] {
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
        if (BabelTypes.isCallExpression(funcNode)) {
          
          const calleeNode = funcNode.callee;
          if (BabelTypes.isIdentifier(calleeNode)) {
            if (calleeNode.name === 'useContext' && BabelTypes.isIdentifier(node.id)) {
              const contextHook = node.id.name;
              if (contextHook) contexts.push(contextHook);
            }
          }
        }
      }
    })
    
    return contexts;
  }
  
  
  public getReducerHooks(path: NodePath<FunctionDeclaration | ArrowFunctionExpression>): any[] {
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
        if (BabelTypes.isCallExpression(funcNode)) {
          const calleeNode = funcNode.callee;
          if (BabelTypes.isIdentifier(calleeNode)) {
            
            // Capture the useReducer's state variable
            if (calleeNode.name === 'useReducer' && BabelTypes.isArrayPattern(node.id)) {
              const reducerHook = node.id.elements?.[0];
              if (BabelTypes.isIdentifier(reducerHook) && reducerHook.name) reducers?.push(reducerHook.name);
            }
          }
        }
      }
    })
    
    return reducers;
  }
  
  
  
  
  // #endregion
}


/* 
  * By recognizing these CallExpression layouts, 
  * you can add a listener inside your plugin visitor to automatically detect what features a component uses:
  
  // ? Inside your plugin visitor block:
    CallExpression(path) {
      const calleeName = path.node.callee.name;
      
      if (calleeName === "useContext") {
        const contextName = path.node.arguments[0]?.name;
        console.log(`AST Scanner -> Component hooks into context provider: ${contextName}`);
      }
      
      if (calleeName === "useState") {
        // Determine the variable names bound to this hook instantiation
        const parentNode = path.parent;
        if (t.isVariableDeclarator(parentNode) && t.isArrayPattern(parentNode.id)) {
          const stateVariableName = parentNode.id.elements[0]?.name;
          console.log(`AST Scanner -> Component instantiates a slice of state tracked via variable: ${stateVariableName}`);
        }
      }
    }
*/




//----------------------------------------------------------------------------------//
// Component Return Type Examples                                                   //
//----------------------------------------------------------------------------------//
// #region Pathing Help?
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


*/
// #endregion
// #region VariableDeclarator
// {} Normal Variables
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
// #region Map
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
// () In source code, React hooks are structural CallExpression nodes (functions being executed). 
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


// ? Function Declarators has argument types for params with default values, and rest params syntax 
// #endregion
// #region FunctionDeclarator
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
