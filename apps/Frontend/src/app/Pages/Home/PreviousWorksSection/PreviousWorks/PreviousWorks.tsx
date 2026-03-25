import { ReactNode, useState } from 'react';
import { Card } from '../../../../Components/Content/Card/Card';
import styled from '@emotion/styled';

import styles from './PreviousWorks.module.scss';

import DemandJump from '../../../../../assets/images/Demandjump.jpg';
import StateAuto from '../../../../../assets/images/StateAuto.png';
import LibertyMutual from '../../../../../assets/images/LibertyMutual.png';
import downtown_city_night from '../../../../../assets/images/downtown_city_night.png';

export interface PreviousWorksProps {
  company: string;
  title: string;
  team: string;
  startDate: string;
  endDate: string;
  languagesAndTech: string;
  content: string;
  learnMoreContent?: ReactNode;
  backgroundImageUrl: string;

  index?: number;
  additionalStyles?: string;
}

export const PreviousWorks = ({
  company, title, team, startDate, endDate, languagesAndTech, 
  content, learnMoreContent, backgroundImageUrl, index = 0, additionalStyles, 
}: PreviousWorksProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>();

  return (
    <div 
    className={`col gap-2
      bg-div outline-css outline-default rounded-lg shadow-lg
      transition duration-300 
      
      opacity-0 animate-fade-in-slow
      hover:selected-box active:selected-box 
      hover:scale-105

      ${additionalStyles} `}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Content and Image */}
      <div className='spacing *:span-12 *:lg:span-6'>

        {/* Content */}
        <Content className='pl-6 pr-2 py-8 col gap-2'>
          <CardHeader className='row lg:col xl:row justify-between items-center'>
            <h3 className='py-2 text-nowrap text-shadow-sm'>
              { company }
            </h3>
            
            <Duration className='row items-center gap-2 py-1 xl:py-0'>
              <div className='p-[3px] rounded-full btn-primary-colors lg:hidden xl:block' />
              <label className='primary-text text-nowrap'>{ startDate }</label>
              <div className='ml-2 border-styles border-b w-4 xl:w-10' />
              <label className='primary-text text-nowrap'>{ endDate }</label>
            </Duration>
          </CardHeader>

          <TeamAndTitle className='row justify-between gap-2 pb-4'>
            <div className='rowStart gap-2 items-center'>
              <label className='label-colors text-base'>
                { team } 
              </label>
              <label className='text-colors font-normal text-sm mt-[1px] pl-2 italic'>
                { title }
              </label>
            </div>
          </TeamAndTitle>

          <About className='col gap-4'>
            <div className='placeholder-text'>
              { languagesAndTech }
            </div>
            <div className='text-colors'>
              { content }
            </div>
          </About>

          <LearnMore>
            <span className='link-text text-sm'>
              Learn more
            </span>
            { modalOpen && <div className='p-12 bg-div-light outline-css outline-styles'> 
                Modal Content
                { learnMoreContent }
              </div>
            }
          </LearnMore>
        </Content>

        {/* Background Image */}
        <Background imgUrl={backgroundImageUrl} className={`w-full min-h-64 sm:min-h-[45vw] md:min-h-64 spacing rounded-r-lg`}>
          <Overlay className='span-12 bg-gradient-to-br from-slate-950/30 from-15% via-slate-700/10 via-55% to-transparent rounded-r-lg' />
        </Background>
      </div>
    </div>
  );
}

// Styled Components
const Content = styled.div``;
const TeamImage = styled.div``;
const Overlay = styled.div``;

const CardHeader = styled.div``;
const Duration = styled.div``;
const TeamAndTitle = styled.div``;
const About = styled.div``;
const LearnMore = styled.div``;

interface ImageDivProps {
  imgUrl: string;
}
const Background = styled.div<ImageDivProps>`
  background-image: url(${props => props.imgUrl});
  background-size: cover;
  background-position: center;
`;
