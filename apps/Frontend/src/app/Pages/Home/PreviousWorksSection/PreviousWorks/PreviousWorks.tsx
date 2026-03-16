import { ReactNode, useState } from 'react';
import styles from './PreviousWorks.module.scss';
import { Card } from '../../../../Components/Layouts/Card/Card';


export interface PreviousWorksProps {
  company: string;
  title: string;
  team: string;
  duration: string;
  languagesAndTech: string;
  readMoreContent: ReactNode;

  additionalStyles?: string;
}

export const PreviousWorks = ({
  company, title, team, duration,
  languagesAndTech, readMoreContent, additionalStyles
}: PreviousWorksProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>();

  return (
    <Card
      outline='default'
      additionalStyles={`col gap-2 ${additionalStyles}`} 
    >
      {/* Company and Duration */}
      <div className='row justify-between items-center pb-4'>
        <h2 className='py-2'>{ company }</h2>
        <label className='placeholder-text font-normal'>
          { duration }
        </label>
      </div>

      <div className='mb-4 border-b border-blue-300 dark:border-slate-600' />

      {/* Team and Title */}
      <div className='row justify-between pb-4'>
        <div className='rowStart gap-2 items-center'>
            <label className='label-colors text-base'>
              { team } 
            </label>
            <label className='text-colors font-normal text-sm mt-[1px] pl-2 italic'>
              { title }
            </label>
        </div>
        
      </div>

      {/* Languages and Tech */}
      <div className='text-colors'>
        <p>{ languagesAndTech }</p>
      </div>

      {/* read more content */}
      <div>
        <span className='link-text text-sm'>read more</span>


        { modalOpen && 
          <div className='p-12 bg-div-light outline-css outline-styles'> 
            Modal Content
            { readMoreContent }
          </div>
        }
      </div>
    </Card>
  );
}

export default PreviousWorks;
