export type SourceRetrievalTypes = 'component' | 'type' | 'interface';


/**
 * Retrieves the exported components for documentation jsx examples
 * from a stringified file import using vite. This function is used in combination with 'react-syntax-highlighter'
 * so we don't have to create redundant code.
 * 
 * @param fileImportSource - The vite import ref; ex. "import CodeSnippets from './CodeSnippetsFile?raw';"
 * @param nameOrRange - The name of the component, type, or interface you want returned as a string, or the lines you want to retrieve.
 * @param type - Whether we're searching for a component () =>, type, or interface.
 * @returns The raw stringified snippet of your code.
 * 
 * @example
 * ```typescript
 * import CodeSnippets from './CodeSnippetsFile?raw';
 * 
 * // For components, types, or interfaces
 * const textInputSnippet = getSourceCode(CodeSnippetFile, "Example_TextInput", 'Component');
 * console.log('source code: ', textInputSnippet);
 * 
 * // To get specific lines
 * const snippet = getSourceCode(CodeSnippetFile, [10, 25], 'lines');
 * ```
 *  <br>&nbsp;
 */
export const getSourceCode = (
  fileImportSource: string,
  nameOrRange: string | [number, number],
  type: SourceRetrievalTypes = 'component'
): string => {
  // Retrieve specified lines of code
  if (Array.isArray(nameOrRange)) {
    const [start, end] = nameOrRange;
    const lines = fileImportSource.split('\n');
    return lines.slice(start - 1, end).join('\n').trim();
  }
  
  // Regex calculations
  const name = nameOrRange;
  const lines = fileImportSource.split('\n');

  // Search for the declaration
  const startIdx = lines.findIndex(line => {
    const t = line.trim();
    return  t.startsWith(`type ${name} `) || t.startsWith(`export type ${name} `) ||
            t.startsWith(`interface ${name} `) || t.startsWith(`export interface ${name} `) ||
            t.startsWith(`const ${name} `) || t.startsWith(`export const ${name} `);
  });

  if (startIdx === -1) return 'Component Source not found.';

  // Find the closing brace
  let endIdx = startIdx;
  if (type === 'component' || type === 'interface') {
    let braceCount = 0;
    let started = false;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      
      // Count braces on this line, but ignore those in comments
      const cleanLine = line.replace(/\/\/.*$/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
      for (const char of cleanLine) {
        if (char === '{') {
          braceCount++;
          started = true;
        } else if (char === '}') {
          braceCount--;
          started = true;
        }
      }

      if (started && braceCount === 0) {
        endIdx = i;
        break;
      }
    }
  } 
  
  // Fallback logic for 'type' which doesn't always use braces
  else {
    for (let i = startIdx + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line.startsWith('export ') || line.startsWith('import ') || 
        line.startsWith('type ') || line.startsWith('interface ') ||
        line.startsWith('const ') || line.startsWith('function ') ||
        line.startsWith('class ')
      ) break;
      endIdx = i;
    }

    // Code from definition to next declaration
    let snippetWithSpacing = lines.slice(startIdx, endIdx + 1).join('\n');

    // Remove trailing // comments, #regions, or extra whitespace between the end of type and the next declaration
    const lastSemicolon = snippetWithSpacing.lastIndexOf(';');
    if (lastSemicolon !== -1) snippetWithSpacing = snippetWithSpacing.substring(0, lastSemicolon + 1);

    return snippetWithSpacing.trim();
  }

  const sourceCode = lines.slice(startIdx, endIdx + 1).join('\n').trim();
  // console.log (`retrieving code for ${name}: `, sourceCode);
  return sourceCode;
};



/**
 * Retrieves the exported components for documentation jsx examples
 * from a stringified file import using vite. This function is used in combination with 'react-syntax-highlighter'
 * so we don't have to create redundant code.
 * 
 * @param fileImportSource - The vite import ref; ex. "import CodeSnippets from './CodeSnippetsFile?raw';"
 * @param name - The name of the component, type, or interface you want returned as a string, or the line numbers you want to retrieve
 * @param type - Whether we're searching for a component () =>, type, or interface.
 * @returns The raw stringified snippet of your code.
 * 
 * @example
 * ```typescript
 * import CodeSnippets from './CodeSnippetsFile?raw';
 * 
 * // For components, types, or interfaces
 * const textInputSnippet = getSourceCode(InputCodeSnippets, "Example_TextInput", 'Component');
 * console.log('source code: ', textInputSnippet);
 * 
 * // To get specific lines
 * const snippet = getSourceCode(MyFile, [10, 25], 'lines');
 * ```
 *  <br>&nbsp;
 * 
 * @note This does not handle complex types well, and is prone to error in those cases.
 */
export const getSourceCode_Regex = (
  fileImportSource: string, // Import needs a '?raw' suffix to convert to string, ex: './Jsx.tsx?raw';
  nameOrRange: string | [number, number], 
  type: SourceRetrievalTypes = 'component', 
) => {
  // Retrieve specified lines of code
  if (Array.isArray(nameOrRange)) {
    const [start, end] = nameOrRange;
    const lines = fileImportSource.split('\n');
    return lines.slice(start - 1, end).join('\n').trim();
  }
  
  // Regex calculations
  const name = nameOrRange;
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
      `(?:export\\s+)?type\\s+${name}\\s*=\\s*[\\s\\S]*?(?=\\s*(?:export\\s+(?:const|type|interface)|$|;))`
    );

  } else if (type === 'interface') {
    // Matches: [export] interface Name { ... }
    pattern = new RegExp(
      `(?:export\\s+)?interface\\s+${name}\\s*{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}`, 
      'g'
    );
  }

  const match = fileImportSource.match(pattern);
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

    // second type version - just check for the next declaration
    pattern = new RegExp(
      `(?:export\\s+)?type\\s+${name}\\s*=[\\s\\S]*?(?:;|(?=\\s*(?:export|const|type|interface|\\/\\*|$)))`,
      'g'
    );

  } else if (type === 'interface') {
    // Matches: [export] interface Name { ... }
    pattern = new RegExp(
      `(?:export\\s+)?interface\\s+${name}\\s*[\\s\\S]*?{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}(?=\\s*(?:export|const|type|interface|$))`
    );
  }

