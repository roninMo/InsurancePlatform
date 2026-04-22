import { useState, useEffect, ReactNode, Suspense, useMemo } from 'react';
import { CodeRenderer, Icon } from '@Project/ReactComponents';
// import { Notify } from '../../Pages/Utils/Notify/Notify'; // Alternative for delay, used w/Suspense and conditional render

import styled from '@emotion/styled';
import styles from './ShowcaseElement.module.scss';


export interface ParamContext {
  name: string;
  contextParam?: boolean;
  variantOption?: boolean;
	overwrite?: string;
}

type showcaseTabType = 'component' | 'jsx';
export interface ShowcaseElementProps {
  jsx: string;
  styles: string;
  children: ReactNode; // Used as the rendered component
}

export const ShowcaseElement = ({ jsx, styles, children }: ShowcaseElementProps) => {
  const [activeTab, setActiveTab] = useState<showcaseTabType>('component');
  const [isRenderDelayDone, setIsRenderDelayDone] = useState<boolean>(false);

  // Quick Render delay for jsx code
  useEffect(() => {
    if (activeTab != 'jsx') return;
    if (isRenderDelayDone) return;

    const timeout = setTimeout(() => setIsRenderDelayDone(true), 450);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  const toggleTab = (newTab: showcaseTabType) => {
    setActiveTab(newTab);
  }

  const copyCodeSnippet = async () => {
    try {
      // Sets the system clipboard to the specified text
      await navigator.clipboard.writeText(jsx);
      console.log('copied to clipboard: ', jsx);
      alert('Copied to clipboard!'); // TODO: Add a tooltip like notification to notify when copied to clipboard
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  return (
    <Container className='col outline-css outline-default'>
      <Tabs className='w-full rowStart items-center gap-4 px-4 border-b border-default rounded-t-md faded-box'>
        <div onClick={() => toggleTab('component')} className={`tab-default ${isTabActive('component', activeTab)}`}>
          Component
        </div>
        <div onClick={() => toggleTab('jsx')} className={`tab-default ${isTabActive('jsx', activeTab)}`}>
          Jsx
        </div>
      </Tabs>

      <Content className='w-full bg-div rounded-b-md'>
        <RenderedComponent className={`height-trans ${displayContent('component', activeTab)}`}>
          <div className={`height-trans-content content-auto ${styles}`}>
            { children }
          </div>
        </RenderedComponent>
        
        <Jsx className={`height-trans ${displayContent('jsx', activeTab, isRenderDelayDone)}`}>
          <div className={`height-trans-content content-auto`}>
            {activeTab == 'jsx' && 
              <Suspense>
                <MemoizedCodeSnippet jsx={jsx} onCopyCodeSnippet={copyCodeSnippet} />
              </Suspense>
            }
          </div>
        </Jsx>

        <PreJsxRenderedContent className={`height-trans ${displayContent('jsx', activeTab, !isRenderDelayDone)}`}>
          <div className={`height-trans-content content-auto`}>
            <p className='p-4 italic loading-text'>Loading code...</p>
            {/* TODO: Add skeleton loading components
              <div className='w-full p-4 skeleton-bg outline-css outline-default'>
                Hello
              </div>  
            */}
          </div>
        </PreJsxRenderedContent>
          
      </Content>

    </Container>
  );
}


interface MemoizedCodeSnippetProps {
  jsx: string;
  onCopyCodeSnippet: () => Promise<void>;
}
const MemoizedCodeSnippet = ({ jsx, onCopyCodeSnippet }: MemoizedCodeSnippetProps) => {
  // Do not rerender react-syntax-highlighter's import, it still takes time in the DOM to render and is very slow
  const memoizedSnippet = useMemo(() => (
    <div className='-my-[7px] react-syntax-highlighter-margin-fix relative'>
      <CodeRenderer language='tsx' code={jsx} showLineNumbers />
      <JsxCopySnippet onClick={onCopyCodeSnippet} className='p-2 m-4 showcase-jsx-copy-snippet'>
        <Icon variant='CodeBracket' styles='size-6 icon-default-color' />
      </JsxCopySnippet>
    </div>
  ), [jsx]);

  return memoizedSnippet;
}


// Styled Components
const Container = styled.div``;
const Tabs = styled.div``;
const Content = styled.div``;
const RenderedComponent = styled.div``;
const Jsx = styled.div``;
const JsxCopySnippet = styled.div``;
const PreJsxRenderedContent = styled.div``;

// Conditional Styles
const isTabActive = (tab: showcaseTabType, activeTab: showcaseTabType): string => 
  tab == activeTab ? 'tab-active' : '';
const displayContent = (tab: showcaseTabType, activeTab: showcaseTabType, shouldRender: boolean = true): string => 
  (tab == activeTab && shouldRender) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
const animateClose = (tab: showcaseTabType, activeTab: showcaseTabType, shouldRender: boolean = true): string => 
  (tab == activeTab && shouldRender) ? 'height-trans-op-content' : '';
