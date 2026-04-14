import { PrismLight as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Syntax highlighters rendered languages
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
// import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
// import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

// Initialization Logic
SyntaxHighlighter.registerLanguage('tsx', tsx);
// SyntaxHighlighter.registerLanguage('typescript', typescript);
// SyntaxHighlighter.registerLanguage('json', json);

const LazySyntaxHighlighter = (props: SyntaxHighlighterProps | any) => (
  <SyntaxHighlighter {...props} style={{...oneDark}} />
);


export default LazySyntaxHighlighter;
