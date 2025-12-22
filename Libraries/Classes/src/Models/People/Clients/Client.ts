import { Person } from "../Person.js";


export interface Client extends Person {
  policies: {
    autoPolicies: Array<AutoPolicy>
    homePolicies: Array<HomePolicy>
  }
}