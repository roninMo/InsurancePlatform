import { useState, MouseEvent, Dispatch, SetStateAction, ChangeEvent, useId, useContext, useMemo } from 'react';
import { Card } from '../../../Components/Content/Card/Card';
import { 
  Button, 
  defaultBoxMetadataTags, 
  defaultPostMetadataTags, 
  Checkbox,
  CheckboxItem,
  CheckboxProps,
  Dropbox, 
  Input, 
  InputProps_Email, 
  RadioGroup, 
  RadioGroupProps,
  RadioItem, 
  RadioTable, 
  Select, 
  SelectItem, 
  Slider, 
  Textarea, 
  TextInputTypes,
  TooltipService, 
} from '@Project/ReactComponents';

import styles from './CustomContent.module.scss';


export const CustomContent = () => {
  const tooltipContext = useContext(TooltipService);
  const genericTooltipContent = useMemo(() => ({ text: 'Tooltip text...'}), []);

  // #region Input Elements
  // Input
  const inputId = useId();
  const [input, setInput] = useState<string>("");
  const inputChanged = (e: ChangeEvent<HTMLInputElement>) => setInput(e?.target?.value);
  const [inputError, SetInputError] = useState<boolean>(false);
  const [inputErrorMessage, SetInputErrorMessage] = useState<string>();

  const inputTypeId = useId();
  const [inputType, setInputType] = useState<SelectItem>({ value: 'search', label: 'Select an input type...'});
  const types: TextInputTypes[] = ['text', 'email', 'password', 'phone', 'creditCard', 'currency', 'policyNumber', 'search'];
  const inputTypes: SelectItem[] = types.map(type => ({ value: type, label: type }));
  const inputTypeChanged = (selected: SelectItem, index: number) => {
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

  // Email input error/disable toggles
  const [disabled, setDisabled] = useState<boolean>(false);
  const toggleDisabled = () => setDisabled(!disabled);
  const toggleError = (setState: Dispatch<SetStateAction<boolean>>, setMessageState: Dispatch<SetStateAction<string | undefined>>, errorState: boolean, errorMessage?: string) => {
    if (!setState) return;

    setState(errorState);
    setMessageState(errorMessage);
    // console.log('toggle error: ', {errorState, errorMessage, setStates: {setState, setMessageState}});
  }

  // SelectIcons
  const selectIconId = useId();
  const selectIcons: SelectItem[] = [
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
  const [currentIcon, setCurrentIcon] = useState<SelectItem>({ value: '', label: ''});
  const [selectIconError, setSelectIconError] = useState<boolean>(false);
  const [selectIconErrorMessage, setSelectIconErrorMessage] = useState<string>();
  const selectIconChanged = (selected: SelectItem, index: number) => {
    setCurrentIcon(selected);
    // console.log('select: new value: ', {currentIcon, index, selectIcons});
  }

  // Textarea
  const textareaId = useId();
  const [textarea, setTextarea] = useState<string>("");
  const textareaChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setTextarea(e?.target?.value);
  const [textareaError, setTextareaError] = useState<boolean>(false);
  const [textareaErrorMessage, setTextareaErrorMessage] = useState<string>();
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // console.log('submitted text area: ', { value: textarea, error: textareaError && textareaErrorMessage });
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
  const selectedFavoriteFood = (item: RadioItem, currentValue: RadioItem, e?: ChangeEvent<HTMLInputElement>) => {
    setFavoriteFood(item);
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
  const [checkedFoods2, setCheckedFoods2] = useState<{ [key: string]: CheckboxItem }>({
    'none': { ...favoriteFoodsNoDescriptions[0], checked: false },
    'peanutButterJelly': { ...favoriteFoodsNoDescriptions[1], checked: false },
    'ramen': { ...favoriteFoodsNoDescriptions[2], checked: false },
    'broccoliPotatoesAndChicken': { ...favoriteFoodsNoDescriptions[3], checked: false },
  });
  
  const [checkedError, setCheckedError] = useState<boolean>();
  const [checkedErrorMessage, setCheckedErrorMessage] = useState<string>();
  const checkedFavoriteFood = (item: CheckboxItem, event: ChangeEvent<HTMLElement>) => {
    // console.log(`\n${item.label} value: ${item.checked} set to ${!item.checked}`, item);
    setCheckedFoods({ ...checkedFoods, [item.value]: {...item, checked: !item.checked} });
  }
  const checkedFavoriteFood2 = (item: CheckboxItem, event: ChangeEvent<HTMLElement>) => {
    // console.log(`\n${item.label} value: ${item.checked} set to ${!item.checked}`, item);
    setCheckedFoods2({ ...checkedFoods2, [item.value]: {...item, checked: !item.checked} });
  }

  // Slider component
  const [slider, setSlider] = useState<boolean>(false);
  const [sliderError, setSliderError] = useState<boolean>(false);
  const [sliderErrorMessage, setSliderErrorMessage] = useState<string>('');
  const onChangeSlider = () => setSlider(!slider);
  // #endregion

  const [taError, SetTaError] = useState<boolean>(false);
  const [taDisabled, SetTaDisabled] = useState<boolean>(false);
  const toggleTaError = () => SetTaError(!taError);
  const toggleTaDisabled = () => SetTaDisabled(!taDisabled);


  const RadioGroupProps: RadioGroupProps = {
    variant: 'default',
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
    items: checkedFoods,
    onSelect: checkedFavoriteFood,

    error: checkedError,
    errorMessage: checkedErrorMessage,
    disabled: false,
    required: false,
  }

  // Dropbox component
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileUploadError, setFileUploadError] = useState<boolean>(false);
  const [fileUploadDisabled, setFileUploadDisabled] = useState<boolean>(false);
  const handleFiles = (files: FileList | null) => {
    setFiles(files);
    console.log('files uploaded: ', files);
  }


  return (
    <>
      {/* First Section for Input component logic */}
      <div className='spacing mt-4 p-4 pb-8 bg-div outline-css outline-styles'>
        <div className='span-12 md:span-8 lg:span-4 p-2'>
          <Input 
            // type="currency"
            type={inputType.value as TextInputTypes}
            name="Input"
            label="Input"
            description=""
            value={input}
            placeholder="Input text..."
            onChange={inputChanged}
            error={inputError} 
            errorMessage={inputErrorMessage} 
            disabled={disabled}
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />
        </div>

        <div className='span-12 lg:span-3 py-4 *:m-2 rowStart items-start lg:mt-3'>
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

        <div className='span-12 md:span-8 lg:span-4 p-6 pt-2'>
          <Select 
            name="inputType"
            label="Input Type"
            value={inputType}
            values={inputTypes}
            onSelect={inputTypeChanged}
          />
        </div>
        
      </div>

      {/* Input and Textarea */}
      <div className='spacing p-2 bg-div outline-css outline-styles'>
        {/* List of the different input types */}
        <div className='colStart p-4 pb-8  span-12 md:span-6 lg:span-4 *:w-full *:py-2'>
          <h4 className='label-colors'>Inputs</h4>
          <Input 
            type="text" name="TextInputShowcase"
            label="Text Input" description=""
            value="Hello " placeholder="Input Text..."
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />

          <Input 
            type="email" name="EmailInputShowcase"
            label="Email Input" description=""
            value="example@email.com" placeholder="Input Email..."
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />

          <Input 
            type="password" name="PasswordInputShowcase"
            label="Password Input" description=""
            value="password" placeholder="Input Password..."
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />

          <Input 
            type="phone" name="PhoneInputShowcase"
            label="Phone Input" description=""
            value="(123)-456-7890" placeholder="Input Phone..."
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />

          <Input 
            type="creditCard" name="CreditCardInputShowcase"
            label="CreditCard Input" description=""
            value="0000 0000 0000 0000" placeholder="Input Credit Card..."
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />

          <Input 
            type="currency" name="CurrencyInputShowcase"
            label="Currency Input" description=""
            value="$100.00" placeholder="Input Credit Card..."
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />

          <Input 
            type="policyNumber" name="PolicyNumberInputShowcase"
            label="Policy Number Input" description=""
            value="90012345-AB" placeholder="Input Policy Number..."
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />

          <Input 
            type="search" name="SearchInputShowcase"
            label="Search Input" description=""
            value="" placeholder="Search for Something..."
            tooltipContext={tooltipContext}
            tooltipContent={genericTooltipContent}
          />

          {/* Drag and drop component */}
          <div className='mt-2 col gap-4'>
            <Dropbox 
              name="fileUpload"
              label="Upload files"
              description='The description of the dropbox.'
              value={files}
              handleFiles={handleFiles}
              // multiple
              // accept='image/*'
              customIcon='Canvas'

              error={fileUploadError}
              errorMessage='An error occurred.'
              disabled={fileUploadDisabled}
              required
            />

            <div className=''>
              <Button 
                displayText={fileUploadError ? 'Unset Error' : 'Set Error'}
                color={fileUploadError ? 'gray-focus' : 'gray'}
                onClick={() => setFileUploadError(!fileUploadError)}
                additionalStyles='mr-4'
              />
              
              <Button 
                displayText={fileUploadDisabled ? 'Enable' : 'Disable'}
                color={fileUploadDisabled ? 'gray-focus' : 'gray'}
                onClick={() => setFileUploadDisabled(!fileUploadDisabled)}
              />
            </div>
          </div>
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
              error={taError}
              errorMessage="An error occurred."
              disabled={taDisabled}
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
              metadataTags={defaultBoxMetadataTags}
              error={taError}
              errorMessage="An error occurred."
              disabled={taDisabled}
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
              metadataTags={defaultPostMetadataTags}
              error={taError}
              errorMessage="An error occurred."
              disabled={taDisabled}
            />
          </div>
        </div>
      </div>


      {/* Random custom logic and display to show layout and svgs */}
      <div className='spacing p-4 pb-8 bg-div outline-css outline-styles'>
        <div className='span-12 pb-2'>
          <h4 className='pb-2 pt-1 label-colors'>Custom React Input Components</h4>
        </div>

        {/* Input and Select */}
        <div className='span-4 pb-8 px-4 p-2'>
          <Input 
            { ...InputProps_Email } 
            tooltipContext={tooltipContext}
            value={email}
            id={emailId}
            onChange={emailChanged}
            error={emailError} 
            errorMessage={emailErrorMessage} 
            required={false} 
            disabled={false}
          />
        </div>

        <div className='span-4 pb-8 px-4 p-2'>
          <Select 
            name="selectIcons"
            label="Selected Svgs"
            description="A list of the svgs currently available for the project."
            value={currentIcon}
            values={selectIcons}
            onSelect={selectIconChanged}
            placeholder='Select a value'

            error={selectIconError}
            errorMessage={selectIconErrorMessage}
            disabled={false}
            required={false}
          />
        </div>
        
        {/* Content Layout */}
        <div className='spacing gap-2 p-4 pt-2'>
          <div className='span-4 p-2 bg-default text-colors rounded-md'>Grid content</div>
          <div className='span-4 p-2 bg-default text-colors rounded-md'>Grid content</div>
          <div className='span-4 p-2 bg-default text-colors rounded-md'>Grid content</div>
          <div className='span-6 p-2 bg-default text-colors rounded-md'>Grid content</div>
          <div className='span-6 p-2 bg-default text-colors rounded-md'>Grid content</div>
          <div className='span-12 p-2 bg-default text-colors rounded-md'>Grid content</div>
        </div>
      </div>


      {/* Radio Tables */}
      <div className='spacing mt-4 p-4 pb-8 bg-div outline-css outline-styles'>
        <div className='span-12 pb-2'>
          <h4 className='pb-2 pt-1 label-colors'>Radio Tables</h4>
        </div>
        
        <div className='span-12 lg:span-6 md:span-10 p-4 pb-4'>
          <RadioTable 
            {...RadioGroupProps} 
            variant='inline' 
            name='radioTable-1'
            radioItems={favoriteFoods}
            onSelect={selectedFavoriteFood}
          />
        </div>
        <div className='span-12 lg:span-6 md:span-10 p-4 pb-4'>
          <RadioTable 
            {...RadioGroupProps} 
            variant='block' 
            name='radioTable-2'
            radioItems={favoriteFoods}
            onSelect={selectedFavoriteFood}
            disabled
          />
        </div>
      </div>


      {/* Slider and list Checkboxes */}
      <div className='spacing mt-4 p-4 pb-8 bg-div outline-css outline-styles'>
        <div className='span-12 pb-2'>
          <h4 className='pb-2 pt-1 label-colors'>Slider and list style Checkbox</h4>
        </div>

        <div className='spacing span-12 p-4 justify-between'>
          <div className='span-12 lg:span-3 p-4 pb-4 bg-default text-colors rounded-md'>
            {[0, 1, 2, 3, 4, 5].map((index) => 
              <Slider 
                name="slider"
                label="Slider"
                description="A slider component"
                value={slider}
                onChange={onChangeSlider}

                error={sliderError}
                errorMessage={sliderErrorMessage}
                required={false}
                disabled={false}
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
      <div className='spacing mt-4 p-4 pb-8 bg-div outline-css outline-styles'>
        <div className='span-12 pb-2'>
          <h4 className='pb-2 pt-1 label-colors'>Default and Inline style Checkboxes</h4>
        </div>
        
        <div className='spacing lg:span-10 xl:span-8 p-4 mx-4'>
          <div className='span-12 p-4 bg-default text-colors rounded-md'>
              <Checkbox 
                {...CheckboxProps}
                items={checkedFoods2}
                onSelect={checkedFavoriteFood2}
                variant='inline'
                name="checkbox-2"
                label="What are your favorite foods?"
                description="Select from the list of our favorite foods."
              />
          </div>

          <div className='span-12 p-4 bg-default text-colors rounded-md'>
              <Checkbox 
                {...CheckboxProps}
                variant='default'
                name="checkbox-3"
                label="What are your favorite foods?"
                description="Select from the list of our favorite foods."
              />
          </div>
        </div>
      </div>


      {/* Radio Groups */}
      <div className='spacing mt-4 p-4 pb-8 bg-div outline-css outline-styles'>
        <div className='span-12 pb-2'>
          <h4 className='pb-2 pt-1 label-colors'>Radio Groups</h4>
        </div>
        
        <div className='span-12 p-4 mx-4 bg-default text-colors rounded-md'>
          <RadioGroup 
            {...RadioGroupProps} 
            variant='default' 
            name='radioGroup-default'
            radioItems={favoriteFoodsNoDescriptions}
            label="Default"
            // error
            // errorMessage='an error occurred'
          />
        </div>
        
        <div className='span-12 p-4 mx-4 bg-default text-colors rounded-md'>
          <RadioGroup 
            {...RadioGroupProps} 
            variant='list' 
            name='radioGroup-list'
            radioItems={favoriteFoods}
            label="List"
          />
        </div>

        <div className='span-12 lg:span-6 p-4 m-4 bg-default text-colors rounded-md'>
          <RadioGroup 
            {...RadioGroupProps} 
            variant='column' 
            name='radioGroup-column'
            radioItems={favoriteFoods}
            label="Column"
            description={undefined}
          />
        </div>
        <div className='span-12 lg:span-6 p-4 m-4 bg-default text-colors rounded-md'>
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
      <div className='spacing mt-4 p-4 pb-8 bg-div outline-css outline-styles'>
        <div className='span-12 pb-2'>
          <h3 className='pb-2 pt-1 label-colors'>Card variations</h3>
        </div>

        {/* Default */}
        <div className='span-12 pb-2'>
          <h4 className='pb-2 pt-1 label-colors'>Containers</h4>
        </div>
        <div className='default-layouts spacing pb-8'>
          <Card additionalStyles='span-12 lg:span-4 p-4' border='default' background='default'>
            Default layout
          </Card>

          <Card additionalStyles='span-12 lg:span-4 p-4' border='none' background='none'>
            Default layout
          </Card>

          <Card additionalStyles='span-12 lg:span-4 p-4' border='default' background='none'>
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
            additionalStyles='span-12 lg:span-4 p-4' border='default' background='default'
          >
            <div>Card content</div>
            <div>Card content</div>
          </Card>

          <Card
            type='card' 
            title='Card Layout'
            description='The description of a card style element'
            additionalStyles='span-12 lg:span-4 p-4' border='default' background='none'
          >
            <div>Card content</div>
            <div>Card content</div>
          </Card>

          <Card
            type='card' 
            title='Card Layout'
            description='The description of a card style element'
            additionalStyles='span-12 lg:span-4 p-4' border='none' background='none'
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
            additionalStyles='span-12 lg:span-6 p-4' border='default' background='default'
            buttonProps={{displayText: 'Create', onClick: () => {}}}
            >
            <div>Card button content</div>
            <div>Card button content</div>
          </Card>
          
          <Card
            type='card-button' 
            title='Card Button Layout'
            description='The description of a card button element'
            additionalStyles='span-12 lg:span-6 p-4' border='default' background='none'
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
            additionalStyles='span-12 lg:span-6 p-4' border='default' background='none'
            linkText='Card link' onClickLink={() => {}}
          >
            <div>Card link content</div>
            <div>Card link content</div>
          </Card>
          
          <Card
            type='card-link' 
            title='Card Link Layout'
            description='The description of a card link element'
            additionalStyles='span-12 lg:span-6 p-4' border='default' background='default'
            linkText='Card link' onClickLink={() => {}}
          >
            <div>Card link content</div>
            <div>Card link content</div>
          </Card>
        </div>
      </div>


      <div className='pb-24' />
    </>
  );
}
