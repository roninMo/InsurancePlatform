import styled from '@emotion/styled';
import styles from './Keyword.module.scss';
import { HashLink, HashLinkProps } from '../../../../Components/Utils/HashLink/HashLink';
import { Tooltip, TooltipProps } from '../../../../Components/Utils/Tooltip/Tooltip';


interface KeywordProps {
	text?: string;
	tooltip?: TooltipProps;
	link?: HashLinkProps;
}

export const Keyword = ({ text, tooltip, link }: KeywordProps) => {
	
	if (link) return (
		<HashLink label={link.label} url={link.url} opts={link.opts}>
			<b className='bg-div-light label-colors p-2 hover:theme-focus-2'>
				{ text }
			</b>
			{ tooltip && 
				<Tooltip alignment={tooltip?.alignment} additionalStyles={tooltip?.additionalStyles}>
					<div>Tooltip text!</div>
				</Tooltip>
			}
		</HashLink>
	);

  return (
    <b className='bg-div-light label-colors p-2 hover:theme-focus-2'>
			{ text }
		</b>
  );
}

const Container = styled.div``;