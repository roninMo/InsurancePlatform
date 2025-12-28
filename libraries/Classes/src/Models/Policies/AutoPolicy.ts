import { Policy } from "./Policy.js";
import { 
  PolicyType, 
  AutoPolicyLimits, 
  AutoDeductible, 
  AutoPremium, 
  AutoExcCond, 
  AutoLiability, 
  BI_Liability, 
  PD_Liability, 
  UninsuredMotoristCov, 
  MedPay, 
  ColCov, 
  CompCov 
} from "src/Common/AutoTypes.js";


export interface AutoPolicy extends Policy {
  PolicyDetails: {
    PolicyType: PolicyType; // The company's signified type of policy the owner has purchased.
    Limits: AutoPolicyLimits; // The maximum amount your insurer will pay for a covered loss. Higher limits offer more protection but increase your premium.
    Deductible: AutoDeductible; // The amount you agree to pay out-of-pocket before your insurance coverage kicks in. A higher deductible typically results in a lower premium.
    Premium: AutoPremium; // The total price you pay for the policy, which is influenced by factors like your driving record, age, location, and the vehicle type.
    ExclusionsAndConditions: AutoExcCond; // Specific circumstances or situations where coverage may be denied (e.g., normal wear-and-tear is not covered).
    PolicyPeriod: number; // The length of time your policy is valid, usually six or twelve
  }

  Coverages: {
    LiabilityCoverage: AutoLiability; // Mandatory in almost every state, this pays for injuries and property damage you cause to others in an at-fault accident.
    BodilyInjuryLiability: BI_Liability; // Covers the medical expenses, lost wages, and pain and suffering of the other parties involved.
    PropertyDamageLiability: PD_Liability; // Pays for damage to another person's property, which typically includes their vehicle but can also include items like fences or utility poles.
    UmUimCov: UninsuredMotoristCov; // Uninsured/UnderInsured Motorist (UM/UIM) Coverage: Protects you if you are hit by a driver who has no insurance or insufficient insurance to cover the full extent of the damages or your medical bills. This is required in some states and optional in others.
    MedPay: MedPay; // Medical Payments (MedPay) / Personal Injury Protection (PIP): These cover medical bills and sometimes other expenses like lost wages or childcare for you and your passengers after an accident, regardless of who was at fault. PIP is mandatory in "no-fault" states. 
  }

  OtherCoverages: {
    CollisionCoverage: ColCov; // Pays for damage to your own car if you hit another vehicle or object (like a tree, wall, or pothole), regardless of fault. A deductible applies.
    ComprehensiveCoverage: CompCov; // Protects your vehicle from non-collision damage, such as theft, vandalism, fire, hail, flooding, falling objects, or hitting an animal. A deductible also applies to this coverage. 
  }
}
