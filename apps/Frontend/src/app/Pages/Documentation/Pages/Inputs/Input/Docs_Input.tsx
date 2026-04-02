import { ChangeEvent, Dispatch, FocusEvent, MouseEvent, SetStateAction, Suspense, useId, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Input, TextInputTypes } from '@Project/ReactComponents';
import { SubPageLinkProps } from '../../../../../Components/Sidebar/Sidebar';
import { ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { CodeBlock } from '../../../Documentation';

import styles from './Docs_Input.module.scss';
import styled from '@emotion/styled';
import { ElementState, ElementStateTypes } from '../../../Components/ShowcaseElement/ElementStates/ElementState';
import { ParamItem, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { ParamType } from '../../../Components/ParamType/ParamType';


export const Docs_Input = () => {
  const [text, setText] = useState<string>('');
  const [textError, setTextError] = useState<string>('');
  const [textDisabled, setTextDisabled] = useState<boolean>(false);
  
  const [number, setNumber] = useState<string>('0');
  const [numberError, setNumberError] = useState<string>('');
  const [numberDisabled, setNumberDisabled] = useState<boolean>(false);
  
  const [email, setEmail] = useState<string>('example@email.com');
  const [emailError, setEmailError] = useState<string>('');
  const [emailDisabled, setEmailDisabled] = useState<boolean>(false);
  
  const [password, setPassword] = useState<string>('password');
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordDisabled, setPasswordDisabled] = useState<boolean>(false);
  
  const [search, setSearch] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  const [searchDisabled, setSearchDisabled] = useState<boolean>(false);
  
  const [phone, setPhone] = useState<string>('(012)-345-6789');
  const [phoneError, setPhoneError] = useState<string>('');
  const [phoneDisabled, setPhoneDisabled] = useState<boolean>(false);
  
  const [policy, setPolicy] = useState<string>('');
  const [policyError, setPolicyError] = useState<string>('');
  const [policyDisabled, setPolicyDisabled] = useState<boolean>(false);
  
  const [credit, setCredit] = useState<string>('0000-0000-0000-0000');
  const [creditError, setCreditError] = useState<string>('');
  const [creditDisabled, setCreditDisabled] = useState<boolean>(false);
  
  const [currency, setCurrency] = useState<string>('0.00');
  const [currencyError, setCurrencyError] = useState<string>('');
  const [currencyDisabled, setCurrencyDisabled] = useState<boolean>(false);

  const universalProps = {
    styles: "p-4 pt-6 pb-2 span-12 lg:span-8",
    stateStyles: "p-4 span-12 lg:span-8 rowStart gap-2",
    tooltip: true,
    tooltipText: "Tooltip text...",
  };1

  return (
    <Container className='spacing'>
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
      </div>

      {/* Showcase Element */}
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="text"
            label="Text Input"
            description="The text input's description."
            value={text}
            setValue={setText}
            placeholder="Type something..."

            error={textError}
            setError={setTextError}
            disabled={textDisabled}
            setDisabled={setTextDisabled}
            elementStateTypes={[]}
            { ...universalProps }
          />
        </ShowcaseElement>
      </div>
      
      <h3 className="span-12 py-2 pt-8">
        Input Parameters
      </h3>
      <div className='span-12 py-2'>
        <ParamTable params={ParamTableArgs_Input} />
      </div>




      {/* Variants */}
      <h3 className="span-12 py-2 pt-8">
        Variants
      </h3>


      <h4 className='span-12 py-2 pt-8 label-colors'>
        Add a Number Input with Increment/Decrement
      </h4>

      <h4 className='span-12 py-2 pt-8 label-colors'>
        Email Input
      </h4>
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="email"
            label="Email Input"
            description="The email input's description."
            value={email}
            setValue={setEmail}
            placeholder="Type something..."

            error={emailError}
            setError={setEmailError}
            disabled={emailDisabled}
            setDisabled={setEmailDisabled}
            elementStateTypes={[]}
            { ...universalProps }
          />
        </ShowcaseElement>
      </div>
      
      <h4 className='span-12 py-2 pt-8 label-colors'>
        Password Input
      </h4>
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="password"
            label="Password Input"
            description="The password input's description."
            value={password}
            setValue={setPassword}
            placeholder="Type something..."

            error={passwordError}
            setError={setPasswordError}
            disabled={passwordDisabled}
            setDisabled={setPasswordDisabled}
            elementStateTypes={[]}
            { ...universalProps }
          />
        </ShowcaseElement>
      </div>
      
      <h4 className='span-12 py-2 pt-8 label-colors'>
        Search Input
      </h4>
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="search"
            label="Search Input"
            description="The search's description."
            value={search}
            setValue={setSearch}
            placeholder="Type something..."

            error={searchError}
            setError={setSearchError}
            disabled={searchDisabled}
            setDisabled={setSearchDisabled}
            elementStateTypes={[]}
            { ...universalProps }
          />
        </ShowcaseElement>
      </div>
      
      <h4 className='span-12 py-2 pt-8 label-colors'>
        Policy Number Input
      </h4>
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="policyNumber"
            label="Policy Number Input"
            description="The policy number input's description."
            value={policy}
            setValue={setPolicy}
            placeholder="Do something..."

            error={policyError}
            setError={setPolicyError}
            disabled={policyDisabled}
            setDisabled={setPolicyDisabled}
            elementStateTypes={[]}
            { ...universalProps }
          />
        </ShowcaseElement>
      </div>
      
      <h4 className='span-12 py-2 pt-8 label-colors'>
        Phone Input
      </h4>
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="phone"
            label="Phone Input"
            description="The phone input's description."
            value={phone}
            setValue={setPhone}
            placeholder="Type something..."

            error={phoneError}
            setError={setPhoneError}
            disabled={phoneDisabled}
            setDisabled={setPhoneDisabled}
            elementStateTypes={[]}
            { ...universalProps }
          />
        </ShowcaseElement>
      </div>
      
      <h4 className='span-12 py-2 pt-8 label-colors'>
        Credit Card Input
      </h4>
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="creditCard"
            label="Credit Card Input"
            description="The credit card input's description."
            value={credit}
            setValue={setCredit}
            placeholder="Type something..."

            error={creditError}
            setError={setCreditError}
            disabled={creditDisabled}
            setDisabled={setCreditDisabled}
            elementStateTypes={[]}
            { ...universalProps }
          />
        </ShowcaseElement>
      </div>
      
      <h4 className='span-12 py-2 pt-8 label-colors'>
        Currency Input
      </h4>
      <div className='span-12 py-2'>
        <ShowcaseElement jsx={JsxExample_Input()} styles="spacing gap-0">
          <ShowcaseExample_Input
            type="currency"
            label="Currency Input"
            description="The currency input's description."
            value={currency}
            setValue={setCurrency}
            placeholder="Type something..."

            error={currencyError}
            setError={setCurrencyError}
            disabled={currencyDisabled}
            setDisabled={setCurrencyDisabled}
            elementStateTypes={[]}
            { ...universalProps }
          />
        </ShowcaseElement>
      </div>
      


    </Container>
  );
}


// The rendered component
interface ShowcaseInputProps {
  type: TextInputTypes;
  label: string;
  description: string;
  value: string;
  placeholder: string;

  setValue: Dispatch<SetStateAction<string>>;
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
  type, label, description, value, placeholder,
  setValue, error, setError, disabled, setDisabled,
  elementStateTypes, tooltip, tooltipText = 'Tooltip',
  styles, stateStyles
}: ShowcaseInputProps) => {
  const id = useId();
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
          type={type} 
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
          <ElementState type={type} isSelected={isSelected} onClick={() => onSelectState(type)} key={`${label}-${id}-element-state-${type}`} />
        )}
      </div>
    </>
  )
}


