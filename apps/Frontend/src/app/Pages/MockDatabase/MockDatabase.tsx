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
