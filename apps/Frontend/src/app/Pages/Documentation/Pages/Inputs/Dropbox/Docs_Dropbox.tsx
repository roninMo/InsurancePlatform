
import { useState, useMemo, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { getSourceCode, TooltipService } from "@Project/ReactComponents";

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import { HashLink } from '../../../../../Components/Utils/HashLink/HashLink';
import styled from '@emotion/styled';

import DropboxCodeSnippets from './Docs_DropboxJsxComponents.tsx?raw';
import { 
  Example_Dropbox,
} from './Docs_DropboxJsxComponents';


export const Docs_Dropbox = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<string>('default');
  const tabs: string[] = ['default'];
  const tabLabels: string[] = ['Default'];

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
  const { show, hide } = useContext(TooltipService);
  const [defaultError, setDefaultError] = useState<string>('');
  const [defaultDisabled, setDefaultDisabled] = useState<boolean>(false);


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2 docs-showcase-header">
        Dropbox Component
      </h3>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          A <Kw>drag and drop</Kw> file input component. It has themed styles with hover and error/disabled styles.
          Allows you to choose whether to accept <Kw>multiple</Kw> files, and what kind of files the user is allowed to choose.

          There's additional functionality to edit the display and add your own background icon or custom styling if you need.
        </p>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container' id="showcase-variants">
        { tabs.map((tab: string, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} key={`showcase-input-tab-${tab}-${index}`} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabLabels[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2'>
        { currentTab == 'default' && 
          <ShowcaseElement jsx={getSourceCode(DropboxCodeSnippets, "Example_Dropbox")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={defaultError} setError={setDefaultError}
              disabled={defaultDisabled} setDisabled={setDefaultDisabled}
              elementStateTypes={[]} 
            >
              <Example_Dropbox error={defaultError} disabled={defaultDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
      </Variants>

      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Checkbox Parameters' openByDefault>
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
  'name', 'accept', 'handleFiles', 'multiple',
  'spacing', 'label', 'description', 'customIcon', 'iconStyles',
  'spacing', 'value', 'error', 'errorMessage', 'disabled', 'required',
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
  'name': () => <ParamType type="string" tooltip={{ code: dParArg('name', 'dropbox.form.name') }} />,
  'accept': () => <ParamType type="string" tooltip={{ code: dParArg('accept', 'image/*, .pdf, .doc, .docx, .txt') }} />,
  'handleFiles': () => <ParamType type="ChangeEvent" tooltip={{ code: Code_HandleFiles }} />,
  'multiple': () => <ParamType type="boolean" tooltip={{ code: dParArg('multiple', 'multiple', 'var') }} />,

  'label': () => <ParamType type="string" tooltip={{ code: dParArg('label', 'Upload files') }} />,
  'description': () => <ParamType type="string" tooltip={{ code: dParArg('description', 'The description of the dropbox.') }} />,
  'additionalStyles': () => <ParamType type="string" tooltip={{ code: dParArg('additionalStyles', 'stylesClass') }} />,
  'customIcon': () => <ParamType type="IconTypes" tooltip={{ code: Code_IconTypes }} />,
  'iconStyles': () => <ParamType type="string" tooltip={{ code: dParArg('iconStyles', 'iconStylesClass') }} />,
  
  'value': () => <ParamType type="string" tooltip={{ code: dParArg('value', 'files', 'var') }} />,
  'error': () => <ParamType type="boolean" tooltip={{ code: dParArg('error', 'error', 'var'), }} />,
  'errorMessage': () => <ParamType type="string" tooltip={{ code: dParArg('errorMessage', 'An error occurred.') }} />,
  'disabled': () => <ParamType type="boolean" tooltip={{ code: dParArg('disabled', 'disabled', 'var') }} />,
  'required': () => <ParamType type="boolean" tooltip={{ code: dParArg('required', 'required', 'var') }} />,
};

// Code Snippet imports
import IconSourceSnippets from '@lib-rc/Common/Icons/Icon.tsx?raw';
const Code_IconTypes = getSourceCode(IconSourceSnippets, [135, 236]);
const Code_HandleFiles = 'handleFiles: (files: FileList | null) => void;';


const paramDescriptionElements: Record<string, React.FC> = {
  'name': () =>
    <div className='param-item-desc-text'>
      The internal id used for capturing values during submit and with form libraries like @see react-hook-forms.
    </div>,
  'accept': () =>
    <div className='param-item-desc-text'>
      A stringified list of the different file types it accepts. Leaving it blank allows for any, if you want certain types: 'image/*, .pdf, .doc, .docx, .txt'.
    </div>,
  'handleFiles': () =>
    <div className='param-item-desc-text'>
      The event function for you to handle storing the files retrieved from the user.
    </div>,
  'multiple': () =>
    <div className='param-item-desc-text'>
      Whether the dropbox allows for uploading multiple files
    </div>,

  'label': () =>
    <div className='param-item-desc-text'>
      The label of the dropbox component.
    </div>,
  'description': () =>
    <div className='param-item-desc-text'>
      The description of the dropbox component.
    </div>,
  'additionalStyles': () =>
    <div className='param-item-desc-text'>
      The description of the dropbox component.
    </div>,
  'customIcon': () =>
    <div className='param-item-desc-text'>
      Whether you want to add your own icon from this project's library as the image.
    </div>,
  'iconStyles': () =>
    <div className='param-item-desc-text'>
      Custom styles for the dropbox's icon.
    </div>,

  'error': () =>
    <div className='param-item-desc-text'>
      Whether there's an error for the dropbox component.
    </div>,
  'errorMessage': () =>
    <div className='param-item-desc-text'>
      The error message for the dropbox component.
    </div>,
  'disabled': () =>
    <div className='param-item-desc-text'>
      Whether the dropbox component is disabled.
    </div>,
  'required': () =>
    <div className='param-item-desc-text'>
      Whether the dropbox component is required.
    </div>,
};
