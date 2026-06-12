import { BaseLogger, BaseLogFunction, BaseLogInfo, BaseLogMetadata, BaseLogStruct, DefLogType, LogParams } from "./BaseLogger";


// #region Types
/** 
 * ### LogInfo
 * The organized log information stored in the {@link _logs|log history} of the application's {@link BaseLogger|Logger}. 
 * * `TLogStruct` - &nbsp; &nbsp; &nbsp; The custom arguments passed into the *{@link BaseLogger.initializeLogFunctions|log()}* functions.
 * * `TLogMetadata` - &nbsp; Information specific to when and what called the *{@link BaseLogger.initializeLogFunctions|log()}* function.
*/
export interface LogInfo extends BaseLogInfo<LogStruct, LogMetadata> {
  data: LogStruct,
  renderData: LogRenderData,
  metaData: LogMetadata,
};


/** The stored log data for quickly finding and retrieving logs in history. */
export interface LogStruct extends BaseLogStruct {
  index: number,
  componentName: string,
  log?: LogParams,
};


/** The component's contextual information for when it's rerendered, using a snapshot of the state that is has at any given time. */
export interface LogRenderData {
  parentName: string,
  componentName: string,
  props?: any[],
  contexts?: any[],
  hooks?: any[],
}


/** The log's base metadata information */
export interface LogMetadata extends BaseLogMetadata<LogType> {
  // Additional metadata information
}


/** The standard log types that are used for logging. Each will have their own function() call tied to them */
export type LogType = DefLogType | 'RENDER';


/**
 * A flexible base logging function type. `logData` is what is actually passed to the log function. 
 * * Everything else is meant to be *subclassed* for when you add context specific parameters.
 */
export interface LogFunction extends BaseLogFunction {
  /** The category and log information tied to each specific log */
  (category: string, message?: any, ...optionalParams: any[]): void;
};




// #endregion
/** Devlog */
export class DevLog extends BaseLogger<LogType, LogFunction, LogStruct, LogMetadata, LogInfo> {
  /**
   *  {} Add the devlog class, it needs
   *    - a flat array/map of the nested component hierarchy ie: 
   *        "compA": ["compA1", "compB", "compC"],
   *        "compA1": ["leafNode"],
   *        "compB": ["compB1", "compB2"],
   *        "compB1": etc.
   *    - add the traverse nodes function to retrieve all nested components in the component hierarchy
   *    - SubTypes: Add a new logType for handling renderLogs, added componentName to the logStruct
   *    - work on AST to handle creating the component hierarchy flat array, and then have it add renderLogs to all components with the captured, props, and react's hooks to track rerenders
   *    - Form components already have console logs specific to visualizing state information, they can have their own category, but shouldn't be used alongside renderLogs
   *  
   * 
   */
  
  
  /**  */
  /** lastLogPerComponent (Map/Object): tracks latest log index in O(1) time per component. */
  protected lastLogPerComponent: Map<string, number> = new Map<string, number>();
  
  /** A map of all the currently rendered component names and their children */
  protected adjacencyList: Map<string, string[]> = new Map<string, string[]>();
  
  /** descendantMap (Map/Object): O(1) dictionary mapping component hierarchy to a flat Set of all deep children. */
  protected descendantMap: Map<string, Set<string>> = new Map<string, Set<string>>();
  
  /** 
   * ### `get storeLogData()`
   * Stores the log's information and metadata to our cached *{@link _logs|history}*, and links it's index to the *{@link _categoryLogs|category}* hashmap.
   * * Subclass this to add additional functionality when storing the log data.
   * 
   * ----
   * @param category      The *category* this log pertains to
   * @param logParams     the log function's *arguments* passed in
   * @param logType       What kind of *log function* was called
   */
  protected storeLogData(category: string, logParams: LogStruct, logType: LogType): void {
    const nextLogIndex: number = this.getNextLogIndex();
    const logStruct = {...logParams, index: nextLogIndex };
    const logMetadata = this.createLogMetadata(this.getSource(logStruct), logType);
    // const logInformation: TLogStruct & TLogMetaData = { ...logStruct, ...logMetadata};
    
    console.log(`storeLogData(${logType}): `, { logStruct, logMetadata, this: this });
    // {} Add it to the history and hashmaps
    this.addLog(logStruct, logMetadata);
    this.addLogsToCategory(category, nextLogIndex);
  }
  
  
  
  
  // #region Create Log Functions
  /** 
   * #### InitializeLogs
   * Adds this class instance to the global scope, and the universal custom logging functions
   * * Checks that it hasn't already been initialized and *overwrites* if called with a different class.
   * * Each class adds their own logging functions. Subclass this for custom logs like *render* state specific diagnostics.
   * 
   * ----
   * This class saves the log history which can be used for creating your own dev console within the application.
   */
  public override initializeLogFunctions(): void {
    super.initializeLogFunctions();
  }
  
  
  
  
  // #endregion
  // #region Component Hierarchy Retrieval
  /**
   * Crawls React's live internal Fiber tree from the DOM to map parent-child relationships.
   * Runs in O(N) microsecond speeds. Execute once right after navigation/layout shifts.
   */
  public getComponentHierarchy(): void {
    const rootDOM = document.getElementById('root') || document.querySelector('[data-reactroot]');
    if (!rootDOM) return;
    
    // Locate the internal React Fiber container key on the root element
    const reactKey = Object.keys(rootDOM).find(key => key.startsWith('__reactContainer$'));
    if (!reactKey) return;
    
    // Extract React's internal fiber root node for discovering the current component hierarchy
    const rootFiber = (rootDOM as any)[reactKey];
    
    
    // {} Depth-First Search (DFS) traversal via React's left-child/right-sibling pointers
    // ? Build the adjacencyList - Crawl the new tree hierarchy
    this.adjacencyList.clear();
    this.traverse(rootFiber.child); 
    
    
    // ? Build the flattened deep descendant map for O(1) filtering
    // descendantMap: Process all components discovered in the tree
    this.descendantMap.clear();
    Object.keys(this.adjacencyList).forEach(component => {
      // Flatten the adjacency list into a nested deep-descendant Set map
      this.buildDescendants(component);
    });
    
    
    // #region Traverse
    // {} Depth-First Search (DFS) traversal via React's left-child/right-sibling pointers

    
    // #endregion
    // #region BuildDescendants
    // {} Flatten the adjacency list into a nested deep-descendant Set map

    // #endregion
  }
  
