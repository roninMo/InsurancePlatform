import { NodePath, PluginObj, types as BabelTypes } from "@babel/core";
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
  return {
    name: "add-render-logs",
    visitor: {
      // {} Runs once at the beginning of every file
      // Program(path) {
      //   componentInstances.clear();
      // },
      // Program: {
        // enter(path) { /* Starts file */ },
        // exit(path) { /* Ends file. Put global cleanup/verification here */ }
      // }
      
      
      // {} Runs on every function that's found in each file
      FunctionDeclaration(path: NodePath<BabelTypes.FunctionDeclaration>) {
        const component: BabelTypes.FunctionDeclaration = path.node;
        const name = component?.id?.name; // The name of the component
        if (!component || !name) return;
        
        // <- Opt-in check: Only target uppercase names (React components)
        if (!/^[A-Z]/.test(name)) return;
        
        // <- Check that this component has a compId for us to use
        
        // check both the direct node and the static node identifier bindings
        const compId: string | undefined = (component as any).__uniqueComponentId__ || (component.id as any)?.__uniqueComponentId__;
        if (!compId) return;
        
        
        // {} Gather and structure the props
        // ? Determine how props are named in the component parameters (usually the first param, e.g., 'props')
        const firstParam = component.params[0];
        let propsIdentifier: BabelTypes.Expression = t.objectExpression([]); // Fallback to an empty object if no props exist
        
        if (firstParam) {
          // ? Case: function MyComponent(props) { ... }
          if (t.isIdentifier(firstParam)) {
            propsIdentifier = t.identifier(firstParam.name);
          }
          
          // ? Case Destructured: function MyComponent({ title, userId }) { ... }
          else if (t.isObjectPattern(firstParam)) {
            // We rebuild an object reference matching the destructuring signature to feed into our tracker hook
            propsIdentifier = t.objectExpression(
              firstParam.properties.map((prop) => {
                if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                  return t.objectProperty(prop.key, t.identifier(prop.key.name));
                }
                return null;
              }).filter((p): p is BabelTypes.ObjectProperty => p !== null)
            );
          }
        }
        
        // 1. Build Node: const _renderData = useRenderTracker("Comp_1", props);
        const trackerHookCall = t.variableDeclaration("const", [
          t.variableDeclarator(
            t.identifier("_renderData"),
            t.callExpression(t.identifier("useRenderTracker"), [
              t.stringLiteral(compId),
              propsIdentifier
            ])
          )
        ]);
        
        // 2. Build Node: renderLog('rerender', "Comp_1", _renderData);
        const logCall = t.expressionStatement(
          t.callExpression(t.identifier("renderLog"), [
            t.stringLiteral("rerender"),
            t.stringLiteral(compId),
            t.identifier("_renderData")
          ]) 
        );
        
        // 3. Inject both statements sequentially into the very beginning of the component's block body
        component.body.body.unshift(trackerHookCall, logCall);
      }
    }
  };
};




// #endregion
