import styled from '@emotion/styled';
import styles from './ParamType.module.scss';


export type ParamTypes = "number" | "string" | "boolean" | "function" | "any" /* | "custom" */ | string & {};		 
export interface ParamTypeProps {
	type: ParamTypes;
	isArray?: boolean;
}

export const ParamType = ({ type, isArray }: ParamTypeProps) => {
  return (
		<Container className={`param-type ${getTypeStyles(type)}`}>
			{ type }{ isArray ? "[]" : "" }
			{/* TODO: add a tooltip popup that shows the default value (or this normally, except on custom types to account for potential extra spacing) */}
			{/* Modal for custom objects to show it's data, if the popup isn't fancy */}
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