import styled from '@emotion/styled';
import styles from './Experiences.module.scss';
import { Icon } from '@Project/ReactComponents';
import { Dot, Tech } from './Tech/Tech';

export const Experiences =() => {
  const headerStyles = ``;
  const descriptionStyles = ``;
  const languageStyles = ``;


  return (
    <div className='span-12 p-4 col gap-2 items-center bg-div'>
      <div className='w-full pt-12'>
        <div className='mx-6 border-styles border-b ' />
      </div>

      <Content className='col gap-2 pt-14 xl:w-8/12'>
        <label className='header-colors text-3xl lg:text-5xl text-shadow-lg'>
          Tech and Language Experience
        </label>

        <div className='py-8 text-colors text-xl lg:text-xl w-4/6'>
          I've worked with a variety of stacks and languages and have a solid understanding of the concepts and 
          best practices for creating clean and reliable code. Here's a list of what I've built with my previous teams
        </div>

        <div className='col gap-2 pb-4 *:py-4 *:col *:gap-2'>
          {/* Frontend Languages and Frameworks */}
          <div>
            <Header className='text-xl lg:text-2xl header-colors font-semibold rowStart items-center gap-4 py-2'>
                <div className='p-2 mt-[2px] bg-slate-100 dark:bg-gray-700 outline-css outline-default rounded-lg'>
                  <Icon variant="Computer" styles='size-5 text-teal-500 dark:text-teal-500' />
                </div>
              Frontend Languages and Frameworks
            </Header>

            <Description className='text-base lg:text-xl'>
              Description
            </Description>
            <Languages className='py-2 rowStart items-center flex-wrap text-center w-4/6'>
              <Tech type="React" label='React' /> <Dot />
              <Tech type="Angular" label='Angular' /> <Dot />
              <Tech type="Vue" label='Vue' /> <Dot />
              
              <Tech type="RxJs" label='RxJs' /> <Dot />
              <Tech type="ReactHookForms" label='ReactHookForms' /> <Dot />
              <Tech type="Redux" label='Redux' /> <Dot />
              <Tech type="Jest" label='Jest' /> <Dot />
              <Tech type="Playwright" label='Playwright' /> <Dot />
              <Tech type="Axios" label='Axios' /> <Dot />
              <Tech type="DataDog" label='DataDog' />
            </Languages>
          </div>

          {/* Backend and Database Architecture */}
          <div>
            <Header className='text-xl lg:text-2xl header-colors font-semibold rowStart items-center gap-4 py-2'>
              <div className='p-2 mt-[2px] bg-slate-100 dark:bg-gray-700 outline-css outline-default rounded-lg'>
                <Icon variant="Database" styles='size-5 text-green-500 dark:text-green-500' />
              </div>
              Backend and Database Architecture
            </Header>

            <Description className='text-base lg:text-xl'>
              Description
            </Description>
            <Languages className='py-2 rowStart items-center flex-wrap text-center w-4/6'>
              <Tech type="Express" label='Express' /> <Dot />
              <Tech type="Net" label='Net' /> <Dot />
              <Tech type="Node" label='Node' /> <Dot />

              <Tech type="Orleans" label='Orleans' /> <Dot />
              <Tech type="ApolloGraphQL" label='ApolloGraphQL' /> <Dot />
              <Tech type="Postgres" label='Postgres' /> <Dot />
              <Tech type="MongoDB" label='MongoDB' />
            </Languages>
          </div>
          
          {/* Devops and Automated Deployment */}
          <div>
            <Header className='text-xl lg:text-2xl header-colors font-semibold rowStart items-center gap-4 py-2'>
              <div className='p-2 mt-[2px] bg-slate-100 dark:bg-gray-700 outline-css outline-default rounded-lg'>
                <Icon variant="Cloud" styles='size-5 text-sky-500 dark:text-sky-500' />
              </div>
              Devops and Automated Deployment
            </Header>

            <Description className='text-base lg:text-xl'>
              Description
            </Description>
            <Languages className='py-2 rowStart items-center flex-wrap text-center w-4/6'>
              <Tech type="AWS" label='AWS' /> <Dot />
              <Tech type="Azure" label='Azure' /> <Dot />
              <Tech type="GCP" label='Google Cloud Platform' /> <Dot />

              <Tech type="AWS CDK" label='AWS CDK' /> <Dot />
              <Tech type="Kubernetes" label='Kubernetes' /> <Dot />
              <Tech type="Bamboo" label='Bamboo' /> <Dot />
              <Tech type="Docker" label='Docker' /> <Dot />

              <Tech type="CI/CD Pipelines" label='CI/CD Pipelines' /> <Dot />
              <Tech type="Azure Devops" label='Azure Devops' /> <Dot />
              <Tech type="Atlassian" label='Atlassian' />
            </Languages>
          </div>
        </div>
      </Content>
    </div>
  );
}

// Styled Components
const Header = styled.div``;
const Description = styled.div``;
const Languages = styled.div``;
const Content = styled.div``;
