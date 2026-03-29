import { ReactNode, useState } from 'react';
import { Card } from '../../../../Components/Content/Card/Card';
import {Icon, IconTypes} from "@Project/ReactComponents";
import { Modal } from '../../../../Components/Utils/Modal/Modal';
import styled from '@emotion/styled';

import styles from './PreviousWorks.module.scss';


export interface PreviousWorksProps {
  company: string;
  companyLogo?: IconTypes;
  
  title: string;
  teams: string[];
  
  duration: string;
  startDate: string;
  endDate: string;
  
  languagesAndTech: string;
  teamImageUrl: string;

  summary: string;
  learnMoreContent?: ReactNode;

  // Component Specific
  index?: number;
  additionalStyles?: string;
  iconStyles?: string;
}


/*

  TODO: Determine whether you should add icons for each language used in the previous works section
  Edit the modal scroll to the content section and add better padding for different medias

*/
export const PreviousWorks = ({
    company, companyLogo, title, teams, teamImageUrl,
    duration, startDate, endDate, languagesAndTech,
    summary, learnMoreContent, index = 0, additionalStyles, iconStyles
}: PreviousWorksProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Container 
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
          
          <div className="p-4">
            <CompanyAndLogo className='px-4 row lg:col xl:row gap-1 justify-between items-center'>
              <h3 className='py-2 text-nowrap text-shadow-sm'>{ company }</h3>
              <div className="overflow-hidden max-h-14 lg:max-h-20 row items-center">
                { companyLogo && <Icon variant={companyLogo} styles={iconStyles ? iconStyles : 'size-32 lg:size-40'} /> }
              </div>
            </CompanyAndLogo>
            
            {/* Ghost Grid dual column alignment layout "grid-rows-subgrid" tells this div to use the parent's row tracks */}
            <TwoColumnLayout className="grid grid-cols-[max-content_1fr] gap-x-4 p-4 *:grid *:grid-rows-subgrid *:row-span-6">
              <Labels className="justify-items-end *:placeholder-text *:text-sm *:italic">
                <span className="">Title: </span>
                <span className="">Teams: </span>
                <span className="">Duration: </span>
                <span className="">LanguagesAndTech: </span>
                <span className="mb-2">Summary: </span>
                <span className="">LearnMore: </span>
              </Labels>
              
              <Content className='col'>
                <Title className='row justify-between gap-2 pb-4'>
                  { title }
                </Title>
                
                <Teams className='row justify-between gap-2 pb-4'>
                  <label className='text-colors font-normal text-sm mt-[1px] pl-2 italic'>
                    { teams.join(', ') }
                  </label>
                </Teams>
                
                <Duration className="rowStart gap-2 items-center pb-4">
                  <span className="placeholder-text italic text-sm">
                    { duration } -
                  </span>
                  <span className="text-colors text-sm">
                    { startDate } / { endDate }
                  </span>
                </Duration>
    
                <LanguagesAndTech className='placeholder-text'>
                  { languagesAndTech }
                </LanguagesAndTech>
                
                <Summary className="">
                  { summary }
                </Summary>
    
                <LearnMore>
                  <span onClick={() => setModalOpen(true)} className='link-text text-sm'>
                    Learn more
                  </span>
                </LearnMore>
              </Content>
            </TwoColumnLayout>
          </div>
          
          
          {/* Background Image */}
          <TeamImage imgUrl={teamImageUrl} className={`w-full min-h-64 sm:min-h-[45vw] md:min-h-64 spacing rounded-r-lg`}>
            <Overlay className='span-12 bg-gradient-to-br from-slate-950/30 from-15% via-slate-700/10 via-55% to-transparent rounded-r-lg' />
          </TeamImage>
        </div>
      </Container>


      {/* Learn More Modal */}
      <Modal label='Hello' isModalOpen={modalOpen} setModalOpen={setModalOpen}>
          Modal Content
          { learnMoreContent }
        
          {/* Modal Layout  
                - Two Sections (Retain Readability / Easy rearranging for mobile)
                
                - Left side
                  - Content section about your time spent at each job and what you did
                - Right side
                  - Image, and then the information displayed above 
                
                - Refactor this component to render the content section without recreating it for this modal
            
          */}
      </Modal>
    </>
  );
}

// Styled Components
const Container = styled.div``;
const TwoColumnLayout = styled.div``;
const Labels = styled.div``;
const Content = styled.div``;
const Overlay = styled.div``;

const CompanyAndLogo = styled.div``;
const Title = styled.div``;
const Teams = styled.div``;
const Duration = styled.div``;
const LanguagesAndTech = styled.div``;
const Summary = styled.div``;
const LearnMore = styled.div``;

interface ImageDivProps {
  imgUrl: string;
}
const TeamImage = styled.div<ImageDivProps>`
  background-image: url(${props => props.imgUrl});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
