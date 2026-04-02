import styles from './DocLink.module.scss';


export interface DocLinkProps {
	
}
export const DocLink = ({ url, label }: DocLinkProps) => {
  return (
    <div className={styles['container']}>
      <h1>Welcome to DocLink!</h1>
    </div>
  );
}

const Container = styled.div``;

