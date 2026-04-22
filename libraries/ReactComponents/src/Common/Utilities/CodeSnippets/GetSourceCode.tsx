


/**
 * Retrieves the exported components for documentation jsx examples
 * from a stringified file import using vite. This function is used in combination with 'react-syntax-highlighter'
 * so we don't have to create redundant code.
 * 
 * @param fileImportSource - The vite import ref; ex. "import CodeSnippets from './CodeSnippetsFile?raw';"
 * @param name - the name of the class we're looking for
 * @param type - Whether we're searching for a component () =>, type, or interface.
 * @returns The raw stringified snippet of your code.
 * 
 * @example
 * ```typescript
 * import CodeSnippets from './CodeSnippetsFile?raw';
 * 
 * const textInputSnippet = getSourceCode(InputCodeSnippets, "Example_TextInput");
 * console.log('source code: ', textInputSnippet);
 * ```
 */
export const getSourceCode = (
  fileImportSource: string, // Import needs a '?raw' suffix to convert to string, ex: './Jsx.tsx?raw';
  name: string, // The name of the component, type, or interface you want returned as a string
  type: 'component' | 'type' | 'interface' = 'component' // if we're retrieving a type definition instead
) => {
  let pattern: RegExp = new RegExp('');


  if (type === 'component') {  
  // Matches the export and name
  // [\\s\\S]*?=> matches everything (including props) up until the arrow
  // Then we look for the main body starting with {
  // It captures everything from the name until the final matching closing brace
  pattern = new RegExp(
    `(?:export\\s+)?const\\s+${name}\\s*=[\\s\\S]*?=>\\s*{(?:[^{}]|{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})*}`,
    'g'
  );

  } else if (type === 'type') {
    // Matches: [export] type Name = ...
    pattern = new RegExp(
      `(?:export\\s+)?type\\s+${name}\\s*=[\\s\\S]*?(?:;|(?=\\s*(?:export|const|type|interface|\\/\\*|$)))`,
      'g'
    );

  } else if (type === 'interface') {
    // Matches: [export] interface Name { ... }
    pattern = new RegExp(
      `(?:export\\s+)?interface\\s+${name}\\s*{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}`, 
      'g'
    );
  }

  const match = fileImportSource.match(pattern);

  // console.log (`retrieving code for ${name}: `, match);
  return match ? match[0].trim() : "Component source not found.";
};


/* Old patterns

  if (type === 'component') {
    // Matches: [export] const Name = ... stops at next export/type/interface
    pattern = new RegExp(
      `(?:export\\s+)?const\\s+${name}\\s*=\\s*[\\s\\S]*?(?=\\s*(?:export\\s+(?:const|type|interface)|$))`
    );

  } else if (type === 'type') {
    // Matches: [export] type Name = ...
    pattern = new RegExp(
      `(?:export\\s+)?type\\s+${name}\\s*=\\s*[\\s\\S]*?(?=\\s*(?:export\\s+(?:const|type|interface)|$|;))`
    );

  } else if (type === 'interface') {
    // Matches: [export] interface Name { ... }
    pattern = new RegExp(
      `(?:export\\s+)?interface\\s+${name}\\s*[\\s\\S]*?{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}(?=\\s*(?:export|const|type|interface|$))`
    );
  }

*/