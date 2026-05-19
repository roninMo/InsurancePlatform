import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HashLink } from '../../../../Components/Utils/HashLink/HashLink';
import { Alert } from '../../../../Components/Content/Alert/Alert';
import { Card } from '../../../../Components/Content/Card/Card';
import { 
  Button, 
  Checkbox, 
  Dropbox, 
  getValuesFromType, 
  Icon, 
  IconTypes, 
  Input, 
  RadioGroup, 
  RadioItem, 
  RadioTable, 
  Select, 
  Slider, 
  Textarea, 
  TooltipService 
} from '@Project/ReactComponents';

import styles from './Docs_Introduction.module.scss';


interface DocsIntroductionProps {
  links: 'forms' | 'content' | 'utils' | 'all';
}
export const Docs_Introduction = ({ links }: DocsIntroductionProps) => {
  return (
    <div className="spacing gap-4 p-4">
      { links == 'all' && <>
        <h2 className='span-12'>
          Introduction
        </h2>

        {/* Welcome to documentation demo */}
        <p className='span-12 py-2 text-lg lg:text-xl'>
            Welcome to the Documentation Demo. This documentation consists of the majority of functional custom components used within this project. 
            The components consist of universal dynamic form inputs, 
            themed reusable content, and utility components that 
            can be used across your application with ease. 
        </p>
        
        {/* intro explanation and text */}
        <p className='span-12 py-2 pb-10 text-lg lg:text-xl'>
            The majority of the component's design are focused on best practices, efficiency, customization, 
            and being reusable across the application with ease. It was a lot of fun putting these components together,
            even though I probably won't be using these much outside of this project, I got to design a lot of interesting things while developing each one.
        </p>
      </>}

      <div className='spacing gap-6'>
        { links == 'all' && 
          <h2 className='span-12'>Links Section</h2>
        }
        { (links == 'all' || links == 'forms') && <FormsQuickLinks links={links} /> }
        { (links == 'all' || links == 'content') && <ContentQuickLinks links={links} /> }
        { (links == 'all' || links == 'utils') && <UtilsQuickLinks links={links} /> }
      </div>
    </div>
  );
}