*/


/*



  const lines = fileImportSource.split('\n');

  // Search for the declaration
  const startIdx = lines.findIndex(line => {
    const t = line.trim();
    return  t.startsWith(`type ${name}`) || t.startsWith(`export type ${name}`) ||
            t.startsWith(`interface ${name}`) || t.startsWith(`export interface ${name}`) ||
            t.startsWith(`const ${name}`) || t.startsWith(`export const ${name}`);
  });

  if (startIdx === -1) return "Source not found.";

  // Find the closing brace
  let endIdx = startIdx;
  if (type === 'component' || type === 'interface') {
    let braceCount = 0;
    let started = false;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      
      // Count braces on this line, but ignore those in comments
      const cleanLine = line.replace(/\/\/.*$/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
      for (const char of cleanLine) {
        if (char === '{') {
          braceCount++;
          started = true;
        } else if (char === '}') {
          braceCount--;
          started = true;
        }
      }

      if (started && braceCount === 0) {
        endIdx = i;
        break;
      }
    }
    
    const sourceCode = lines.slice(startIdx, endIdx + 1).join('\n').trim();
    console.log (`retrieving code for ${name}: `, sourceCode);
    return sourceCode;
  }

  if (type == 'type') {
    for (let i = startIdx + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line.startsWith('export type') || line.startsWith('type ') ||
        line.startsWith('export const') || line.startsWith('const ') ||
        line.startsWith('export interface') || line.startsWith('interface ') ||
        line.startsWith('export function') || line.startsWith('function ') ||
        line.startsWith('// #region') || line.startsWith('// #endregion') ||
        line.startsWith('export class') || line.startsWith('class') ||
        line.startsWith('import') || line.startsWith('export') ||
        line.startsWith('export let') || line.startsWith('let ') || 
        line.startsWith('export var') || line.startsWith('var ')
      ) {
        break;
      }
      endIdx = i;
    }

    // Look from the bottom of the captured block upwards for the actual closing line
    const capturedLines = lines.slice(startIdx, endIdx + 1);
    let finalLineIdx = capturedLines.length - 1;

    for (let i = capturedLines.length - 1; i >= 0; i--) {
      const trimmed = capturedLines[i].trim();

      // Types are even simpler: find the last semicolon or closing brace
      if (trimmed.endsWith(';') || trimmed.endsWith('}')) {
        finalLineIdx = i;
        break;
      }
    }

    const sourceCode = lines.slice(startIdx, finalLineIdx + 1).join('\n').trim();
    console.log (`retrieving code for ${name}: `, sourceCode);
    return sourceCode;
  }

*/


// Does not work with destructed props declarations in the component definition - switch to nested braces 
export const getSourceCode_bad = ( fileImportSource: string, name: any, type: SourceRetrievalTypes ) => {
  if (typeof name != 'string') return;
  const lines = fileImportSource.split('\n');
  
  // 1. Find Start
  const startIdx = lines.findIndex(line => {
    const trimmed = line.trim();
    return  trimmed.startsWith(`type ${name}`) || 
            trimmed.startsWith(`export type ${name}`) ||
            trimmed.startsWith(`interface ${name}`) ||
            trimmed.startsWith(`export interface ${name}`) ||
            trimmed.startsWith(`const ${name}`) ||
            trimmed.startsWith(`export const ${name}`);
  });

  if (startIdx === -1) return "Source not found.";

  // Find End (Walk forward until the next block starts)
  let endIdx = startIdx;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith('export type') || line.startsWith('type ') ||
      line.startsWith('export const') || line.startsWith('const ') ||
      line.startsWith('export interface') || line.startsWith('interface ') ||
      line.startsWith('export function') || line.startsWith('function ') ||
      line.startsWith('// #region') || line.startsWith('// #endregion') ||
      line.startsWith('export class') || line.startsWith('class') ||
      line.startsWith('import') || line.startsWith('export') ||
      line.startsWith('export let') || line.startsWith('let ') || 
      line.startsWith('export var') || line.startsWith('var ')
    ) {
      break;
    }
    endIdx = i;
  }

  // Look from the bottom of the captured block upwards for the actual closing line
  const capturedLines = lines.slice(startIdx, endIdx + 1);
  let finalLineIdx = capturedLines.length - 1;

  for (let i = capturedLines.length - 1; i >= 0; i--) {
    const trimmed = capturedLines[i].trim();

    if (type === 'interface' || type === 'component') {
      // It must end with } or }; and NOT be a comment
      if ((trimmed === '}' || trimmed === '};' || trimmed.endsWith('}')) && !trimmed.startsWith('*') && !trimmed.startsWith('/')) {
        finalLineIdx = i;
        break;
      }
    } else if (type === 'type') {
      // Types are even simpler: find the last semicolon or closing brace
      if (trimmed.endsWith(';') || trimmed.endsWith('}')) {
        finalLineIdx = i;
        break;
      }
    }
  }

  const sourceCode = capturedLines.slice(0, finalLineIdx + 1).join('\n').trim();
  console.log (`retrieving code for ${name}: `, sourceCode);
  return capturedLines.slice(0, finalLineIdx + 1).join('\n').trim();
};
