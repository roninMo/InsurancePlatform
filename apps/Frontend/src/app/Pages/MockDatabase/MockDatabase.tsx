import { ChangeEvent, useContext, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { array, boolean, InferType, mixed, object, string } from 'yup';
import { Navbar } from '../../Components/Navbar/Navbar';
import { Button, Input, TooltipService } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './MockDatabase.module.scss';
import { Card } from '../../Components/Content/Card/Card';


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



// Password
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// FileUpload
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const VALID_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];


const schema = object({
	database: string()
    .oneOf(['db1', 'db2', 'db3'], 'Please select a valid database')
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

  checkboxTest: array()
    .required('Skills selection is required'),

	user: object({
		email: string()
			.trim()
			.lowercase()
			.email('Invalid email format')
			.matches(
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				'Email must have a valid domain extension (e.g., .com)'
			)
			.required('Email is required'),
		password: string()
			.required('Password is required')
			.matches(pwdRegex, 'Password must be 8+ characters with 1 letter and 1 number'),
	}),
	
	profilePicture: mixed<File>()
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



export const MockDatabase =() => {
	const tooltipContext = useContext(TooltipService);
	const tooltip = useMemo(() => ({ text: 'The email for this account.' }), []);
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

	const { handleSubmit, formState: { errors } } = formMethods;

  const onSubmit = (data: TestForm) => {
    console.log('Validated Form Data:', data);
  };

	// custom state handling (non rhf)
	const [value, setValue] = useState<string>('');
	const updateValue = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e?.target?.value;
		setValue(newValue);
	}


  return (
		<FormProvider {...formMethods}>
			{/* Navbar */}
			<Navbar />
			<div className='dropdown-spacing py-10' />

			<div className='p-4'>
				<form onSubmit={handleSubmit(onSubmit)} className='spacing col gap-2 p-4 bg-div outline-css outline-default'>
					<h4 className='span-12 pb-10 py-2'> 
						Mock Database 
					</h4>
					
					<div className='span-12 lg:span-6'>
						<Input 
							type="text" name="user.email"
							label='Email'
							description="What is your account's email?"
							error={ errors?.user?.email?.message }
							tooltipContext={tooltipContext}
							tooltipContent={tooltip}

							// useState override
							// value={value}
							// onChange={updateValue}
						/>
					</div>

					<div className='span-12 text-right p-4'>
						<Button displayText='Submit' type='submit' color='primary' />
					</div>
				</form>
			</div>
		</FormProvider>
  );
}


// Styled components
const FormContainer = styled.form``;