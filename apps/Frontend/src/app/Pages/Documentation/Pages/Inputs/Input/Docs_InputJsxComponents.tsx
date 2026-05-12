import { Dispatch, SetStateAction, useState, ChangeEvent, FocusEvent, useMemo, useContext } from "react";
import { Input, TooltipService } from "@Project/ReactComponents";



export const Example_TextInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState<string>('');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
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
        
        name={`text-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
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
  const [value, setValue] = useState<string>('0');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []);

  return (
    <div>
      <Input 
        type="number"
        label="Number Input"
        placeholder="Type a number..."
        description="The number input's description."
        
        name={`number-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
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
  const [value, setValue] = useState<string>('example@email.com');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []);

  return (
    <div>
      <Input 
        type="email"
        label="Email Input"
        placeholder="Your email..."
        description="The email input's description."
        
        name={`email-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        // hideEmailIcon
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
  const [value, setValue] = useState<string>('password');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []);

  return (
    <div>
      <Input 
        type="password"
        label="Password Input"
        placeholder="Type your password..."
        description="The password input's description."
        
        name={`password-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
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
  const [value, setValue] = useState<string>('');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []);

  return (
    <div>
      <Input 
        type="search"
        label="Search Input"
        placeholder="Type something..."
        description="The search input's description."
        
        name={`search-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
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
  const [value, setValue] = useState<string>('');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []);

  return (
    <div>
      <Input 
        type="policyNumber"
        label="Policy Number Input"
        placeholder="Do something..."
        description="The policy number input's description."
        
        name={`search-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hidePolicyNumberIcon
        // policyNumberMask={}
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
  const [value, setValue] = useState<string>('(012)-345-6789');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []);

  return (
    <div>
      <Input 
        type="phone"
        label="Phone Input"
        placeholder="Type something..."
        description="The phone input's description."
        
        name={`phone-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hidePhoneIcon
        // phoneNumberMask={}
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
  const [value, setValue] = useState<string>('0000-0000-0000-0000');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []);

  return (
    <div>
      <Input 
        type="creditCard"
        label="Credit Card Input"
        placeholder="Type something..."
        description="The credit card input's description."
        
        name={`credit-card-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hideCreditCardIcon
        // creditCardMask={}
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
  const [value, setValue] = useState<string>('0.00');
  
  const onValueUpdated = (e: ChangeEvent<any>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  // tooltip logic
  const tooltipContext = useContext(TooltipService);
  const tooltipContent = useMemo(() => ({ text: "Tooltip text..." }), []);

  return (
    <div>
      <Input 
        type="currency"
        label="Currency Input"
        placeholder="Type something..."
        description="The currency input's description."
        
        name={`currency-input-form-name`} // using rhf
        // value={value} // optional useState override
        // onChange={e => onValueUpdated(e)}
        error={error}
        disabled={disabled}
        
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltipContext={tooltipContext}
        tooltipContent={tooltipContent}
        
        // hideMoneySign
        // hideCurrencyType
      />
    </div>
  );
}


















