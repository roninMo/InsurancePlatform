import { ChangeEvent, FocusEvent, MouseEvent, Suspense, useId, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Input } from '@Project/ReactComponents';
import { SubPageLinkProps } from '../../../../../Components/Sidebar/Sidebar';
import { ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { CodeBlock } from '../../../Documentation';

import styles from './Docs_Input.module.scss';
import styled from '@emotion/styled';


export const Docs_Input = () => {
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
        <ShowcaseElement jsx={JsxExample_Input()}>
          <ShowcaseExample_Input />
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

const ShowcaseExample_Input = () => {
  const id = useId();
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const label = 'Text Input';
  const description = 'The description of this element';
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div className='p-4 pt-6 pb-8 spacing *:span-12 *:lg:span-8'>
      <Input 
        type="text" 
        id={id} 
  
        name="ExampleInput"
        label={label} 
        value={value} 
        // ref={getMaskRef(type)}
        placeholder="Input Text..."
  
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
    </div>
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
