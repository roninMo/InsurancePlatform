import { ReactNode, useId } from 'react';

import styled from '@emotion/styled';
import styles from './ParamTable.module.scss';
import { ParamContext } from '../ShowcaseElement/ShowcaseElement';
import { Dropdown } from '../../../../Components/Content/Dropdown/Dropdown';

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


export type PTableItem = ParamItem | 'spacing';
export interface ParamItem {
	name: string;
	type: React.FC; // we're using ParamType
	description: React.FC;
	
	contextParam?: boolean; // used to signify certain variants. e.g. type="email"
	variantOption?: boolean; // parameters highlighted because they're specific to a certain variant
	
	children?: PTableItem[]; // nested object values - sub tables
}

export interface ParamTableProps {
	params?: PTableItem[]; // This is reliant on that the items come in threes
	variant?: 'default' | 'subTable';
	additionalStyles?: string;
}

export const ParamTable = ({ params, variant = 'default', additionalStyles }: ParamTableProps) => {
	const tableItemId = useId();
  return (
		<Container className={`height-trans grid-rows-[1fr] ${variant == "subTable" ? 'param-subtable' : ''}`}>
			<Table className={`param-item-table dual-column-3 height-trans-content ${additionalStyles}`}>
				
				{/* Header */}
				<label className="param-item-base">Name</label>
				<label className="param-item-base">Type</label>
				<label className="param-item-base">Description</label>
				

			{/* Param Items */}
			{ params?.map((item: PTableItem, index: number) => 
				<ParamTableItem 
					item={item} 
					additionalStyles={additionalStyles}
					key={`paramTableItem-${tableItemId}-${index}`} 
				/>
				)}
			</Table>
		</Container>
  );
}


interface ParamTableItemProps {
	item: PTableItem;
	additionalStyles?: string;
}
export const ParamTableItem = ({ item, additionalStyles }: ParamTableItemProps)  => {
	// Create spacing between each of the params, like an empty row
	if (typeof item == "string" && item == "spacing") {
		return (
			<>
				<div className='param-item-spacing' />
				<div className='param-item-spacing' />
				<div className='param-item-spacing' />
			</>
		);
	}

	// Standard logic
	const { name, type, description, contextParam, variantOption, children } = item;
	const ParamTypeElement = type;
	const ParamDescriptionElement = description;
	
	let contextStyles = '';
	let variantStyles = '';
	if (contextParam) contextStyles = 'param-item-context';
	if (variantOption) variantStyles = 'param-item-variant-opt';


	return (
		<>
			<div className={`param-item-base ${variantStyles}`}>
				<div className={`param-item-name ${contextStyles}`}>{ name }</div>
			</div>
			{/* TODO: check that the param elements here are not redundant, those elements also have param-item-base */}
			<div className={`param-item-base ${variantStyles}`}> 
				{ ParamTypeElement ? <ParamTypeElement /> : null }
			</div>
			<div className={`param-item-base ${variantStyles}`}>
				{ ParamDescriptionElement ? <ParamDescriptionElement /> : null }
			</div>
			

			{ (children && children.length > 0) &&
				<div className='col-span-full ml-4'>
					<Dropdown label={`${name} values`}>
						<ParamTable params={children} variant="subTable" additionalStyles={additionalStyles} />
					</Dropdown>
				</div>

			}
		</>
	);
}

// Styled Components
const Container = styled.div``;
const Param = styled.div``;
const Table = styled.div``;


// TODO: refactor this to add object's params to render subTables, and then remove the docs_input's variant params
export const getParamsTableItems = (
	params: string[], 
	contextParams: ParamContext[], 
	childParamsList: Record<string, string[]>,
	typeElements: Record<string, React.FC>,
	descriptionElements: Record<string, React.FC>,
): PTableItem[] => {
	const paramItems: PTableItem[] = [];
	
	params?.forEach((listItem: string) => {
		if (listItem == 'spacing') {
			paramItems.push(listItem);
			return;
		}

		const paramName: string = listItem;
		let item: ParamItem;
		const context: ParamContext | undefined = getOverwriteParam(paramName, contextParams);
		const name: string = paramName;
		
		// check if this is an object with nested values, then try to find the items
		const children: PTableItem[] = [];
		if (childParamsList[paramName] && childParamsList[paramName].length > 0) {
			const objectParamNameHash: Record<string, boolean> = {}; 
			// params.forEach((listItem) => {});
			// TODO: refactor this whole function to just be used from a hash
			// TODO: then use the hash on the fly to retrieve nested object values for params with children
			// Just use two loops, since the param item's aren't built yet. On the second loop create the nested object data


		}

		item = { 
			name: context?.overwrite ? context.name : paramName, 
			type: typeElements[name], 
			description: descriptionElements[name],
			contextParam: context?.contextParam,
			variantOption: context?.variantOption,
		};

		paramItems.push(item);
	});

	return paramItems;
}

const getOverwriteParam = (name: string, params: ParamContext[]): ParamContext | undefined => {
	let param: ParamContext | undefined;
	params?.forEach((val: ParamContext) => (name == val.name || name == val.overwrite) ? param = val : null);
	return param;
}