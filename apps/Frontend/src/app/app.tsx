import { ChangeEvent, createContext, Dispatch, SetStateAction, useEffect, useId, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import { UserTokenInformation } from '@Project/Classes';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Cookies from 'js-cookie';
import styled from '@emotion/styled';

import NxWelcome from './nx-welcome';
import { Button, Icon, Input, InputProps_Email, ProjectReactComponents, RadioButton, RadioItem, Select, SelectItemValues, TextInputTypes } from '@Project/ReactComponents';


const AppSpacing = styled.div`
margin: 0;
padding: 0;
min-width: 100vh;
min-height: 100vh;
`;
const RoutesSpacing = styled.div``;
const MainContent = styled.div``;
// p-2 pb-4 text-sm/6 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8


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
  const InputChanged = (e: ChangeEvent<HTMLInputElement>) => setInput(e?.target?.value);
  const [inputError, SetInputError] = useState<boolean>(false);
  const [inputErrorMessage, SetInputErrorMessage] = useState<string>();

  const inputTypeId = useId();
  const [inputType, setInputType] = useState<SelectItemValues>({ value: 'policyNumber', label: 'Select an input type...'});
  const types: TextInputTypes[] = ['text', 'email', 'password', 'phone', 'creditCard', 'currency', 'policyNumber', 'search'];
  const inputTypes: SelectItemValues[] = types.map(type => ({ value: type, label: type }));
  const InputTypeChanged = (selected: SelectItemValues, index: number) => setInputType(selected);


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
    { value: 'profile', label: "Profile", iconProps:              { icon: "Profile", placement: 'left' }},
    { value: 'selectArrows', label: "Select Arrows", iconProps:   { icon: "SelectArrows", placement: 'left' }},
    { value: 'sort', label: "Sort", iconProps:                    { icon: "Sort", placement: 'left' }},
    { value: 'system', label: "System", iconProps:                { icon: "System", placement: 'left' }},
  ];
  const [currentIcon, setCurrentIcon] = useState<SelectItemValues>({ value: '', label: ''});
  const [selectIconError, setSelectIconError] = useState<boolean>(false);
  const [selectIconErrorMessage, setSelectIconErrorMessage] = useState<string>();
  const selectIconChanged = (selected: SelectItemValues, index: number) => {
    setCurrentIcon(selected);
    // console.log('select: new value: ', {currentIcon, index, selectIcons});
  }

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
      description: 'a classic American sandwich with peanut butter and fruit preserves (jelly or jam)'
    },
    {
      value: 'ramen',
      label: 'Ramen Soup',
      description: 'a popular Japanese noodle soup featuring springy wheat noodles in a rich, savory broth of soy sauce and miso, topped with chashu, eggs, nori, and green onions'
    },
    {
      value: 'broccoliPotatoesAndChicken',
      label: 'Broccoli, potatoes, and chicken',
      description: 'A deliciously crafted meal stir fried to perfection.'
    },
  ];
  const favoriteFoods2: RadioItem[] = favoriteFoods.map(item => { return { value: item.value, label: item.label, disabled: item.disabled}});
  const [favoriteFood, setFavoriteFood] = useState<RadioItem>({ value: '', label: ''});
  const [radioItemError, setRadioItemError] = useState<boolean>(false);
  const [radioItemErrorMessage, setRadioItemErrorMessage] = useState<string>('');
  const selectedFavoriteFood = (selected: RadioItem, index: number, currentValue: RadioItem) => {
    setFavoriteFood(selected);
    console.log(`radioButton`, {selected, index, currentValue});
  }


  // #endregion


  const [disabled, setDisabled] = useState<boolean>(false);
  const toggleDisabled = () => setDisabled(!disabled);
  const toggleError = (setState: Dispatch<SetStateAction<boolean>>, setMessageState: Dispatch<SetStateAction<string | undefined>>, errorState: boolean, errorMessage?: string) => {
    if (!setState) return;

    setState(errorState);
    setMessageState(errorMessage);
    // console.log('toggle error: ', {errorState, errorMessage, setStates: {setState, setMessageState}});
  }
  // #endregion


  return (
    <AppSpacing className={`bg-white dark:bg-gray-800`}>
      <div className='bg-white dark:bg-gray-800'>

        <LoginContext.Provider value={{accessToken, userTokenInformation, setUserTokenInformation}}>
          <div role="navigation" className='p-2'>
            <ul>
              <li className='pb-1'>
                <Link to="/">Home</Link>
              </li>
              <li className='pb-1'>
                <Link to="/page-2">Page 2</Link>
              </li>
            </ul>
          </div>

          <RoutesSpacing className='m-10'>
            <Routes>
              <Route 
                path="/"
                element={
                  <div className={`p-2 pb-4 text-sm/6`}>
                    <div>
                      <h2 className={`mb-2`}>Home Page</h2>
                      <p className={`mb-4`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    
                      <button onClick={setTheme}>{currentTheme === "dark" ? 'set to light' : 'set to dark'}</button>
                    </div>
                  </div>
                } 
              />
              
              <Route
                path="/page-2"
                element={
                  <div className={`p-2 pb-4 text-sm/6`}>
                    <Link to="/">Click here to go back to root page.</Link>
                  </div>
                }
              />
            </Routes>
          </RoutesSpacing>


            {/* <div className={"mx-auto sm:px-6 lg:px-8 " + styles}> */} 
            <MainContent className=' grid grid-cols-12 gap-x-6 gap-y-4 px-6 py-4'>

              
              <div className='col-span-12 grid grid-cols-12 gap-x-4 gap-2 mt-4 p-4 pb-8 bg-slate-900 rounded-md'>
                <div className='col-span-4 md:col-span-4'>
                  <Input 
                    type={inputType.value as TextInputTypes}
                    name="Input"
                    label="Input"
                    description=""
                    value={input}
                    placeholder="Input text..."
                    id={inputId}
                    onChange={InputChanged}
                    error={inputError} 
                    errorMessage={inputErrorMessage} 
                    disabled={disabled}
                  />
                </div>

                <div className='col-span-3 pt-8 ml-2'>
                  <Button 
                    displayText={inputError ? 'Disable Error' : 'Enable Error'} 
                    onClick={(e: any) => toggleError(SetInputError, SetInputErrorMessage, !inputError, !inputError ? 'invalid text' : undefined)} 
                  />
                  <Button 
                    displayText={disabled ? 'Enable' : 'Disable'} 
                    onClick={(e: any) => toggleDisabled()} 
                    additionalStyles='ml-4'
                  />
                </div>

                <div className='col-span-3 px-4'>
                  <Select 
                    name="inputType"
                    label="Input Type"
                    value={inputType}
                    values={inputTypes}
                    onSelect={InputTypeChanged}
                    id={inputTypeId}
                  />
                </div>
                
              </div>


              <div className='col-span-12 grid grid-cols-12 gap-x-4 gap-2 mt-4 p-4 bg-slate-900 rounded-md'>
                <div className='col-span-12 pb-2'>
                  <h2>Custom React Input Components</h2>
                </div>

                <div className='col-span-4 pb-8'>
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
                
                <div className='col-span-12 p-2' />
                <div className='col-span-4 p-2 bg-slate-800 rounded-md'>Grid content</div>
                <div className='col-span-4 p-2 bg-slate-800 rounded-md'>Grid content</div>
                <div className='col-span-4 p-2 bg-slate-800 rounded-md'>Grid content</div>
                <div className='col-span-12 p-2 bg-slate-800 rounded-md'>Grid content</div>
                <div className='col-span-12 mr-20 p-2 mt-2 mb-6 border-b border-slate-500' />


                


              <div className='col-span-12 grid grid-cols-12 gap-2 gap-x-8 mt-4'></div>
                  
                <div className='col-span-2 p-2'>
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

                <div className='col-span-4 p-2 pb-4 bg-slate-800 rounded-md'>
                  <RadioButton 
                    variant='default'
                    id={radioButtonId}
                    name='radioButton'
                    label='Favorite Foods'
                    description='What is your favorite food?'

                    values={favoriteFoods}
                    value={favoriteFood}
                    onSelect={selectedFavoriteFood}
                    defaultValue={undefined}

                    error={radioItemError}
                    errorMessage={radioItemErrorMessage}
                    disabled={false}
                    required={false}
                  />
                </div>


                <div className='col-span-8'></div>
              </div>

            </MainContent>


            {/* TODO: Add a component used in the app to save the user's previous session, and policy submission information for when they open the site again, to navigate back to where they left off */}
            {/* TODO: Add a sidebar for displaying and debugging save state, that captures both saved and retrieved information that's sent to the backend when autosaved during submissions and during retrieval */}
            {/* TODO: Add debugging and your own util function that overrides console logging (and learn how to use other libraries for capturing and diagnostics, and how to have it as a universal import) */}

            {/* TODO: Create a nice landing page and dashboard that's interactive with the ability to sign in, create a claim, and navigate to next steps / user's policy information for home and auto */}
            {/* TODO: Create an interactive application with animations and a step by step process for creating a claim for both home and auto  */}
            {/* TODO: Create the login/sign in pages and the dashboard */}

            {/* Different platforms to navigate to: */}
            {/* 
              This project
                - User dashboard
                - Landing page -> with links to navigate to the other portals
            */}

            {/* Submit a claim, for home and auto */}
            {/* The Agent portal for accessing and handling user claims (no clue what to build here) */}
            
            {/* Backends for handling data, and try out clustering */}

        </LoginContext.Provider>
      </div>
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
