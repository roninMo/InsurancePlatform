import BaseLogger, { BaseLogInfo, BaseLogMetadata, BaseLogStruct, DefLogType } from "./BaseLogger";


/** 
 * ### LogInfo
 * The organized log information stored in the {@link _logs|log history} of the application's {@link BaseLogger|Logger}. 
 * * `TLogStruct` - &nbsp; &nbsp; &nbsp; The custom arguments passed into the *{@link BaseLogger.initializeLogFunctions|log()}* functions.
 * * `TLogMetadata` - &nbsp; Information specific to when and what called the *{@link BaseLogger.initializeLogFunctions|log()}* function.
*/
export interface LogInfo extends BaseLogInfo<LogStruct, LogType, LogMetadata<LogType>> {
  data: LogStruct,
  renderData: LogRenderData,
  metaData: LogMetadata<LogType>,
};


/** The standard log types that are used for logging. Each will have their own function() call tied to them */
export type LogType = DefLogType & 'RENDER';


/** The stored log data for quickly finding and retrieving logs in history. */
export interface LogStruct extends BaseLogStruct {
  index: number,
  componentName: string,
  data?: LogParams,
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
export interface LogMetadata<TLogType extends DefLogType> extends BaseLogMetadata<TLogType> {
  // Additional metadata information
}


/**
 * A flexible base logging function type. `logData` is what is actually passed to the log function. 
 * * Everything else is meant to be *subclassed* for when you add context specific parameters.
 */
export type LogFunction = {
  /** The category and log information tied to each specific log */
  (category: string, message?: any, ...optionalParams: any[]): void;
};


/** 
 * A cached version of the values passed into the console's logging functions. 
 * * Used to store them within the ***{@link BaseLogger._logs|log history}***. 
 */
export type LogParams = 
| { message?: any }
| { message?: any,  optionalParams: any[]     }
// | {}
;




// export class Devlog extends BaseLogger {
  
// }