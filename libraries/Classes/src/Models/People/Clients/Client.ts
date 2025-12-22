import { AutoPolicy } from "src/Models/Policies/AutoPolicy.js";
import { HomePolicy } from "src/Models/Policies/HomePolicy.js";
import { Person } from "../Person.js";

export interface Client extends Person {
  policies: {
    autoPolicies: Array<AutoPolicy>
    homePolicies: Array<HomePolicy>
  }
}
