import styles from './Experiences.module.scss';

export const Experiences =() => {

  return (
    <div className='span-12 p-4 col gap-2 items-center bg-div'>
      <div className='w-full pt-12'>
        <div className='mx-6 border-styles border-b ' />
      </div>

      <div className='col gap-2 pt-4 xl:w-8/12 *:py-4 *:col *:gap-2'>

        {/* Frontend Languages and Frameworks */}
        <div>
          <h2>Frontend Languages and Frameworks</h2>

          <p>
            text here
          </p>
        </div>

        {/* Backend and Database Architecture */}
        <div>
          <h2>Backend and Database Architecture</h2>

          <p>
            text here
          </p>
        </div>
        
        {/* Devops and Automated Deployment */}
        <div>
          <h2>Devops and Automated Deployment</h2>

          <p>
            text here
          </p>
        </div>
      </div>
    </div>
  );
}
