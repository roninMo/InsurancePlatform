

/**
 * Updates a Record by running a transformer function on every entry.
 */
function mapRecord<Key extends string, Value, Result>(
  record: Record<Key, Value>,
  transformer: (key: Key, value: Value) => Result
): Record<Key, Result> {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, transformer(k as Key, v as Value)])
  ) as Record<Key, Result>;
}

// Usage:
// const simple = mapRecord(users, (id, data) => data.role.toUpperCase());




/*  Example Object

  export interface SelectItem {
    value: string;
    label: string;
    iconProps?: SelectItemIconConfig;
    selected?: boolean; // used with multiselect
  }
*/


/** Make a record list from an array 
  Object.fromEntries(projectIcons.map(item => [item.value, item]))
*/


/** Make an array from a record list (just the values) 
  Object.values(itemRecord);
*/

/** Make an array from a record list (if you need both the Record<key, value>) 
  const itemsArray = Object.entries(itemRecord).map(([key, item]) => ({
    value: key,
    ...item
  }));
*/

