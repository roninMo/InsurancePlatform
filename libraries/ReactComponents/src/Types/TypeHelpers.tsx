

//--------------------------------------------------//
// Help with union type assertions                  //
//--------------------------------------------------//
/** Returns the key for a specific type's value when iterating through a type. */
export type AllKeys<T> = T extends any ? keyof T : never;
// type AllVariantProps = Partial<Record<AllKeys<ConditionalVariantProps>>>;

/** Look up a key's type across a union, ignoring 'never' */
export type PickType<T, K extends PropertyKey> = T extends any 
  ? (K extends keyof T ? (T[K] extends never ? never : T[K]) : never) 
  : never;

/** 
 * Used to help with type assertion on union objects with conditional params. 
 * Or if you want to brute force valid type assertions for certain scenarios where typescript's flagging is redundant. 
 * * Grabs all keys of a type/interface with multiple variants or in a union, and extracts all the "valid" types.
 * 
 * Use this when you have type unions or conditional types that have some values that are optionally **never** in some cases, 
 * and need the valid typing in the event that it is defined when you can't programmatically know when it is valid
 * */
export type AllVariantProps<T> = {
  [K in AllKeys<T>]?: PickType<T, K>;
};
