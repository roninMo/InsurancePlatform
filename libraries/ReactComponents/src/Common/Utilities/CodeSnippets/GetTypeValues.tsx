


/**
 * Parses a stringified TypeScript file to extract string literal values from a specific type.
 * 
 * @example
 * ```ts
 * import rawFile from './file.tsx?raw';
 * const types = getValuesFromType(rawFile, 'LoadingStates');
 * // returns ['Loading', 'Error', 'Ok']
 * ```
 * 
 * @param rawFile - The content of the .ts file (usually via Vite's `?raw` import).
 * @param typeName - The name of the type to target (e.g., "LoadingStates").
 * @returns An array of the specified type T, assuming it's the type you're retrieving.
 */
export const getValuesFromType = <T extends string = string>(rawFile: string, typeName: string): T[] => {
  // Matches "type Name =" or "export type Name =" and captures everything until the first ";"
  const findType = new RegExp(`(?:export\\s+)?type\\s+${typeName}\\s*=\\s*([^;]+);`, 'g');
  const blockMatch = findType.exec(rawFile);

  if (!blockMatch) return [];


  // Extract all the values for the type
  const typeBody = blockMatch[1];
  const extractValues = /['"]([^'"]+)['"]/g;
  const matches = [...typeBody.matchAll(extractValues)];

  return matches.map(match => match[1]) as T[];
};
