import { useState } from 'react';
import styled from '@emotion/styled';
import { PreviousWorks, PreviousWorksProps } from './PreviousWorks/PreviousWorks';

import DemandJump from '../../../../assets/images/Demandjump.jpg';
import StateAuto from '../../../../assets/images/StateAuto.png';
import LibertyMutual from '../../../../assets/images/LibertyMutual.png';
import styles from './PreviousWorksSection.module.scss';
import { Button, Icon } from '@Project/ReactComponents';
import { Modal } from '../../../Components/Utils/Modal/Modal';

export interface PreviousWorkSectionProps {
  additionalStyles?: string;
}

export const PreviousWorksSection = ({ additionalStyles }: PreviousWorkSectionProps) => {
  const [activeTab, setActiveTab] = useState<'demos' | 'experience'>('demos');
  
  return (
    <Container id='previous-works-section' className='span-12 lg:span-10 gap-8 gap-x-4 py-8 bg-div mb-4'>
      <div className='child-alignment-fix'>
        <div className='col p-2 pt-12'>
          <h1 className='py-3 text-4xl text-shadow-sm'>Explore some of my projects and past work experience</h1>
          
          <div className={`height-trans ${activeTab == 'demos' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className='height-trans-content text-2xl'>
              Here's a list of demos I've created to test my skills with designing best practices 
              and challenging tasks deployed here just for you. 
              From FullStack applications with complex backend logic to random challenging projects, they're all here.
            </div>
          </div>

          <div className={`height-trans pb-10 ${activeTab == 'experience' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className='height-trans-content text-2xl'>
                Here's some of the past places I've gotten the pleasure to be a part of.
              </div>
            </div>
        </div>

        {/* Previous works */}
        <div className='spacing gap-0 mt-10 p-2 px-4 pt-12 lg:px-6 bg-default rounded-lg shadow-xl'>
          <div className='span-12 place-self-start row justify-start items-center gap-4'>
            <ProjectTab onClick={() => setActiveTab('demos')} className={`project-tab ${activeTab == 'demos' && 'tab-active'}`}>
              Demos
            </ProjectTab>
            <ProjectTab onClick={() => setActiveTab('experience')} className={`project-tab ${activeTab == 'experience' && 'tab-active'}`}>
              Work Experience
            </ProjectTab>
          </div>
          <div className='span-12 mb-10 border-b border-blue-300 dark:border-slate-600' />
          
          { activeTab == 'demos' ?
            <div className='span-12 col gap-4 pb-5'>
              { previousWorks.map((props: PreviousWorksProps, index: number) => 
                <PreviousWorks 
                  key={`demos-${props.title}-${index}`}
                  company={props.company}
                  title={props.title}
                  team={props.team}
                  startDate={props.startDate}
                  endDate={props.endDate}
                  languagesAndTech={props.languagesAndTech}
                  content={props.content}
                  learnMoreContent={props.learnMoreContent}
                  backgroundImageUrl={props.backgroundImageUrl}
                  additionalStyles='span-12'
                  index={index}
                />
              )}
            </div>
          :
            <div className='span-12 col gap-4 pb-5'>
              { previousWorks.map((props: PreviousWorksProps, index: number) => 
                <PreviousWorks 
                  key={`previous-works-${props.title}-${index}`}
                  company={props.company}
                  title={props.title}
                  team={props.team}
                  startDate={props.startDate}
                  endDate={props.endDate}
                  languagesAndTech={props.languagesAndTech}
                  content={props.content}
                  learnMoreContent={props.learnMoreContent}
                  backgroundImageUrl={props.backgroundImageUrl}
                  additionalStyles='span-12'
                  index={index}
                />
              )}
            </div>
          }
        </div>

      </div>
    </Container>
  );
}

// Styled components
const Container = styled.div``;
const ProjectTab = styled.div``;


// Previous works
// TODO: Recreate these
const previousWorks: PreviousWorksProps[] = [
  {
    company: "Liberty Mutual",
    title: "Software Engineer (Fullstack)",
    team: "Spire Team",
    startDate: "Aug 2022",
    endDate: "Aug 2023",
    languagesAndTech: "Angular / .Net / Orleans / Bamboo / Microsoft Azure / Clustering / Rxjs / Playwright / AutoSave Claim State / etc. ",
    content: "read more content",
    // content: "I got to take part in helping build the quoting platform for agents. Helping take the lead in designing the infrastructure for Liberty's home and auto platforms for users. Our team took on the task of building the home after I got to help the Spire team finish up with auto's.  and helped with the business logic on the backend. This was built in Angular with our own custom forms for validating quote information on the backend while the user created a quote. The server side was built in C# with the Orleans framework in place, and we automated and deployed everything separately. We only had a couple guys on our team, so the majority of the work was divided between everyone. The team made it fun, and I got to learn some of the best design patterns for angular and .net while constructing the business logic to create and handle claims for home and auto",
    backgroundImageUrl: LibertyMutual
  },
  {
    company: "State Auto Insurance",
    title: "Software Engineer (Fullstack)",
    team: "Digital Claims Experience Team",
    startDate: "Apr 2021",
    endDate: "Aug 2022",
    languagesAndTech: "React / React Native / Redux / GraphQL / AWS CDK / Everything AWS - IAM, Networking, Auth, Monitoring and Storage, Lambda, Automated Deployments",
    content: "Read more content",
    backgroundImageUrl: StateAuto
  },
  {
    company: "State Auto Insurance",
    title: "Software Engineer (Fullstack)",
    team: "(Intern) PC Agg Team",
    startDate: "Jul 2020",
    endDate: "Mar 2021",
    languagesAndTech: "Languages and tech",
    content: "Read more content",
    backgroundImageUrl: StateAuto
  },
  {
    company: "Demand Jump",
    title: "(Intern) Software Engineer",
    team: "Research and Development",
    startDate: "Jul 2019",
    endDate: "Apr 2020",
    languagesAndTech: "Languages and tech",
    content: "DemandJump is one of the fastest growing startup companies in the Midwest with an award-winning, AI-powered marketing platform that consumes all consumer behavior, competitive, and marketing data for a company and recommends action to improve sales.",
    backgroundImageUrl: DemandJump
  },
];
