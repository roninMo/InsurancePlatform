import { Person } from "../Person.js";
import { AutoPolicy } from "src/Models/Policies/AutoPolicy.js";
import { HomePolicy } from "src/Models/Policies/HomePolicy.js";


export interface Agent extends Person {
  company: string;
  managedPolicies: {
    autoPolicies: Array<AutoPolicy>
    homePolicies: Array<HomePolicy>
  }
}