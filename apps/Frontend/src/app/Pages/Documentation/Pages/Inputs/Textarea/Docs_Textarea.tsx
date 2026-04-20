import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { ParamItem, ParamTable, getParamsTableItems } from '../../../Components/ParamTable/ParamTable';
import { ParamType } from '../../../Components/ParamType/ParamType';
import { EventParamTable } from '../../../Components/EventParamTable/EventParamTable';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import TextareaCodeSnippets from './Docs_TextareaJsxComponents?raw';
import { getSourceCode } from '../../../../../Components/Utils/GetSourceCode';
import { Example_BoxTextareaInput, Example_DefaultTextareaInput, Example_PostTextareaInput } from './Docs_TextareaJsxComponents';
import { TextareaTypes } from '../../../../../Components/Forms/Textarea/Textarea';


export const Docs_Textarea = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<TextareaTypes>('box');
  const tabs: TextareaTypes[] = ['default', 'box', 'post'];
  const tabLabels: string[] = ['Default', 'Box', 'Post'];

  const showTabContent = (tab: TextareaTypes) => tab == currentTab ? 'grid-rows-[1fr] order-[-1]' : 'grid-rows-[0fr] opacity-0';
  const tabStyles = (tab: TextareaTypes) => `tab-default text-base ${tab == currentTab ? 'tab-active' : ''}`;

  const onClickTab = (tab: TextareaTypes) => {
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
  // #region States
  const [defaultError, setDefaultError] = useState<string>('');
  const [defaultDisabled, setDefaultDisabled] = useState<boolean>(false);
  
  const [boxError, setBoxError] = useState<string>('');
  const [boxDisabled, setBoxDisabled] = useState<boolean>(false);
  
  const [postError, setPostError] = useState<string>('');
  const [postDisabled, setPostDisabled] = useState<boolean>(false);
  // #endregion

  return (
    <Container className='spacing'>
      <h3 className="span-12 p-2">
        Input Component
      </h3>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          The input component is designed with functionality and customization 
          to fit your needs for the varying form types. It comes with tooltips, 
          loading bars for server side autosaving, event hooks, error handling, and input masking. 
          Each type has varying icons and functionality so you know whether the input is for 
          text, email, phone, policy number, credit, currency, or search.
        </p>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container'>
        { tabs.map((tab: TextareaTypes, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} key={`showcase-input-tab-${tab}-${index}`} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabLabels[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2'>
        {/* Text Input */}
        { currentTab == 'default' && 
          <ShowcaseElement jsx={getSourceCode(TextareaCodeSnippets, "Example_DefaultTextareaInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            {/* TODO: Add additional state ref buttons for what you can optionally 
              add with each variant on the textarea. Submit, metadata tags, emojis, etc. */}
            <ShowcaseExample_StateRef 
              error={defaultError} setError={setDefaultError}
              disabled={defaultDisabled} setDisabled={setDefaultDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_DefaultTextareaInput error={defaultError} disabled={defaultDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        { currentTab == 'box' && 
          <ShowcaseElement jsx={getSourceCode(TextareaCodeSnippets, "Example_BoxTextareaInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            {/* TODO: Add additional state ref buttons for what you can optionally 
              add with each variant on the textarea. Submit, metadata tags, emojis, etc. */}
            <ShowcaseExample_StateRef 
              error={boxError} setError={setBoxError}
              disabled={boxDisabled} setDisabled={setBoxDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_BoxTextareaInput error={boxError} disabled={boxDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        { currentTab == 'post' && 
          <ShowcaseElement jsx={getSourceCode(TextareaCodeSnippets, "Example_PostTextareaInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            {/* TODO: Add additional state ref buttons for what you can optionally 
              add with each variant on the textarea. Submit, metadata tags, emojis, etc. */}
            <ShowcaseExample_StateRef 
              error={postError} setError={setPostError}
              disabled={postDisabled} setDisabled={setPostDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_PostTextareaInput error={postError} disabled={postDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
      </Variants>


      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Textarea Parameters' openByDefault>
          <ParamTable 
            params={paramTableItems} 
            additionalStyles='mt-4' 
          />
        </Dropdown>
      </div>
      
      {/* TODO: add highlighting for what event parameters are used on each input component, and add this to the other pages */}
      <div className='span-12 py-2 pt-4' id="event-handler-table">
        <Dropdown label='Event Handlers' openByDefault>
          <p className='p-2 pl-1 showcase-text'>
            The event handlers you can use with this component. Pass in your own event functions to interact with the element.
          </p>
          <EventParamTable additionalStyles='mt-4' />
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
  'type', 'name',
  'spacing', 'label', 'description', 'placeholder', 'value',
  'spacing', 'error', 'errorMessage', 'disabled', 'required',
  'spacing', 'onSubmit', 'submitButtonText', 'submitButtonDisabled',
  'spacing', 'tooltip', 'tooltipText',
];

const variantParamsList: Record<string, string[]> = {
  'default': ['onAttachFile'],
  'box':     ['onAttachFile', 'metadataTags'],
  'post':    ['metadataTags'],
}

const paramContextsList: Record<string, ParamContext[]> = {
  "default": [
    { name: 'type="default"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'onAttachFile', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "box": [
    { name: 'type="box"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'onAttachFile', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'metadataTags', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "post": [
    { name: 'type="post"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'metadataTags', 
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
  // Default params
  'type': () => <ParamType type='string' />,
  'name': () => <ParamType type='string' />,

  'label': () => <ParamType type='string' />,
  'description': () => <ParamType type='string' />,
  'placeholder': () => <ParamType type='string' />,
  'value': () => <ParamType type='string' />,

  'error': () => <ParamType type='boolean' />,
  'errorMessage': () => <ParamType type='string' />,
  'disabled': () => <ParamType type='boolean' />,
  'required': () => <ParamType type='boolean' />,

  'onSubmit': () => <ParamType type='function' />,
  'submitButtonText': () => <ParamType type='string' />,
  'submitButtonDisabled': () => <ParamType type='boolean' />,

  'tooltip': () => <ParamType type='boolean' />,
  'tooltipText': () => <ParamType type='string' />,
  
  'onAttachFile': () => <ParamType type='function' />,
  'metadataTags': () => <ParamType type='function' />,
};

//update the textarea and then add the default params
// type
// onSubmit
// tooltip
// onAttachFile
// metadatatags

const paramDescriptionElements: Record<string, React.FC> = {
  // Default params
  'type' : () =>
    <div className='param-item-desc-text'>
      The variant of the textarea component you're using. The types are "default", "box", and "post".
    </div>,
  'name' : () =>
    <div className='param-item-desc-text'>
      The name of the textarea. Acts as a key for form data during submissions.
    </div>,

  'label' : () =>
    <div className='param-item-desc-text'>
      The label of the textarea. 
    </div>,
  'description' : () =>
    <div className='param-item-desc-text'>
      The description for this textarea element.
    </div>,
  'placeholder' : () =>
    <div className='param-item-desc-text'>
      The textarea element's placeholder text. Rendered when the input is empty.
    </div>,
  'value' : () =>
    <div className='param-item-desc-text'>
      The value of the textarea. Use your own state management for handling editing this value.
    </div>,

  'error' : () =>
    <div className='param-item-desc-text'>
      Whether there's validation errors for this textarea.
    </div>,
  'errorMessage' : () =>
    <div className='param-item-desc-text'>
      The validation error message for this textarea.
    </div>,
  'disabled' : () =>
    <div className='param-item-desc-text'>
      Whether the textarea is disabled.
    </div>,
  'required' : () =>
    <div className='param-item-desc-text'>
      Is this textarea required during submission?
    </div>,


  'onSubmit' : () =>
    <div className='param-item-desc-text'>
      Event handler for when the user presses the button attached to this component. It's optional, and is up to you when to utilize it.
      The internal state is already updated through the onChange event of this component.
    </div>,
  'submitButtonText' : () =>
    <div className='param-item-desc-text'>
      Is this textarea required during submission?
    </div>,
  'submitButtonDisabled' : () =>
    <div className='param-item-desc-text'>
      Is this textarea required during submission?
    </div>,
  
  'tooltip' : () =>
    <div className='param-item-desc-text'>
      Should this component have a tooltip?
    </div>,
  'tooltipText' : () =>
    <div className='param-item-desc-text'>
      The tooltip text.
    </div>,

  'onAttachFile' : () =>
    <div className='param-item-desc-text'>
      If you want to additionally allow the user to attach files alongside the text form, 
      there's a built in button on some of this component's variants you can use.
    </div>,
  'metadataTags' : () =>
    <div className='param-item-desc-text'>
      A list of themed buttons with optional labels and icons, and event functions associated with clicking on each one.
      This is helpful for auxiliary events like adding metadata to certain forms and posts for certain applications.
      For example, you could tag other users on an application, create an event and add a due date to the event,
      add tags or labels specific to a post you make, or anything you want to define and add additional functionality here.
    </div>,

};
