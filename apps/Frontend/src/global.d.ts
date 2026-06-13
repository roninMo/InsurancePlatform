// src/global.d.ts
import { DevLog, LogRenderData } from "@Project/ReactComponents/Common/Utilities/Logging/DevLog";
import { BaseLogger } from "@Project/ReactComponents/Common/Utilities/Logging/BaseLogger";


// This forces TypeScript to treat this file as a module, which makes 'declare global' work.
export {};

// ? We're adding the BaseLogger and Devlog's extended functions and classes to the global type here 
declare global {
  // #region BaseLogger Functions and Values
  logClass: typeof BaseLogger;
  function debugLog(category: string, message?: any, ...optionalParams: any[]): void;
  function errorLog(category: string, message?: any, ...optionalParams: any[]): void;
  function warnLog( category: string, message?: any, ...optionalParams: any[]): void;
  function log(     category: string, message?: any, ...optionalParams: any[]): void;
  
  
  // #endregion
  // #region Devlog Functions and Values
  logClass: typeof DevLog
  function debugLog( category: string, compId: string, message?: any, ...optionalParams: any[]): void;
  function errorLog( category: string, compId: string, message?: any, ...optionalParams: any[]): void;
  function warnLog(  category: string, compId: string, message?: any, ...optionalParams: any[]): void;
  function log(      category: string, compId: string, message?: any, ...optionalParams: any[]): void;
  function renderLog(category: string, compId: string, renderData?: LogRenderData, message?: any, ...optionalParams: any[]): void;
  
  
  // #endregion
  // ? Window subclasses
  // interface Window {
  //   myGlobalFunction: (param: string) => void;
  // }
}