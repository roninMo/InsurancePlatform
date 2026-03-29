import { Icon, IconTypes } from '@Project/ReactComponents';
import styles from './Tech.module.scss';


export interface TechProps {
  type: IconTypes;
  label: string;
  iconStyles?: string;
  additionalStyles?: string;
  noDiv?: boolean;
}

export const Tech = ({ type, label, iconStyles, additionalStyles, noDiv }: TechProps) => {
  const techIconStyles = 'size-6';

  return (
    <div className={`rowStart items-center inline-flex gap-1 p-2 transition hover:scale-110
      text-base lg:text-lg font-semibold label-colors ${additionalStyles}`
    }>
      <Icon variant={type} styles={iconStyles ? iconStyles : techIconStyles} />
      { label }
    </div>
  );
}

export const Dot = () => {
  return <div className='mx-2 w-2 h-2 mt-[2px] rounded-full bg-slate-950 dark:bg-slate-100' />;
}