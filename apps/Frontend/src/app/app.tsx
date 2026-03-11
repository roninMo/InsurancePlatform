import { ChangeEvent, createContext, Dispatch, MouseEvent, SetStateAction, useEffect, useId, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import { UserTokenInformation } from '@Project/Classes';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Cookies from 'js-cookie';
import styled from '@emotion/styled';

import NxWelcome from './nx-welcome';
import { Button, Icon, Input, InputProps_Email, ProjectReactComponents, RadioGroupProps, RadioGroup, RadioItem, Select, SelectItemValues, TextInputTypes } from '@Project/ReactComponents';
import { RadioTable } from './Components/Forms/RadioTable/RadioTable';
import { Slider } from './Components/Forms/Slider/Slider';
import { Checkbox, CheckboxItem, CheckboxProps } from './Components/Forms/Checkbox/Checkbox';
import { MetadataTagProps, Textarea } from './Components/Forms/Textarea';
import { Card } from './Components/Layouts/Card/Card';
// import { RadioTable } from './RadioTable/RadioTable';


const AppSpacing = styled.div``;
const RoutesSpacing = styled.div``;
const MainContent = styled.div``;
const Navbar = styled.div``;
// pb-4 p-2 mx-auto max-w-7xl px-2 lg:px-8 sm:px-6


// Authentication Context
export interface LoginContextProps {
  accessToken?: string;
  userTokenInformation?: UserTokenInformation | null;
  setUserTokenInformation?: (value: UserTokenInformation | null) => void;
}
export const LoginContext = createContext<LoginContextProps>({});



export function App() {
  const [currentTheme, SetCurrentTheme] = useState<string>(localStorage.getItem('theme') || '');
  const [userTokenInformation, setUserTokenInformation] = useState<UserTokenInformation | null>(null);
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    // Themes and display settings
    if (!currentTheme) {
      const userPreferenceTheme: string = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      localStorage.setItem('theme', userPreferenceTheme);
      SetCurrentTheme(userPreferenceTheme);
    }
    updateTheme(currentTheme);

    // Retrieve login information
    if (!accessToken || !userTokenInformation) {
      getAccessToken();
    }

    // Retrieve Cookies -> metadata, etc.
    Cookies.get('thisWebsite-metadata');

    // Console Information
    console.log('\ninformation: ', { userTokenInformation, accessToken, currentTheme });
  }, [accessToken, currentTheme, userTokenInformation]);

  // Retrieve the access token (login info) in the event the user is already logged in.
  const getAccessToken = async () => {
      let token = localStorage.getItem('accessToken') || '';
      let tokenInformation: UserTokenInformation | null;

      if (token) {
        setAccessToken(token);
        tokenInformation = jwtDecode<UserTokenInformation>(token);
        setUserTokenInformation(tokenInformation);
        if (tokenInformation.email) {
          await axios.post(`http://localhost:3333/loggedIn`, { accessToken: token })
            .then(res => {
              console.log('already logged in response: ', res);
              if (res.status !== 200) {
                localStorage.setItem('accessToken', '');
                tokenInformation = null;
                token = '';
              }
              
              // Refresh token from server
              setUserTokenInformation(tokenInformation);
              setAccessToken(token);
              return;
            }).catch(err => console.log('something happened while trying to access the server!', err));
        }
      }
  };

  // #region Theme
  const setTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    SetCurrentTheme(newTheme);
    updateTheme(currentTheme);
    // console.log('theme status: ', {currentTheme, newTheme});
  }

  const updateTheme = (theme: 'light' | 'dark' | string) => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }
  // #endregion


  // #region Input Elements
  // Input
  const inputId = useId();
  const [input, setInput] = useState<string>("");
  const inputChanged = (e: ChangeEvent<HTMLInputElement>) => setInput(e?.target?.value);
  const [inputError, SetInputError] = useState<boolean>(false);
  const [inputErrorMessage, SetInputErrorMessage] = useState<string>();

  const inputTypeId = useId();
  const [inputType, setInputType] = useState<SelectItemValues>({ value: 'search', label: 'Select an input type...'});
  const types: TextInputTypes[] = ['text', 'email', 'password', 'phone', 'creditCard', 'currency', 'policyNumber', 'search'];
  const inputTypes: SelectItemValues[] = types.map(type => ({ value: type, label: type }));
  const inputTypeChanged = (selected: SelectItemValues, index: number) => {
    setInput("");
    SetInputError(false);
    SetInputErrorMessage("");
    setInputType(selected);
  }

  // Email
  const emailId = useId();
  const [email, setEmail] = useState<string>("");
  const emailChanged = (e: ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();

  // SelectIcons
  const selectIconId = useId();
  const selectIcons: SelectItemValues[] = [
    { value: 'attachFile', label: "Attach File", iconProps:       { icon: "AttachFile", placement: 'left' }},
    { value: 'checkbox', label: "Checkbox", iconProps:            { icon: "Checkbox", placement: 'left' }},
    { value: 'darkTheme', label: "Dark Theme", iconProps:         { icon: "DarkTheme", placement: 'left' }},
    { value: 'dropdownArrow', label: "Dropdown Arrow", iconProps: { icon: "DropdownArrow", placement: 'left' }},
    { value: 'envelope', label: "Envelope", iconProps:            { icon: "Envelope", placement: 'left' }},
    { value: 'error', label: "Error", iconProps:                  { icon: "Error", placement: 'left' }},
    { value: 'infoBox', label: "Info box", iconProps:             { icon: "InfoBox", placement: 'left' }},
    { value: 'lightTheme', label: "Light Theme", iconProps:       { icon: "LightTheme", placement: 'left' }},
    { value: 'plus', label: "Plus", iconProps:                    { icon: "Plus", placement: 'left' }},
    { value: 'profile', label: "Profile", iconProps:              { icon: "Profile", placement: 'left' }},
    { value: 'SelectArrow', label: "Select Arrows", iconProps:    { icon: "SelectArrow", placement: 'left' }},
    { value: 'sort', label: "Sort", iconProps:                    { icon: "Sort", placement: 'left' }},
    { value: 'system', label: "System", iconProps:                { icon: "System", placement: 'left' }},
    { value: 'trash', label: "Trash", iconProps:                  { icon: "Trash", placement: 'left' }},
  ];
  const [currentIcon, setCurrentIcon] = useState<SelectItemValues>({ value: '', label: ''});
  const [selectIconError, setSelectIconError] = useState<boolean>(false);
  const [selectIconErrorMessage, setSelectIconErrorMessage] = useState<string>();
  const selectIconChanged = (selected: SelectItemValues, index: number) => {
    setCurrentIcon(selected);
    // console.log('select: new value: ', {currentIcon, index, selectIcons});
  }

  // Email
  const textareaId = useId();
  const [textarea, setTextarea] = useState<string>("");
  const textareaChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setTextarea(e?.target?.value);
  const [textareaError, setTextareaError] = useState<boolean>(false);
  const [textareaErrorMessage, setTextareaErrorMessage] = useState<string>();
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    console.log('submitted text area: ', { value: textarea, error: textareaError && textareaErrorMessage });
  };

  const textareaProps = {
    onSubmit: onSubmitTextarea,
    name: 'textArea',
    value: textarea,
    id: textareaId,
    onChange: textareaChanged,
    error: textareaError, 
    errorMessage: textareaErrorMessage, 
    required: false, 
    disabled: false,
  };
  const boxMetadataTags: MetadataTagProps[] = [
    {
      tagLabel: 'assign', onClickTag: () => {},
      tagIcon: 'Profile', iconStyles: '',
    },
    {
      tagLabel: 'label', onClickTag: () => {},
      tagIcon: 'Tag', iconStyles: '',
    },
    {
      tagLabel: 'due date', onClickTag: () => {},
      tagIcon: 'Calendar', iconStyles: '',
    },
  ];
  const postMetadataTags:MetadataTagProps[] = [
    {
      tagIcon: 'Link', iconStyles: '',
      onClickTag: () => {},
    },
    {
      tagIcon: 'CodeBracket', iconStyles: '',
      onClickTag: () => {},
    },
    {
      tagIcon: 'AtSymbol', iconStyles: '',
      onClickTag: () => {},
    },
  ];

  // Radio buttons
  const radioButtonId = useId();
  const favoriteFoods: RadioItem[] = [
    {
      value: 'none',
      label: 'None',
    },
    {
      value: 'peanutButterJelly',
      label: 'Peanut butter and jelly',
      description: 'A classic American sandwich with peanut butter and fruit preserves (jelly or jam).'
    },
    {
      value: 'ramen',
      label: 'Ramen Soup',
      description: 'A popular Japanese noodle soup featuring springy wheat noodles in a rich, savory broth of soy sauce and miso, topped with chashu, eggs, nori, and green onions.'
    },
    {
      value: 'broccoliPotatoesAndChicken',
      label: 'Broccoli, potatoes, and chicken',
      description: 'A deliciously crafted meal stir fried to perfection.'
    },
  ];
  const favoriteFoodsNoDescriptions: RadioItem[] = favoriteFoods.map(item => { return { value: item.value, label: item.label, disabled: item.disabled }});
  const [favoriteFood, setFavoriteFood] = useState<RadioItem>({ value: '', label: ''});
  const [radioItemError, setRadioItemError] = useState<boolean>(false);
  const [radioItemErrorMessage, setRadioItemErrorMessage] = useState<string>('');
  const selectedFavoriteFood = (selected: RadioItem, index: number, currentValue: RadioItem) => {
    setFavoriteFood(selected);
    // console.log(`radioButton: `, {selected, index, currentValue});
  }

  // Checkbox component
  const checkboxId = useId();
  const [checkedFoods, setCheckedFoods] = useState<{ [key: string]: CheckboxItem }>({
    'none': { ...favoriteFoods[0], checked: false },
    'peanutButterJelly': { ...favoriteFoods[1], checked: false },
    'ramen': { ...favoriteFoods[2], checked: false },
    'broccoliPotatoesAndChicken': { ...favoriteFoods[3], checked: false },
  });
  const [checkedError, setCheckedError] = useState<boolean>();
  const [checkedErrorMessage, setCheckedErrorMessage] = useState<string>();
  const checkedFavoriteFood = (item: CheckboxItem, event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // console.log(`\n${item.label} value: ${item.checked} set to ${!item.checked}`, item);
    setCheckedFoods({ ...checkedFoods, [item.value]: {...item, checked: !item.checked} });
  }


  // Slider component
  const sliderId = useId();
  const [slider, setSlider] = useState<boolean>(false);
  const [sliderError, setSliderError] = useState<boolean>(false);
  const [sliderErrorMessage, setSliderErrorMessage] = useState<string>('');
  const onChangeSlider = () => setSlider(!slider);


  // #endregion


  // First input error/disable toggles
  const [disabled, setDisabled] = useState<boolean>(false);
  const toggleDisabled = () => setDisabled(!disabled);
  const toggleError = (setState: Dispatch<SetStateAction<boolean>>, setMessageState: Dispatch<SetStateAction<string | undefined>>, errorState: boolean, errorMessage?: string) => {
    if (!setState) return;

    setState(errorState);
    setMessageState(errorMessage);
    // console.log('toggle error: ', {errorState, errorMessage, setStates: {setState, setMessageState}});
  }
  // #endregion


  const RadioGroupProps: RadioGroupProps = {
    variant: 'default',
    id: radioButtonId,
    name: 'radioButton',
    label: 'Favorite Foods',
    description: 'What is your favorite food?',

    radioItems: favoriteFoods,
    currentValue: favoriteFood,
    onSelect: selectedFavoriteFood,

    error: radioItemError,
    errorMessage: radioItemErrorMessage,
    disabled: false,
    required: false,
  };

  
  const CheckboxProps: CheckboxProps = {
    name: 'checked favorite foods',
    variant: 'default',
    id: checkboxId,
    items: checkedFoods,
    onSelect: checkedFavoriteFood,

    error: checkedError,
    errorMessage: checkedErrorMessage,
    disabled: false,
    required: false,
  }

  return (
    <AppSpacing className="bg-default">
      <LoginContext.Provider value={{accessToken, userTokenInformation, setUserTokenInformation}}>

        {/* Navbar */}
        <Navbar role="navigation" className='p-2'>
          <ul>
            <li className='pb-1'>
              <Link to="/">Home</Link>
            </li>
            <li className='pb-1'>
              <Link to="/page-2">Page 2</Link>
            </li>
          </ul>
        </Navbar>


        {/* Routes */}
        <RoutesSpacing className='spacing m-10'>
          <Routes>
            <Route 
              path="/"
              element={
                <div className="spacing p-2 pb-4">
                  <h2 className="span-12 mb-2"> Home Page</h2>

                  <p className="span-12 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
                    officia deserunt mollit anim id est laborum.
                  </p>

                  <div className='span-4 md:span-12'>
                    <Button
                      displayText={ currentTheme === "dark" ? 'set to light' : 'set to dark'}
                      icon={        currentTheme === "dark" ? 'DarkTheme' : 'LightTheme'}
                      iconStyles='size-10 text-slate-100 dark:text-slate-100'
                      size='md'
                      additionalStyles='py-[2px]'
                      onClick={setTheme}
                    />
                  </div>
                </div>
              } 
            />
            
            <Route
              path="/page-2"
              element={
                <div className={`p-2 pb-4`}>
                  <Link to="/">Click here to go back to root page.</Link>
                </div>
              }
            />
          </Routes>
        </RoutesSpacing>


        {/* Playground */}
        <MainContent className='spacing gap-y-4 px-6 py-4'>

          {/* First Section for Input component logic */}
          <div className='spacing mt-4 p-4 pb-8 bg-div rounded-md'>
            <div className='span-12 md:span-8 lg:span-4'>
              <Input 
                // type="currency"
                type={inputType.value as TextInputTypes}
                name="Input"
                label="Input"
                description=""
                value={input}
                placeholder="Input text..."
                id={inputId}
                onChange={inputChanged}
                error={inputError} 
                errorMessage={inputErrorMessage} 
                disabled={disabled}
                tooltip
                tooltipText='tooltip text...'
              />
            </div>

            <div className='span-12 lg:span-3 py-2 *:m-2 rowStart items-start lg:mt-3'>
              <Button 
                displayText={inputError ? 'Disable Error' : 'Enable Error'} 
                size='md'
                onClick={(e: any) => toggleError(SetInputError, SetInputErrorMessage, !inputError, !inputError ? 'invalid text' : undefined)} 
              />
              <Button 
                displayText={disabled ? 'Enable' : 'Disable'} 
                size='md'
                onClick={(e: any) => toggleDisabled()} 
              />
            </div>

            <div className='span-12 md:span-8 lg:span-4'>
              <Select 
                name="inputType"
                label="Input Type"
                value={inputType}
                values={inputTypes}
                onSelect={inputTypeChanged}
                id={inputTypeId}
              />
            </div>
            
          </div>


          {/* Input and Textarea */}
          <div className='spacing bg-div outline-css outline-styles'>
            {/* List of the different input types (For quick testing) */}
            <div className='colStart p-4 pb-8  span-12 md:span-6 lg:span-4 *:w-full *:py-2'>
              <h4 className='label-colors'>Inputs</h4>
              <Input 
                type="text" name="TextInputShowcase"
                label="Text Input" description=""
                value="Hello " placeholder="Input Text..."
                id="TextInputShowcase" 
                tooltip tooltipText='tooltip text...'
              />

              <Input 
                type="email" name="EmailInputShowcase"
                label="Email Input" description=""
                value="example@email.com" placeholder="Input Email..."
                id="EmailInputShowcase" 
                tooltip tooltipText='tooltip text...'
              />

              <Input 
                type="password" name="PasswordInputShowcase"
                label="Password Input" description=""
                value="password" placeholder="Input Password..."
                id="PasswordInputShowcase" 
                tooltip tooltipText='tooltip text...'
              />

              <Input 
                type="phone" name="PhoneInputShowcase"
                label="Phone Input" description=""
                value="(123)-456-7890" placeholder="Input Phone..."
                id="PhoneInputShowcase" 
                tooltip tooltipText='tooltip text...'
              />

              <Input 
                type="creditCard" name="CreditCardInputShowcase"
                label="CreditCard Input" description=""
                value="0000 0000 0000 0000" placeholder="Input Credit Card..."
                id="CreditCardInputShowcase" 
                tooltip tooltipText='tooltip text...'
              />

              <Input 
                type="currency" name="CurrencyInputShowcase"
                label="Currency Input" description=""
                value="$100.00" placeholder="Input Credit Card..."
                id="CurrencyInputShowcase" 
                tooltip tooltipText='tooltip text...'
              />

              <Input 
                type="policyNumber" name="PolicyNumberInputShowcase"
                label="Policy Number Input" description=""
                value="90012345-AB" placeholder="Input Policy Number..."
                id="PolicyNumberInputShowcase" 
                tooltip tooltipText='tooltip text...'
              />

              <Input 
                type="search" name="SearchInputShowcase"
                label="Search Input" description=""
                value="" placeholder="Search for Something..."
                id="SearchInputShowcase" 
                tooltip tooltipText='tooltip text...'
              />
            </div>

            {/* List of the different textarea types */}
            <div className='span-12 lg:span-1' />
            <div className='p-4 span-12 md:span-6 lg:span-6 *:p-6'>
              <h4 className='label-colors'>Textareas</h4>

              <div className='spacing *:span-12'>
                <Textarea  
                  type="default"
                  label="Default style"
                  description="Textarea description"
                  placeholder="input text..."
                  submitButtonText='Post'
                  { ...textareaProps }
                  error={false}
                  errorMessage="invalid input"
                />
              </div>
              
              <div className='spacing *:span-12'>
                <Textarea  
                  type="box"
                  label="Box style"
                  description="Textarea description"
                  placeholder="input text..."
                  submitButtonText='Create'
                  { ...textareaProps }
                  metadataTags={boxMetadataTags}
                  error={false}
                  errorMessage="invalid input"
                />
              </div>
              
              <div className='spacing *:span-12'>
                <Textarea  
                  type="post"
                  label="Post style"
                  description="Textarea description"
                  placeholder="input text..."
                  submitButtonText='Post'
                  { ...textareaProps }
                  metadataTags={postMetadataTags}
                  error={false}
                  errorMessage="invalid input"
                />
              </div>
            </div>
          </div>


          {/* Random custom logic and display to show layout and svgs */}
          <div className='spacing mt-4 p-4 pb-8 bg-div rounded-md'>
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Custom React Input Components</h4>
            </div>

            {/* Input and Select */}
            <div className='span-4 pb-8'>
              <Input 
                { ...InputProps_Email } 
                value={email}
                id={emailId}
                onChange={emailChanged}
                error={emailError} 
                errorMessage={emailErrorMessage} 
                required={false} 
                disabled={false}
              />
            </div>

            <div className='span-4 pb-8'>
              <Select 
                name="selectIcons"
                label="Selected Svgs"
                description="A list of the svgs currently available for the project."
                value={currentIcon}
                values={selectIcons}
                onSelect={selectIconChanged}
                id={selectIconId}
                placeholder='Select a value'

                error={selectIconError}
                errorMessage={selectIconErrorMessage}
                disabled={false}
                required={false}
              />
            </div>
            
            {/* Content Layout */}
            <div className='span-12 p-2' />
            <div className='span-4 p-2 bg-default text-colors rounded-md'>Grid content</div>
            <div className='span-4 p-2 bg-default text-colors rounded-md'>Grid content</div>
            <div className='span-4 p-2 bg-default text-colors rounded-md'>Grid content</div>
            <div className='span-12 p-2 bg-default text-colors rounded-md'>Grid content</div>
          </div>


          {/* Radio Tables */}
          <div className='spacing mt-4 p-4 pb-8 bg-div rounded-md'>
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Radio Tables</h4>
            </div>
            
            <div className='span-12 lg:span-6 md:span-10 p-4 pb-4'>
              <RadioTable 
                {...RadioGroupProps} 
                variant='inline' 
                name='radioTable-1'
                radioItems={favoriteFoods}
                error
                errorMessage='an error occurred'
              />
            </div>
            <div className='span-12 lg:span-6 md:span-10 p-4 pb-4'>
              <RadioTable 
                {...RadioGroupProps} 
                variant='block' 
                name='radioTable-2'
                radioItems={favoriteFoods}
              />
            </div>
          </div>


          {/* Slider and list Checkboxes */}
          <div className='spacing mt-4 p-4 pb-8 bg-div rounded-md'>
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Slider and list style Checkbox</h4>
            </div>

            <div className='spacing span-12 justify-between'>
              <div className='span-12 lg:span-3 p-4 pb-4 bg-default text-colors rounded-md'>
                {[0, 1, 2, 3, 4, 5].map((index) => 
                  <Slider 
                    name="slider"
                    label="Slider"
                    description="A slider component"
                    value={slider}
                    onChange={onChangeSlider}
                    id={sliderId}

                    error={sliderError}
                    errorMessage={sliderErrorMessage}
                    required={false}
                    disabled={false}

                    aria="input slider ref"
                    key={`inputSlider-${index}`}
                  />
                )}
              </div>

              <div className='span-3' />
              <div className='span-12 lg:span-6 p-4 pb-4 bg-default text-colors rounded-md'>
                  <Checkbox 
                    {...CheckboxProps}
                    variant='list'
                    name="checkbox-1"
                    label="What are your favorite foods?"
                    description="Select from the list of our favorite foods."
                  />
              </div>
            </div>
          </div>


          {/* Default and Inline style Checkboxes */}
          <div className='spacing mt-4 p-4 pb-8 bg-div rounded-md'>
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Default and Inline style Checkboxes</h4>
            </div>
            
            <div className='span-12 lg:span-6 p-4 pb-4 bg-default text-colors rounded-md'>
                <Checkbox 
                  {...CheckboxProps}
                  variant='default'
                  name="checkbox-2"
                  label="What are your favorite foods?"
                  description="Select from the list of our favorite foods."
                />
            </div>
            
            <div className='span-12 lg:span-6 p-4 pb-4 bg-default text-colors rounded-md'>
                <Checkbox 
                  {...CheckboxProps}
                  variant='inline'
                  name="checkbox-3"
                  label="What are your favorite foods?"
                  description="Select from the list of our favorite foods."
                />
            </div>
          </div>


          {/* Radio Groups */}
          <div className='spacing mt-4 p-4 pb-8 bg-div rounded-md'>
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Radio Groups</h4>
            </div>
            
            <div className='span-12 p-4 pb-4 bg-default text-colors rounded-md'>
              <RadioGroup 
                {...RadioGroupProps} 
                variant='default' 
                name='radioGroup-default'
                radioItems={favoriteFoodsNoDescriptions}
                label="Default"
                error
                errorMessage='an error occurred'
              />
            </div>
            
            <div className='span-12 p-4 pb-4 bg-default text-colors rounded-md'>
              <RadioGroup 
                {...RadioGroupProps} 
                variant='list' 
                name='radioGroup-list'
                radioItems={favoriteFoods}
                label="List"
              />
            </div>

            <div className='span-12 lg:span-6 p-4 pb-4 bg-default text-colors rounded-md'>
              <RadioGroup 
                {...RadioGroupProps} 
                variant='column' 
                name='radioGroup-column'
                radioItems={favoriteFoods}
                label="Column"
                description={undefined}
              />
            </div>
            <div className='span-12 lg:span-6 p-4 pb-4 bg-default text-colors rounded-md'>
              <RadioGroup 
                {...RadioGroupProps} 
                variant='columnInline' 
                name='radioGroup-columnInline'
                radioItems={favoriteFoods}
                label="Column-Inline"
                description={undefined}
                disabled
              />
            </div>
          </div>

          {/* Card Layouts */}
          <div className='spacing mt-4 p-4 pb-8 bg-div rounded-md'>
            <div className='span-12 pb-2'>
              <h3 className='pb-2 pt-1 label-colors'>Card variations</h3>
            </div>

            {/* Default */}
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Containers</h4>
            </div>
            <div className='default-layouts spacing pb-8'>
              <Card cardStyles='span-12 lg:span-4 p-4' outline='default' background='default'>
                Default layout
              </Card>

              <Card cardStyles='span-12 lg:span-4 p-4' outline='none' background='none'>
                Default layout
              </Card>

              <Card cardStyles='span-12 lg:span-4 p-4' outline='default' background='none'>
                Default layout
              </Card>
            </div>


            {/* Card */}
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Cards</h4>
            </div>
            <div className='card-layouts spacing pb-8'>
              <Card
                type='card' 
                title='Card Layout'
                description='The description of a card style element'
                cardStyles='span-12 lg:span-4 p-4' outline='default' background='default'
              >
                <div>Card content</div>
                <div>Card content</div>
              </Card>

              <Card
                type='card' 
                title='Card Layout'
                description='The description of a card style element'
                cardStyles='span-12 lg:span-4 p-4' outline='default' background='none'
              >
                <div>Card content</div>
                <div>Card content</div>
              </Card>

              <Card
                type='card' 
                title='Card Layout'
                description='The description of a card style element'
                cardStyles='span-12 lg:span-4 p-4' outline='none' background='none'
              >
                <div>Card content</div>
                <div>Card content</div>
              </Card>
            </div>



            {/* Card Buttons */}
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Card Buttons</h4>
            </div>
            <div className='card-layouts spacing pb-8'>
              <Card
                type='card-button' 
                title='Card Button Layout'
                description='The description of a card button element'
                cardStyles='span-12 lg:span-6 p-4' outline='default' background='default'
                buttonProps={{displayText: 'Create', onClick: () => {}}}
                >
                <div>Card button content</div>
                <div>Card button content</div>
              </Card>
              
              <Card
                type='card-button' 
                title='Card Button Layout'
                description='The description of a card button element'
                cardStyles='span-12 lg:span-6 p-4' outline='default' background='none'
                buttonProps={{displayText: 'Create', onClick: () => {}}}
                >
                <div>Card button content</div>
                <div>Card button content</div>
              </Card>
            </div>

            {/* Card Links */}
            <div className='span-12 pb-2'>
              <h4 className='pb-2 pt-1 label-colors'>Card Links</h4>
            </div>
            <div className='card-layouts spacing pb-8'>
              <Card
                type='card-link' 
                title='Card Link Layout'
                description='The description of a card link element'
                cardStyles='span-12 lg:span-6 p-4' outline='default' background='none'
                linkText='Card link' onClickLink={() => {}}
              >
                <div>Card link content</div>
                <div>Card link content</div>
              </Card>
              
              <Card
                type='card-link' 
                title='Card Link Layout'
                description='The description of a card link element'
                cardStyles='span-12 lg:span-6 p-4' outline='default' background='default'
                linkText='Card link' onClickLink={() => {}}
              >
                <div>Card link content</div>
                <div>Card link content</div>
              </Card>
            </div>
          </div>


          <div className='pb-96'></div>
          <div className='pb-96'></div>
          <div className='pb-96'></div>
          <div className='pb-96'></div>
          <div className='pb-96'></div>
          <div className='pb-96'></div>
        </MainContent>

          {/* TODO: Add a component used in the app to save the user's previous session, and policy submission information for when they open the site again, to navigate back to where they left off */}
          {/* TODO: Add a sidebar for displaying and debugging save state, that captures both saved and retrieved information that's sent to the backend when autosaved during submissions and during retrieval */}
          {/* TODO: Add debugging and your own util function that overrides console logging (and learn how to use other libraries for capturing and diagnostics, and how to have it as a universal import) */}

          {/* TODO: Create a nice landing page and dashboard that's interactive with the ability to sign in, create a claim, and navigate to next steps / user's policy information for home and auto */}
          {/* TODO: Create an interactive application with animations and a step by step process for creating a claim for both home and auto  */}
          {/* TODO: Create the login/sign in pages and the dashboard */}

          {/* Different platforms to navigate to: */}
          {/* 
            Homepage navbar 
              - Home 
              - Demos
              - Mock Database
              - etc.

            Settings/User Login
              - User
              - Settings
              - etc.
          */}

          {/* 
            Mock Database
              A way to create fake databases. Creating individual tables, their values, and relations
                - Created data gets sent to the backend for constructing mock databases dynamically. Attach
                    databases to each account, and retrieve values from the backend when logging in.
                    The data is transient, but the table structures can be cached in localStorage
            
              Popovers
              - Sidebar (Tables of the current database)
                - Allows the user to select and rearrange the current list of tables for the selected database
              - TopBar - Information / Data / Edit
                - Information:  The information about the current table (to edit / move the list of it's params)
                - Data:         The values that the database currently has on the table
              - BottomBar (the list of databases, and where to create a new one)
                - Contains boxes of the current databases, and the way to create additional ones.
                - Separate menu for creating a database from scratch, use the edit tab of a specific database to delete it

              - skeleton loaders for values on each of the tabs, loading / error / okay state for color / glow loading anim
              - drag and drop functionality for reordering the table's params, or the values of a table
              - ability to select table and it's foreign keys to display in the data tables
              - eventual bottom border display for inputs on whether the current value is being saved or 
                  in sync with the backend. Like a horizontal loading bar that slides to the right while loading

          */}

          {/* 
            Insurance Demo
              - User dashboard
              - Landing page -> with links to navigate to the other portals
              - Submit a claim page - home and auto
                - Sidebar for steps, fade in/out animations for each step, with a way to add and navigate between steps
                - Business logic for dynamically handling what needs to be filled out during a quote
                - Current submit claim state should be saved on the backend, tied the guid for retrieval
                - Eventual logic should save the form data to the backend while they're entering the information on the backend
          */}

          {/* Submit a claim, for home and auto */}
          {/* Login page should accept dummy data, or a universal user for quick access */}
          {/* An additional settings page to determine whether to use mock data for the insurance page, or a backend */}
          {/* Backends for handling data, and try out clustering */}

      </LoginContext.Provider>
    </AppSpacing>
  );
}


export default App;


const Container = styled.div``;
const SelectElement = styled.button``;
const CurrentlySelected = styled.div``;
const DropdownItems = styled.div``;
const PrecedingSelectItemElements = styled.div``;
const SubsequentSelectItemElements = styled.div``;
