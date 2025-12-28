import { Policy } from "./Policy.js";
import { 
  H_CovA_Dwelling, 
  H_CovB_OtherStructs, 
  H_CovC_PersonalProp, 
  H_CovD_AdditLivExp, 
  H_CovE_PersonalLiability, 
  H_CovF_MedPay, 
  H_Endorsements, 
  H_HighValueItems, 
  H_LawCov, 
  H_ReplacementCostValues, 
  H_SewerAndWater, 
  Home_Perils, 
  HomeDeductible, 
  HomeExcCond, 
  HomeLimits, 
  HomePolicyType, 
  HomePremium 
} from "src/Common/HomeTypes.js";


export interface HomePolicy extends Policy {

  PolicyDetails: {
    PolicyType: HomePolicyType; // The company's signified type of policy the owner has purchased.
    Limits: HomeLimits; // The maximum amount your insurer will pay for a covered loss. Higher limits offer more protection but increase your premium.
    Deductible: HomeDeductible; // The amount you agree to pay out-of-pocket before your insurance coverage kicks in. A higher deductible typically results in a lower premium.
    Premium: HomePremium; // The total price you pay for the policy, which is influenced by factors like your driving record, age, location, and the vehicle type.
    ExclusionsAndConditions: HomeExcCond; // Specific circumstances or situations where coverage may be denied (e.g., normal wear-and-tear is not covered).
    PolicyPeriod: number; // The length of time your policy is valid, usually six or twelve
  }

  Coverages: {
    CoverageA: H_CovA_Dwelling; // Dwelling This covers the physical structure of your house and any attached structures (like an attached garage or deck) against damage from covered perils such as fire, lightning, and windstorms. The coverage limit should ideally be enough to rebuild your home entirely.
    CoverageB: H_CovB_OtherStructs; // Other Structures This protects structures that are not attached to the main house, such as a detached garage, shed, or fence. The limit is often set as a percentage (around 10%) of your dwelling coverage.
    CoverageC: H_CovC_PersonalProp; // Personal Property This coverage helps pay to repair or replace your personal belongings, such as furniture, clothing, and electronics, if they are stolen or damaged by a covered event. This coverage typically ranges from 50% to 70% of your dwelling coverage, and may have specific dollar limits for high-value items like jewelry or fine art, which often require a special endorsement (rider) for full value coverage.
    CoverageD: H_CovD_AdditLivExp; // Loss of Use (Additional Living Expenses) If damage from a covered peril makes your home uninhabitable, this coverage pays for the additional costs of living away, such as hotel bills, restaurant meals, and temporary housing, that are above your normal living expenses.
    CoverageE: H_CovE_PersonalLiability; // Personal Liability This protects you against lawsuits for bodily injury or property damage you, your family members, or even your pets cause to other people. It covers both the cost of defending you in court and any court-ordered awards, up to the policy limit, which typically starts at around $100,000.
    CoverageF: H_CovF_MedPay; // Medical Payments to Others This provides no-fault coverage for minor medical bills for guests injured on your property, without a liability claim being filed. 
  }

  OtherCoverages: {
    H_Perils: Home_Perils; // Perils Covered vs. Excluded Most policies cover standard perils like fire, windstorms, and theft. However, common exclusions are floods and earthquakes, which require separate policies. Other typical exclusions include damage from wear and tear, neglect, mold, or pest infestations.
    H_ReplacementCostValues: H_ReplacementCostValues; // Replacement Cost vs. Actual Cash Value The policy will specify how property damage is paid out. Actual Cash Value (ACV) pays the replacement cost minus depreciation, while Replacement Cost (RC) pays the full cost to repair or replace the item or structure without factoring in depreciation.
    H_Endorsements: H_Endorsements; // Endorsements (Riders/Add-ons) You can customize your policy with endorsements to add coverage for specific needs, such as: {
    H_SewerAndWater: H_SewerAndWater; // Sewer or water backup damage.
    H_HighValueItems: H_HighValueItems; // Specific high-value items (jewelry, art).
    H_LawCov: H_LawCov; // Ordinance or law coverage to bring a rebuilt home up to current building codes. 
  }
}
