import styles from './DocLink.module.scss';


export interface DocLinkProps {
	url: string;
	label: string;
}

export const DocLink = ({ url, label }: DocLinkProps) => {
	const linkStyles = "";
	
  return (
    <HashLink url={url}>
      <SeeRef /> { label }
    </HashLink> 
  ); 
} 

const SeeRef = styled.span``;

