import styled from '@emotion/styled';
import styles from './Keyword.module.scss';
import { HashLink, HashLinkProps } from '../../../../Components/Utils/HashLink/HashLink';
import { Tooltip, TooltipProps } from '../../../../Components/Utils/Tooltip/Tooltip';
import { ReactNode } from 'react';


interface KeywordProps {
	tooltip?: TooltipProps;
	link?: HashLinkProps;
	onClick?: () => void;
	children: ReactNode;
	styles?: string;
	textStyles?: string;
}

export const Keyword = ({ tooltip, link, onClick, children, styles, textStyles }: KeywordProps) => {
	
	if (link) return (
		<HashLink label={link.label} url={link.url} opts={link.opts}>
			<b className={`${styles ? styles : 'keyword'} ${textStyles ? textStyles : 'keyword-text'}`}>
				{ children }
			</b>
			{/* TODO: use the universal tooltip component we're adding  */}
			{ tooltip && 
				<Tooltip alignment={tooltip?.alignment} additionalStyles={tooltip?.additionalStyles}>
					<div>Tooltip text!</div>
				</Tooltip>
			}
		</HashLink>
	);

  return (
		<b 
			onClick={() => onClick && onClick()} 
			className={`${styles ? styles : 'keyword'} ${textStyles ? textStyles : 'keyword-text'}`}
		>
			{ children }
		</b>
  );
}