    /**
   * Recursively traverses the *React Fiber tree* using a Left-Child/Right-Sibling pattern.
   * Filters out native HTML elements and populates a global {@link adjacencyList|adjacency list} map 
   * of each react component name, and an array of it's child component names.
   *
   * @param {object|null} fiber           The current React *Fiber node* to process.
   * @param {string} currentParentName    The name of the closest valid *parent component* up the tree.
   * @returns {void}                      This function builds the *{@link adjacencyList}*.
   *  
   * @example
   * // Mutates global state:
   * // adjacencyList = { "App": ["Dashboard"], "Dashboard": ["ComponentB"] }
   * traverse(rootFiber, "App");
   */
  protected traverse(fiber: any, currentParentName = "Root") {
    if (!fiber) return;
    let nextParent = currentParentName;
    
    // Filter for functional/class components (ignore native HTML nodes like 'div')
    if (typeof fiber.type === 'function') {
      const componentName = fiber.type.name || fiber.type.displayName || 'UnknownComponent';
      
      // Initialize the adjacency list array for the parent if missing
      if (!this.adjacencyList.has(currentParentName)) {
        this.adjacencyList.set(currentParentName, []);
      }
      
      // Add the child to the parent's list (avoiding duplicate logs for re-renders)
      if (!this.adjacencyList.get(currentParentName)?.includes(componentName)) {
        this.adjacencyList?.get(currentParentName)?.push(componentName);
      }
      
      // Update the parent context for deeper elements down this branch
      nextParent = componentName;
    }
    
    // Traverse the first child
    if (fiber.child) {
      this.traverse(fiber.child, nextParent);
    }
    
    // Traverse the immediate sibling under the same parent context
    if (fiber.sibling) {
      this.traverse(fiber.sibling, currentParentName);
    }
  }
  
  
  /**
   * Recursively flattens the `adjacencyList` to find every deep descendant of a given component.
   * * Populates the *{@link descendantMap}* with a **Set** of of all nested components within each component.
   *
   * @param {string} node         The name of the component to find all descendants for.
   * @returns {Set<string>}       A *Set* containing all **descendants** of a given component.
   * 
   * ----
   * @example
   * const adjacencyList = { "App": ["Dashboard"], "Dashboard": ["ComponentB"], "ComponentB": ["ComponentC"] };
   * const cache = new Map();
   * 
   * const descendants = buildDescendants("Dashboard", adjacencyList, cache);
   * // Returns: Set { "ComponentB", "ComponentC" }
   */
  protected buildDescendants(node: string): Set<string> {
    if (this.descendantMap.has(node)) return this.descendantMap.get(node) as Set<string>;
    
    const children = this.adjacencyList.get(node) || [];
    const allDescendants: Set<string> = new Set(children);
    
    // ? Recursively pull sub-children into this component's descendant set
    for (const child of children) {
      const childDescendants = this.buildDescendants(child);
      childDescendants.forEach((d: any) => allDescendants.add(d));
    }
    
    this.descendantMap.set(node, allDescendants); // Add the component's nested components to it's array
    return allDescendants;
  }
  
  
  /**
   * Retrieves the last N logs for a specific component and all its descendants.
   * Immune to log scale and tree depth.
   * 
   * @param {string} targetComponentId - The clicked component to inspect.
   * @param {number} count - Total target logs desired (e.g., 50).
   * @returns {LogInfo[]} List of matching logs sorted newest-to-oldest.
   */
  public getRecentLogs(targetComponentId: string, count: number = 50): LogInfo[] {
    const results: LogInfo[] = [];
    
    // Get all pre-calculated deep descendants
    const descendants = this.descendantMap.get(targetComponentId);
    if (!descendants) return results;
    
    // Create unified target lookup Set (O(1) lookups)
    const targetGroup = new Set(descendants);
    targetGroup.add(targetComponentId);
    
    // ? Optimization ->  Collect the last logged index for every active component in our target group
    const indexes: number[] = [];
    targetGroup.forEach(compName => {
      if (this.lastLogPerComponent.has(compName)) {
        indexes.push(this.lastLogPerComponent.get(compName) as number);
      }
    });
    
    // <- If none of these components have ever logged, exit instantly
    if (indexes.length === 0) {
      return results; 
    }
    
    // ? Start from the component's most recent log, and work our way backwards
    const maxStartIndex = Math.max(...indexes); // Find the latest log these components have logged, and use it as the starting point
    for (let i = maxStartIndex; i >= 0; i--) {
      const log = this.logs.get(i);
      if (!log) continue;
      
      // Evaluate target group containment in constant O(1) time
      if (targetGroup.has(log.data.componentName)) {
        results.push(log);
      }
      
      // Exit immediately the millisecond the quota is satisfied
      if (results.length === count) {
        break;
      }
    }
    
    return results;
  }
  
  
  
  
  // #endregion
  // #region Inject Render logs to application
  public addRenderLogging(): void {
    
  }
  
  
  
  
  // #endregion
  // #region _logs
  /** 
   * ### `get addLog()`
   * Retrieves the map that contains an indexed list of the log's *data*, and metadata pertaining to when the log occurred.
   * * Subclassed logs that extend {@link TLogType} will have information specific to their log types (ie. renderLog) containing other relevant information. 
   * 
   * ----
   * @param logData       The combined {@link TLogStruct|LogStruct} and {@link TLogMetadata|LogMetadata} object
   */
  protected addLog(logData: LogStruct, logMetadata: LogMetadata): void;
  protected addLog(logData: LogStruct, renderData: LogRenderData, logMetadata: LogMetadata): void;
  
  
  /** 
   * ### `get addLog()`
   * Retrieves the map that contains an indexed list of the log's *data*, and metadata pertaining to when the log occurred.
   * * Subclassed logs that extend {@link TLogType} will have information specific to their log types (ie. renderLog) containing other relevant information. 
   * 
   * ----
   * @param logData       The combined {@link TLogStruct|LogStruct} and {@link TLogMetadata|LogMetadata} object
   */
  protected override addLog(arg1: any, arg2: any, arg3?: any): void {
    const logData: LogStruct = arg1;
    let renderData: LogRenderData = {} as any;
    let logMetadata: LogMetadata = {} as any;
    
    // LogRenderData
    const renderDataOrMetadata = arg2 || {};
    if ('componentName' in renderDataOrMetadata) {
      renderData = renderDataOrMetadata;
    }
    
    // LogMetadata
    const possiblyMetadata = arg3 || {};
    if ('type' in renderDataOrMetadata) {
      logMetadata = renderDataOrMetadata;
    } else if ('type' in possiblyMetadata) {
      logMetadata = possiblyMetadata;
    }
    
    
    // <- Early out if we did not retrieve the proper information for storing a log.
    if (!logData || !logData?.index === undefined) return;
    if (!logMetadata || !logMetadata?.type) return;
    if (!renderData || !renderData?.componentName) {
      super.addLog(logData, logMetadata);
      return;
    }
    
    
    
    if (!logMetadata) logMetadata = this.createLogMetadata(this.getSource(logData), 'INFO');
    let stableRefData: LogInfo = { data: logData, renderData, metaData: logMetadata }; 
    
    // ? Try cloning the data - we need stable refs, no memory leaks, and historical logged information
    const deepCopyDebugging: any[] = [];
    try {
      stableRefData = this.deepCopyData(logData, new Map(), deepCopyDebugging);
    } catch (e: any) {
      console.error(`BaseLogger::AddLog() ->  [Failed to clone payload: ${e.message}]`, { logData });
    }
    console.log(`Log::addLog() ->  finished deepCopying logged information. deepCopyInformation: `, deepCopyDebugging);
    
    // Add the new data to the log history
    this.logs.set(logData.index, stableRefData);
    this._logCounter++;
  }
  
  
  /**
   * ### `getSource()`
   * Returns the caller of the log() function. For the base class, this is just the user.
   * * Subclasses can add custom logic to point to the specific component that called the *{@link getLogFunction|log()}* function.
   * 
   * ----
   * @param logData       The data pertaining to a specific log function.
   * @returns             What invoked the *{@link getLogFunction|log()}* function
   */
  public getSource(logData: LogStruct): string {
    return "user";
  }
  
  
  
  
  // #endregion
}


// Default singleton export
const devLog = new DevLog();
export default devLog;
