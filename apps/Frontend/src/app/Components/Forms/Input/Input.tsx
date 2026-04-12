import { Dispatch, MouseEvent, RefObject, SetStateAction, useId, useRef, useState } from 'react';
import { InputMask, useMask } from '@react-input/mask';

import styles from './Input.module.scss';
import styled from '@emotion/styled';
import { UniversalEventHandlers, Icon, Button } from '@Project/ReactComponents';


export type TextInputTypes = 'text' | 'number' | 'email' | 'password' | 'search' | 'policyNumber' | 'phone' | 'creditCard' | 'currency';
export type TextInputAutoCompleteTypes = "email"  | "tel" | "name"  | "password"  | "family-name" | "given-name" | "country-name" | "postal-code" | "street-address" | "address-level1" | "address-level2";

export interface InputProps {
  type?: TextInputTypes
  
  name: string;
  label: string;
  description?: string;
  value: string;
  setValue?: Dispatch<SetStateAction<string>>;
  placeholder?: string;

  error?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
  tooltip?: boolean;
  tooltipText?: string;

  autocomplete?: TextInputAutoCompleteTypes;

  // variant specific configurations
  opts?: InputVariantOpts;
}

export const Input = ({
  type = 'text', name, label, description, value, setValue, placeholder,
  error = false, errorMessage, required = false, disabled = false, tooltip = false, tooltipText,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  autocomplete, opts = DefaultInputVariantOpts, ...props
}: InputProps & UniversalEventHandlers) => {
  const id = useId();
  const emailRegexValidation = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`; // TODO: Removed for variation, implement react-hook-forms
  const loadBarRandDelay = Math.floor(Math.random() * (100 - 25 + 1)) + 25; // TODO: visual test, not necessary. This might mess with seeing loading with actual load times

  const getMaskRef = (type: TextInputTypes): RefObject<HTMLInputElement> | undefined => {
    // if (type == 'phone') return phoneMaskRef;
    return undefined;
  }

  // Password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Tooltip logic
  const [tooltipActive, setTooltipActive] = useState<boolean>(false);
  const tooltipCoordinates = useRef<{ x: number, y: number}>({ x: 0, y: 0 });

  const getType = (): TextInputTypes => {
    if (type == 'number' || type == 'currency') return 'number';
    if (type == 'password') return showPassword ? 'text' : 'password';
    return 'text';
  }

  // Error handling
  const getError = (): boolean => (error && !disabled);


  return (
    <TextInput className='input'>
      <Label htmlFor={type} className="input-label"> 
        { label } 
      </Label>

      <InputContainer className="input-container group">
        <input 
          type={getType()}
          name={name} id={id}
          // ref={getMaskRef(type)} // TODO: add optional input masking
          value={value}
          placeholder={placeholder}
          autoComplete={autocomplete}

          onChange={(e) => onChange ? onChange(e) : null}
          onBlur={(e) => onBlur ? onBlur(e) : null}
          onFocus={(e) => onFocus ? onFocus(e) : null}
          onClick={(e) => onClick ? onClick(e) : null}
          onMouseEnter={(e) => onMouseEnter ? onMouseEnter(e) : null}
          onMouseLeave={(e) => onMouseLeave ? onMouseLeave(e) : null}

          required={required} disabled={disabled}
          className={`input-base peer
            ${!(type == 'search' || type == 'text' || type == 'currency' || type == 'number') ? 'input-icon-spacing' : ''}
            ${getError() ? 'input-error' : ''}
          `}
          { ...props }
        />

        {/* Variant specific elements before and after the input element */}
        <PrecedingElements 
          type={type}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          opts={opts}
        />

        <SubsequentElements
          type={type} name={name}
          setValue={setValue} error={getError()} disabled={disabled}
          tooltip={tooltip} tooltipCoords={tooltipCoordinates}
          tooltipActive={tooltipActive} setTooltipActive={setTooltipActive}
        />
        
        <LoadingBar className='input-loading-bar-cont'>
          <div 
            className={`input-loading-bar ${false ? 'animate-loading-bar opacity-75' : 'opacity-0'} `}
            style={{ animationDelay: `${loadBarRandDelay}ms` }}
          />
        </LoadingBar>
      </InputContainer>

      {/* Error / Description messages */}
      <ErrorAndDescription className='mt-2 ml-1'>
        { getError() && errorMessage ? 
          <p className="error-text"> { errorMessage } </p> 
        : description && 
          <p className=""> { description } </p> 
        }
      </ErrorAndDescription>

      {/* Tooltip Text */}
      <Tooltip 
        style={{ transform: `translate(${tooltipCoordinates.current.x + 8}px, ${tooltipCoordinates.current.y + 12}px)`}}
        className={`input-tooltip ${tooltipCoordinates} ${tooltipActive ? 'input-tooltip-v' : 'input-tooltip-h'}`}
      >
        {tooltipText ? tooltipText : 'Tooltip text...'}
      </Tooltip>

    </TextInput>
  );
}



//------------------------------------------//
// Preceding Variant Elements               //
//------------------------------------------//
interface PrecedingElProps {
  type: TextInputTypes;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  opts: InputVariantOpts;
}
export const PrecedingElements: React.FC<PrecedingElProps> = ({ type, showPassword, setShowPassword, opts }) => {
  const toggleShowPassword = (visible: boolean) => setShowPassword(visible);
  const VariantIcon: React.FC<InputVariantOpts> | undefined = PrecedingIcons[type] || undefined;
  
  return (
    <div className="input-preceding-el-c">
      <div className='input-preceding-el'>
        {VariantIcon && <VariantIcon {...opts} />}

        { type == 'password' && 
          <div onClick={() => toggleShowPassword(!showPassword)} className='input-password-vis'>
            { showPassword  &&  <Icon variant='EyeSlash' styles='input-icon-def' /> }
            { !showPassword &&  <Icon variant='Eye' styles='input-icon-def' /> }
          </div>
        }
      </div>
    </div>
  );
}

const PrecedingIcons: Partial<Record<TextInputTypes, React.FC<InputVariantOpts>>> = {
  'email': (opts) => opts.showEmailIcon 
  ? <Icon variant='Envelope'    styles='input-icon-def' /> : undefined,

  'policyNumber': (opts) => opts.showPolicyNumberIcon 
  ? <Icon variant='Profile'     styles='input-icon-def' /> : undefined,

  'phone': (opts) => opts.showPhoneIcon 
  ? <Icon variant='Phone'       styles='input-icon-def' /> : undefined,

  'creditCard': (opts) => opts.showCreditCardIcon 
  ? <Icon variant='CreditCard'  styles='input-icon-def' /> : undefined,
};


//------------------------------------------//
// Subsequent Variant Elements              //
//------------------------------------------//
interface SubsequentElProps {
  name: string;
  type: TextInputTypes;
  disabled: boolean;
  error: boolean;
  setValue?: Dispatch<SetStateAction<string>>;

  tooltip?: boolean;
  tooltipCoords: RefObject<{ x: number, y: number }>;
  tooltipActive: boolean;
  setTooltipActive: Dispatch<SetStateAction<boolean>>;
}
export const SubsequentElements: React.FC<SubsequentElProps> = ({
  name, type, disabled, error, setValue, 
  tooltip, tooltipCoords, setTooltipActive 
}) => {
  const tooltipMouseEnter = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    // console.log('mouse enter tooltip', {Event: e});
    setTooltipActive(true);
  }
  
  const tooltipMouseLeave = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    // console.log('mouse leave tooltip', {Event: e});
    setTooltipActive(false);
  }

  const toolTipHover = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>): void => {
    const coordinates = { x: e.clientX, y: e.clientY };
    tooltipCoords.current = coordinates;
    // console.log(`mouseCoordinates: `, tooltipCoordinates.current); //  {x: coordinates.x, y: coordinates.y });
  }

  const incrementValue = (add: boolean) => {
    if (!setValue) return;

    setValue(prevValue => {
      const num = Number(prevValue); 
      const isNumber = prevValue.trim() !== '' && Number.isFinite(num);
      if (isNumber) return add ? `${num + 1}` : `${num - 1}`;
      return prevValue;
    })
  }
  
  return (
    <SubsequentInputElements className="input-subsequent-el-c">
      <div className="input-subsequent-el">
        {/* Error / Tooltip icon */}
        { error ?
          <Icon variant='Error' styles='mr-3 size-4 error-text' /> 
        : 
          <TooltipIcon 
            onMouseEnter={e => tooltip && tooltipMouseEnter(e)} 
            onMouseOver={e =>  tooltip && toolTipHover(e)} 
            onMouseLeave={e => tooltip && tooltipMouseLeave(e)} 
            className=""
          >
            <Icon variant='InfoBox' styles='mr-3 size-4 cursor-pointer' /> 
          </TooltipIcon>
        }

        {/* Increment buttons */}
        { type == 'number' && 
          <div className={`increment-btns ${!disabled && !error ? 'increment-btns-states' : error ? 'input-btns-error' : ''}`}>
            <Button 
              onClick={() => incrementValue(true)}
              icon='ChevronUp' iconStyles='input-inc-i' disabled={disabled} 
              color='gray' additionalStyles='inc-btn-base input-inc-btn-t' 
            />
            <Button 
              onClick={() => incrementValue(false)}
              icon='ChevronDown' iconStyles='input-inc-i' disabled={disabled} 
              color='gray' additionalStyles='inc-btn-base input-inc-btn-b' 
            />
          </div>
        }

        {/* Currency Dropdown */}
        { type == 'currency' && 
          <CurrencySelectContainer className='row relative'>
            <Icon variant='DropdownArrow' styles='input-curr-i' />
            <CurrencySelect 
              name={`${name}-currencyType`} disabled={disabled}
              className={`input-curr ${error ? 'input-curr-error' : ''}`}
            >
              <option value="USD">USD</option> 
              <option value="CAD">CAD</option> 
              <option value="EUR">EUR</option>
              <option value="YEN">YEN</option>
            </CurrencySelect>
          </CurrencySelectContainer>
        }

        {/* Search Sort Button */}
        { type == 'search' &&
          <SortSearchButton 
            type="button" disabled={disabled} 
            className={`input-sort-btn ${error ? 'input-sort-error' : ''}`}
          >
            <Icon variant='Sort' styles='input-sort-i' />
            Sort
          </SortSearchButton>
        }

      </div>
    </SubsequentInputElements>
  );
}


// Component Styles
const TextInput = styled.div``;
const InputContainer = styled.div``;

const SubsequentInputElements = styled.div``;
const Label = styled.label``;
const ErrorAndDescription = styled.div``;

const LoadingBar = styled.div``;
const SortSearchButton = styled.button``;
const CurrencySelectContainer = styled.div``;
const CurrencySelect = styled.select`pointer-events: all;`; // TODO: remove these, they should be done through css themes

// TODO: try making an element at the app level that we key into with params for performance and less overhead
// With nested documentation and code specific elements passed into the tooltip
const Tooltip = styled.div``;
const TooltipIcon = styled.div`pointer-events: all;`;


// TODO: update the docs input examples to include these variant options
export interface InputVariantOpts {
    /* Number  */
    incrementButtons: boolean;
    
    /* Email */
    showEmailIcon: boolean;

    /* Password */
    visibilityIcon: boolean;

    /* Search */
    sortButton: boolean;
    sortType: boolean;
    
    /* Policy Number */
    showPolicyNumberIcon: boolean;
    policyNumberMask: boolean;

    /* Phone Number */
    showPhoneIcon: boolean;
    phoneNumberMask: boolean;

    /* Credit Card */
    showCreditCardIcon: boolean;
    creditCarkMask: boolean;

    /* Currency */
    showMoneySign: boolean;
    currencyTypeDropdown: boolean;
}

const DefaultInputVariantOpts: InputVariantOpts = {
    incrementButtons: true,
    showEmailIcon: true,
    visibilityIcon: true,
    sortButton: true,
    sortType: true,
    showPolicyNumberIcon: true,
    policyNumberMask: true,
    showPhoneIcon: true,
    phoneNumberMask: true,
    showCreditCardIcon: true,
    creditCarkMask: true,
    showMoneySign: true,
    currencyTypeDropdown: true,
}

// #region Input Type Props
type InputPropsPartial = Partial<InputProps> & { type: TextInputTypes } & any;
export const InputProps_Text: InputPropsPartial = {
  type: 'text',
  name: 'text',
}

export const InputProps_Email: InputPropsPartial = {
  type: 'email',
  name: 'email',
  label: 'Email',
  description: 'What is your email address?',
  placeholder: 'yourname@email.com',
  tooltip: true,
  tooltipText: 'The email used to create your account.',
  autocomplete: 'email',
}

export const InputProps_Password: InputPropsPartial = {
  type: 'password',
  name: 'password',
  label: 'Password',
  description: 'Create your password.',
  tooltip: true,
  tooltipText: 'The used for your account.',
  autocomplete: 'password',
}

export const InputProps_Phone: InputPropsPartial = {
  type: 'phone',
  name: 'phone',
  label: 'Phone',
  description: 'What is your phone number?',
  tooltip: true,
  tooltipText: 'Your phone number, including the area code. ex: (000)-000-0000',
  autocomplete: 'tel',
}
// #endregion

/* Input masks
  const rawMaskValue = value.replace(/\D/g, ''); // To retrieve raw mask values
  let phoneMaskRef: RefObject<HTMLInputElement> = useMask({
    mask: '(___) ___-____', // '+0 (___) ___-____'
    replacement: { _: /\d/ },
  });

  let creditCardMaskRef: RefObject<HTMLInputElement> = useMask({
    mask: '____ ____ ____ ____',
    replacement: { _: /\d/ },
  });

  let policyNumberMaskRef: RefObject<HTMLInputElement> = useMask({
    mask: '_________',
    replacement: { _: /\d/ },
  });
*/

/* Placeholder ideas
  // placeholder logic
  if (type == 'currency') {
    const currencyType = '$';
    if (placeholder == '') placeholder = `${currencyType} 0.00`;
  }

  else if (type == 'policyNumber') {
    if (placeholder == '') {
      // if (isAutoPolicy) placeholder = '000000000';
      // if (isHomePolicy) placeholder = 'B000A000A000A';
      placeholder = '000000000';
    }
  } 
*/
