import { useState } from 'react';
import styled from '@emotion/styled';
import { PreviousWorks, PreviousWorksProps } from './PreviousWorks/PreviousWorks';

import DemandJump from '../../../../assets/images/Demandjump.jpg';
import StateAuto from '../../../../assets/images/StateAuto.png';
import LibertyMutual from '../../../../assets/images/LibertyMutual.png';
import styles from './PreviousWorksSection.module.scss';

export interface PreviousWorkSectionProps {
  additionalStyles?: string;
}

export const PreviousWorksSection = ({ additionalStyles }: PreviousWorkSectionProps) => {
  
  return (
    <Container className={`span-12 place-items-center place-content-center gap-8 gap-x-4 p-4 py-8 bg-div -mt-6 mb-4 ${additionalStyles}`}>
      <div className=''>
        <div className='col gap-4 p-2'>
          <h1 className='py-3 text-5xl text-shadow-sm'>Previous Works</h1>
          <p className='text-lg'>Here's a list of the past places I've gotten to be a part of</p>
          <div className='mb-8 border-b border-blue-300 dark:border-slate-600' />
        </div>

        {/* Previous works */}
        <div className='spacing justify-center gap-8'>
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
              additionalStyles=''
            />
          )}
        </div>

      </div>
    </Container>
  );
}

// Styled components
const Container = styled.div``;


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
    content: "I got to take part in helping build the quoting platform for agents. Helping take the lead in designing the infrastructure for Liberty's home and auto platforms for users. Our team took on the task of building the home after I got to help the Spire team finish up with auto's.  and helped with the business logic on the backend. This was built in Angular with our own custom forms for validating quote information on the backend while the user created a quote. The server side was built in C# with the Orleans framework in place, and we automated and deployed everything separately. We only had a couple guys on our team, so the majority of the work was divided between everyone. The team made it fun, and I got to learn some of the best design patterns for angular and .net while constructing the business logic to create and handle claims for home and auto",
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
