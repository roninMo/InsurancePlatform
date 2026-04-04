

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
