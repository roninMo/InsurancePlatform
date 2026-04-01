import styles from './ParamTable.module.scss';


export interface ParamItem {
	name: string;
	type: ParamType | ReactNode;
	description: ReactNode;
	
	contextParam?: boolean; // used to signify certain variants. e.g. type="email"
	variantOption?: boolean;
}

export interface ParamTableProps {
	params: ParamItem[];
	variant: 'default' | 'additionalParams';
	additionalStyles?: string;
}

export function ParamTable() {
  return (
    <div className="">
      <h4>Welcome to ParamTable!</h4>
			
		{/* Param Table */}			
		{/* 
	    Grid layout or two column layout
				- Header with Name, type, and description
				- each param should have these values passed in with additional options
				  - custom options for variants with required values to change styles
					- add contextual highlighting for these values (ex. type=email highlighted green)
					- another theme for additional options specific to variant specific params
			  - slightly different param table for additional params on each variant
				- Either collapse the original table by default for variant with additional dropdown for variant param table below
				
		
				
			
			Layout - (Quick reference, try building it with grid's two column layout)
			  <Container classname="w-full col gap-2 p-4 bg-div outline-css outline-styles">
				  <Headers classname="spacing gap-2 outline-css rounded-none outline-styles">
					  <label classname="span-6 md:span-3">Name</label>
					  <label classname="span-6 md:span-2">Type</label>
					  <label classname="span-12 md:span-7">Description</label>
					</Headers>
					
					{ params.map(({ name, type, description}: ParamItem) =>
					  <Param classname="spacing gap-2 outline-css rounded-none outline-styles">
					    <label classname="span-6 md:span-3">{ name }</label>
					    <label classname="span-6 md:span-2">{ type }</label>
					    <label classname="span-12 md:span-7">{ description }</label>
					  </Param>
					)}
				</Container>
			
			
		*/}
    </div>
  );
}


// Styled Components
const Container = styled.div´´;
const Headers = styled.div´´;
const Param = styled.div´´;

