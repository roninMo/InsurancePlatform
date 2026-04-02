


// From a stringified file import using vite, retrieves the exported components for documentation jsx examples.
export const getComponentSourceCode = (
  fileImportSource: string, // Import needs a '?raw' suffix to convert to string, ex: './Jsx.tsx?raw';
  componentName: string, // The name of the component you want returned as a string
) => {
  // Escapes the name and builds the regex to find the block
  const pattern = new RegExp(
    `(export\\s+const\\s+${componentName}\\s*=\\s*[\\s\\S]*?)(?=\\nexport|$)`
  );
  
  const match = fileImportSource.match(pattern);
  return match ? match[1].trim() : "Component source not found.";
};


// Example Usage:
// import JsxExampleFile from 'Content/Examples/Jsx.tsx';
// const textInputSource = getComponentSource(AllExamplesSource, 'JsxExample_TextInput');
// const emailInputSource = getComponentSource(AllExamplesSource, 'JsxExample_EmailInput');
