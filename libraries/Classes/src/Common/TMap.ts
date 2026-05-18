


/**
 * A highly optimized, type-safe data structure that combines the instant lookups 
 * of a `Map` with quick to an `Array` structure that's cached internally with it's references in sync with the `Map`.
 * 
 * ### Core Capabilities
 * - **Dual Access**: Perform $O(1)$ key-based lookups while exposing a real-time list layout via `.array`.
 * - **Lazy Caching**: The underlying pointer array is only generated on-demand when items are added or deleted, ensuring zero redundant CPU overhead.
 * - **Preserved Sequence**: Built on a native `Map`, guaranteeing that your array version strictly maintains insertion order.
 * - **Smart Re-indexing**: Automatically transforms raw Arrays, Records, or Maps into a standardized structure using a property string or custom composite key function.
 * 
 * ### Performance Design
 * Modifying nested properties on an object (e.g., `map.get("id").sentence = "text"`) updates both 
 * the map and the array instantly without triggering a cache invalidation or memory garbage sweep.
 * 
 * @template T The type of data payload object stored within the collection.
 */
class TMap<T> {
  /** The stored data. */
  private store = new Map<string, T>();
  
  /** A cached array for easy retrieval of the mapped values. */
  private cachedArray: T[] | null = null;
  
  /** Save the selection rule for future inserts. */
  private savedKeySelector: KeySelector<T>;
  
  
  //----------------------------------------------------------------------------//
  // When they pass a flat ARRAY of objects                                     //
  //----------------------------------------------------------------------------//
  /**
   * Initializes a `TMap` instance pre-populated from a flat Array.
   * All elements are automatically re-indexed using your `keySelector`.
   * 
   * ### Example Usage
   * ```ts
   * const usersArray: User[] = [
   *   { id: "usr_99", name: "Alex" },
   *   { id: "usr_100", name: "Jeff" }
   * ];
   * 
   * const map = new TMap<User>(usersArray, "id");
   * map.get("usr_99"); // returns { id: "usr_99", name: "Alex" }
   * 
   * ```
   */
  constructor(initialData: T[], keySelector: KeySelector<T>);
  
  
  //----------------------------------------------------------------------------//
  // When they pass a standard key-value dictionary / record                    //
  //----------------------------------------------------------------------------//
  /**
   * Initializes a `TMap` instance pre-populated from a plain Object Record.
   * Internal values are extracted and re-indexed by your chosen `keySelector`.
   * 
   * ### Example Usage
   * ```ts
   * const usersRecord: Record<string, User> = {
   *   user1: { id: "usr_99", name: "Alex" },
   *   user2: { id: "usr_100", name: "Jeff" }
   * };
   * 
   * const map = new TMap<User>(usersRecord, "id");
   * map.get("usr_99"); // returns { id: "usr_99", name: "Alex" }
   * 
   * ```
   */
  constructor(initialData: Record<string, T>, keySelector: KeySelector<T>);
  
  
  //----------------------------------------------------------------------------//
  // When they pass a native JavaScript map                                     //
  //----------------------------------------------------------------------------//
  /**
   * Initializes a `TMap` instance pre-populated from a native JavaScript Map.
   * Internal map values are unrolled and re-indexed by your chosen `keySelector`.
   * 
   * ### Example Usage
   * ```ts
   * const usersMap = new Map<string, User>([
   *   ["user1", { id: "usr_99", name: "Alex" }],
   *   ["user2", { id: "usr_100", name: "Jeff" }]
   * ]);
   * 
   * const map = new TMap<User>(usersMap, "id");
   * map.get("usr_99"); // returns { id: "usr_99", name: "Alex" }
   * 
   * ```
   */
  constructor(initialData: Map<string, T>, keySelector: KeySelector<T>);
  
  
  //----------------------------------------------------------------------------//
  // Empty Initialization of the TMap                                           //
  //----------------------------------------------------------------------------//
  /**
   * Initializes a completely empty `TMap` instance.
   * 
   * ### Example Usage
   * ```ts
   * const map = new TMap<User>({}, "id");
   * map.add({ id: "usr_99", name: "Alex" });
   * map.get("usr_99"); // returns { id: "usr_99", name: "Alex" }
   *   
   * ```
   */
  constructor(initialData: [], keySelector?: KeySelector<T>);
  
  
  //----------------------------------------------------------------------------//
  // Implementation                                                             //
  //----------------------------------------------------------------------------//
  constructor(
    initialData?: Map<string, T> | Record<string, T> | T[],
    keySelector: KeySelector<T> = "value" as any, // "id"
  ) {
    // How we're defining and extracting keys to add to the map
    this.savedKeySelector = keySelector;
    
    // Early out
    if (!initialData) return;
    let index = 0;
    
    
    // Loop through Map values and re-index them
    if (initialData instanceof Map) {
      for (const item of initialData.values()) {
        const key = this.extractKey(item, index++);
        this.store.set(key, item);
      }
      
    // Create the map from an array
    } else if (Array.isArray(initialData)) {
      initialData.forEach((item, index) => {
        const key = this.extractKey(item, index);
        this.store.set(key, item);
      });
      
    // Create the map from a Record/Object
    } else {
      Object.entries(initialData).forEach(([key, value]) => {
        this.store.set(key, value);
      });
    }
  }
  
  
  
  
  //----------------------------------//
  // Get and set functions            //
  //----------------------------------//
  
