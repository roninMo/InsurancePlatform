import { ChangeEvent, Dispatch, SetStateAction, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { FieldErrors, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { array, boolean, InferType, mixed, object, string } from 'yup';
import { Navbar } from '../../Components/Navbar/Navbar';
import { Card } from '../../Components/Content/Card/Card';
import { Button, Checkbox, CheckboxItem, Input, makeRecord, mapRecord, RadioGroup, RadioItem, RadioTable, Select, SelectItem, Slider, Textarea, TooltipService } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './MockDatabase.module.scss';


/*

	Creating Mock Data
		- when creating the database tables, separately create relational contexts
			- foreign key list (paramName, table)
			- relations (other tables that have this one as a foreign key (same data))
			- state to determine whether a table has foreign keys, is only relational, or isolated
			-loop through tables in that order
			
		- mock data options
			- random factor of how often a foreign table is created for a table
			- relational or isolated set how many are made with a random factor
			
			
		- Redux implementation
	- id maps of the table item data
	- databases and auto generated content specifically saved for the user
	- ability to save custom/user entered data to the backend for tables
	- selectors for tables and their relational data based on user table relation selection
	- reducers for handling database and table creation and configuration
	- saved data mutations for config edits
	- updated table structure and db edits should be dynamic
		- updating individual params should only retrieve that information from backend
		- user table data should be stored in localStorage for persistance (safe and performant)
		- users should have all db's stored in redux for quick access. 
			- only retrieve what's selected, and cache when switching dbs and tables
		- when user reopens the page, retrieve localStorage data and 
		- then check backend for updates / custom data
	- option to export db creation schema for different databases/orms
		- mysql/nosql, raw and orm - postgres, sequelize, prism, mongo, apolloGraphql, .net? orleans?
		- for complex versions like orleans, create multiple files for grain logic
		
		
Table Param types
	- id (normal / guid)
		- primary key
		- required
		- increments
		
	- string
		- limit
		- required
		
	- number
		- limit
		- required
		
Context options 
	- header value (title displayed for each item in the rendered list)
	- keyword (used to know how to autofill)
		- tabs: user, pop culture, typography
		
		- user information
			- names (first and last)
			- phone numbers
			- birth dates
			- socials
			- emails, linkedin, social accounts
			- generic usernames, passwords
			- age 
			- gender
			- street address, city, state, zip, country
			- credit card, exp date, ccv
			
		- pop culture references
			- books, authors, comics
			- movies, tv shows, directors, actors
			- games, consoles
			- misic, albums, artists
			- sports teams
			
		- typography
			- lorem ipsum sentences, paragraphs, words
			- titles
			- dates
			- numbers 0-10, 0-100, etc
			- currencies 0-10, 0-100, etc
			
		
		
			
	Page data layout
		- mock app
			- databases
			- tables
			
		- content page
			- pass in table and relational tables rendered
			- table items (map of id to items)
			- item order hash (map of id to sort order)
			- while they create the db, calculate the relational contexts for context options
				- notifications for if the current updates to the db require them to fill in the proper autofill data options for each table
			
				
	- Components
		- siderbar (selected tables)
		- tob bar
		- content page
		- bottom popover (select / new table)
		
		- create db page (content)
			- dbConfigComp
			- create table comp
				- paramListComp
					- addParamComp
				- paramOptionsSection
					- paramConfigComp
					- paramContextComp
		- information page
			- db stats, table stats, values stats
		- values page
			- TableItem (quick display, move/depete, dropdown -> table item values)
			- edit value comp (modal on edit selection)
		- edit page
			- edit table components ^
			- * a history button on this page that allows you 
			
			
	- Backend routes
		- add mockDb
		- update mockDb should be done in batches (possible just edit Table) with context data for how to migrate table data if there's any custom data
		- delete mockDb
		
		- add Table
		- edit Table
		- delete Table
		- update Table
		
		- add Table Param
		- edit Table Param
		- delete Table Param
		- update Table Param

		- alongside any of the creation, edit, or deletion routes, add internal history tracking
			- keeps track of what values were changed, that captures the current options whenever the database is changed:
				- generateMockData config
				- custom MockData 
			- Allows you to go back to specific version while retaining the same data that the user previously had with minimal storage space used
			- DBHistoryTable
				- id
				- databaseId
				- updateIndex / version
				- editAction ( "table1 param value's type changed" )
				- custom MockData - if there's custom mockData, capture it
			- Focus on 
				- the current table structure
				- the current param's mock data generation config
			- Ideally
				- travel back through each index to specific history states
				- keep track of the table structures and mock gen config as you go 	
				- do not generate mock data until the index is reached? TODO: or find a better way to access (cache current index on serve?)
				- send the user the current state for the specific history index requested

				
		- get History Actions Param
		
		- if changes end up affecting the values, pass back updates tables

*/



// validation consts
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// FileUpload
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const VALID_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Form validations
const schema = object({
		user: object({
			email: string()
				.trim()
				.lowercase()
				.email('Invalid email format')
				.matches(emailRegex, 'Email must have a valid domain extension (e.g., .com)')
				.required('Email is required'),
			password: string()
				.required('Password is required')
				.matches(pwdRegex, 'Password must be 8+ characters with 1 letter and 1 number'),
		}),

	database: string()
    .oneOf(['databaseA', 'databaseB', 'databaseC'], 'Please select a valid database')
    .required('You must select a database'),
	tables: array()
    .of(string()
			.oneOf(['table1', 'table2', 'table3'], 'Invalid table selected')
			.required()
		)
    .min(1, 'Select at least one table')
    .max(3, 'You can select a maximum of 3 tables')
    .required('Skills selection is required'),
	
	retrieveServerData: boolean().optional(),
		// .nullable(), // .notRequired()

	radioGroupTest: string()
    .oneOf(['item1', 'item2', 'item3'], 'Please select a valid radio item')
    .required('You must select a radio item'),
		
	radioTableTest: string()
    .oneOf(['item1', 'item2', 'item3'], 'Please select a valid radio table item')
    .required('You must select a radio table item'),

  checkboxTest: array().min(1, 'Skills selection is required.'),

	databaseLogo: mixed<File>()
    .required('A file upload is required')
    .test('fileSize', 'File size must be less than 2MB', (value) => {
      return value ? value.size <= MAX_FILE_SIZE : false;
    })
    .test('fileType', 'Unsupported file format', (value) => {
      return value ? VALID_FILE_TYPES.includes(value.type) : false;
    }),

		textareaTest: string()
			.max(500)
			.required(),
		// textareaFileUpload
});

// Type reference if needed
export type TestForm = InferType<typeof schema>;



export const MockDatabase = () => {
	const tooltipContext = useContext(TooltipService);
	const emailTooltip = useMemo(() => ({ text: 'The email for this account.' }), []);
	const passwordTooltip = useMemo(() => ({ text: 'The password for this account.' }), []);
	const dbTooltip = useMemo(() => ({ text: 'The selected database.' }), []);
	const tableTooltip = useMemo(() => ({ text: 'The tables to search.' }), []);
  const formMethods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      database: undefined,
      tables: [],
      retrieveServerData: false,
      radioGroupTest: undefined,
      radioTableTest: undefined,
      checkboxTest: [],
      user: { email: '', password: '' },
      textareaTest: '',
    },
  });

	// Rhf hook
	const { handleSubmit, formState: { errors } } = formMethods;
  const onSubmit = (data: TestForm) => {
    console.log('\nValid Form Data:', data);
  };
	const onInvalid = (errors: FieldErrors<TestForm>) => {
    console.log('\ninvalid Form Data:', errors);
		console.log(`rhf state: `, formMethods.getValues());
  };


	//--------------------------//
	// Rhf Toggle								//
	//--------------------------//
	const usingRhf = true; 


	const [email, setEmail] = useState<string>('');
	const [pass, setPass] = useState<string>('');
	const [textareaVal, setTextareaVal] = useState<string>('');
	const updateEmail = useCallback((e: ChangeEvent<any>) => { 
		console.log(`${e?.target?.value}`); 
		if (!usingRhf) setEmail(e?.target?.value); 
	}, []);

	const updatePass = useCallback((e: ChangeEvent<any>) => { 
		console.log(`${e?.target?.value}`); 
		if (!usingRhf) setPass(e?.target?.value); 
	}, []);

	const updateTextarea = useCallback((e: ChangeEvent<any>) => { 
		console.log(`${e?.target?.value}`); 
		if (!usingRhf) setTextareaVal(e?.target?.value); 
	}, []);


	const [dbItems, setDbItems] = useState<SelectItem[]>([ ...databaseValues ]);
	const updateDbItems = useCallback((updatedItem: SelectItem) => {
		console.log(`updated ${updatedItem.value}, isSelected: ${updatedItem.selected}, data: `, {updatedItem, items: dbItems});
		if (!usingRhf) {
			setDbItems(pv => pv.map(item => updatedItem.value == item.value ? updatedItem : item));
		}
	}, []);
	
	const [tableItems, setTableItems] = useState<SelectItem[]>([ ...tableValues ]);
	const updateTableItems = useCallback((updatedItem: SelectItem) => {
		// console.log(`updated ${updatedItem.value}, isSelected: ${updatedItem.selected}, data: `, {updatedItem, items: tableItems });
		// if (!usingRhf) setTableItems(pv => pv.map(item => updatedItem.value == item.value ? updatedItem : item));
	}, []);


	const [chbxItems, setChbxItems] = useState<Record<string, CheckboxItem>>(makeRecord(chbxVals, item => [item.value, item]));
	const updateChbx = useCallback((e: ChangeEvent<HTMLInputElement>, checked: CheckboxItem) => {
		console.log(`${checked.label} ${checked.checked ? 'checked' : 'unchecked'}, data: `, { checked, chbxItems });
		if (!usingRhf) setChbxItems(mapRecord(chbxItems, (k, v) => v.value == checked.value ? checked : v)); // useState update
	}, []);

	const [retServerData, setRetServerData] = useState<'true' | 'false'>('false');
	const updateRetServerData = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const checked = e?.target?.value as 'true' | 'false';
		console.log(`retrieveServerData: ${checked}`);
		setRetServerData(checked);
	}, []);

	const [radioItem, setRadioItem] = useState<RadioItem>({ label: '', value: '' });
	const [radioTableItem, setRadioTableItem] = useState<RadioItem>({ label: '', value: '' });
	const updateRadioGroup = useCallback((e: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
		console.log(`${selected.label} selected: `, selected);
		if (!usingRhf) setRadioItem(selected);
	}, []);

	const updateRadioTable = useCallback((e: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
		console.log(`${selected.label} selected: `, selected);
		if (!usingRhf) setRadioTableItem(selected);
	}, []);


  return (
		<FormProvider {...formMethods}>
			{/* Navbar */}
			<Navbar />
			<div className='dropdown-spacing py-10' />

			<div className='row justify-center pt-20'>
				<form onSubmit={handleSubmit(onSubmit)} className='spacing p-8 w-3/4 gap-2 bg-div outline-css outline-default'>
					<h3 className='span-12 pb-10'> 
						Mock Database 
					</h3>
					
					
					<h4 className='span-12 pb-4'> 
						React Hook forms example
					</h4>
					
					<Card type='default' noBackground additStyles='spacing gap-y-4 gap-x-8 lg:p-8'>

						{/* Email */}
						<div className='span-12 lg:span-6'>
							<Input 
								type="email" name="user.email"
								label='Email' placeholder='email@example.com'
								description="What is your account's email?"
								
								value={!usingRhf ? email : undefined} // useState override
								onChange={updateEmail}
								error={ errors?.user?.email?.message }
								tooltipContext={tooltipContext} tooltipContent={emailTooltip}
							/>
						</div>

						{/* Password */}
						<div className='span-12 lg:span-6'>
							<Input 
								type="password" name="user.password"
								label='Password' placeholder='Enter your password'
								description="The password of this account."

								value={!usingRhf ? pass : undefined} // useState override
								onChange={updatePass}
								error={ errors?.user?.password?.message }
								tooltipContext={tooltipContext} tooltipContent={passwordTooltip}
							/>
						</div>

						
						<h5 className='span-12 pt-10'> 
							Database information
						</h5>
						
						{/* Database (Select) */}
						<div className='span-12 lg:span-8'>
							<Select 
								name="database"
								label='Select a database'
								description='The databases that are saved to this account.'
								placeholder='Select a database...'

								values={Object.values(dbItems || {})}
								onSelect={ updateDbItems }
								error={ errors?.database?.message }
								tooltipContext={tooltipContext} tooltipContent={dbTooltip}
							/>
						</div>

						{/* Tables (MultiSelect) */}
						<div className='span-12 lg:span-6 col gap-2'>
							<Select 
								name="tables"
								label='Tables'
								description="The tables that you'd like information about."
								placeholder='Select some tables...'

								multiSelect
								values={tableItems}
								onSelect={updateTableItems}
								error={ errors?.tables?.message }
								tooltipContext={tooltipContext} tooltipContent={tableTooltip}
							/>

							
							{/* checkboxTest */}
							<div className='pt-3 inline-flex'>
								<Checkbox 
									name="checkboxTest" variant="inline"
									label="Checkbox Test"
									description="The Checkbox test's description."

									items={chbxItems}
									onSelect={updateChbx}
									disableHookForms={!usingRhf}
									error={ errors?.checkboxTest?.message }
								/>
							</div>
						</div>
						{/* <div className='span-12 -mt-10' /> */}

						{/* retrieveServerData (Slider) */}
						<div className='span-12 lg:span-6 pt-[18px]'>
							<div className='inline-flex'>
								<Slider 
									name="retrieveServerData"
									label='Retrieve Server Data'
									description='Download custom data from the server?'
									value={retServerData}
									onChange={updateRetServerData}
								/>
							</div>
							<div className='pt-12 inline-flex'>
								<Slider 
									name="unaffiliatedSliderTest"
									label='Use cached data'
									description="Use save data that's been cached locally?"
								/>
							</div>
						</div>

						{/* Rendered form values */}
						<div className='spacing pt-4'>
							<RenderedItems name="tables" styles='span-12 lg:span-6' />
							<RenderedItems name="database" styles='span-12 lg:span-6' />
							
						</div>


						{/* radioGroupTest */}
						<div className='span-12 lg:span-6'>
							<RadioGroup 
								name="radioGroupTest" variant='list'
								label='RadioGroup Test'
								description="The RadioGroup test's description."
								radioItems={radioVals}
								
								currentValue={radioItem}
								onSelect={updateRadioGroup}
								disableHookForms={!usingRhf}
								error={ errors?.radioGroupTest?.message }
							/>
						</div>
						
						<div className='span-12 lg:span-6'>
							{/* <RadioTable 
								name="RadioTableTest"
								label='RadioTable Test'
								description="The RadioTable test's description."
								radioItems={radioVals}
								
								currentValue={radioItem}
								onSelect={(e, s) => updateRadio(e, s, 'rg')}
								error={ errors?.radioTableTest?.message }
							/> */}
						</div>

						{/* radioTableTest */}
						<div className='span-12 lg:span-6'>
							
						</div>
						
						{/* databaseLogo (File Upload) */}
						<div className='span-12 lg:span-6'>
							
						</div>

						{/* Textarea */}
						<div className='span-12' />
						<div className='span-12 pr-8'>
							<Textarea 
								type='default' name='textareaTest'
								label='Textarea Label'
								placeholder='Type something...'
								// description='The textarea input for this form.'

								value={!usingRhf ? textareaVal : undefined}
								onChange={updateTextarea}
								error={ errors?.textareaTest?.message }

								submitButtonText='Submit' submitButtonType='submit'
								onSubmit={handleSubmit(onSubmit, onInvalid)}
							/>
						</div>




						{/* <div className='span-12 text-right pt-4'>
							<Button displayText='Submit' type='submit' color='primary' size='md' />
						</div> */}
					</Card>
				</form>
			</div>
		</FormProvider>
  );
}


