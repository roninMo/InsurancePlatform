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
	
	nestedParams?: PTableItem[]; // nested object values - sub tables
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
	const { name, type, description, contextParam, variantOption, nestedParams } = item;
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
			

			{ (nestedParams && nestedParams.length > 0) &&
				<Dropdown label={`${name} values`} additionalStyles='subtable-dropdown' labelStyles='dropdown-subheader' iconStyles='ml-4'>
					<ParamTable params={nestedParams} variant="subTable" additionalStyles={additionalStyles} />
				</Dropdown>
			}
		</>
	);
}

// Styled Components
const Container = styled.div``;
const Param = styled.div``;
const Table = styled.div``;


export const getParamsTableItems = (
	params: string[], // retains the layout of the params
	contextParams: ParamContext[], // adjusts the look of the table items based on variant context
	nestedParamsList: Record<string, string[]>, // subTable data 
	typeElements: Record<string, React.FC>, // optimized list of components to render
	descriptionElements: Record<string, React.FC>, // optimized list of description components to render 
): PTableItem[] => {
	const paramHash: Record<string, ParamItem> = {};
	const paramItems: PTableItem[] = [];

	// Add all values to the hash
	params.forEach((listItem: string) => {
		if (listItem == 'spacing') return;
		paramHash[listItem] = {
			name: listItem,
			type: typeElements?.[listItem],
			description: descriptionElements?.[listItem]
		};
	});
	
	Object.entries(nestedParamsList).forEach(([name, nestedParamNames]) => {
		if (!nestedParamNames) return;

		// Check if the object has been added to the hash
		if (!(name in paramHash)) {
			paramHash[name] = {
				name,
				type: typeElements?.[name],
				description: descriptionElements?.[name]
			};
		} 

		// Add it's values to the hash
		nestedParamNames.forEach((paramName: string) => {
			if (paramName in paramHash) return;
			paramHash[paramName] = {
				name: paramName,
				type: typeElements?.[paramName],
				description: descriptionElements?.[paramName]
			}
		});
	});
	// console.log(`\nget paramTable items hash`, paramHash);


	// Retrieve the base parameters for the component
	params.forEach((listItem: string) => {
		if (listItem == 'spacing') {
			paramItems.push(listItem);
			return;
		}

		// Retrieve the item from the hash, and add it's context and nested values
		const paramName: string = listItem;
		let item: ParamItem = paramHash[paramName];
		// console.log(`\nRetrieved ${paramName} from the hash`, item);

		// Add the context values
		const context: ParamContext | undefined = getOverwriteParam(paramName, contextParams);
		addParamContext(item, context);
		// if (context) console.log(`Added ${paramName}'s context values: `, item);
		
		// Retrieve the nested values for this param, if it has any
		const nestedParams: PTableItem[] = [];
		if (paramName in nestedParamsList) {
			nestedParamsList[paramName].forEach((nestedParam: string) => {
				if (!(nestedParam in paramHash)) return;

				let nestedItem: ParamItem = paramHash[nestedParam];
				const context: ParamContext | undefined = getOverwriteParam(nestedParam, contextParams);
				addParamContext(nestedItem, context);
				nestedParams.push(nestedItem);
			});

			item.nestedParams = nestedParams;
			// console.log(`Added ${paramName}'s nested params: `, nestedParams);
		}

		paramItems.push(item);
	});

	// console.log(`finished list of paramItems: `, paramItems);
	return paramItems;
}

const getOverwriteParam = (name: string, params: ParamContext[]): ParamContext | undefined => {
	let param: ParamContext | undefined;
	params?.forEach((val: ParamContext) => (name == val.name || name == val.overwrite) ? param = val : null);
	return param;
}

const addParamContext = (item: ParamItem, context?: ParamContext) => {
	if (!item || !context) return;
	if (context.overwrite) item.name = context.name; 
	item.contextParam = context.contextParam;
	item.variantOption = context.variantOption;
}
