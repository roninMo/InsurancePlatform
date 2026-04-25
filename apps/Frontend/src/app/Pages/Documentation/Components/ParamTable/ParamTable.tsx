


import { ReactNode, useId, useState } from 'react';
import { ParamContext } from '../ShowcaseElement/ShowcaseElement';
import { Dropdown } from '../../../../Components/Content/Dropdown/Dropdown';
import { Button } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './ParamTable.module.scss';


export type PTableItem = ParamItem | 'spacing';
export interface ParamItem {
	name: string;
	type: React.FC; // we're using <ParamType>
	description: React.FC;
	
	contextParam?: boolean; // used to signify certain variants. e.g. type="email"
	variantOption?: boolean; // parameters highlighted because they're specific to a certain variant
	
	nestedParams?: PTableItem[]; // nested object values - sub tables
}

export interface ParamTableProps {
	params?: PTableItem[]; // This is reliant on that the html items come in threes
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
				<label className="param-item-type">Type</label>
				<label className="param-item-desc">Description</label>
				

			{/* Param Items */}
			{ params?.map((item: PTableItem, index: number) => 
				<ParamTableItem item={item} key={`paramTableItem-${tableItemId}-${index}`} />
				)}
			</Table>
		</Container>
  );
}


interface ParamTableItemProps {
	item: PTableItem;
}
export const ParamTableItem = ({ item }: ParamTableItemProps)  => {
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

	// Subtable properties!
	const createSubTable = nestedParams && nestedParams.length > 0;
	const [showSubTable, setShowSubTable] = useState<boolean>(true); // bad but only creates diff, i want this styling however
	

	return (
		<>
			<div className={`param-item-base ${variantStyles}`}>
				<div className={`param-item-name ${contextStyles}`}>{ name }</div>
			</div>
			<div className={`param-item-type ${variantStyles}`}> 
				{ ParamTypeElement ? <ParamTypeElement /> : null }
			</div>
			<div className={`param-item-desc ${variantStyles}`}>
				<div className='rowStart gap-2 items-center'>
					{ createSubTable && (
						<Button 
							displayText={showSubTable ? 'Show Less' : 'Show More'}
							onClick={() => setShowSubTable(!showSubTable)}
							color={showSubTable ? 'gray-focus' : 'gray'} 
							additionalStyles='px-2 py-1 mr-2 text-sm font-normal italic'
						/>
					)}
					{ ParamDescriptionElement ? <ParamDescriptionElement /> : null }
				</div>
			</div>

			{ createSubTable &&
				<>
					<div className="keep-grid-flow" /> {/* Container col-span-2 */}
					<Container className={`col-span-2 height-trans 
							${showSubTable ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} 
							${showSubTable ? 'animate-fade-in' : ''}
					`}>
						<div className='height-trans-content'>
							<ParamTable params={nestedParams} variant="subTable" additionalStyles='subtable-dropdown' />
						</div>
					</Container>
				</>
			}
			{/* { createSubTable && // more performant
				<>
					<div className="keep-grid-flow" />
					<div className="keep-grid-flow" />
					<Dropdown label={`${name} values`} openByDefault additionalStyles='subtable-dropdown' labelStyles='dropdown-subheader' iconStyles='ml-4'>
						<ParamTable params={nestedParams} variant="subTable" additionalStyles={additionalStyles} />
					</Dropdown>
				</>
			} */}
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
	// TODO: try refactoring this to do the 'build' and the 'hash' in a single pass 
	const paramHash: Record<string, ParamItem> = {};
	const paramItems: PTableItem[] = [];
	const contextMap = new Map(contextParams?.map(cp => [cp.overwrite || cp.name, cp]));

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
		let item: ParamItem = { ...paramHash[paramName] }; // don't let this mutate our original static references
		// console.log(`\nRetrieved ${paramName} from the hash`, item);

		// Add the context values
		const context: ParamContext | undefined = contextMap.get(paramName);
		addParamContext(item, context);
		// if (context) console.log(`Added ${paramName}'s context values: `, item);
		
		// Retrieve the nested values for this param, if it has any
		const nestedParams: PTableItem[] = [];
		if (paramName in nestedParamsList) {
			nestedParamsList[paramName].forEach((nestedParam: string) => {
				if (!(nestedParam in paramHash)) return;

				let nestedItem: ParamItem = { ...paramHash[nestedParam] };
				const context: ParamContext | undefined = contextMap.get(nestedParam);
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

const addParamContext = (item: ParamItem, context?: ParamContext) => {
	if (!item || !context) return;
	if (context.overwrite) item.name = context.name; 
	item.contextParam = context.contextParam;
	item.variantOption = context.variantOption;
}
