import { ChangeEvent, Dispatch, FocusEvent, FormEvent, memo, RefObject, SetStateAction, useEffect, useReducer, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';
import { InputMask, MaskOpts, TMaskClass } from '@Project/ReactComponents/Common/Utilities/InputMasks/InputMask';
import { AllVariantProps } from '../../Types/TypeHelpers';
import { TooltipContextActions } from '../../Common/Utilities/Tooltip/TooltipProvider/TooltipProvider';
import { TooltipContentProps } from '../../Common/Utilities/Tooltip/Tooltip';

import { CCMask, EmailFilter, PhoneMask, PolicyMask } from '@Project/ReactComponents/Common/Utilities/InputMasks/Masks';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';
import { Button } from '../Button/Button';
import { Icon } from '../../Common/Icons/Icon';

import styled from '@emotion/styled';
import styles from './Input.module.scss';


/** The input component's different variants. Each are specifically designed for certain input types, with additional styling for each */
export type TextInputTypes = 'text' | 'number' | 'email' | 'password' | 'search' 
                          |  'policyNumber' | 'phone' | 'creditCard' | 'currency';

/** The autocomplete types for certain input types. These help with autofill. */
export type TextInputAutoCompleteTypes = 
  | "name" | "given-name" | "family-name" | "email" | "password" | "tel" 
  | "street-address" | "address-level2"| "address-level1" | "postal-code" | "country-name";


// #region InputProps
/** The input component's props. Combined with {@link ConditionalVariantProps} for intellisense props that display contextually, to help remove clutter */
export type InputProps<TMaskOpts extends MaskOpts = MaskOpts> = ConditionalVariantProps & {
  // {} Form and display
  /** The variant of input we're using. Each has different functionality for each input type. */
  type?: TextInputTypes;
  
  /** The form name of the input. Rhf uses this in it's register functions. */
  name: string;
  
  /** The label of this input */
  label: string;
  
  /** The description of this input */
  description?: string;
  
  /** The placeholder of this input */
  placeholder?: string;
  
  // {} Handling State
  /** Whether you're using a mask. If you have a custom class for this, declare it in the **{@link Input|Input's}** template arguments. */
  mask?: TMaskOpts;
  
  /** Whether to use Rhf or custom state through the onChange event */
  disableHookForms?: boolean;
  
  /** Optional Event to update the event.currentTarget.value to pass to the  onChange event. If you're using an input mask, this edit is ignored entirely. */
  onUpdateValue?: (prevValue: string, event: FormEvent<HTMLInputElement>) => void;
  
  /** To handle custom logic, or handling state without **react-hook-forms**. */
  onTyped?: (e: ChangeEvent<HTMLInputElement>) => void;
  
	// {} Form/Validation
	/** The error message, if there is one. */
  error?: string;
	
	/** Whether this input is disabled. */
  disabled?: boolean;
	
	/** Whether this input is required. */
  required?: boolean;
  
	// {} misc	
	/** The context used to enable the tooltip @see TooltipProvider */
  tooltipContext?: TooltipContextActions;
		
	/** The content you'd like to display for the tooltip. Don't forget memoization to prevent rerenders. */
  tooltipContent?: TooltipContentProps;
	
	/** the specific autocompleteType you'd like to use. */
  autocomplete?: TextInputAutoCompleteTypes;
  
  // {} Variant Specific - ConditionalVariantProps
  // hideIncrementButtons?: boolean;
  // hideEmailIcon?: boolean;
  // disableEmailFilter?: boolean;
  // hideVisibilityIcon?: boolean;
  // sortButton?: boolean;
  // sortType?: SortType;
  // hidePolicyNumberIcon?: boolean;
  // disablePolicyMask?: RefObject<any>;
  // hidePhoneIcon?: boolean;
  // disablePhoneMask?: RefObject<any>;
  // hideCreditCardIcon?: boolean;
  // disableCCMask?: RefObject<any>;
  // hideMoneySign?: boolean;
  // hideCurrencyTypeOpts?: boolean;
}


// #endregion
// #region conditional variant props 
type NumberVariantProps = 
| { 
    /** An input that's oriented for using number specific values. */
    type?: 'number';
    /** Whether to disable the number input's incremental buttons.  */
    hideIncrementButtons?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'number'>; 
    /** @deprecated CANNOT use 'hideIncrementButtons' when 'type' isn't number. */
    hideIncrementButtons?: never; 
  };

type EmailVariantProps = 
| { 
    /** The variant specific for handling emails. Visually for emails; however, we opted to using rhf's validation for handling email. */
    type?: 'email';
    /** Whether to hide this variant's email icon.  */
    hideEmailIcon?: boolean;
    /** The email's character filter. Filters out non-valid characters for creating a username. */
    disableEmailFilter?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'email'>; 
    /** @deprecated CANNOT use 'hideEmailIcon' when 'type' isn't email. */
    hideEmailIcon?: never; 
    /** @deprecated CANNOT use 'disableEmailFilter' when 'type' isn't email. */
    disableEmailFilter?: never;
  };

type PasswordVariantProps = 
| { 
    /** The password variant. Hides the input value, and adds an icon to show/hide the input value */
    type?: 'password';
    /** Whether to hide this variant's visibility icon.  */
    hideVisibilityIcon?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'password'>; 
    /** @deprecated CANNOT use 'hideVisibilityIcon' when 'type' isn't password. */
    hideVisibilityIcon?: never; 
  };

type SearchVariantProps = 
| { 
    /** The search variant. Adds a dropdown for search results, and optional sorting. */
    type?: 'search';
    /** Whether to add a sort button for the rendered search results.  */
    sortButton?: boolean;
    /** The sorting type for the search results.  */
    sortType?: SearchSortType;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'search'>; 
    /** @deprecated CANNOT use 'sortButton' when 'type' isn't search. */
    sortButton?: never; 
    /** @deprecated CANNOT use 'sortType' when 'type' isn't search. */
    sortType?: never;
  };

type PolicyNumberVariantProps = 
| { 
    /** The policy number variant. Has an input mask for the format, and an optional icon. */
    type?: 'policyNumber';
    /** Whether to hide the policy number icon for the input.  */
    hidePolicyNumberIcon?: boolean;
    /** Whether to disable the default InputMask for the policy number. You can override the current with `maskOpts`, or disable this and pass in your own custom mask. */
    disablePolicyMask?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'policyNumber'>; 
    /** @deprecated CANNOT use 'hidePolicyNumberIcon' when 'type' isn't policyNumber. */
    hidePolicyNumberIcon?: never; 
    /** @deprecated CANNOT use 'disablePolicyMask' when 'type' isn't policyNumber. */
    disablePolicyMask?: never;
  };


type PhoneVariantProps = 
| { 
    /** The phone variant. Has an input mask for the format, and an optional phone icon. */
    type?: 'phone';
    /** Whether to hide the phone icon for the input.  */
    hidePhoneIcon?: boolean;
    /** Whether to disable the default InputMask for the phone number. You can override the current with `maskOpts`, or disable this and pass in your own custom mask. */
    disablePhoneMask?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'phone'>; 
    /** @deprecated CANNOT use 'hidePhoneIcon' when 'type' isn't phone. */
    hidePhoneIcon?: never; 
    /** @deprecated CANNOT use 'disablePhoneMask' when 'type' isn't phone. */
    disablePhoneMask?: never;
  };

type CreditCardVariantProps = 
| { 
    /** The credit card variant. Has an input mask for the format, and an optional icon. */
    type?: 'creditCard';
    /** Whether to hide the credit card icon for the input.  */
    hideCreditCardIcon?: boolean;
    /** Whether to disable the default InputMask for the credit card. You can override the current with `maskOpts`, or disable this and pass in your own custom mask. */
    disableCCMask?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'creditCard'>; 
    /** @deprecated CANNOT use 'hideCreditCardIcon' when 'type' isn't creditCard. */
    hideCreditCardIcon?: never; 
    /** @deprecated CANNOT use 'disableCCMask' when 'type' isn't creditCard. */
    disableCCMask?: never;
  };
// TODO - add a variant for both CCExpDate and CCV

type CurrencyVariantProps = 
| { 
    /** The credit card variant. Has an input mask for the format, and an optional icon. */
    type?: 'currency';
    /** Whether to hide the money sign before the value.  */
    hideMoneySign?: boolean;
    /** an optional currency type dropdown built into the input.  */
    hideCurrencyTypeOpts?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'currency'>; 
    /** @deprecated CANNOT use 'hideMoneySign' when 'type' isn't currency. */
    hideMoneySign?: never; 
    /** @deprecated CANNOT use 'hideCurrencyTypeOpts' when 'type' isn't currency. */
    hideCurrencyTypeOpts?: never;
  };

/** The conditional props for each of the variants, only valid and shown when the specific variant is select. */
export type ConditionalVariantProps = 
|  NumberVariantProps
|  EmailVariantProps
|  PasswordVariantProps
|  SearchVariantProps
|  PolicyNumberVariantProps
|  PhoneVariantProps
|  CreditCardVariantProps
|  CurrencyVariantProps;


// #endregion
export const Input = <TMask extends InputMask = InputMask, TMaskOpts extends MaskOpts = MaskOpts>
  (props: InputProps<TMaskOpts> & UniversalEventHandlers<HTMLInputElement> & TMaskClass<TMask, TMaskOpts>) => 
{
  // #region Component State
  const MaskClass = props.MaskClass || (InputMask as NonNullable<typeof props.MaskClass>);
  const  { // * Base Props
    type = 'text', name, 
    label, description, placeholder, 
    error, disabled = false, required = false, 
    
    tooltipContext, tooltipContent,
    autocomplete = 'none', 
    
    onUpdateValue, onTyped, disableHookForms, mask,
    onFocus, onChange, onBlur, onClick, 
    onMouseEnter, onMouseLeave
  } = props;
  
  const { // * Variant Specific conditionally rendered props
    hideIncrementButtons, 
    hideEmailIcon, disableEmailFilter,
    hideVisibilityIcon, 
    sortButton, sortType, 
    hidePolicyNumberIcon, disablePolicyMask, 
    hidePhoneIcon, disablePhoneMask, 
    hideCreditCardIcon, disableCCMask, 
    hideMoneySign, hideCurrencyTypeOpts
  } = props as AllVariantProps<ConditionalVariantProps>;
  
  // * Input binding logic
  const { register, getValues, getFieldState, control, clearErrors, trigger } = useFormContext() || {}; // non rhf variant catch
  const isRHFMode = !disableHookForms && !!register;
  const { error: errors } = getFieldState?.(name, control?._formState) || {}; // <- second arg prevents the internal JavaScript Proxy from adding a tracking flag to your component.
  const rhfBindings = isRHFMode ? register(name) : null;
  const localInputRef = useRef<HTMLInputElement | null>(null); // When not using rhf
  
  // Other
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false); // Password visibility
  const loadBarRandDelay = Math.floor(Math.random() * (100 - 25 + 1)) + 25; // TODO: visual test, not necessary. This could mess with seeing loading with actual load times
  
  
  // #endregion
  // #region Validation and Input Mask
  /** Retrieves the inputMask if there should be one */
  const createInputMask = (): TMask | undefined => {
    const maskOverrides = mask; // * for the sake of brevity
    if (type == 'phone' && !disablePhoneMask)         return PhoneMask.create(maskOverrides);
    if (type == 'email' && !disableEmailFilter)       return EmailFilter.create(maskOverrides);
    if (type == 'creditCard' && !disableCCMask)       return CCMask.create(maskOverrides);
    if (type == 'policyNumber' && !disablePolicyMask) return PolicyMask.create(maskOverrides);
    if (MaskClass && mask) {
      // return new MaskClass(maskOpts);
      return MaskClass.create(mask);
    }
    
    return undefined;
  }
  
  // ? Input mask
  const inputMask = useRef<TMask | undefined>(createInputMask());
  const usingInputMask = inputMask.current;
  
  // * validation logic
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const debouncer = useRef<NodeJS.Timeout>(undefined);
  const shouldValidate = useRef<boolean>(false);
  useEffect(() => { // ? Cleanup on unmount
    () => {
      clearTimeout(debouncer.current); // onKeypress validations
      if (inputMask.current) inputMask.current.cleanup(); // Event listeners
    }
  }, []);
  
  
  /** Handles validation debouncing (if we need to validate) */
  const keypressDebouncer = (newValue: string, event: ChangeEvent<HTMLInputElement>) => {
    // Check if we're currently validating this form value
    if (isRHFMode && rhfBindings) {
      const isInRevalidateMode = control?._formState?.isSubmitted || false;
      if (!isInRevalidateMode || (isInRevalidateMode && !newValue) || disabled) {
        // debouncer.current && clearTimeout(debouncer.current);
        shouldValidate.current = false;
        
        // ? check if we should clear any current errors
        const { error } = getFieldState?.(name) || {};
        if (!!error || disabled) clearErrors(name);
      } 
      
      // otherwise, we should validate the next time they stop typing
      else { 
        shouldValidate.current = true;
      }
    }
    
    // If it was submitted and still has active errors, refresh to run validations
    if (debouncer.current) clearTimeout(debouncer.current);
    debouncer.current = setTimeout(() => {
      if (shouldValidate.current) trigger(name);
      if (onTyped) onTyped(event); // custom event handling
      // forceUpdate(); // * let rhf's validation logic handle rerenders
      // console.log(`running validations for ${name}`, { value: getValue() });
    }, 450);
  }
  
  
  /** Either Rhf's captured form value, or the internal ref for custom state. */
  const getValue = (): string => isRHFMode ? getValues(name) || '' : localInputRef?.current?.value || ''; 
  
  /** Retrieves the input *element's* type */
  const getType = (): TextInputTypes => {
    if (type == 'number' || type == 'currency') return 'number';
    if (type == 'password') return passwordVisible ? 'text' : 'password';
    return 'text';
  }
  
  /** Retrieves the placeholder that's used */
  const getPlaceholder = (): string | undefined => (inputMask.current && inputMask.current.useMaskAsPlaceholder && placeholder === undefined) ? inputMask.current.mask : placeholder;
  
  /** Returns whether we have an error for this component, and it's not currently disabled. */
  const getError = (): boolean => (!!error && !disabled);
  
  
  // #endregion
  // #region Input Event Logic
  /**
   * Adds any input masking or custom logic to the input before updating the input component directly. 
   * * Updates the target value during each event before being passed to Rhf's and optional OnChange events.
   * 
   * ---
   * @param event       The native changeEvent data tied to the input event.
   */
  const handleUpdateValue = (event: FormEvent<HTMLInputElement>) => {
    if (!usingInputMask && onUpdateValue) { // Otherwise, handle custom edits from the onUpdateValue function
      onUpdateValue(getValue(), event);
    }
  }
  
  
  /**
   * Links event logic with custom user event logic for both Rhf and custom state handling.  
   * 
   * By default, this component should handle it's own rerenders, and 
   * onSelect / onChange shouldn't inherently cause hierarchical rerenders.
   * 
   * ---
   * @param event       The native changeEvent data tied to the input event.
   */
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    // console.log(`${name}(${type})::handleOnChange(): "${getValue()}"`,
    //   `\n event data: `, { value: event.target.value, event: event }
    // );
    
    // ? react hook forms event and optional event logic
    if (isRHFMode && rhfBindings) rhfBindings.onChange(event);
    if (onChange) onChange(event);
    
    // update the internal ref so the input reflects the updated value (for non Rhf inputs)
    if (localInputRef.current) {
      const targetValue = event.target.value;
      localInputRef.current.value = targetValue;
    }
    
    // Finally, add a debouncer for handling input validations for keystrokes after a brief duration
    keypressDebouncer(event.target.value, event);
  };
  
  
  /** Links custom events with Rhf's event bindings */
  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (isRHFMode && rhfBindings) rhfBindings.onBlur(e);
    if (onBlur) onBlur(e);
  }
  
  
  /** Safe Unified Ref Callback */
  const handleRef = (node: HTMLInputElement | null) => {
    localInputRef.current = node; // Store it locally for our increment buttons
    
    // Pass it along to react-hook-forms
    if (isRHFMode && rhfBindings?.ref) {
      rhfBindings.ref(node); 
    }
    
    // Pass a reference to our input mask
    if (inputMask.current && node) {
      inputMask.current.initEventListeners(node);
    }
  };
  
  // #endregion
  // #region Rendered HTML
  // * Rerender state
  // console.log(`\n\nRerendered ${name}(${type}): isRhfMode(${isRHFMode}), isUsingMask(${!!usingInputMask})`, 
  //   `\n data: `, { value: getValue(), localRef: localInputRef, errors: { field: errors, prop: error } },
  //   `\n config: `, { inputMask, maskOptsProp: mask }
  // );
  
  
  return (
    <TextInput className='input'>
      <Label htmlFor={type} className="input-label"> 
        { label } 
      </Label>
      
      <InputContainer className="input-container group">
        <input 
          // { ...props }
          name={name} type={getType()} id={`${name}-${type}`}
          placeholder={getPlaceholder()} autoComplete={autocomplete}
          disabled={disabled} required={required} 
          
          // Rhf or useState handling
          {...(() => {
            if (isRHFMode && rhfBindings) {
              const { ref, onChange: _, onBlur: __, ...rest } = rhfBindings;
              return rest;
            }
            return {};
          })()}
          ref={handleRef} 
          onBeforeInput={handleUpdateValue}
          onChange={handleOnChange} // custom rhfBindings.onChange
          onBlur={handleOnBlur}
          
          // Other optional events
          onFocus={(e) => onFocus && onFocus(e)}
          onClick={ (e) => onClick && onClick(e)}
          onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
          onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
          
          className={`input-base peer
            ${!inputTypesWithoutIcons.includes(type) ? 'input-icon-spacing' : ''}
            ${getError() ? 'input-error' : ''}
          `}
        />
        
        {/* Variant specific elements before and after the input element */}
        <PrecedingElements 
          name={name} type={type}
          showPassword={passwordVisible} setShowPassword={setPasswordVisible}
          hideEmailIcon={hideEmailIcon} hideVisibilityIcon={hideVisibilityIcon} hidePolicyNumberIcon={hidePolicyNumberIcon}
          hidePhoneIcon={hidePhoneIcon} hideCreditCardIcon={hideCreditCardIcon} hideMoneySign={hideMoneySign}
        />
        
        <SubsequentElements
          type={type} name={name}
          disabled={disabled} error={getError()} 
          
          tooltipContent={tooltipContent} tooltipContext={tooltipContext}
          
          hideIncrementButtons={hideIncrementButtons}
          inputRef={localInputRef} isRHFMode={isRHFMode} onChange={handleOnChange}
          
          sortButton={sortButton} sortType={sortType}
          hideCurrencyTypeOpts={hideCurrencyTypeOpts}
        />
        
        <LoadingBar className='input-loading-bar-cont'>
          <div 
            className={`input-loading-bar ${false ? 'animate-loading-bar opacity-75' : 'opacity-0'} `}
            style={{ animationDelay: `${loadBarRandDelay}ms` }}
          />
        </LoadingBar>
      </InputContainer>
      
      {/* Error / Description messages */}
      <ErrorAndDesc show={!!description || getError()} styles='mt-2 ml-1' cStyles={getError() ? 'error-text' : 'text-colors'}>
        { getError() ? error : description } &nbsp;
      </ErrorAndDesc>
    </TextInput>
  );
  // #endregion
}


