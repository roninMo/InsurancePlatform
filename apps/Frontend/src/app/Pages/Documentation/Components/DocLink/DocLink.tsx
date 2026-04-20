import { HashLink } from '../../../../Components/Utils/HashLink/HashLink';

import styled from '@emotion/styled';
import styles from './DocLink.module.scss';


export interface DocLinkProps {
	url: string;
	label: string;
}

export const DocLink = ({ url, label }: DocLinkProps) => {
  return (
    <HashLink url={url}>
      <span className='doc-link keyword'>
        <SeeRef className='doc-link-see'> @See </SeeRef> 
        <span className='doc-link-text'> { label } </span>
      </span>
    </HashLink> 
  ); 
} 


// Styled Components
const SeeRef = styled.span``;
