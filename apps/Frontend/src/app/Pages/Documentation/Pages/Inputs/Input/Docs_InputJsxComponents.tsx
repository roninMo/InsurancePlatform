import { Dispatch, SetStateAction, useState, ChangeEvent, FocusEvent } from "react";
import { Input } from "../../../../../Components/Forms/Input/Input";
// import { Input } from "@Project/ReactComponents";



export const Example_TextInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState<string>('');
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="text"
        label="Text Input"
        placeholder="Type something..."
        description="The text input's description."
        name={`text-input-form-name`}

        value={value}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
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
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="number"
        label="Number Input"
        placeholder="Type a number..."
        description="The number input's description."
        name={`number-input-form-name`}

        value={value}
        setValue={setValue}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
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
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="email"
        label="Email Input"
        placeholder="Your email..."
        description="The email input's description."
        name={`email-input-form-name`}

        value={value}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
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
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="password"
        label="Password Input"
        placeholder="Type your password..."
        description="The password input's description."
        name={`password-input-form-name`}

        value={value}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
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
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="search"
        label="Search Input"
        placeholder="Type something..."
        description="The search input's description."
        name={`search-input-form-name`}

        value={value}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
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
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="policyNumber"
        label="Policy Number Input"
        placeholder="Do something..."
        description="The policy number input's description."
        name={`search-input-form-name`}

        value={value}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
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
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="phone"
        label="Phone Input"
        placeholder="Type something..."
        description="The phone input's description."
        name={`phone-input-form-name`}

        value={value}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
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
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="creditCard"
        label="Credit Card Input"
        placeholder="Type something..."
        description="The credit card input's description."
        name={`credit-card-input-form-name`}

        value={value}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
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
  
  const onValueUpdated = (e: any) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }

  return (
    <div>
      <Input 
        type="currency"
        label="Currency Input"
        placeholder="Type something..."
        description="The currency input's description."
        name={`currency-input-form-name`}

        value={value}
        error={!!error}
        disabled={disabled}
        errorMessage={error}
        // ref={getMaskRef(type)}
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueUpdated(e)}
        onBlur={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        onFocus={(e: FocusEvent<HTMLElement, Element>) => onValueUpdated(e)}
        
        tooltip={{ text: "Tooltip text..." }}
      />
    </div>
  );
}


















