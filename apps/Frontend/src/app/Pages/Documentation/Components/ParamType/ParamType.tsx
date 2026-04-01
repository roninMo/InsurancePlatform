import styles from './ParamType.module.scss';


export type ParamTypes = "number" | "string" | "custom";		 
export interface ParamTypeProps {
	type: ParamTypes;
	isArray?: boolean;
}

export const ParamType = (({ type, isArray }: ParamTypeProps)) => {			 
  return (
	  <Container classname="p-2 bg-div hover:bg-div-light transition">
	    { type } { isArray ? "[]" : "" }
	  </Container>
  );
}


// Styled Components 
const Container = styled.div'';
