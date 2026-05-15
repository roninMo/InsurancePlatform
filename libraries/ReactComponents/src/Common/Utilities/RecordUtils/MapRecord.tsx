


/**
 * Updates a Record by running a transformer function on every entry.  
 * 
 * ---
 * ### Example
 * ```ts
 * const users: Record<string, User> = {
 *   user1: { role: 'admin', username: 'user1', pass: 'password' },
 * };
 * 
 * const newRecord = mapRecord(users, (id, data) => data.role.toUpperCase());
 * // returns { user1: { role: 'ADMIN', username: 'user1', pass: 'password' } }
 *   
 * ```
 * ---
 * @param record        The record we're using as a reference. 
 * @param transformer   The function used to edit the data.
 * @returns             The transformed record with proper typings.
 */
export const mapRecord = <Key extends string | number, Value, Result>(
  record: Record<Key, Value>,
  transformer: (key: Key, value: Value) => Result
): Record<Key, Result> => {
  const newRecord = Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, transformer(k as Key, v as Value)])
  );
  
  return newRecord as Record<Key, Result>;
}


/*
  * Make a record list from an array 
    ? Object.fromEntries(listOfValues.map(item => [item.value, item]))

  * Make an array from a record list (just the values) 
    ? Object.values(itemRecord);

  * Make an array from a record list (if you need both the Record<key, value>) 
    ? const itemsArray = Object.entries(itemRecord).map(([key, item]) => ({
    ?   value: key,
    ?   ...item
    ? }));
*/
