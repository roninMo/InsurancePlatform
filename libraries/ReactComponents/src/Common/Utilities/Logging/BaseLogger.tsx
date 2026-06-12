


// #region Log Types
/** 
 * ### LogInfo
 * The organized log information stored in the {@link _logs|log history} of the application's {@link BaseLogger|Logger}. 
 * * `TLogStruct` - &nbsp; &nbsp; &nbsp; The custom arguments passed into the *{@link BaseLogger.initializeLogFunctions|log()}* functions.
 * * `TLogMetadata` - &nbsp; Information specific to when and what called the *{@link BaseLogMetadata|log()}* function.
*/
export interface BaseLogInfo<
  TLogStruct extends BaseLogStruct = BaseLogStruct,
  TLogMetadata extends BaseLogMetadata = BaseLogMetadata
> {
  data: TLogStruct,
  metaData: TLogMetadata
};


/** The stored log data for quickly finding and retrieving logs in history. */
export interface BaseLogStruct {
  index: number,
  log?: LogParams
};


/** The log's base metadata information */
export interface BaseLogMetadata<T extends string = string> {
  type: T;
  source: string;
  timestamp: Date;
  environment: string;
}


/** The standard log types that are used for logging. Each will have their own function() call tied to them */
export type DefLogType = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';



/**
 * The standard *console's* logging function arguments.
 */
export interface ConsoleLogFunction {
  /** All log functions optional arguments. */
  (message?: any, ...optionalParams: any[]): void;
};


/**
 * A flexible base logging function type. `logData` is what is actually passed to the log function. 
 * * Everything else is meant to be *subclassed* for when you add context specific parameters.
 */
export interface BaseLogFunction extends ConsoleLogFunction {
  /** The category and log information tied to each specific log */
  (category: string, message?: any, ...optionalParams: any[]): void;
};


/** 
 * A cached version of the values passed into the console's logging functions. 
 * * Used to store them within the ***{@link BaseLogger._logs|log history}***. 
 */
export type LogParams = { message?: any,  optionalParams?: any[] };




// #endregion
/** The base class for storing  */
// export class BaseLogger<TC extends LoggerConfig = BaseLoggerConfig> {
export class BaseLogger<
  TLogType extends string = string, 
  TLogFunc extends ConsoleLogFunction = BaseLogFunction,
  TLogStruct extends BaseLogStruct = BaseLogStruct,
  TLogMetadata extends BaseLogMetadata<TLogType> = BaseLogMetadata<TLogType>,
  TLogInfo extends BaseLogInfo<TLogStruct, TLogMetadata> = BaseLogInfo<TLogStruct, TLogMetadata>
