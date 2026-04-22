import { MouseEvent, useContext } from 'react';
import { TooltipProps, TooltipService } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './ParamType.module.scss';


export type ParamTypes = "number" | "string" | "boolean" | "function" | "any" /* | "custom" */ | string & {};		 
export interface ParamTypeProps {
	type: ParamTypes;
	isArray?: boolean;
	optional?: boolean;

	tooltip?: TooltipProps;
}

export const ParamType = ({ type, isArray, optional, tooltip }: ParamTypeProps) => {
	const { show, hide } = useContext(TooltipService);

  return (
		<Container 
			onMouseEnter={(e) => show(tooltip)} 
			onMouseLeave={(e) => hide()} 
			className={`param-type ${getTypeStyles(type)}`}
		>
			{ type }<span className='text-sm text-colors font-semibold opacity-80'>{ isArray ? "[]" : optional ? "?" : "" }</span>
		</Container>
  );
}


// Styled Components 
const Container = styled.span``;

const getTypeStyles = (type: ParamTypes) => {
	if (type == 'string') return 'param-type-string';
	if (type == 'number') return 'param-type-number';
	if (type == 'boolean') return 'param-type-boolean';
	if (type == 'function') return 'param-type-function';
	if (type == 'any') return 'param-type-boolean';
	return 'param-type-custom';
	return 'text-slate-900 dark:text-slate-400';
}

// Create a code snippet of the default definition of a prop for an element.
export const dParArg = (
  param: string, 
  value: string, 
  type: 'str' | 'var' = 'str' // str: param="value", var: param={value}
): string => {
  if (type == 'str') return `${param}="${value}"`;
  if (type == 'var') return `${param}={${value}}`;
  return '';
};
