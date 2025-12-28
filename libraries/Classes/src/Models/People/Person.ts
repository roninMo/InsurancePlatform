import { Address } from "src/Common/Address.js";
import { Guid } from "src/Common/Guid.js";

export interface Person {
  id: Guid;
  firstName: string;
  lastName: string;
  phoneNumber: string; // '(000)-000-0000'
  email: string;

  dob: Date; // DD/MM/YYYY
  ss: string; // "000-00-0000"
  address: Address;
}