// Styled components
const FormContainer = styled.form``;


const databaseValues: SelectItem[] = [
	{ label: 'None', value: '' },
	{ label: 'Database A', value: 'databaseA' },
	{ label: 'Database B', value: 'databaseB' },
	{ label: 'Database C', value: 'databaseC' },
];

const tableValues: SelectItem[] = [
	{ label: 'Table1', value: 'Table1' },
	{ label: 'Table2', value: 'Table2' },
	{ label: 'Table3', value: 'Table3' },
];

const chbxVals: CheckboxItem[] = [
	{ value: 'Value1', label: 'Value 1', description: '', checked: false },
	{ value: 'Value2', label: 'Value 2', description: '', checked: false },
	{ value: 'Value3', label: 'Value 3', description: '', checked: false },
	{ value: 'Value4', label: 'Value 4', description: '', checked: false },
];

const radioVals: RadioItem[] = [
	{ value: 'Radio1', label: 'Radio 1', description: 'The description of Radio 1', disabled: false },
	{ value: 'Radio2', label: 'Radio 2', description: 'The description of Radio 2', disabled: false },
	{ value: 'Radio3', label: 'Radio 3', description: 'The description of Radio 3', disabled: false },
	{ value: 'Radio4', label: 'Radio 4', description: 'The description of Radio 4', disabled: false },
];


const RenderedItems = ({ name, styles }: { name: string, styles?: string }) => {
	const { watch } = useFormContext() || {};
	const formValues = watch(name);
	const getValues = () => Array.isArray(formValues) ? [...formValues].sort() : [formValues];
	const getComputedVal = (val: any) => {
		if (val === true) return 'true';
		if (val === false) return 'false';
		if (val === null) return 'null';
		if (val === undefined) return 'undefined';
		if (val === '') return 'empty string';
		return val;
	}

	return (
		<div className={`rendered-form-vals-c ${styles}`}>
			<span className='rendered-form-vals-header'>
				&nbsp;{ name }'s <span className='text-base'>values</span>
			</span>
			<div className='my-1 mb-2.5 border-b border-default' />

			<div className='rendered-form-vals-items-c'>
				{ getValues().map(value => (
					<div className='rendered-form-vals-item' key={`${name}-disp-${getComputedVal(value)}`}> 
						{ getComputedVal(value) }
					</div>
				))}
			</div>
		</div>
	)
}