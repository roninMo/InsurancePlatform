import { Navbar } from '../../Components/Navbar/Navbar';
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
			
		

*/
export const MockDatabase =() => {
  return (
   	<>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-spacing py-10' />

      <div className='p-4'>
        <h4> Mock Database </h4>

      </div>
    </>
  );
}

export default MockDatabase;
