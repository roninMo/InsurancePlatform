import { Guid } from "src/Common/Guid.js";

export interface Policy {
  id: Guid;
  policyHolder: Guid; 
  covered: Array<Guid>;
  
  CreationDate: Date;
  ExpirationDate: Date;
}