


/**
 * Updates a Record by running a transformer function on every entry.  
 * 
 * ---
 * ### Example
 * ```ts
 * const users: User[] = [
 *   { role: 'admin', username: 'user1', pass: 'password' },
 * ];
 * 
 * const newRecord = makeRecord(users, (id, data) => data.role.toUpperCase());
 * // returns [ { role: 'admin', username: 'user1', pass: 'password' } ]
 *   
 * ```
 * ---
 * @param array         The array we're using as a reference. 
 * @param transformer   The function used to create each entry [key, value].
 * @returns             The transformed record with proper typings.
 */
export const makeRecord = <Key extends string, Value, Result>(
  array: Value[],
  transformer: (value: Value) => [Key, Result]
): Record<string, Result> => {
  const newRecord = Object.fromEntries(
    array.map((value) => transformer(value))
  );
  
  return newRecord as Record<Key, Result>;
}


/*
  * Make a record list from an array 
    ? Object.fromEntries(listOfValues.map(item => [item.value, item]))

    makeRecord(listOfValues, (item) => [item.value, item])

  * Make an array from a record list (just the values) 
    ? Object.values(itemRecord);

  * Make an array from a record list (if you need both the Record<key, value>) 
    ? const itemsArray = Object.entries(itemRecord).map(([key, item]) => ({
    ?   value: key,
    ?   ...item
    ? }));
*/