// Rendered code
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


// Input components rendered args
const ParamTableArgs_Input: (ParamItem | 'spacing')[] = [
  { name: 'name', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The name of the input. Acts as a key for form data during submissions.
    </div>
  },
  { name: 'label', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The label of the input. 
    </div>
  },
  { name: 'description', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The description for this input element.
    </div>
  },
  { name: 'value', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The value of the input. Use your own state management for handling editing this value.
    </div>
  },
  { name: 'placeholder', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The input element's placeholder text. Rendered when the input is empty.
    </div>
  },
  { name: 'id', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The id of the native input element. 
    </div>
  },
  'spacing',
  
  { name: 'error', 
    type: <ParamType type='boolean' />,
    description:  
    <div className='param-item-desc-text'>
      Whether there's validation errors for this input.
    </div>
  },
  { name: 'errorMessage', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The validation error message for this input.
    </div>
  },
  { name: 'disabled', 
    type: <ParamType type='boolean' />,
    description:  
    <div className='param-item-desc-text'>
      Whether the input is disabled.
    </div>
  },
  { name: 'required', 
    type: <ParamType type='boolean' />,
    description:  
    <div className='param-item-desc-text'>
      Is this input required during submission?
    </div>
  },
  'spacing',
  
  { name: 'tooltip', 
    type: <ParamType type='boolean' />,
    description:  
    <div className='param-item-desc-text'>
      Should this component have a tooltip?
    </div>
  },
  { name: 'tooltipText', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The tooltip text.
    </div>
  },
  
  { name: 'autocomplete', 
    type: <ParamType type='TextInputAutoCompleteTypes' />,
    description:  
    <div className='param-item-desc-text'>
      The autocomplete text for this input.
    </div>
  },
];


// Styled Components
const Container = styled.div``;


//--------------------------//
// HashLinks                //
//--------------------------//
export const DocsPageHashLinks_Input: SubPageLinkProps[] = [

];
