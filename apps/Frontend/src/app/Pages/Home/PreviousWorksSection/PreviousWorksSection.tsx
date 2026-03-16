import { useState } from 'react';
import styled from '@emotion/styled';
import styles from './PreviousWorksSection.module.scss';
import PreviousWorks, { PreviousWorksProps } from './PreviousWorks/PreviousWorks';



export const PreviousWorksSection = () => {
  

  return (
    <Container className='spacing bg-div -mt-6 mb-4 gap-8 gap-x-4 p-4 py-8'>
      <h2 className='span-12 pb-4'>Previous Works</h2>

      {/* Previous works */}
        { previousWorks.map((props: PreviousWorksProps, index: number) => 
          <PreviousWorks 
            key={`previous-works-${props.title}-${index}`}
            company={props.company}
            title={props.title}
            team={props.team}
            duration={props.duration}
            languagesAndTech={props.languagesAndTech}
            readMoreContent={props.readMoreContent}
            additionalStyles='span-12 xl:span-6 p-8 px-6 hover:selected-box'
          />
        )}
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
    readMoreContent: "I got to take part in helping build the quoting platform for agents. Helping take the lead in designing the infrastructure for Liberty's home and auto platforms for users. Our team took on the task of building the home after I got to help the Spire team finish up with auto's.  and helped with the business logic on the backend. This was built in Angular with our own custom forms for validating quote information on the backend while the user created a quote. The server side was built in C# with the Orleans framework in place, and we automated and deployed everything separately. We only had a couple guys on our team, so the majority of the work was divided between everyone. The team made it fun, and I got to learn some of the best design patterns for angular and .net while constructing the business logic to create and handle claims for home and auto",
  },
  {
    company: "State Auto Insurance",
    title: "Software Engineer (Fullstack)",
    team: "Digital Claims Experience Team",
    duration: "04/21 - 08/22",
    languagesAndTech: "React / React Native / Redux / GraphQL / AWS CDK / Everything AWS - IAM, Networking, Auth, Monitoring and Storage, Lambda, Automated Deployments",
    readMoreContent: "",
  },
  {
    company: "State Auto Insurance",
    title: "Software Engineer (Fullstack)",
    team: "(Intern) PC Agg Team",
    duration: "07/20 - 3/21",
    languagesAndTech: "Languages and tech",
    readMoreContent: "Read more content",
  },
  {
    company: "Demand Jump",
    title: "(Intern) Software Engineer",
    team: "Research and Development",
    duration: "07/19 - 04/20",
    languagesAndTech: "Languages and tech",
    readMoreContent: "DemandJump is one of the fastest growing startup companies in the Midwest with an award-winning, AI-powered marketing platform that consumes all consumer behavior, competitive, and marketing data for a company and recommends action to improve sales.",
  },
];