> {
  // #region State
  // ? Stored Log information
  /** A map of the stored logs. indexed for retrieval, and uses a hash for quick retrieval via category. */
  protected _logs: Map<number, TLogInfo> = new Map<number, TLogInfo>();
  
  /** 
   * The next index we add the *{@link TLogStruct|Log Information}* to the {@link _logs|Log History}. 
   * * Incremented from the **{@link addLog()}** function.  
   * * **note:** You must use this function when adding to the history to properly add the state.  
   */
  protected _logCounter: number = 0;
  
  /** A hash map to utilize a `Read-Optimized Indexing Strategy` for quickly filtering and accessing logs by category. */
  protected _categoryLogs: Map<string, Map<number, boolean>> = new Map<string,  Map<number, boolean>>();
  
  
  // ? Initialization variables
  /** Whether we've already created the **global log** functions. */
  protected _functionsInitialized: boolean = false;
  
  /** 
   * #### LogTypes
   * A cached map containing each log function we attach to the global scope.
   * * {@link DefLogType|TLogType}:    The different types of log functions you'd like to add to the application. 
   * * {@link BaseLogFunction}:           Uses custom arguments for creating logs in the application.
   * 
   * ----
   * This map should be created before you call ***{@link InitializeLogs()}. ***
   */
  protected _logTypes: Map<TLogType, TLogFunc> = new Map();
  
  
  
  
  // #endregion
  // #region Main Functionality
  /** 
   * #### InitializeLogs
   * Adds this class instance to the global scope, and the universal custom logging functions
   * * Checks that it hasn't already been initialized and *overwrites* if called with a different class.
   * * Each class adds their own logging functions. Subclass this for custom logs like *render* state specific diagnostics.
   * 
   * ----
   * This class saves the log history which can be used for creating your own dev console within the application.
   */
  public initializeLogFunctions(): void {
    const globalScope = globalThis as any;
    const warnLogFunc = this.warnLog.bind(this);
    const errLogFunc = this.errorLog.bind(this);
    const debugLogFunc = this.debugLog.bind(this);
    const infoLogFunc = this.infoLog.bind(this);
    
    // ? Don't recreate this if there's already the same instance running.
    if (isAlreadyInitializedOrNewClass(this)) {
      console.error(`${this.constructor.name} tried to re-instantiate the logger for this application. 
        \nCheck that this is only being initialized once. `, { 
          alreadyInitialized: this._functionsInitialized, 
          newInstance: this, 
          currentInstance: (globalThis as any)?.logClass 
        }
      );
      return;
    }
    
    // {} Attach this class and functions to the global scope 
    // The logger's instance
    if (this) { 
      globalScope.logClass = this;
    }
    
    // The base log functions
    globalScope.debugLog = debugLogFunc;
    globalScope.errorLog = errLogFunc;
    globalScope.warnLog = warnLogFunc;
    globalScope.log   = infoLogFunc;
    
    // -> Set that we've already added the log functions to the global scope
    this._functionsInitialized = true;
    return;
    
    
    /** Return whether we already initialized, are creating a new logging engine, or if we called with the same one. */
    function isAlreadyInitializedOrNewClass(classInstance: BaseLogger): boolean {
      console.log(`isAlreadyInitializedOrNewClass: data: `, { classInstance, globalClass: globalScope?.logClass });
      
      const currentClass = globalScope?.logClass;
      const isSameClass = classInstance?.constructor === currentClass?.constructor;
      
      if (classInstance?._functionsInitialized) return true; // We've already ran InitializeLogs()
      if (!currentClass) return false; // it hasn't been initialized yet, or was incorrectly initialized
      return isSameClass;
    }
  }
  
  
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
  protected storeLogData(category: string, logParams: TLogStruct, logType: TLogType): void {
    const nextLogIndex: number = this.getNextLogIndex();
    const logStruct = {...logParams, index: nextLogIndex };
    const logMetadata = this.createLogMetadata(this.getSource(logStruct), logType);
    // const logInformation: TLogStruct & TLogMetadata = { ...logStruct, ...logMetadata};
    
    console.log(`storeLogData(${logType}): `, { logStruct, logMetadata, this: this });
    // {} Add it to the history and hashmaps
    this.addLog(logStruct, logMetadata);
    this.addLogsToCategory(category, nextLogIndex);
  }
  
  
  /** Helper function for storing and logging the information for all scenarios. */
  private logFuncHelper(type: TLogType | DefLogType, category: string, rawArgs: IArguments, sliceIndex: number): void {
    const cfcr = type === 'WARN' ? 'warn' : type === 'ERROR' ? 'error' : type === 'DEBUG' ? 'debug' : 'log';
    const argsArray = Array.prototype.slice.call(rawArgs, sliceIndex); // IArguments has an array-like structure
    const message = argsArray?.[0];
    const optionalParams = argsArray.slice(1);
    
    const logStruct = {
      index: this.getNextLogIndex(),
      log: { 
        ...(message !== undefined && { message }), 
        ...(optionalParams?.length && optionalParams) }
    } as TLogStruct;
    
    // ? Store the data, and log the value.
    this.storeLogData(category, logStruct, type as TLogType);
    const prefix = `[${category}]`;
    if (message) {
      if (typeof message === 'string') {
        argsArray[0] = `${prefix} ${message}`; // Add the category prefix to the message string
        console?.[cfcr].apply(console, argsArray);
      } else {
        argsArray.unshift(prefix); // Add category as the message param
        console?.[cfcr].apply(console, argsArray);
      }
    } else if (optionalParams?.length) console?.[cfcr](...optionalParams); // This shouldn't happen
    // else console?.[cfcr]();
  }
  
  
  /** Example routed log function.  */
  private warnLog(category: string, message?: any, ...optionalParams: any[]): void {
    // this.logFuncHelper("WARN", category, message, ...optionalParams);
    this.logFuncHelper("WARN", category, arguments, 1); // chop category from this^ function's params
  }
  
  /** Example routed log function.  */
  private errorLog(category: string, message?: any, ...optionalParams: any[]): void {
    // this.logFuncHelper("ERROR", category, message, ...optionalParams);
    this.logFuncHelper("ERROR", category, arguments, 1); // chop category from this^ function's params
  }
  
  /** Example routed log function.  */
  private debugLog(category: string, message?: any, ...optionalParams: any[]): void {
    // this.logFuncHelper("DEBUG", category, message, ...optionalParams);
    this.logFuncHelper("DEBUG", category, arguments, 1); // chop category from this^ function's params
  }
  
  /** Example routed log function.  */
  private infoLog(category: string, message?: any, ...optionalParams: any[]): void {
    // this.logFuncHelper("INFO", category, message, ...optionalParams);
    this.logFuncHelper("INFO", category, arguments, 1); // chop category from this^ function's params
  }
  
  
  
  
  // #endregion
  // #region Logs()
  /** 
   * ### `get logs()`
   * Retrieves the map that contains an indexed list of the log's *data*, and metadata pertaining to when the log occurred.
   * * Subclassed logs that extend {@link TLogType} will have information specific to their log types (ie. renderLog) containing other relevant information. 
   * 
   * ----
   * @returns             A Map containing everything that's been logged through this class. 
   */
  public get logs(): Map<number, TLogInfo> {
    return this._logs;
  }
  
  
  /** 
   * ### `get addLog()`
   * Retrieves the map that contains an indexed list of the log's *data*, and metadata pertaining to when the log occurred.
   * * Subclassed logs that extend {@link TLogType} will have information specific to their log types (ie. renderLog) containing other relevant information. 
   * 
   * ----
   * @param logData       The combined {@link TLogStruct|LogStruct} and {@link TLogMetadata|LogMetadata} object
   */
  protected addLog(logData: TLogStruct, logMetadata: TLogMetadata): void {
    if (!logData || !logData?.index === undefined) return;
    if (!logMetadata || !logMetadata?.type) logMetadata = this.createLogMetadata(this.getSource(logData), 'INFO' as TLogType);
    let stableRefData: TLogInfo = { data: logData, metaData: logMetadata } as TLogInfo; 
    
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
   * ### `getNextLogIndex()`
   * Returns the next available index in the *{@link _logs|log history map}*. Even if these values are edited/removed, the value remains the same
   * * Subclassed logs that extend {@link TLogType} will have information specific to their log types (ie. renderLog) containing other relevant information. 
   * 
   * ----
   * @returns             The current size of the {@link _logs|cached logs}.
   */
  public getNextLogIndex(): number {
    return this._logCounter;
  }
  
  
  /**
   * ### `createLogMetadata()`
   * Creates metadata pertaining to when and what called the *{@link getLogFunction|log()}* function.
   * 
   * ----
   * @param caller        What invoked the *{@link getLogFunction|log()}* function
   * @returns             The *metadata* information attached to each log.
   */
  public createLogMetadata(source: string, type: TLogType): TLogMetadata {
    return {
      timestamp: new Date(),
      environment: import.meta.env.VITE_ENV || 'dev',
      source: source,
      type: type
    } as TLogMetadata;
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
  public getSource(logData: TLogStruct): string {
    return "user";
  }
  
  
  // #endregion
  // #region CategoryLogs
  /** 
   * ### `get categories()`
   * Retrieves the {@link _categoryLogs|categories} that are currently defined throughout the application.
   * 
   * ----
   * @returns           An array of the *category* names. 
   */
  public get categories(): string[] {
    return [ ...this._categoryLogs.keys() ];
  }
  
  
  /** 
   * ### `get categoryLogs()`
   * Retrieves the stored logs for each {@link _categoryLogs|category}.
   * 
   * ----
   * @returns           A map of the *categories and the *logs* specific to them. 
   */
  public get categoryLogs(): Map<string, Map<number, boolean>> {
    return this._categoryLogs;
  }
  
  
  /** 
   * ### `createLogCategory()`
   * Adds a new **log category** to the {@link _categoryLogs|categoryLogs}. 
   * 
   * ----
   * @param category    The *log category* we're adding.
   * @param logs        An optional array to pass in as the *initialized* logs.
   */
  public createLogCategory(category: string, logs: number[] = []): void {
    if (this.categoryLogs.has(category)) {
      return;
    }
    
    this.categoryLogs.set(category, new Map<number, boolean>(logs.map(i => [i, true])));
  }
  
  
  /** 
   * ### `addLogsToCategory()`
   * Add a log's index to the {@link _categoryLogs|categoryLog} hashmap. 
   * 
   * ----
   * @param category    Which *category* we're adding logs to.
   * @param indices     The *index* or *indices* of the log(s) stored in the {@link _logs|logs} map.
   */
  public addLogsToCategory(category: string, indices: number | number[]): void {
    if (!this.categoryLogs.has(category)) {
      this.createLogCategory(category, []);
    }
    
    const logCategory = this.categoryLogs.get(category);
    const indicesToAdd: number[] = Array.isArray(indices) ? indices : [indices];
    for (const i of indicesToAdd) {
      logCategory?.set(i, true);
    }
  }
  
  
  /** 
   * ### `removeLogsFromCategory()`
   * Removes one or many log hashes from a {@link _categoryLogs|log category}.
   * 
   * ----
   * @param category    Which *category* we're adding logs to.*
   * @param indices     The *index* or *indices* we're removing from the specified category.
   */
  public removeLogsFromCategory(category: string, indices: number | number[]): void {
    const logCategory = this.categoryLogs.get(category);
    if (!logCategory) {
      return;
    }
    
    const indicesToRemove: number[] = Array.isArray(indices) ? indices : [indices];
    for (const i of indicesToRemove) {
      logCategory.delete(i);
    }
  }
  
  
  
  
  // #endregion
  // #region Log Types
  /** 
   * ### `get logTypes()`
   * Retrieves a map of the **{@link TLogType|LogTypes}** and their called functions from this {@link BaseLogger|class}.
   * 
   * ----
   * @returns           A map of the *{@link TLogType|LogTypes}* and their functions.
   */
  public get logTypes(): Map<TLogType, TLogFunc> {
    return this._logTypes;
  }
  
  
  /** 
   * ### `get types()`
   * Retrieves the {@link TLogType|LogType} that this class is currently using.
   * 
   * ----
   * @returns An array of the *{@link TLogType|LogTypes}* we're using.
   */
  public get types(): TLogType[] {
    return [ ...this.logTypes.keys() ];
  }
  
  
  /** 
   * ### `addLogType()`
   * Adds the blueprint of a new log function mapped to a **{@link TLogType|LogTypes}**.
   * 
   * ----
   * @param type        The {@link TLogType|Log Type} the function is being mapped to 
   * @param func        The function that's added to the *global* scope.
   */
  public addLogType(type: TLogType, func: TLogFunc): void {
    this.logTypes.set(type, func);
  }
  
  
  
  
  // #endregion
  // #region Utility
  /**
   * ### `getLogTimestamp()`
   * Generates custom log timestamps truncated for the sake of space.
   * 
   * @param {Date} [date=new Date()] - The Date object to format. Defaults to the current time.
   * @returns {{ monthDay: string; timeOnly: string }} An object containing two formatted strings:
   * - `monthDay`: Formatted as `MM/DD:HH:mm:ss:f` (e.g., "06/09:10:28:00:4")
   * - `timeOnly`: Formatted as `HH:mm:ss:f` (e.g., "10:28:00:4")
   * 
   * ----
   * @example
   * const timestamps = getTenthLogTime();
   * console.log(`[${timestamps.monthDay}] System booted.`); // [06/09:10:28:00:4] System booted.
   * console.log(`[${timestamps.timeOnly}] Query run.`);     // [10:28:00:4] Query run.
   */
  public getLogTimestamp(timeOnly: boolean = true, date: Date = new Date()): string {
    const pad = (n: number): string => String(n).padStart(2, '0');
    
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    const tenth = Math.floor(date.getMilliseconds() / 100);
    
    if (timeOnly) return `${h}:${min}:${s}:${tenth}`;
    else return `${m}/${d}:${h}:${min}:${s}:${tenth}`;
  };
  
  
  /**
   * Deep clones any JavaScript value. 
   * Uses fast native browser cloning for data, but intercepts and sanitizes
   * uncloneable/leaky entities (DOM elements, events, functions) into safe snapshots.
   *
   * @param {*} value       The input data to safely clone.
   * @param {Map} [seen]    Map for internal tracking map to prevent circular reference crashes.
   * @param deepCopyLogs    An array of information to evaluate the deep-copy's process.
   * @returns               The completely independent, memory-safe cloned data structure.
   */
  protected deepCopyData(value: any, seen = new Map(), deepCopyLogs: boolean | any[] = false): any {
    // TODO - we still haven't really checked if deeply nested scenarios recursively capture all logs. Just a heads up when debugging
    // ? Instantly resolve primitives (Strings, Numbers, Booleans, Symbols, Undefined)
    if (value === null || typeof value !== 'object') {
      // structuredClone does not copy functions, let's just pass a reference to the function name
      if (typeof value === 'function') {
        const functionRef = `[Function: ${value.name || 'anonymous'}]`;
        addDeepCopyLog(functionRef)
        return functionRef;
      }
      
      // just return primitives, they're recreated on every instance
      return value;
    }
    
    // * Circular Reference Protection (Prevents call-stack crashes)
    if (seen.has(value)) {
      return seen.get(value);
    }
    
    // ? Handle Active DOM Elements & Browser/React Events - There is not a way to copy these, create a snapshot.
    if (value instanceof HTMLElement || (value && value.nodeType === 1)) {
      const domElementRef = {
        __type: 'DOM_Element',
        tagName: value.tagName.toLowerCase(),
        id: value.id || null,
        className: value.className || null,
        value: 'value' in value ? value.value : undefined
      };
      addDeepCopyLog(domElementRef);
      return domElementRef;
    }
    if (value.nativeEvent || value instanceof Event || ('target' in value && 'type' in value && value.preventDefault)) {
      const eventRef = {
        __type: 'Event_Snapshot',
        eventType: value.type,
        targetTagName: value.target?.tagName?.toLowerCase() || null,
        targetValue: value.target?.value !== undefined ? value.target.value : null,
        targetName: value.target?.name || null
      };
      addDeepCopyLog(eventRef);
      return eventRef;
    }
    
    
    // ? Try using javascript's new deep-copy function. If it finds something it can't copy, switch to manually handling it
    try {
      addDeepCopyLog("using structured clone!");
      return structuredClone(value);
    } catch (e: any) {
      // Native engine tripped on an uncloneable item.
      // Fall back to manual key extraction, but preserve fast-pathing for healthy sibling items!
      console.error(`BaseLogger::DeepCopyData() ->  [structuredClone Failed to clone payload: ${e.message}]`, { value });
    }
    
    // * Manual: Arrays
    if (Array.isArray(value)) {
      const cloneArr: any[] = [];
      seen.set(value, cloneArr);
      for (let i = 0; i < value.length; i++) {
        cloneArr[i] = this.deepCopyData(value[i], seen, deepCopyLogs); 
      }
      
      addDeepCopyLog(cloneArr);
      return cloneArr;
    }
    
    // * Manual: Plain Objects
    const cloneObj = Object.create(Object.getPrototypeOf(value));
    seen.set(value, cloneObj);
    
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        cloneObj[key] = this.deepCopyData(value[key], seen, deepCopyLogs); 
      }
    }
    
    addDeepCopyLog(cloneObj);
    return cloneObj;
    
    
    // {} Helper functions for debugging
    function addDeepCopyLog(...args: any[]) {
      if (!Array.isArray(deepCopyLogs)) {
        return;
      }
      
      deepCopyLogs.push(args);
    }
  }
  
  
  
  
  // #endregion
}


// Default singleton export
const baseLogger = new BaseLogger();
export default baseLogger;
