import { useState, useEffect, ReactNode, Suspense, useMemo } from 'react';
import { CodeRenderer, Ht, Icon } from '@Project/ReactComponents';
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

    const delay = 400 + (Math.random() * 101);
    const timeout = setTimeout(() => setIsRenderDelayDone(true), delay);
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
        <div onClick={() => toggleTab('component')} className={`tab-default ${activeTab == 'component' ? 'tab-active' : ''}`}>
          Component
        </div>
        <div onClick={() => toggleTab('jsx')} className={`tab-default ${activeTab == 'jsx' ? 'tab-active' : ''}`}>
          Jsx
        </div>
      </Tabs>

      <Content className='w-full bg-div rounded-b-md'>
        <Jsx show={activeTab == 'jsx' && isRenderDelayDone} cStyles='content-auto'>
          <Suspense>
            <MemoizedCodeSnippet jsx={jsx} onCopyCodeSnippet={copyCodeSnippet} />
          </Suspense>
        </Jsx>

        <RenderedComponent show={activeTab == 'component'} cStyles={`content-auto ${styles}`}>
          { children }
        </RenderedComponent>
        <PreJsxRenderedContent show={activeTab == 'jsx' && !isRenderDelayDone} cStyles='content-auto'>
          <div className='w-full lg:w-7/12 col gap-2 py-4 px-6 pb-8'>
            <div className='p-1.5 italic font-semibold skeleton-txt'>Loading code...</div>
            <div className='showcase-jsx-sk-bg w-full' />
            <div className='showcase-jsx-sk-bg w-1/4' />
            <div className='showcase-jsx-sk-bg w-4/5' />
            <div className='showcase-jsx-sk-bg w-1/2' />
          </div>

          {/* TODO: Add skeleton loading components
            <div className='w-full p-4 skeleton-bg outline-css outline-default'>
              Hello
            </div>  
          */}
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
const RenderedComponent = styled(Ht)``;
const Jsx = styled(Ht)``;
const JsxCopySnippet = styled.div``;
const PreJsxRenderedContent = styled(Ht)``;

// Conditional Styles
const isTabActive = (tab: showcaseTabType, activeTab: showcaseTabType): string => 
  tab == activeTab ? 'tab-active' : '';
