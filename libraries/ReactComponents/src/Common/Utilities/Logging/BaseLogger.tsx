

/** The standard log types that are used for logging. Each will have their own function() call tied to them */
export type baseLogType = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

/** The stored log data for quickly finding and retrieving logs in history. */
export type baseLogStruct = {
  index: number,
  data?: any
};

/** The log's base metadata information */
export type baseLogMetadata<TLogType extends baseLogType> = {
  timestamp: Date;
  environment: string;
  caller: string;
  type: TLogType;
}

/**
 * A flexible logging function that supports both custom structured logs 
 * and standard varied console arguments.
 */
export type LogFunction = {
  /** The category and log information tied to each specific log */
  (category: string, data?: unknown): void;
  
  /** An additional catch all for any additional arguments used in subclasses of the BaseLogger */
  (...args: unknown[]): void;
};


// Add the info, warn, error, and debug logs
// add the BaseLogger to the app, and it's function declarations to the global.d.ts file in the src folder
// test that the base class works
/**
 * ? Once that's completed
 *  - Add the devlog class, it needs
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
/** The base class for storing  */
export class BaseLogger<
  TLogType extends baseLogType = baseLogType, 
  TLogStruct extends baseLogStruct = baseLogStruct,
  TLogMetaData extends baseLogMetadata<TLogType> = baseLogMetadata<TLogType>,
> {
  // #region State
  // ? Stored Log information
  /** A map of the stored logs. indexed for retrieval, and uses a hash for quick retrieval via category. */
  protected _logs: Map<number, TLogStruct> = new Map<number, TLogStruct>();
  
  /** A hash map to utilize a `Read-Optimized Indexing Strategy` for quickly filtering and accessing logs by category. */
  protected _categoryLogs: Map<string, Map<number, boolean>> = new Map<string,  Map<number, boolean>>();
  
  // ? Logger init variables
  /** Whether we've already created the **global log** functions. */
  protected _functionsInitialized: boolean = false;
  
  /** 
   * #### LogTypes
   * A cached map containing each log function we attach to the global scope.
   * * {@link baseLogType|TLogType}:    The different types of log functions you'd like to add to the application. 
   * * {@link LogFunction}:           Uses custom arguments for creating logs in the application.
   * 
   * ----
   * This map should be created before you call ***{@link InitializeLogs()}. ***
   */
  protected _logTypes: Map<TLogType, LogFunction> = new Map();
  
  
  // #endregion
  // #region Log() Initialization
  /** The function that should be called to initialize the global log functions within your application. */
  public InitializeLogs(): void {
    
  const globalScope = globalThis as any;
  const infoLogFunc = this.getLogFunction();
  
  // ? Check if the class has already been initialized
  if (this.functionsInitialized) {
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
  
  
  // TODO - remove these and use initialize logs to handle creating the global functions here instead 
  /** Returns the used method of creating logs for the application. This method is called when creating the `globalThis.log()` function. */
  protected getLogFunction(): LogFunction {
    // ex: if (type == 'INFO') return this.createBaseLog; 
    return this.createBaseLog;
  }
  
  
  /** Example routed log function.  */
  private createBaseLog(data?: any): void {
    console.log(data);
  }
  
  
  // #endregion
  // #region Log Functions
  /** Returns the metadata information tied to each log. */
  public createLogMetadata(caller: string): TLogMetaData {
    return {
      timestamp: new Date(),
      environment: import.meta.env.VITE_ENV || 'dev',
      caller: caller,
      type: "INFO" as TLogType // TODO: find the current LogType 
    } as TLogMetaData;
  }
  
  
  /**
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
  
  
  // #endregion
  // #region State Getters and Setters
  
  /** 
   * ### `get` logs()
   * Retrieves the map that contains an indexed list of the log's *data*, and metadata pertaining to when the log occurred.
   * * Subclassed logs that extend {@link TLogType} will have information specific to their log types (ie. renderLog) containing other relevant information. 
   * 
   * ----
   * @returns           A Map containing everything that's been logged through this class. 
  */
  public get logs(): Map<number, TLogStruct> {
    return this._logs;
  }
  
  
  // #region CategoryLogs
  /** 
   * ### `get` categories()
   * Retrieves the {@link _categoryLogs|categories} that are currently defined throughout the application.
   * 
   * ----
   * @returns           An array of the *category* names. 
  */
  public get categories(): string[] {
    return [ ...this._categoryLogs.keys() ];
  }
  
  /** 
   * ### `get` categoryLogs()
   * Retrieves the stored logs for each {@link _categoryLogs|category}.
   * 
   * ----
   * @returns           A map of the *categories and the *logs* specific to them. 
  */
  public get categoryLogs(): Map<string, Map<number, boolean>> {
    return this._categoryLogs;
  }
  
  
  /** 
   * ### createLogCategory()
   * Adds a new **log category** to the {@link _categoryLogs|categoryLogs}. 
   * 
   * ----
   * @param category    The *log category* we're adding.
   * @param logs        An optional array to pass in as the *initialized* logs.
   * */
  public createLogCategory(category: string, logs: number[] = []): void {
    if (this.categoryLogs.has(category)) {
      return;
    }
    
    this.categoryLogs.set(category, new Map<number, boolean>(logs.map(i => [i, true])));
  }
  
  /** 
   * ### addLogsToCategory()
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
   * ### removeLogsFromCategory()
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
   * ### `get` logTypes()
   * Retrieves a map of the **{@link TLogType|LogTypes}** and their called functions from this {@link BaseLogger|class}.
   * 
   * ----
   * @returns           A map of the *{@link TLogType|LogTypes}* and their functions.
  */
  public get logTypes(): Map<TLogType, LogFunction> {
    return this._logTypes;
  }
  
  
  /** 
   * ### `get` types()
   * Retrieves the {@link TLogType|LogType} that this class is currently using.
   * 
   * ----
   * @returns An array of the *{@link TLogType|LogTypes}* we're using.
  */
  public get types(): TLogType[] {
    return [ ...this.logTypes.keys() ];
  }
  
  
  /** 
   * ### addLogType()
   * Adds the blueprint of a new log function mapped to a **{@link TLogType|LogTypes}**.
   * 
   * ----
   * @param type        The {@link TLogType|Log Type} the function is being mapped to 
   * @param func        The function that's added to the *global* scope.
  */
  public addLogType(type: TLogType, func: LogFunction): void {
    this.logTypes.set(type, func);
  }
  // #endregion
  // #endregion
}
