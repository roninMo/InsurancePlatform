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
      <SeeRef /> { label }
    </HashLink> 
  ); 
} 

const SeeRef = styled.span``;