// #region Preceding Elements
//------------------------------------------//
// Preceding Variant Elements               //
//------------------------------------------//
interface PrecedingElProps {
  name: string;
  type: TextInputTypes;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  
  /* Variant Specific */
  hideEmailIcon?: boolean;
  hideVisibilityIcon?: boolean;
  hidePolicyNumberIcon?: boolean;
  hidePhoneIcon?: boolean;
  hideCreditCardIcon?: boolean;
  hideMoneySign?: boolean;
}
export const PrecedingElements: React.FC<PrecedingElProps> = memo(({ 
  name, type, showPassword, setShowPassword, 
  hideEmailIcon, hideVisibilityIcon, hidePolicyNumberIcon, 
  hidePhoneIcon, hideCreditCardIcon, hideMoneySign
}) => {;
  const showVariantIcon = !hideEmailIcon || !hideVisibilityIcon || // TODO: Do we want to simplify the prop passed here?
    !hidePolicyNumberIcon || !hidePhoneIcon || !hideCreditCardIcon || !hideMoneySign;
  const VariantIcon: React.FC | undefined = showVariantIcon ? PrecedingIcons[type] || undefined : undefined;
  
  // * Rerender state
  // console.log(`Input-PrecedingElements ${name} rerendered`)
  
  
  return (
    <VariantIcons className="input-preceding-el-c">
      <div className='input-preceding-el'>
        {VariantIcon && <VariantIcon />}
        
        { (type == 'password' && !hideVisibilityIcon) && 
          <div onClick={() => setShowPassword(!showPassword)} className='input-password-vis'>
            { showPassword  &&  <Icon variant='EyeSlash' styles='input-icon-def' /> }
            { !showPassword &&  <Icon variant='Eye' styles='input-icon-def' /> }
          </div>
        }
      </div>
    </VariantIcons>
  );
});

