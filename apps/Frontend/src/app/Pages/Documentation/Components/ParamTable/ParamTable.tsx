import { ComponentType, ReactNode, useId } from 'react';
import { ParamType, ParamTypeProps } from '../ParamType/ParamType';

import styled from '@emotion/styled';
import styles from './ParamTable.module.scss';

/* Param Table	
	Grid layout or two column layout
		- Header with Name, type, and description
		- each param should have these values passed in with additional options
			- custom options for variants with required values to change styles
			- add contextual highlighting for these values (ex. type=email highlighted green)
			- another theme for additional options specific to variant specific params
		- slightly different param table for additional params on each variant
		- Either collapse the original table by default for variant with additional dropdown for variant param table below
*/


export interface ParamItem {
	name: string;
	type: ReactNode; // we're using ParamType
	description: ReactNode;
	
	contextParam?: boolean; // used to signify certain variants. e.g. type="email"
	variantOption?: boolean; // parameters highlighted because they're specific to a certain variant
}

export interface ParamTableProps {
	params: (ParamItem | 'spacing')[]; // This is reliant on that the items come in threes
	variant?: 'default' | 'additionalParams';
	additionalStyles?: string;
}

export const ParamTable = ({ params, variant = 'default', additionalStyles}: ParamTableProps) => {
	const tableItemId = useId();
  return (
		<Table className="param-item-table dual-column-3">
			
			{/* Header */}
			<label className="param-item-base">Name</label>
			<label className="param-item-base">Type</label>
			<label className="param-item-base">Description</label>

			{/* Param Items */} {/* Add variant context styles ex: type="text" */}
			{ params?.map((item: ParamItem | 'spacing', index: number) => 
				<TableItem item={item} key={`paramTableItem-${tableItemId}-${index}`} />
			)}
			
		  {/* todo: Additional variant params */}
		</Table>
  );
}


interface TableItemProps {
	item: ParamItem | 'spacing';
}
const TableItem = ({ item }: TableItemProps)  => {
	// Create spacing between each of the params, like an empty row
	if (typeof item == "string") {
		return (
			<>
				<div className='param-item-spacing' />
				<div className='param-item-spacing' />
				<div className='param-item-spacing' />
			</>
		);
	}

	// Standard logic
	const { name, type, description, contextParam, variantOption } = item;
	let variantStyles = '';
	if (contextParam) variantStyles += ' param-item-context';
	if (variantOption) variantStyles += ' param-item-variant-opt';

	return (
		<>
			<div className={`param-item-base ${variantStyles}`}>
				<div className='param-item-name'>{ name }</div>
			</div>
			<div className={`param-item-base ${variantStyles}`}>
				{ type }
			</div>
			<div className={`param-item-base ${variantStyles}`}>
				{ description }
			</div>
		</>
	);
}

// Styled Components
const Table = styled.div``;
const Param = styled.div``;
