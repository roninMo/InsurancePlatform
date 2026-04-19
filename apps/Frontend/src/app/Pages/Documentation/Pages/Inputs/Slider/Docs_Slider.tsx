import { useState, useMemo } from "react";
import styled from "@emotion/styled";
import { ShowcaseElement, ParamContext } from "../../../Components/ShowcaseElement/ShowcaseElement";
import { ShowcaseExample_StateRef } from "../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef";
import { ParamItem, ParamTable, getParamsTableItems } from "../../../Components/ParamTable/ParamTable";
import { ParamType } from "../../../Components/ParamType/ParamType";
import { Dropdown } from "../../../../../Components/Content/Dropdown/Dropdown";

import SliderCodeSnippets from './Docs_SliderJsxComponent?raw';
import { getSourceCode } from "../../../../../Components/Utils/GetSourceCode";
import { Example_DefaultSlider } from "./Docs_SliderJsxComponent";


export const Docs_Slider = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<string>('Default');
  const tabs: string[] = ['Default'];

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
  const [sliderError, setSliderError] = useState<string>('');
  const [sliderDisabled, setSliderDisabled] = useState<boolean>(false);


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2">
        Slider Component
      </h3>

      <div className='span-12' id="showcase-element">
        <p className='p-2 showcase-text'>
          A themed functional slider component for this project. 
          It's a styled button with a hidden input wired to it to link the value to a form component if needed. 
          You can override the styles if you need a custom theme or other styles to suit your project goal.
        </p>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container'>
        { tabs.map((tab: string, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} key={`showcase-input-tab-${tab}-${index}`} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabs[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2'>
        { currentTab == 'Default' && 
          <ShowcaseElement jsx={getSourceCode(SliderCodeSnippets, "Example_DefaultSlider")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={sliderError} setError={setSliderError}
              disabled={sliderDisabled} setDisabled={setSliderDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <div className="rowStart">
                <Example_DefaultSlider error={sliderError} disabled={sliderDisabled} />
              </div>
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
      </Variants>

      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Slider Parameters' openByDefault>
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
  'type', 'name' , 'label', 'description', 
  'spacing', 'value', 'onChange',
  'spacing', 'error', 'errorMessage', 'disabled', 'required',
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

  'type': () => <ParamType type="SliderVariants" />,
  'name': () => <ParamType type="string" />, 
  'label': () => <ParamType type="string" />,
  'description': () => <ParamType type="string" />,

  'value': () => <ParamType type="boolean" />,
  'onChange': () => <ParamType type="function" />,

  'error': () => <ParamType type="boolean" />,
  'errorMessage': () => <ParamType type="string" />,
  'disabled': () => <ParamType type="boolean" />,
  'required': () => <ParamType type="boolean" />,
};

// onChange
// add default params to these

const paramDescriptionElements: Record<string, React.FC> = {
  'type': () => 
    <div className='param-item-desc-text'>
      The style of slider you want. Currently there's only the default, but you can override the css with the "styles" attribute.
    </div>,
  'name': () => 
    <div className='param-item-desc-text'>
      The internal id used for capturing values during submit and with form libraries like @see react-hook-forms.
    </div>,
  'label': () => 
    <div className='param-item-desc-text'>
      The label of the slider.
    </div>,
  'description': () => 
    <div className='param-item-desc-text'>
      The description of the slider.
    </div>,

  'value': () => 
    <div className='param-item-desc-text'>
      Whether the slider is enabled.
    </div>,
  'onChange': () => 
    <div className='param-item-desc-text'>
      The function used to handle updating the slider value, as this isn't handled internally for developer customization.
    </div>,

  'error': () =>
    <div className='param-item-desc-text'>
      Whether there's an error for the slider component.
    </div>,
  'errorMessage': () =>
    <div className='param-item-desc-text'>
      The error message for the slider component.
    </div>,
  'disabled': () =>
    <div className='param-item-desc-text'>
      Whether the slider component is disabled.
    </div>,
  'required': () =>
    <div className='param-item-desc-text'>
      Whether the slider component is required.
    </div>,
};
