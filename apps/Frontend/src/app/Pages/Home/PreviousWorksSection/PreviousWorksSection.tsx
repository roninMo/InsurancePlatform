import { useState } from 'react';
import styled from '@emotion/styled';
import { PreviousWorks, PreviousWorksProps } from './PreviousWorks/PreviousWorks';

import DemandJump from '../../../../assets/images/Demandjump.jpg';
import StateAuto from '../../../../assets/images/StateAuto.png';
import LibertyMutual from '../../../../assets/images/LibertyMutual.png';
import styles from './PreviousWorksSection.module.scss';
import { Ht } from '@Project/ReactComponents';

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
          
          <Ht show={activeTab == 'demos'} cStyles='text-2xl'>
            test Here's a list of demos I've created to test my skills with designing best practices 
            and challenging tasks deployed here just for you. 
            From FullStack applications with complex backend logic to random challenging projects, they're all here.
          </Ht>
          <Ht show={activeTab == 'experience'} styles='pb-10' cStyles='text-2xl'>
            Here's some of the past places I've gotten the pleasure to be a part of.
          </Ht>
        </div>

        {/* Previous works */}
        <div className='spacing gap-0 mt-10 p-2 px-4 pt-12 lg:px-6 bg-default rounded-lg shadow-xl'>
          <div className='span-12 place-self-start row justify-start items-center gap-4'>
            <ProjectTab onClick={() => setActiveTab('demos')} className={`tab-default ${activeTab == 'demos' && 'tab-active'}`}>
              Demos
            </ProjectTab>
            <ProjectTab onClick={() => setActiveTab('experience')} className={`tab-default ${activeTab == 'experience' && 'tab-active'}`}>
              Work Experience
            </ProjectTab>
          </div>
          <div className='span-12 mb-10 border-b border-blue-300 dark:border-slate-600' />
          
          { activeTab == 'demos' ?
            <div className='span-12 col gap-4 pb-5'>
              { previousWorks.map((props: PreviousWorksProps, index: number) => 
                <PreviousWorks 
                  key={`demos-${props.title}-${index}`}
                  index={index}
                  
                  company={props.company}
                  companyLogo={props.companyLogo}
                  title={props.title}
                  teams={props.teams}
                  
                  duration={props.duration}
                  startDate={props.startDate}
                  endDate={props.endDate}
                  
                  languagesAndTech={props.languagesAndTech}
                  summary={props.summary}
                  learnMoreContent={props.learnMoreContent}
                  teamImageUrl={props.teamImageUrl}
                  
                  additionalStyles='span-12'
                  iconStyles={props.iconStyles}
                />
              )}
            </div>
          :
            <div className='span-12 col gap-4 pb-5'>
              { previousWorks.map((props: PreviousWorksProps, index: number) => 
                <PreviousWorks 
                  key={`previous-works-${props.title}-${index}`}
                  index={index}
                  
                  company={props.company}
                  companyLogo={props.companyLogo}
                  title={props.title}
                  teams={props.teams}
                  
                  duration={props.duration}
                  startDate={props.startDate}
                  endDate={props.endDate}
                  
                  languagesAndTech={props.languagesAndTech}
                  summary={props.summary}
                  learnMoreContent={props.learnMoreContent}
                  teamImageUrl={props.teamImageUrl}
                  
                  additionalStyles='span-12'
                  iconStyles={props.iconStyles}
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
    companyLogo: "LibertyLogo",
    title: "Fullstack Software Engineer",
    teams: ["Tux Team (Home)", "Spire Team (Auto)", "Aspire Team (Frontend)"],
    
    duration: "1 year",
    startDate: "Aug 2022",
    endDate: "Aug 2023",
    
    languagesAndTech: "Angular / .Net / Orleans / Bamboo / Microsoft Azure / Clustering / Rxjs / Playwright / AutoSave Claim State / etc. ",
    // content: "I got to take part in helping build the quoting platform for agents. Helping take the lead in designing the infrastructure for Liberty's home and auto platforms for users. Our team took on the task of building the home after I got to help the Spire team finish up with auto's.  and helped with the business logic on the backend. This was built in Angular with our own custom forms for validating quote information on the backend while the user created a quote. The server side was built in C# with the Orleans framework in place, and we automated and deployed everything separately. We only had a couple guys on our team, so the majority of the work was divided between everyone. The team made it fun, and I got to learn some of the best design patterns for angular and .net while constructing the business logic to create and handle claims for home and auto",
    summary: "",
    teamImageUrl: LibertyMutual
  },
  {
    company: "State Auto Insurance",
    companyLogo: "StateAutoLogo",
    title: "Fullstack Software Engineer",
    teams: ["PaceSetter Team", "Digital Claims Experience Team (DCX Team)"],
    
    duration: "1.5 years",
    startDate: "Apr 2021",
    endDate: "Aug 2022",
    
    languagesAndTech: "React / React Native / Redux / GraphQL / AWS CDK / Everything AWS - IAM, Networking, Auth, Monitoring and Storage, Lambda, Automated Deployments",
    summary: "",
    teamImageUrl: StateAuto
  },
  {
    company: "State Auto Insurance",
    companyLogo: "StateAutoLogo",
    title: "Intern - Software Engineer",
    teams: ["PC Agg Team (Property and Casualty Aggregate)"],
    
    duration: "1 year",
    startDate: "Jul 2020",
    endDate: "Mar 2021",
    
    languagesAndTech: "React / NodeJs / AWS SAM / AWS CloudFormation / AWS Solutions Architect / Gosu",
    summary: "",
    teamImageUrl: StateAuto
  },
  {
    company: "Demand Jump",
    companyLogo: "DemandJump",
    
    title: "Intern - Software Engineer",
    teams: ["Research and Development team"],
    
    duration: "1 year",
    startDate: "Jul 2019",
    endDate: "Apr 2020",
    
    languagesAndTech: "Angular / Kubernetes / Google Big Query / Looker / Data Visualizations / R&D Development / Any task required / Data Science ",
    // content: "DemandJump is one of the fastest growing startup companies in the Midwest with an award-winning, AI-powered marketing platform that consumes all consumer behavior, competitive, and marketing data for a company and recommends action to improve sales.",
    summary: "",
    teamImageUrl: DemandJump
  },
];
