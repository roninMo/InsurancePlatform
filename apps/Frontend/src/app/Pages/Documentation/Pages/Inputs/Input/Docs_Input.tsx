import { ChangeEvent, Dispatch, FocusEvent, MouseEvent, SetStateAction, Suspense, useId, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Input, TextInputTypes } from '@Project/ReactComponents';
import { SubPageLinkProps } from '../../../../../Components/Sidebar/Sidebar';
import { ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { CodeBlock } from '../../../Documentation';

import styles from './Docs_Input.module.scss';
import styled from '@emotion/styled';
import { ElementState, ElementStateTypes } from '../../../Components/ShowcaseElement/ElementStates/ElementState';


export const Docs_Input = () => {
  const [textError, setTextError] = useState<string>('');
  const [textDisabled, setTextDisabled] = useState<boolean>(false);

  return (
    <Container className='spacing showcase-element-container'>
      <h3 className="span-12 py-2">
        Input Component
      </h3>

      <div className='span-12'>
        <p className='py-2 showcase-text'>The input component is a custom input component with loads of functionality and customization 
          to fit your needs for the varying form types. It comes with tooltips, 
          loading bars for server side autosaving, event hooks, error handling, and input masking. 
          Each type has varying icons and functionality so you know whether the input is for 
          text, email, phone, policy number, credit, currency, or search.
        </p>
        
        <p className='py-2 showcase-text'>
          Add bubbles for displaying the different rendered states of the element (default, error, disabled) to the showcase element 
        </p>
      </div>

      {/* Showcase Element */}
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="text"
            label="Text Input"
            description="The text input's description."
            placeholder="Type something..."

            error={textError}
            setError={setTextError}
            disabled={textDisabled}
            setDisabled={setTextDisabled}
            elementStateTypes={[]}

            styles="p-4 pt-6 pb-2 span-12 lg:span-8"
            stateStyles="p-4 span-12 lg:span-8 rowStart gap-2"
            tooltip
            tooltipText="Tooltip text..."
          />
        </ShowcaseElement>
      </div>

      <div className='span-12 py-2'>
        <p className='py-2 showcase-text'>
          Params table
        </p>
      </div>
      <div className='span-12 py-2'>
        Email Input
      </div>
      
      <div className='span-12 py-2'>
        Password Input
      </div>
      
      <div className='span-12 py-2'>
        Phone Input
      </div>
      
      <div className='span-12 py-2'>
        Add a Number Input with Increment/Decrement
      </div>
      
      <div className='span-12 py-2'>
        Credit Card Input
      </div>
      
      <div className='span-12 py-2'>
        Currency Input
      </div>
      
      <div className='span-12 py-2'>
        Policy Number Input
      </div>
      
      <div className='span-12 py-2'>
        Search Input
      </div>


    </Container>
  );
}


interface ShowcaseInputProps {
  type: TextInputTypes;
  label: string;
  description: string;
  placeholder: string;

  error: string;
  setError: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  elementStateTypes?: ElementStateTypes[];

  styles: string;
  stateStyles: string;
  tooltip?: boolean;
  tooltipText?: string;
}

const ShowcaseExample_Input = ({
  type, label, description, placeholder,
  error, setError, disabled, setDisabled,
  elementStateTypes, tooltip, tooltipText = 'Tooltip',
  styles, stateStyles
}: ShowcaseInputProps) => {
  const id = useId();
  const [value, setValue] = useState<string>('');
  const [elementStates, setElementStates] = useState<Record<ElementStateTypes, boolean>>({
    'default': false, 'error': false, 'disabled': false,
    ...elementStateTypes?.map((stateType: ElementStateTypes) => ({[stateType]: false}))
  });


  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  const onSelectState = (type: ElementStateTypes | string) => {
    const nextTypeValue = !elementStates?.[type as ElementStateTypes] || false;
    const clearedState: any = Object.fromEntries(Object.entries(elementStates)
      ?.map(([type, isSelected]) => [type, false]));

    setElementStates((prevState: Record<ElementStateTypes, boolean>) => {
      const nextState = clearedState;
      nextState[type as ElementStateTypes] = nextTypeValue;
      return nextState;
    });

    // Change input state
    if (type == 'default') {
      if (error) setError('');
      if (disabled) setDisabled(false);
    }
    
    else if (type == 'error') {
      if (!error) setError('An error occurred.');
      if (disabled) setDisabled(false);
    } 
    
    else if (type == 'disabled') {
      if (error) setError('');
      if (!disabled) setDisabled(true);
    }
  }


  return (
    <>
      <div className={styles}>
        <Input 
          type="text" 
          id={id} 

          name={`${type}-input-${id}`}
          label={label} 
          value={value} 
          // ref={getMaskRef(type)}
          placeholder={placeholder}

          error={error ? true : undefined}
          errorMessage={error}
          disabled={disabled}

          onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
          onBlur={(e: FocusEvent<HTMLInputElement, Element>) => onValueUpdated(e)}
          onFocus={(e: FocusEvent<HTMLInputElement, Element>) => onValueUpdated(e)}

          description={description}
          tooltip={tooltip}
          tooltipText={tooltipText}
        />
      </div>
      <div className={stateStyles}>
        { Object.entries(elementStates)?.map(([type, isSelected]) => 
          <ElementState type={type} isSelected={isSelected} onClick={() => onSelectState(type)} />
        )}
      </div>
    </>
  )
}

const JsxExample_Input = () => 
`const InputExample = ({ label, description }: InputProps) => {
  const id = useId();
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);

  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <Input 
      type="text" 
      id={id} 

      name="ExampleInput"
      label={label} 
      value={value} 
      placeholder="Input Text..."
      // ref={getMaskRef(type)}

      error={error ? true : undefined}
      errorMessage={error}
      disabled={disabled}

      onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
      onBlur={(e: FocusEvent<HTMLInputElement, Element>) => onValueUpdated(e)}
      onFocus={(e: FocusEvent<HTMLInputElement, Element>) => onValueUpdated(e)}

      description={description}
      tooltip 
      tooltipText='tooltip text...'
    />
  );
}
`;


// Styled Components
const Container = styled.div``;


//--------------------------//
// HashLinks                //
//--------------------------//
export const DocsPageHashLinks_Input: SubPageLinkProps[] = [

];
