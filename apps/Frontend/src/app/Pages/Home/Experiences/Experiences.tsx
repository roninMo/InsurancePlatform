import styled from '@emotion/styled';
import styles from './Experiences.module.scss';

export const Experiences =() => {
  const headerStyles = ``;
  const descriptionStyles = ``;
  const languageStyles = ``;


  return (
    <div className='span-12 p-4 col gap-2 items-center bg-div'>
      <div className='w-full pt-12'>
        <div className='mx-6 border-styles border-b ' />
      </div>

      <div className='col gap-2 pt-4 xl:w-8/12 *:py-4 *:col *:gap-2'>

        {/* Frontend Languages and Frameworks */}
        <div>
          <Header className=''>
            Frontend Languages and Frameworks
          </Header>

          <Description className=''>

          </Description>
          <Languages>
            text here
          </Languages>
        </div>

        {/* Backend and Database Architecture */}
        <div>
          <Header>Backend and Database Architecture</Header>

          <p>
            text here
          </p>
        </div>
        
        {/* Devops and Automated Deployment */}
        <div>
          <Header>Devops and Automated Deployment</Header>

          <p>
            text here
          </p>
        </div>
      </div>
    </div>
  );
}

// Styled Components
const Header = styled.div``;
const Description = styled.div``;
const Languages = styled.p``;
