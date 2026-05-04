import { useState, useMemo, SetStateAction, Dispatch, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { getSourceCode, TooltipContextActions, TooltipService } from "@Project/ReactComponents";
import { AlertType } from '../../../../../Components/Content/Alert/Alert';

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';
import { ElementState } from '../../../Components/ShowcaseElement/ElementStates/ElementState';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import AlertCodeSnippets from './Docs_AlertJsxComponents?raw';
import CardCodeSnippets from '../Card/Docs_CardJsxComponents?raw';
import { 
  Example_Alert, 
  Example_AllAlerts, 
} from './Docs_AlertJsxComponents';


export const Docs_Alert = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const { show, hide } = useContext(TooltipService);
  const [currentTab, setCurrentTab] = useState<string>('Default');
  const tabs: string[] = ['Default', 'Content'];
  const tabLabels: string[] = ['Default', 'With Content'];

  const showTabContent = (tab: string) => tab == currentTab ? 'grid-rows-[1fr] order-[-1]' : 'grid-rows-[0fr] opacity-0';
  const tabStyles = (tab: string) => `tab-default text-base ${tab == currentTab ? 'tab-active' : ''}`;

  const onClickTab = (tab: string) => {
    setCurrentTab(tab);
    // updateParamContexts(tab);
  }

  //--------------------------------//
  // Param Table State              //
  //--------------------------------//
  const paramTableItems = useMemo(() => {
    const baseParamList: string[] = defaultParams || [];
    const contextParams: ParamContext[] = paramContextsList[currentTab]; 
    const params: (ParamItem | 'spacing')[] = getParamsTableItems(baseParamList, contextParams, childParamsList, paramTypeElements, paramDescriptionElements);
    
    // Variant specific params
    const variantParams: string[] = variantParamsList[currentTab] || [];
    const variantContextParams = paramContextsList[currentTab];
    if (variantParams?.length > 0) {
      const spacing: (ParamItem | 'spacing')[] = ['spacing'];
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(variantParams, variantContextParams, childParamsList, paramTypeElements, paramDescriptionElements);
      params.push(...spacing, ...variantParamItems);
    }

    return params;
  }, [currentTab]);


  //--------------------------------//
  // Input State Management         //
  //--------------------------------//
  const [alertType, setAlertType] = useState<AlertType>('info');

  const updateAlertType = (type: AlertType) => {
    setAlertType(type);
  }


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2 docs-showcase-header">
        Alert Component
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          The alert component is for displaying themed notifications for the projects I'm working on. It accepts any content, 
          and functions like a normal div element, allowing you to create a quick notification, or dynamic content while using
          the themes for specific states based on the type of notification you need. The alert types are 
          <Kw onClick={() => updateAlertType('info')} styles="keyword-interactive">info</Kw>, 
          <Kw onClick={() => updateAlertType('warning')} styles="keyword-interactive">warning</Kw>, 
          <Kw onClick={() => updateAlertType('error')} styles="keyword-interactive">error</Kw>, 
          <Kw onClick={() => updateAlertType('ok')} styles="keyword-interactive">ok</Kw>, or
          <Kw onClick={() => updateAlertType('question')} styles="keyword-interactive">question</Kw>.

        </div>
      </div>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          If you're just looking for a container to add content dynamically or in a uniform and themed manner, use &nbsp;
          <span 
            onMouseEnter={() => show({ code: getSourceCode(CardCodeSnippets, "Example_Card"), type: "component" })} 
            onClick={hide}
            onMouseLeave={hide}
          >
            <DocLink label='Card' url='/Documentation/Content/Card' />
          </span>
          
          . You can either add content with specific layouts, or just use the container to add content with themed styles.
        </p>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container'>
        { tabs.map((tab: string, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} key={`showcase-input-tab-${tab}-${index}`} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabLabels[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2' id="showcase-variants">
        { currentTab == 'Default' && 
          <ShowcaseElement jsx={getSourceCode(AlertCodeSnippets, "Example_Alert")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='showcase-state-ref-c'>
              <Example_Alert type={alertType} />
            </div>

            <div className={`pb-32 showcase-state-ref-states-c`}>
                <ElementState type='info' onClick={() => updateAlertType('info')} isSelected={alertType == 'info'} />
                <ElementState type='warning' onClick={() => updateAlertType('warning')} isSelected={alertType == 'warning'} />
                <ElementState type='error' onClick={() => updateAlertType('error')} isSelected={alertType == 'error'} />
                <ElementState type='ok' onClick={() => updateAlertType('ok')} isSelected={alertType == 'ok'} />
                <ElementState type='question' onClick={() => updateAlertType('question')} isSelected={alertType == 'question'} />
            </div>
          </ShowcaseElement>
        }
        
        { currentTab == 'Content' && 
          <ShowcaseElement jsx={getSourceCode(AlertCodeSnippets, "Example_AllAlerts")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='showcase-state-ref-c pb-8'>
              <Example_AllAlerts />
            </div>
          </ShowcaseElement>
        }
      </Variants>

      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Select Parameters' openByDefault>
          <ParamTable 
            params={paramTableItems} 
            additionalStyles='mt-4' 
          />
        </Dropdown>
      </div>
      
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const Tabs = styled.div``;
const Variants = styled.div``;


//---------------------------------------------//
// Component param table logic                 //
//---------------------------------------------//
// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'type', 'children', 'additStyles', 'additCStyles',
];


const variantParamsList: Record<string, string[]> = {
  'none': [],
}

const childParamsList: Record<string, string[]> = {
  'none': [],
};


const paramContextsList: Record<string, ParamContext[]> = {
  "text": [],
  "number": [
    { name: 'type="number"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'incrementButtons', 
      contextParam: false,
      variantOption: true,
    },
  ],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// Static FC component functions do not take up memory or increase load times, they're static and diffing is nominal
const paramTypeElements: Record<string, React.FC> = {
  'type': () => <ParamType type="AlertType" tooltip={{ code: Code_AlertTypes }} />,
  'children': () => <ParamType type="ReactNode" tooltip={{ text: 'The html content wrapped inside the <Alert>' }} />,
  'additStyles': () => <ParamType type="string" tooltip={{ code: dParArg('additStyles', 'content-classes') }} />,
  'additCStyles': () => <ParamType type="string" tooltip={{ code: dParArg('additCStyles', 'container-classes') }} />,
};

// Code Snippets
import SourceAlertSnippets from '../../../../../Components/Content/Alert/Alert.tsx?raw';
const Code_AlertTypes = getSourceCode(SourceAlertSnippets, 'AlertType', 'type');


const paramDescriptionElements: Record<string, React.FC> = {
  'type': () => 
    <div className='param-item-desc-text'>
      The type of alert we're using. It changes the theme and icon that's used in the alert.
    </div>,
  'children': () => 
    <div className='param-item-desc-text'>
      The content wrapped inside the Alert. It's a <Kw>ReactNode</Kw>.
    </div>,
  'additStyles': () => 
    <div className='param-item-desc-text'>
      Additional styles for the <Kw>children</Kw>, use <Kw>additCStyles</Kw> for adding styles to the container.
    </div>,
  'additCStyles': () => 
    <div className='param-item-desc-text'>
      The additional styles for the Alert's container, or the base element.
    </div>,
};
