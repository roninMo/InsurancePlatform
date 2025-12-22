export function classes(): string {
  return 'Classes';
}

// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs
// https://dbdiagram.io/d


/*
Table follows {
  following_user_id integer
  followed_user_id integer
  created_at timestamp
}

Table users {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer [not null]
  status varchar
  created_at timestamp
}

Ref user_posts: posts.user_id > users.id // many-to-one

Ref: users.id < follows.following_user_id

Ref: users.id < follows.followed_user_id

*/




// User -> One To Many
/*
  id: guid;
  first name: string;
  last name: string;
  phoneNumber: '(000)-000-0000';
  email: string;

  dob: Date DD/MM/YYYY;
  ss: "000-00-0000";
  address: Address;

  policies: {
    autoPolicies: Array<AutoPolicy>
    homePolicies: Array<HomePolicy>
  }
*/




// Agent
/*
  id: guid;
  first name: string;
  last name: string;
  phoneNumber: '(000)-000-0000';
  email: string;

  company: string;
  managedPolicies: {
    autoPolicies: Array<AutoPolicy>
    homePolicies: Array<HomePolicy>
  }
*/




// Auto Policy -> Many to Many
/*
  id: guid;
  policyHolder: UserId; 
  covered: Array<UserId>;

  PolicyDetails: {
    PolicyType: The company's signified type of policy the owner has purchased.
    Limits: The maximum amount your insurer will pay for a covered loss. Higher limits offer more protection but increase your premium.
    Deductible: The amount you agree to pay out-of-pocket before your insurance coverage kicks in. A higher deductible typically results in a lower premium.
    Premium: The total price you pay for the policy, which is influenced by factors like your driving record, age, location, and the vehicle type.
    Exclusions and Conditions: Specific circumstances or situations where coverage may be denied (e.g., normal wear-and-tear is not covered).
    Policy Period: The length of time your policy is valid, usually six or twelve
  }

  Coverages: {
    Liability Coverage: Mandatory in almost every state, this pays for injuries and property damage you cause to others in an at-fault accident.
    Bodily Injury Liability: Covers the medical expenses, lost wages, and pain and suffering of the other parties involved.
    Property Damage Liability: Pays for damage to another person's property, which typically includes their vehicle but can also include items like fences or utility poles.
    Uninsured/Underinsured Motorist (UM/UIM) Coverage: Protects you if you are hit by a driver who has no insurance or insufficient insurance to cover the full extent of the damages or your medical bills. This is required in some states and optional in others.
    Medical Payments (MedPay) / Personal Injury Protection (PIP): These cover medical bills and sometimes other expenses like lost wages or childcare for you and your passengers after an accident, regardless of who was at fault. PIP is mandatory in "no-fault" states. 
  }

  OtherCoverages: {
    Collision Coverage: Pays for damage to your own car if you hit another vehicle or object (like a tree, wall, or pothole), regardless of fault. A deductible applies.
    Comprehensive Coverage: Protects your vehicle from non-collision damage, such as theft, vandalism, fire, hail, flooding, falling objects, or hitting an animal. A deductible also applies to this coverage. 
  }

  CreationDate: Date;
  ExpirationDate: Date;
}
*/




// Home Policy -> Many to Many
/*
  id: guid;
  policyHolder: UserId; 
  covered: Array<UserId>;

  PolicyDetails: {
    PolicyType: The company's signified type of policy the owner has purchased.
    Limits: The maximum amount your insurer will pay for a covered loss. Higher limits offer more protection but increase your premium.
    Deductible: The amount you agree to pay out-of-pocket before your insurance coverage kicks in. A higher deductible typically results in a lower premium.
    Premium: The total price you pay for the policy, which is influenced by factors like your driving record, age, location, and the vehicle type.
    Exclusions and Conditions: Specific circumstances or situations where coverage may be denied (e.g., normal wear-and-tear is not covered).
    Policy Period: The length of time your policy is valid, usually six or twelve
}

  Coverages: {
    Coverage A: Dwelling This covers the physical structure of your house and any attached structures (like an attached garage or deck) against damage from covered perils such as fire, lightning, and windstorms. The coverage limit should ideally be enough to rebuild your home entirely.
    Coverage B: Other Structures This protects structures that are not attached to the main house, such as a detached garage, shed, or fence. The limit is often set as a percentage (around 10%) of your dwelling coverage.
    Coverage C: Personal Property This coverage helps pay to repair or replace your personal belongings, such as furniture, clothing, and electronics, if they are stolen or damaged by a covered event. This coverage typically ranges from 50% to 70% of your dwelling coverage, and may have specific dollar limits for high-value items like jewelry or fine art, which often require a special endorsement (rider) for full value coverage.
    Coverage D: Loss of Use (Additional Living Expenses) If damage from a covered peril makes your home uninhabitable, this coverage pays for the additional costs of living away, such as hotel bills, restaurant meals, and temporary housing, that are above your normal living expenses.
    Coverage E: Personal Liability This protects you against lawsuits for bodily injury or property damage you, your family members, or even your pets cause to other people. It covers both the cost of defending you in court and any court-ordered awards, up to the policy limit, which typically starts at around $100,000.
    Coverage F: Medical Payments to Others This provides no-fault coverage for minor medical bills for guests injured on your property, without a liability claim being filed. 
}

  OtherCoverages: {
    Perils Covered vs. Excluded Most policies cover standard perils like fire, windstorms, and theft. However, common exclusions are floods and earthquakes, which require separate policies. Other typical exclusions include damage from wear and tear, neglect, mold, or pest infestations.
    Replacement Cost vs. Actual Cash Value The policy will specify how property damage is paid out. Actual Cash Value (ACV) pays the replacement cost minus depreciation, while Replacement Cost (RC) pays the full cost to repair or replace the item or structure without factoring in depreciation.
    Endorsements (Riders/Add-ons) You can customize your policy with endorsements to add coverage for specific needs, such as: {
      Sewer or water backup damage.
      Specific high-value items (jewelry, art).
      Ordinance or law coverage to bring a rebuilt home up to current building codes. 
    }
    
    CreationDate: Date;
    ExpirationDate: Date;
}
*/




// Policy Object (polymorphism)
/*
  id: guid;
  policyHolder: UserId; 
  covered: Array<UserId>;

  agentIssued: agentId;
  
  CreationDate: Date;
  ExpirationDate: Date;
*/