const FormsQuickLinks = ({ links }: DocsIntroductionProps) => {
  const tooltipContext = useContext(TooltipService);

  // Open the select by default, and prevent natural nav behavior from navigating from simulated event
  const [allowSelectNav, setAllowSelectNav] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const selectElement = document.getElementById('quicklink-select-slct');
    if (selectElement) selectElement.click();
    setAllowSelectNav(true);
  }, []);

  const selectNavigateLogic = () => {
    if (!allowSelectNav) return;
    navigate('/Documentation/Forms/Select');
  }


  return (<>
    { links != 'all' ? 
      <h2 id='forms-quicklinks' className='span-12 pt-4'>Form Links</h2>
    :
      <h3 id='forms-quicklinks' className='span-12 pt-4'>Form Inputs</h3>
    }
    
    <p className='span-12 pb-4 text-lg lg:text-xl'>
      Custom interactive and highly customizable themed form components. We're using rhf to 
      help tackle performance bottlenecks with deeply nested components, as well as memoized.
      Between trying best practices and customizability, these were fun to spin up from reference.
      They all have variants for different scenarios, give it a try.
    </p>

    {/* input */}
    <div className='span-12 lg:span-5 col *:flex-1'>
      <HashLink url='/Documentation/Forms/Input' styles='doc-quicklink'>
        <h4 className='pb-2'>Input Component</h4>
        <Input 
          type='search' name='quicklink-input'
          label='Example Input' value=''
          placeholder='Type something...'
          description="The input's description."
          tooltipContent={{ text: "Tooltip text... "}} tooltipContext={tooltipContext}
        /> 
      </HashLink>
    </div>
    
    {/* textarea */}
    <div className='span-12 lg:span-7 col *:flex-1'>
      <HashLink url='/Documentation/Forms/Textarea' styles='doc-quicklink'>
        <h4 className='pb-2'>Textarea Component</h4>
        
        <div className=''>
          <Textarea  
            type="default" name="quicklink-textarea"
            label="Box style"
            description="The description of the textarea."
            placeholder="input text..." value=""

            submitButtonText="Post" onSubmit={() => {}}
            attachFile={{} as any} metadataTags
          />
        </div>
      </HashLink>
    </div>


    {/* checkbox */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Forms/Checkbox' styles='doc-quicklink'>
        <h4 className='pb-2'>Checkbox Component</h4>
        <Checkbox 
          variant="list" name="quicklink-checkbox" 
          label="List Checkbox"
          description="The checkbox component's description."
          items={{
            "valueA": {
              label: "Option A", description: "Option A's description.",
              value: "valueA", checked: false
            },
            "valueB": {
              label: "Option B", description: "Option B's description.",
              value: "valueB", checked: true
            }
          }}
          onSelect={() => {}}
        />
      </HashLink>
    </div>
    
    {/* select */}
    <div className='span-12 lg:span-6 col'>
      <HashLink url='/Documentation/Forms/Select' styles='doc-quicklink pb-40' customNavigate={selectNavigateLogic}>
        <h4 className='pb-2'>Select Component</h4>
        <Select 
          name='quicklink-select'
          label="Select Component"
          placeholder="Select a value..."
          description="The select input's description."
          multiSelect

          // value={{ value: 'checkbox', label: "Checkbox", iconProps:            { icon: "CircleOkay", placement: 'left' }}}
          values={[
            { value: 'attachFile', label: "Attach File", iconProps:       { icon: "AttachFile", placement: 'left' }},
            { value: 'checkbox', label: "Checkbox", iconProps:            { icon: "CircleOkay", placement: 'left' }, selected: true },
            { value: 'error', label: "Error", iconProps:                  { icon: "CircleError", placement: 'left' }},
            { value: 'plus', label: "Plus", iconProps:                    { icon: "Plus", placement: 'left' }},
          ]}
          onSelect={() => {}}

          // Tooltip params
          tooltipContent={{ text: 'Tooltip text... '}} tooltipContext={tooltipContext}
        /> 
      </HashLink>
    </div>


    {/* radioTable */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Forms/RadioTable' styles='doc-quicklink'>
        <h4 className='pb-2'>RadioTable Component</h4>
        <RadioTable
          variant="block" name="quicklink-radioTable"
          label="Block Style"
          description="The description of the radio table."

          radioItems={radioTableItems}
          // currentValue={radioItems[1]}
          onSelect={() => {}}
        />
      </HashLink>
    </div>

    {/* radio */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Forms/Radio' styles='doc-quicklink'>
        <h4 className='pb-2'>Radio Component</h4>
        <RadioGroup
          variant="list" name="quicklink-radioGroup"
          label="List Style"
          description="The description of the radio group."

          radioItems={radioItems}
          // currentValue={radioItems[3]}
          onSelect={() => {}}
        />
      </HashLink>
    </div>


    {/* dropbox */}
    <div className='span-12 lg:span-6 col'>
      <HashLink url='/Documentation/Forms/Dropbox' styles='doc-quicklink'>
        <h4 className='pb-2'>Dropbox Component</h4>
        <Dropbox 
          label="Upload files" name="quicklink-fileUpload"
          description='The description of the dropbox.'
          
          value={null} handleFiles={() => {}}
          multiple accept='image/*, .pdf, .doc, .docx, .txt'
        />
      </HashLink>
    </div>

    {/* slider */}
    <div className='span-6 lg:span-3 col'>
      <HashLink url='/Documentation/Forms/Slider' styles='doc-quicklink'>
        <h4 className='pb-2'>Slider Component</h4>
        
        <Slider 
          label="Slider Component" name="quicklink-slider"
          description="The description of the slider."
          value="true" 
          onChange={() => {}}
        />
      </HashLink>
    </div>

    {/* button */}
    <div className='span-6 lg:span-3 col'>
      <HashLink url='/Documentation/Forms/Button' styles='doc-quicklink'>
        <h4 className='pb-2'>Button Component</h4>
        <div className='col gap-2'>
          <p>The description for this button</p>
          <div className=''>
            <Button displayText="Click Me" color='primary' size='md' />
          </div>
        </div>
      </HashLink>
    </div>
  </>
  );
}


const ContentQuickLinks = ({ links }: DocsIntroductionProps) => {

  return (<>
    { links != 'all' ? 
      <h2 id='content-quicklinks' className='span-12 pt-4'>Content Links</h2>
    :
      <h3 id='content-quicklinks' className='span-12 pt-20'>Content Components</h3>
    }
    
    <p className='span-12 pb-4 text-lg lg:text-xl'>
      Random Content functions to go along with the theme and find new ways to make 
      ease of access customizable components for the developers to use.
    </p>

    {/* alert */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Content/Alert' styles='doc-quicklink'>
        <h4 className='pb-2'>Alert Component</h4>
        <Alert type='question'>
          An example notification's description.
        </Alert>
        <Alert type='info'>
          An example notification's description.
        </Alert>
        <Alert type='warning'>
          An example notification's description.
        </Alert>
        <Alert type='error'>
          An example notification's description.
        </Alert>
        <Alert type='ok'>
          An example notification's description.
        </Alert>
      </HashLink>
    </div>

    {/* card */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Content/Card' styles='doc-quicklink'>
        <h4 className='pb-2'>Card Component</h4>

        <Card
          type='card-button' 
          title='Card Button Layout'
          description='The description of a card button element'
          additStyles='span-12 lg:span-6 p-4'
          buttonProps={{displayText: 'Create', onClick: () => {}}}
          hoverTheme focusTheme
        >
          <div>Card button content</div>
        </Card>
        
        <Card
          type='card-link' 
          title='Card Link Layout'
          description='The description of a card link element'
          additStyles='span-12 lg:span-6 p-4' noBackground
          linkText='Card link' onClickLink={() => {}}
          hoverTheme
        >
          <div>Card link content</div>
        </Card>

        <Card type='default' additStyles='span-12 lg:span-4 p-4' hoverTheme>
          Default layout
        </Card>
      </HashLink>
    </div>

    {/* icon */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Content/Icon' styles='doc-quicklink'>
        <h4 className='pb-2'>Card Component</h4>

        <div className='span-12 lg:span-8 rowStart gap-4 p-8 flex-wrap'>
            { conglomerateIcons.map((variant: IconTypes) => 
              <DisplayedIcon 
                variant={variant} styles='[&_svg]:size-[1.9rem]'
                key={`doc_intro_icon_${variant}`}
              />
            )}
        </div>
      </HashLink>
    </div>

    {/* dropdown */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Content/Dropdown' styles='doc-quicklink'>
        <Dropdown label='Dropdown Component' openByDefault labelStyles='text-xl font-semibold header-colors'>
          <div className='p-4 col gap-4'>
            <Card
              title='Dropdown Content' type='card' 
              description='The description of a card style element'
              additStyles='span-12 lg:span-4 p-4' 
              hoverTheme
            >
              <div>Dropdown content description</div>
              <div>Dropdown content description</div>
            </Card>
            <Card
              title='Dropdown Content' type='card' 
              description='The description of a card style element'
              additStyles='span-12 lg:span-4 p-4' 
              hoverTheme
            >
              <div>Dropdown content description</div>
              <div>Dropdown content description</div>
            </Card>
          </div>
        </Dropdown>
      </HashLink>
    </div>

  </>
  );
}


const UtilsQuickLinks = ({ links }: DocsIntroductionProps) => {
  const { show, hide } = useContext(TooltipService);

  return (<>
    { links != 'all' ? 
      <h2 id='utils-quicklinks' className='span-12 pt-4'>Utils Links</h2>
    :
      <h3 id='utils-quicklinks' className='span-12 pt-20'>Utils Components</h3>
    }
    
    <p className='span-12 pb-4 text-lg lg:text-xl'>
      Utility functions that are useful for various scenarios that help leverage other libraries,
      help with performance and efficiency, and are in general convenient to use.
    </p>

    {/* modal */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Utils/Modal' styles='doc-quicklink'>
        <h4 className='pb-2'>Modal Component</h4>
        <div className='row justify-center items-center px-6 py-4'>
          <div className='w-full modal-alignment'>
            <div className='w-full modal-container opacity-100'>
              <div className='modal-header-c'>
                <label className='modal-header'> Pseudo Modal </label>
                <div> <Icon variant='Close' styles='modal-icon' /> </div>
              </div>

              {/* User Content */}
              <div className='px-4 py-14 pb-20 row justify-center items-center'>
                <div>
                  <Button 
                    displayText='Check it out here'
                    color='primary'
                    size='md'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </HashLink>
    </div>

    {/* tooltip */}
    <div 
      className='span-12 lg:span-6 col *:flex-1' 
      onMouseEnter={() => show({ text: 'Tooltip text...' })} 
      onMouseLeave={() => hide()}
    >
      <HashLink url='/Documentation/Utils/Tooltip' styles='doc-quicklink'>
        <h4 className='pb-2'>Tooltip Component</h4>
        
        <div className='p-4 py-20 row justify-center items-center'>
          <div className="p-4 bg-default outline-css outline-styles row justify-between items-center gap-2">
            <p>Hover over the icon for a code tooltip for this element.</p>
            <Icon variant="OutlineInfo" styles="icon-theme theme-fa size-6" />
          </div>
        </div>
      </HashLink>
    </div>

    {/* hashLink */}
    <div className='span-12 lg:span-6 col *:flex-1'>
      <HashLink url='/Documentation/Utils/HashLink' styles='doc-quicklink'>
        <h4 className='pb-2'>HashLink Component</h4>
        
        <div className='p-4 pb-8 row justify-center items-center'>
          <p className='link-text py-1.5 px-2.5 link-text text-lg underline'>
            Click me 
          </p>
        </div>
      </HashLink>
    </div>

  </>);
}


// Example RadioItems
const radioItems: RadioItem[] = ["A", "B", "C", "D"].map((val, i) => {
  return {
    value: `value${val}`,
    label: `Option ${val}`,
    description: `The description of option ${val}.`,
    disabled: false,
    selected: i == 3
  };
});

const radioTableItems: RadioItem[] = ["A", "B", "C", "D"].map((val, i) => {
  return {
    value: `value${val}`,
    label: `Option ${val}`,
    description: `The description of option ${val}.`,
    disabled: false,
    selected: i == 1
  };
});

// Rendered Icons
import SourceIconSnippets from '@lib-rc/Common/Icons/Icon?raw';
import { DisplayedIcon } from '../Content/Icon/Docs_Icon';
import { Dropdown } from '../../../../Components/Content/Dropdown/Dropdown';
const defaultIcons = getValuesFromType<IconTypes>(SourceIconSnippets, 'DefaultIconTypes') || [];
const alertIcons = getValuesFromType<IconTypes>(SourceIconSnippets, 'AlertIconTypes') || [];
const mediaIcons = getValuesFromType<IconTypes>(SourceIconSnippets, 'MediaIconTypes') || [];
const conglomerateIcons = [...defaultIcons, ...alertIcons, ...mediaIcons];
