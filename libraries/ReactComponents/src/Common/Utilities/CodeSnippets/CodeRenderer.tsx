import { lazy } from 'react';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';


/** Lazy render for React Syntax Highlighter because it's a costly import */
export const CodeRenderer = lazy(() => 
	import('./CodeSnippet')
) as React.FC<SyntaxHighlighterProps | any>;
