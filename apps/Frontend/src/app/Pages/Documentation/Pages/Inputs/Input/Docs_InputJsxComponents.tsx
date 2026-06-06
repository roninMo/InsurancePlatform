import { Dispatch, SetStateAction, useState, ChangeEvent, useMemo, useContext, FormEvent } from "react";
import { Input, TooltipService } from "@Project/ReactComponents";
import { phoneMaskConfig } from "@Project/ReactComponents/Common/Utilities/InputMasks/InputMask";
import { useFormContext } from "react-hook-form";



export const Example_TextInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('textInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="text" 
        label="Text Input"
        placeholder="Type something..."
        description="The text input's description."
        
        name={`textInputFormName`} 
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
      />
    </div>
  );
}


export const Example_NumberInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('numberInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="number"
        label="Number Input"
        placeholder="Type a number..."
        description="The number input's description."
        
        name={`numberInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        // hideIncrementButtons
      />
    </div>
  );
}


export const Example_EmailInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('emailInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="email"
        label="Email Input"
        placeholder="Your email..."
        description="The email input's description."
        
        name={`emailInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        // hideEmailIcon
        // disableEmailFilter
      />
    </div>
  );
}


export const Example_PasswordInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('passwordInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="password"
        label="Password Input"
        placeholder="Type your password..."
        description="The password input's description."
        
        name={`passwordInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        // hideVisibilityIcon
      />
    </div>
  );
}


export const Example_SearchInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('searchInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="search"
        label="Search Input"
        placeholder="Type something..."
        description="The search input's description."
        
        name={`searchInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        sortButton
        sortType='alphabetical'
      />
    </div>
  );
}

export const Example_PolicyNumberInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('policyInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="policyNumber"
        label="Policy Number Input"
        placeholder="Do something..."
        description="The policy number input's description."
        
        name={`policyInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hidePolicyNumberIcon
        // disablePolicyMask
      />
    </div>
  );
}


export const Example_PhoneInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('phoneInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="phone"
        label="Phone Input"
        // placeholder=""
        description="The phone input's description."
        
        name={`phoneInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hidePhoneIcon
        // disablePhoneMask
      />
    </div>
  );
}


export const Example_CreditCardInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('creditCardInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="creditCard"
        label="Credit Card Input"
        placeholder="0000-0000-0000-0000"
        description="The credit card input's description."
        
        name={`creditCardInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hideCreditCardIcon
        // disableCCMask
      />
    </div>
  );
}


export const Example_CurrencyInput = ({ error, disabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  
  const onUpdateValue = (prevValue: string, e: FormEvent<HTMLInputElement>) => {
    console.log(`custom onUpdateValue ran, prevValue: `, {prevValue, e });
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // react-hook-forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('currencyInputFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log(`updated the value: "${newValue}"`);
    setValue(newValue);
  }
  
  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []); // prevent unnecessary object rerenders
  
  
  return (
    <div>
      <Input 
        type="currency"
        label="Currency Input"
        placeholder="Type something..."
        description="The currency input's description."
        
        name={`currencyInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onTyped={onChangeValue}
        // mask={phoneMaskConfig}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hideMoneySign
        // hideCurrencyType
      />
    </div>
  );
}


