const inputTypesWithoutIcons = ['search', 'text', 'currency', 'number'];
const PrecedingIcons: Partial<Record<TextInputTypes, React.FC>> = {
  'email': () => <Icon variant='Envelope'         styles='input-icon-def' />,
  'policyNumber': () => <Icon variant='Profile'   styles='input-icon-def' />,
  'phone': () => <Icon variant='Phone'            styles='input-icon-def' />,
  'creditCard': () => <Icon variant='CreditCard'  styles='input-icon-def' />,
};




// #endregion
// #region Subsequent Elements
//------------------------------------------//
// Subsequent Variant Elements              //
//------------------------------------------//
interface SubsequentElProps {
  name: string;
  type: TextInputTypes;
  
  disabled: boolean;
  error: boolean;
  
  tooltipContent?: TooltipContentProps;
  tooltipContext?: TooltipContextActions;
  
  // Variant specific
  hideIncrementButtons?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  isRHFMode?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  
  sortButton?: boolean;
  sortType?: SearchSortType;
  hideCurrencyTypeOpts?: boolean;
}
export const SubsequentElements: React.FC<SubsequentElProps> = memo(({
  name, type, disabled, error, 
  tooltipContext, tooltipContent, 
  hideIncrementButtons, inputRef, isRHFMode, onChange,
  sortButton, sortType, hideCurrencyTypeOpts
}) => {
  const { show, hide } = tooltipContext || {};
  const { getValues, setValue, control } = useFormContext() || {};
  
  const onPressIncrementButtons = (add: boolean) => {
    // If we're using rhf
    const inputValue = getValues?.(name) === undefined ? 0 : getValues?.(name);
    if (isRHFMode && !Number(inputValue)) {
      
      const currentValue = Number(inputValue) || 0;
      const isInRevalidateMode = control?._formState?.isSubmitted || false; // TODO - should this be a global function because it's tied to rhf's validation modes?
      setValue(name, currentValue + (add ? 1 : -1), { shouldValidate: isInRevalidateMode });
      return;
    }
    
    // Custom state or if rhf's not working
    if (inputRef && inputRef.current) {
      const domValue = inputRef.current.value;
      const baseValue = domValue === '' ? 0 : Number(domValue);
      
      if (!Number.isNaN(baseValue)) {
        const nextValue = baseValue + (add ? 1 : -1);
        
        // Dispatch the change event back up to the user's custom state handler
        onChange && onChange({ target: { value: String(nextValue) } } as any); // call the onChange
      }
    }
  }
  
  // * Rerender state
  // console.log(`Input-SubsequentElements ${name} rerendered`);
  
  
  return (
    <div className="input-subsequent-el-c">
      <div className="input-subsequent-el">
        
        {/* Error / Tooltip icon */}
        <ErrorAndTooltipIcon className="input-tooltip-icon"
          onMouseEnter={() => tooltipContent && show?.(tooltipContent)} 
          onMouseLeave={() => hide?.()} 
        >
          { error ? <Icon variant='OutlineWarning' styles='mr-2.5 input-sub-icon i-err-color' /> 
          :         <Icon variant='OutlineInfo' styles='mr-2.5 input-sub-icon' /> }
        </ErrorAndTooltipIcon>
        
        {/* Increment buttons - type="number" */}
        { (type == 'number' && !hideIncrementButtons) && 
          <div className={`increment-btns ${!disabled && !error ? 'increment-btns-states' : error ? 'input-btns-error' : ''}`}>
            <Button 
              onClick={() => onPressIncrementButtons(true)}
              icon='ChevronUp' iconStyles='input-inc-i' disabled={disabled} 
              color='gray' additStyles='inc-btn-base input-inc-btn-t' 
            />
            <Button 
              onClick={() => onPressIncrementButtons(false)}
              icon='ChevronDown' iconStyles='input-inc-i' disabled={disabled} 
              color='gray' additStyles='inc-btn-base input-inc-btn-b' 
            />
          </div>
        }
        
        {/* Currency Dropdown - type="currency" */}
        { (type == 'currency' && !hideCurrencyTypeOpts) && 
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
        
        {/* Search Sort Button - type="search" */}
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
    </div>
  );
// custom rerender functionality
}, (prevProps, nextProps) => {
  
  // If configurations change, rerender
  if ( prevProps.type !== nextProps.type 
    || prevProps.name !== nextProps.name
    || prevProps.isRHFMode !== nextProps.isRHFMode) {
    return false;
  }
  
  // Form / Validations
  if (prevProps.disabled !== nextProps.disabled || prevProps.error !== nextProps.error) {
    return false;
  }
  
  // Input variant specific functionality
  if (nextProps.type == 'number') {
    if (prevProps.hideIncrementButtons !== nextProps.hideIncrementButtons) {
      return false;
    }
  }
  if (nextProps.type == 'search') {
    if (prevProps.sortButton !== nextProps.sortButton) return false;
    if (prevProps.sortType !== nextProps.sortType) return false;
  }
  if (nextProps.type == 'currency') {
    if (prevProps.hideCurrencyTypeOpts !== nextProps.hideCurrencyTypeOpts) return false;
  }
  
  // Tooltip specific edits - quick check that they passed in different content 
  const prevTooltip = prevProps.tooltipContent as any;
  const nextTooltip = prevProps.tooltipContent as any;
  if (prevProps.tooltipContext !== nextProps.tooltipContext) return false;
  if (prevTooltip?.text !== nextTooltip?.text || prevTooltip?.styles !== nextTooltip?.styles) return false;
  if (prevTooltip?.code !== nextTooltip?.code || prevTooltip?.type !== nextTooltip?.type) return false;
  if (prevTooltip?.children !== nextTooltip?.children) return false;
  
  // If nothing changed, safely skip the rerender
  return true; 
});




// #endregion
// #region Misc


// Component Styles
const Label = styled.label``;
const TextInput = styled.div``;
const InputContainer = styled.div``;
const ErrorAndDesc = styled(Ht)``;

const VariantIcons = styled.div``;
const ErrorAndTooltipIcon = styled.div``;
const LoadingBar = styled.div``;
const SortSearchButton = styled.button``;
const CurrencySelectContainer = styled.div``;
const CurrencySelect = styled.select``;


export type SearchSortType = 'alphabetical' | 'numerical' | ((a: any, b: any) => void);


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
  tooltipContent: { text: 'The email used to create your account.' },
  autocomplete: 'email',
}

export const InputProps_Password: InputPropsPartial = {
  type: 'password',
  name: 'password',
  label: 'Password',
  description: 'Create your password.',
  tooltipContent: { text: 'The used for your account.' },
  autocomplete: 'password',
}

export const InputProps_Phone: InputPropsPartial = {
  type: 'phone',
  name: 'phone',
  label: 'Phone',
  description: 'What is your phone number?',
  tooltipContent: { text: 'Your phone number, including the area code. ex: (000)-000-0000' },
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




//#endregion

