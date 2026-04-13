


// From a stringified file import using vite, retrieves the exported components for documentation jsx examples.
export const getSourceCode = (
  fileImportSource: string, // Import needs a '?raw' suffix to convert to string, ex: './Jsx.tsx?raw';
  name: string, // The name of the component, type, or interface you want returned as a string
  type: 'component' | 'type' | 'interface' = 'component' // if we're retrieving a type definition instead
) => {
  let pattern: RegExp = new RegExp('');
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

  const match = fileImportSource.match(pattern);
  return match ? match[0].trim() : "Component source not found.";
};


// Example Usage:
// import JsxExampleFile from 'Content/Examples/Jsx.tsx';
// const textInputSource = getComponentSource(AllExamplesSource, 'JsxExample_TextInput');
// const emailInputSource = getComponentSource(AllExamplesSource, 'JsxExample_EmailInput');
