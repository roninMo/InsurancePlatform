import { NodePath, PluginObj, types as BabelTypes } from "@babel/core";
import { addNamed } from "@babel/helper-module-imports";
import { Devlog, LogInfo } from "./Devlog";


// #region createCompReferenceHierarchy()
/** 
 * ### *createCompReferenceHierarchy()*
 * Attaches unique component names to each of the component's *function* via an `id`.
 * * This gives the **{@link Devlog}** access to their `component name`, and a unique component ref `id` for traceable logging and diagnostics.
 * * This allows ***react-fiber*** to have access to the values, for bridging component tree references on the fly.
 * * You can utilize filtering and searches to quickly extract which components are logging what, to help with troubleshooting
 * 
 */
export function createCompReferenceHierarchy({ types: t }: { types: typeof BabelTypes }): PluginObj {
  // Keep track of how many times the component has been "created"
  const componentInstances = new Map<string, number>();
  
  
  return {
    name: "component-reference-hierarchy",
    visitor: {
      // {} Runs once at the beginning of every file
      // Program(path) {
      //   componentInstances.clear();
      // },
      
      // {} Runs on every function that's found in each file
      FunctionDeclaration(path: NodePath<BabelTypes.FunctionDeclaration>) {
        const name = path?.node?.id?.name; // The name of the component
        if (!name) return;
        
        // <- Opt-in check: Only target uppercase names (React components)
        if (!/^[A-Z]/.test(name)) return;
        
        // ? Manage counter safely with Map APIs
        const currentCount = componentInstances.get(name) ?? 0;
        const nextCount = currentCount + 1;
        componentInstances.set(name, nextCount);
        
        
        // ? Add the unique id to the react component's function so we can access it both at runtime and through react.fiber
        const uniqueId = `${name}_${nextCount}`; // e.g., "ComponentA_1", "ComponentA_2"
        
        // *  assignment = ComponentA.__uniqueComponentId__ = "ComponentA_1";
        const addVar_CompId = t.expressionStatement(
          t.assignmentExpression(
            "=", // equals assignment operation
            t.memberExpression(t.identifier(name), t.identifier("__uniqueComponentId__")), // left side of the equals sign
            t.stringLiteral(uniqueId) // the right side of the equals sign
          )
        );
        
        // ? Because component names are destroyed in production, let's just create another ref here: 
        const addVar_CompName = t.expressionStatement(
          t.assignmentExpression(
            "=", 
            t.memberExpression(t.identifier(name), t.identifier("__ComponentName__")),
            t.stringLiteral(name)
          )
        );
        
        // -> Complete: Insert these right after the function definition
        path.insertAfter(addVar_CompId);
        path.insertAfter(addVar_CompName);
      }
    }
  };
};




// #endregion
// #region addRenderLogs()
/** 
 * ### *addRenderLogs()*
 * Adds a *{@link LogInfo|renderLog}* to every functional component in your project, attaching all prop and context information for tracking rerender functionality. 
 * This is used in the **{@link Devlog}** for:
 * * Capturing the *{@link Devlog._logs|log history}* of component's, in order to increase performance and remove bottlenecks in efficiency
 * * Combine brief sections of *rerendered information* in a custom ui that displays a **{@link Devlog.getComponentHierarchy|historical view}** of what just rerendered
 * * The ability to *search*, *select*, or *traverse* a **component hierarchy**, and opt into seeing and logging **specific component's** logs (including Dev/Render logs)
 * * Easy to read, calculated information based on rerenders, to find the source of a component's inefficiency between *multiple* components.
 * 
 * ----
 * @note In order to use this and the {@link Devlog} properly, **{@link createCompReferenceHierarchy()}** must first be ran.
 */
export function addRenderLogs({ types: t }: { types: typeof BabelTypes }): PluginObj {
  // TODO - remove the useRerenderStats hook - switch back to capturing the props, state, contexts, and hooks and passing them to the devlog
  // TODO - handle diff checking for rerender cause in the devlog logic once the circular rerender dep has been fixed
  // Keep track of how many times the component has been "created"
  const componentInstances = new Map<string, number>();
  
  // ? Adds the compId, useRenderStats, and renderLog to each component
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

    // #region Add the render tracking hook, and renderLog()
    
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
    const trackerHookCall = t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier("_renderData"),
        t.callExpression(importUseRerenderStats, [
          t.stringLiteral(compId),
          propsIdentifier
        ])
      )
    ]);

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
    // #endregion
  }
  
  
  
  return {
    name: "add-render-stats",
    visitor: {
      // function MyComponent() {}
      FunctionDeclaration(path: NodePath<BabelTypes.FunctionDeclaration>) {
        const name = path.node.id?.name;
        if (!name) return;
        
        processComponent(path, name, path.node);
      },
      
      // const MyComponent = () => {}
      VariableDeclarator(path) {
        const name = t.isIdentifier(path.node.id) ? path.node.id.name : null;
        if (!name) return;
        const init = path.node.init;
        
        if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
          // we're trying to avoid React.FC and other component only with visual purposes created without brackets: const MyComp = () => <div />;
          if (!t.isBlockStatement(init.body)) {
            return;
          }
          
          processComponent(path, name, init);
        }
      }
    }
  };
}