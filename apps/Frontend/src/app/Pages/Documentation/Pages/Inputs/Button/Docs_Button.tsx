import { useState, useMemo } from "react";
import styled from "@emotion/styled";
import { ShowcaseElement, ParamContext } from "../../../Components/ShowcaseElement/ShowcaseElement";
import { ShowcaseExample_StateRef } from "../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef";
import { ParamItem, ParamTable, getParamsTableItems } from "../../../Components/ParamTable/ParamTable";
import { ParamType } from "../../../Components/ParamType/ParamType";
import { Dropdown } from "../../../../../Components/Content/Dropdown/Dropdown";

import ButtonCodeSnippets from './Docs_ButtonJsxComponents?raw';
import { getSourceCode } from "../../../../../Components/Utils/GetSourceCode";
import { 
  Example_CustomButton, 
  Example_GrayButton, 
  Example_GrayFocusButton, 
  Example_PrimaryButton
} from "./Docs_ButtonJsxComponents";


export const Docs_Button = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<string>('Primary');
  const tabs: string[] = ['Primary', 'Gray', 'GrayFocus', 'Custom'];
  const tabLabels: string[] = ['Primary', 'Gray', 'Gray-Focus', 'Custom'];

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
    const params: (ParamItem | 'spacing')[] = getParamsTableItems(baseParamList, contextParams, {}, paramTypeElements, paramDescriptionElements);
    
    // Variant specific params
    const variantParams: string[] = variantParamsList[currentTab] || [];
    const variantContextParams = paramContextsList[currentTab];
    if (variantParams?.length > 0) {
      const spacing: (ParamItem | 'spacing')[] = ['spacing'];
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(variantParams, variantContextParams, {}, paramTypeElements, paramDescriptionElements);
      params.push(...spacing, ...variantParamItems);
    }

    return params;
  }, [currentTab]);


  //--------------------------------//
  // Input State Management         //
  //--------------------------------//
  const [buttonError, setButtonError] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2">
        Button Component
      </h3>

      <div className='span-12' id="showcase-element">
        <p className='p-2 showcase-text'>
          A themed functional button component for this project. With built in functionality for events and styling.
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
      <Variants className='span-12 py-2'>
        { currentTab == 'Primary' && 
          <ShowcaseElement jsx={getSourceCode(ButtonCodeSnippets, "Example_PrimaryButton")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={buttonError} setError={setButtonError}
              disabled={buttonDisabled} setDisabled={setButtonDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_PrimaryButton error={buttonError} disabled={buttonDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        { currentTab == 'Gray' && 
          <ShowcaseElement jsx={getSourceCode(ButtonCodeSnippets, "Example_GrayButton")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={buttonError} setError={setButtonError}
              disabled={buttonDisabled} setDisabled={setButtonDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_GrayButton error={buttonError} disabled={buttonDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        { currentTab == 'GrayFocus' && 
          <ShowcaseElement jsx={getSourceCode(ButtonCodeSnippets, "Example_GrayFocusButton")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={buttonError} setError={setButtonError}
              disabled={buttonDisabled} setDisabled={setButtonDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_GrayFocusButton error={buttonError} disabled={buttonDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        { currentTab == 'Custom' && 
          <ShowcaseElement jsx={getSourceCode(ButtonCodeSnippets, "Example_CustomButton")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={buttonError} setError={setButtonError}
              disabled={buttonDisabled} setDisabled={setButtonDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_CustomButton error={buttonError} disabled={buttonDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
      </Variants>

      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Button Parameters' openByDefault>
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

const showCaseElementStyleProps = {
  styles: "p-4 pl-8 pt-8 pb-2 span-12 lg:span-8",
  stateStyles: "p-4 pl-8 span-12 lg:span-8 rowStart gap-2"
};


//---------------------------------------------//
// Component param table logic                 //
//---------------------------------------------//
// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'displayText', 'onClick', 'disabled',
  'spacing', 'size', 'color', 'additionalStyles',
  'spacing', 'icon', 'iconStyles',
];

const variantParamsList: Record<string, string[]> = {
  'none': [],
}


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
  'displayText': () => <ParamType type="string" />, 
  'onClick': () => <ParamType type="function" />,
  'disabled': () => <ParamType type="boolean" />,

  'size': () => <ParamType type="ButtonSizes" />,
  'color': () => <ParamType type="ButtonColors" />,
  'additionalStyles': () => <ParamType type="string" />,

  'icon': () => <ParamType type="IconTypes" />,
  'iconStyles': () => <ParamType type="string" />,
};

const paramDescriptionElements: Record<string, React.FC> = {
  'displayText': () =>
    <div className='param-item-desc-text'>
      The button text.
    </div>, 
  'onClick': () =>
    <div className='param-item-desc-text'>
      Event function passed in for when the user clicks the button.
    </div>, 
  'disabled': () =>
    <div className='param-item-desc-text'>
      Whether the button is disabled.
    </div>,

  'size': () =>
    <div className='param-item-desc-text'>
      The preset sizes for the button. The values are "default", "md", "lg", "xl", and "none". You can add your own custom styles for other scenarios.
    </div>, 
  'color': () =>
    <div className='param-item-desc-text'>
      The preset colors for this project's themes. The options are "primary", "gray", "gray-focus", and "none".
    </div>, 
  'additionalStyles': () =>
    <div className='param-item-desc-text'>
      Additional styles you can add to the button.
    </div>,

  'icon': () =>
    <div className='param-item-desc-text'>
      The icon you want to add to the button.
    </div>, 
  'iconStyles': () =>
    <div className='param-item-desc-text'>
      The styles for the icon paired with this button.
    </div>,
};
