

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


/** The base class for storing  */
export class BaseLogger<
  TLogType extends baseLogType = baseLogType, 
  TLogStruct extends baseLogStruct = baseLogStruct,
  TLogMetaData extends baseLogMetadata<TLogType> = baseLogMetadata<TLogType>,
> {
  // ? Stored Log information
  /** A map of the stored logs. indexed for retrieval, and uses a hash for quick retrieval via category. */
  protected _logs: Map<number, TLogStruct> = new Map<number, TLogStruct>();
  
  /** A hash map to utilize a `Read-Optimized Indexing Strategy` for quickly filtering and accessing logs by category. */
  protected _logCategories: Map<string, number> = new Map<string, number>();
  
  // ? Logger init variables
  /** Whether we've already created the **global log** functions. */
  protected functionsInitialized: boolean = false;
  
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
  
  
  
  public InitializeLogs(): void {
    
  }
  
  // TODO - remove these and use initialize logs to handle creating the global functions here instead 
  /** Returns the used method of creating logs for the application. This method is called when creating the `globalThis.log()` function. */
  protected getLogFunction(): LogFunction {
    return this.createBaseLog;
  }
  
  
  public createBaseLog(data?: any): void {
    
  }
  
  
  /** Returns the metadata information tied to each log. */
  public createLogMetadata(caller: string): baseLogMetadata<TLogType> {
    return {
      timestamp: new Date(),
      environment: import.meta.env.VITE_ENV || 'dev',
      caller: caller,
      type: "INFO" as TLogType // TODO: find the current LogType 
    };
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
}