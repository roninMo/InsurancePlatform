import styled from '@emotion/styled';
import styles from './Keyword.module.scss';


interface KeywordProps {
	link?: string;
	// TODO: add a tooltip text component for hovers on certain elements
	/*
		<div className="relative inline">
			<div className={`absolute inset-0 col gap-2 ${additionalStyles}`}>
				{ children }
			</div>
		</div>
	*/
}

export const Keyword = () => {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Keyword!</h1>
    </div>
  );
}

const Container = styled.div``;