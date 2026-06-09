import { BaseLogger } from "./BaseLogger";


/** 
 * The current logger we're using for this application. Specify this by calling {@link log.initialize()}
 * 
 * ----
 * #### Example 
 * ```ts 
 * 
 * const isDevelopment = process.env.NODE_ENV === 'deployment';
 * globalThis.log.initialize(Devlog); // Pass in the logger that you're using for this application.
 * 
 * export default function App() {
 *   // Your application code...
 * }
 * 
 * ```
*/
let activeEngine: BaseLogger | null = null; 


/** 
 * Initializes the `log()` function on the global scope, and adds the specified logging engine used for capturing, handling, and storing logs. 
 * * The logClass should be a ***singleton*** that's already initialized. We call it's {@link import('./BaseLogger.tsx').handleLog|Log.handleLog()} function.
 * 
 * ----
 * @param logClass    The log engine we're using for handling state and logging throughout the application
 */
export function initializeDevLog(logClass: BaseLogger) {
  const globalScope = globalThis as any;
  
  // ? Check if the class has already been initialized
  if (isAlreadyInitializedOrNewClass(logClass)) {
    console.warn(`Just tried to initialize the devlog with an invalid or the same class! data: `, { logClass, currentClass: globalScope?.logClass });
    return;
  }
  
  // TODO: we need to add more than just the "log" function. Let's create a list of the logTypes in the default class for reference
  // {} Attach the log function to the global scope
  if (logClass) {
    globalScope.log = logClass.getLogFunction;
  }
  
  // ? Let's still add the standard logging otherwise: 
  else {
    globalScope.log = (category: string, data?: any) => {
      if (data) console.log(`${category}: `, data);
      else console.log(data);
    }
  }
  
  /** Return whether we are creating a new logging engine, or if we called with the same one. */
  function isAlreadyInitializedOrNewClass(classInstance: BaseLogger): boolean {
    const currentClass = globalScope.logClass;
    if (!currentClass) return false; // it hasn't been initialized yet, or was incorrectly initialized
    if (!classInstance) return true; // we didn't pass in a proper log class instance, defer to the default
    
    const isSameClass = classInstance.constructor === currentClass.constructor;
    return isSameClass;
  }
}