  /** Accepts just the object; automatically computes the map key */
  /**
   * Adds the object using one of it's keys as a reference to the store.
   * 
   * Invalidates the array cache so that the next `.array` read updates correctly.
   * 
   * ---
   * ### Example
   * ```ts
   * const map = new TMap<User>({}, "id");
   * 
   * map.add({ id: "usr_99", name: "Alex" }); // Automatically uses "usr_99" as key
   *   
   * ```
   * ---
   * @param item The object we're saving to the collection.
   */
  public add(item: T): void {
    const key = this.extractKey(item, this.store.size);
    this.store.set(key, item);
    this.cachedArray = null; // Mark cache dirty
  }
  
  
  /**
   * Fallback for if you need to manually add a custom key.
   * 
   * Useful for overriding the default key layout or pairing alternative string aliases.
   * 
   * ---
   * ### Example
   * ```ts
   * const map = new TMap<User>({}, "id");
   * 
   * map.setCustom("override_key", { id: "usr_99", name: "Alex" });
   * map.get("override_key"); // returns { id: "usr_99", name: "Alex" }
   *   
   * ```
   * ---
   * @param key     The explicit string identifier for the key.
   * @param item    The stored data.
   */
  public setCustom(key: string, item: T): void {
    this.store.set(key, item);
    this.cachedArray = null;
  }
  
  //----------------------------------//
  // Get and set functions            //
  //----------------------------------//
  /**
   * Retrieves a stored item instantly using its extracted lookup key.
   * 
   * Runs in $O(1)$ constant time via a native hash-table lookup.
   * 
   * ---
   * ### Example
   * ```ts
   * const map = new TMap<User>(initialUsers, "id");
   * map.add({ id: "usr_99", name: "Alex" });
   * const user = map.get("usr_99");
   * console.log(user?.name); // "Alex"
   *   
   * ```
   * ---
   * @param key     The unique string identifier computed by the key selector.
   * @returns       The requested data object, or `undefined` if the key does not exist.
   */
  public get(key: string): T | undefined {
    return this.store.get(key);
  }
  
  
  /**
   * Removes an item from the collection using its lookup key.
   * 
   * Automatically handles cache invalidation so the next `.array` read is accurate.
   * 
   * ---
   * ### Example
   * ```ts
   * const map = new TMap<User>(initialUsers, "id");
   * 
   * const deleted = map.delete("usr_99"); 
   * console.log(deleted); // Returns: true (or false if key didn't exist)
   *   
   * ```
   * ---
   * @param key The unique string identifier of the item to remove.
   * @returns `true` if the item was successfully found and removed; otherwise `false`.
   */
  public delete(key: string): boolean {
    const deleted = this.store.delete(key);
    if (deleted) this.cachedArray = null;
    return deleted;
  }
  
  
  /**
   * Retrieves or creates an up to date array that's in sync with the map's current values.
   * 
   * @note the references are kept intact, so mutating these values will affect the actual values.  
   *   
   * ---
   * ### Example
   * ```ts
   * const map = new TMap<User>({}, "id");
   * map.add({ id: "usr_99", name: "Alex" });
   * map.add({ id: "usr_100", name: "Jeff" });
   * 
   * console.log(map.array); 
   * // Returns: [{ id: "usr_99", name: "Alex" }, { id: "usr_100", name: "Jeff" }]  
   * 
   * 
   * ```
   * 
   * ---
   * @returns The data in the form as an array.
   */
  public get array(): T[] {
    if (this.cachedArray === null) {
      this.cachedArray = Array.from(this.store.values());
    }
    return this.cachedArray;
  }
  
  
  
  
  //----------------------------------//
  // Utility functions                //
  //----------------------------------//
  /**
   * Internally extracts a string lookup key from a single data item.
   * 
   * This helper isolates the branching logic required to handle both static 
   * property selection (e.g., extracting `"usr_99"` from the `id` field) and 
   * dynamic functional callbacks.  
   *   
   * ---
   * ### Example Mechanics
   * ```ts
   * const user = { id: "usr_99", name: "Alex" };
   * 
   * // Scenario A: If savedKeySelector is a string field like "id", the index isn't used.
   * const map = new TMap<User>([], "id");
   * map.add(user); // extractKey(user, 0) -> Returns "usr_99"
   * 
   * // Scenario B: If savedKeySelector is a callback, the index can be used to generate custom composite keys
   * const map = new TMap<User>([], (item, index) => `${item.name}_${index}`);
   * map.add(user); // extractKey(user, 1) -> Returns "Alex_1"
   * 
   * ```
   * &nbsp;
   * 
   * ---
   * @param item      The raw data object currently being evaluated.
   * @param index     The insertion sequence tracker used to supply custom composite key callbacks.
   * @returns The retrieved or computed dictionary key to be used in the map.
   */
  private extractKey(item: T, index: number): string {
    if (typeof this.savedKeySelector === "function") {
      return this.savedKeySelector(item, index);
    }
    
    const propertyKey = this.savedKeySelector as keyof T;
    return String(item[propertyKey]);
  }
}

/** A key used from the one of the object's values, or a custom function for creating composite keys. */
type KeySelector<T> = keyof T | ((item: T, index: number) => string);


/* 
  * Example Logic 

interface User {
  id: string;
  name: string;
  pass?: string;
}

const usersArray: User[] = [
  { id: "usr_99", name: "Alex" },
  { id: "usr_100", name: "Jeff" }
];
const usersRecord: Record<string, User> = {
  user1: { id: "usr_99", name: "Alex" },
  user2: { id: "usr_100", name: "Jeff" }
};
const usersMap = new Map<string, User>([
  ["user1", { id: "usr_99", name: "Alex" }],
  ["user2", { id: "usr_100", name: "Jeff" }]
]);
const userObject = { id: "usr_99", name: "Alex" };


// Map creation logic
const myMap: TMap<User> = new TMap({}, "id");
new TMap(usersArray, "id");
new TMap(usersRecord, "id");
new TMap(usersMap, "id");
new TMap([], "id");

*/