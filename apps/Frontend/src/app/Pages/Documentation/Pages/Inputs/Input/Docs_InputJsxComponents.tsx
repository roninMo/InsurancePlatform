import { Dispatch, SetStateAction, useState, ChangeEvent, FocusEvent, useMemo, useContext, FormEvent } from "react";
import { Input, TooltipService } from "@Project/ReactComponents";
import { phoneMaskConfig } from "@Project/ReactComponents/Common/Utilities/InputMasks/InputMask";
import { useFormContext } from "react-hook-form";



export const Example_TextInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        onChange={onChangeValue}
        mask={phoneMaskConfig} // Check that this works
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
      />
    </div>
  );
}


export const Example_NumberInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        onChange={onChangeValue}
        // mask={}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        // hideIncrementButtons
      />
    </div>
  );
}


export const Example_EmailInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        onUpdateValue={onUpdateValue}
        onChange={onChangeValue}
        // mask={}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        // hideEmailIcon
        // disableEmailFilter
      />
    </div>
  );
}


export const Example_PasswordInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        onChange={onChangeValue}
        // mask={}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        // hideVisibilityIcon
      />
    </div>
  );
}


export const Example_SearchInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        onChange={onChangeValue}
        // mask={}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        sortButton
        sortType='alphabetical'
      />
    </div>
  );
}

export const Example_PolicyNumberInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        
        name={`searchInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onChange={onChangeValue}
        // mask={}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hidePolicyNumberIcon
        // disablePolicyMask
      />
    </div>
  );
}


export const Example_PhoneInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        placeholder="Type something..."
        description="The phone input's description."
        
        name={`phoneInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onChange={onChangeValue}
        // mask={}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hidePhoneIcon
        // disablePhoneMask
      />
    </div>
  );
}


export const Example_CreditCardInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        placeholder="Type something..."
        description="The credit card input's description."
        
        name={`credit-cardInputFormName`}
        // disableHookForms
        onUpdateValue={onUpdateValue}
        onChange={onChangeValue}
        // mask={}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hideCreditCardIcon
        // disableCCMask
      />
    </div>
  );
}


export const Example_CurrencyInput = ({ error, setError, disabled, setDisabled }: {
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
    // React hook forms
    console.log('getValues: ', getValues('textInputFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    console.log('updated the value: ', newValue);
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
        onChange={onChangeValue}
        // mask={}
        error={error} disabled={disabled}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hideMoneySign
        // hideCurrencyType
      />
    </div>
  );
}


















