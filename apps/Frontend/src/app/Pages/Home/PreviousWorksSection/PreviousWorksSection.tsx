import { useState } from 'react';
import styled from '@emotion/styled';
import styles from './PreviousWorksSection.module.scss';
import PreviousWorks, { PreviousWorksProps } from './PreviousWorks/PreviousWorks';



export const PreviousWorksSection = () => {
  

  return (
    <Container className='span-12 place-items-center place-content-center gap-8 gap-x-4 p-4 py-8 bg-div -mt-6 mb-4'>
      <div className=''>
        <div className='col gap-4 p-2'>
          <h1 className='py-3 text-5xl'>Previous Works</h1>
          <p className='text-lg'>Here's a list of the past places I've gotten to be a part of</p>
          <div className='mb-8 border-b border-blue-300 dark:border-slate-600' />
        </div>

        {/* Previous works */}
        <div className='spacing justify-center gap-2'>
          { previousWorks.map((props: PreviousWorksProps, index: number) => 
            <PreviousWorks 
              key={`previous-works-${props.title}-${index}`}
              company={props.company}
              title={props.title}
              team={props.team}
              duration={props.duration}
              languagesAndTech={props.languagesAndTech}
              content={props.content}
              learnMoreContent={props.learnMoreContent}
              additionalStyles='span-12 lg:span-6 m-2 mb-8 p-8 px-6 hover:selected-box'
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
    duration: "08/22 - 08/23",
    languagesAndTech: "Angular / .Net / Orleans / Bamboo / Microsoft Azure / Clustering / Rxjs / Playwright / AutoSave Claim State / etc. ",
    content: "I got to take part in helping build the quoting platform for agents. Helping take the lead in designing the infrastructure for Liberty's home and auto platforms for users. Our team took on the task of building the home after I got to help the Spire team finish up with auto's.  and helped with the business logic on the backend. This was built in Angular with our own custom forms for validating quote information on the backend while the user created a quote. The server side was built in C# with the Orleans framework in place, and we automated and deployed everything separately. We only had a couple guys on our team, so the majority of the work was divided between everyone. The team made it fun, and I got to learn some of the best design patterns for angular and .net while constructing the business logic to create and handle claims for home and auto",
  },
  {
    company: "State Auto Insurance",
    title: "Software Engineer (Fullstack)",
    team: "Digital Claims Experience Team",
    duration: "04/21 - 08/22",
    languagesAndTech: "React / React Native / Redux / GraphQL / AWS CDK / Everything AWS - IAM, Networking, Auth, Monitoring and Storage, Lambda, Automated Deployments",
    content: "Read more content",
  },
  {
    company: "State Auto Insurance",
    title: "Software Engineer (Fullstack)",
    team: "(Intern) PC Agg Team",
    duration: "07/20 - 3/21",
    languagesAndTech: "Languages and tech",
    content: "Read more content",
  },
  {
    company: "Demand Jump",
    title: "(Intern) Software Engineer",
    team: "Research and Development",
    duration: "07/19 - 04/20",
    languagesAndTech: "Languages and tech",
    content: "DemandJump is one of the fastest growing startup companies in the Midwest with an award-winning, AI-powered marketing platform that consumes all consumer behavior, competitive, and marketing data for a company and recommends action to improve sales.",
  },
];