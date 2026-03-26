import { useState, useEffect } from "react";
import { IconTypes, Icon } from "@Project/ReactComponents";
import { useInView } from 'react-intersection-observer';
import styled from "@emotion/styled";
import styles from './QuickLinks.module.scss';
import { HashLink } from "../../../../Components/Utils/HashLink/HashLink";


export interface QuickLinksProps {
  links: QuickLinkProps[];
  initialRender: boolean;
}
export const QuickLinks = ({ links, initialRender }: QuickLinksProps) => {
  return (
    <Container className="col gap-2">
      { links.map((link: QuickLinkProps, index: number) => 
        <QuickLink 
          url={link.url}
          initialRender={initialRender}
          label={link.label} 
          id={link.id}
          env={link.env}
          index={index}
          key={`quickLink-${index}-${link.id}`}
        />
      )}
    </Container>
  );
}


type Status = 'Error' | 'Loading' | 'Ok';
export interface QuickLinkProps {
  url: string;
  label?: string;
  id: string;
  env: 'local' | 'dev' | 'stage' | 'prod';
};
export interface QuickLinkInitialRenderProps {
  initialRender: boolean;
  index: number;
}

export const QuickLink = ({ url, label, id, env, initialRender, index }: QuickLinkProps & QuickLinkInitialRenderProps) => {
  const [status, setStatus] = useState<Status>('Loading');
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: false });

  // check if the site is up
  useEffect(() => {
    // if (!initialRender) return;
    if (!inView) {
      setStatus('Loading');
    }

    const checkStatus = async (url: string) => {

      // Delay the status check for visuals
      const timeout = setTimeout(async () => {
        try {
          const response = await fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(5000) });

          // if (env == 'stage') setStatus('Error');
          setStatus('Ok');// The site is up
        } 

        catch (err) {
          const error = err as Partial<Error>; // "TimeoutError", "Abort Error", else Network Error
          setStatus('Error');
        }
      }, 2040);
      return () => clearTimeout(timeout);
    }

    checkStatus(url);
  }, [url, inView]);


  const getStatusIcon = (): IconTypes => {
    if (status == 'Error') return 'Error';
    if (status == 'Ok') return 'Checkbox';
    return 'Loading';
  }

  // Styles
  const getTextStyles = () => status == 'Loading' ? 'loading-text' : status == 'Error' ? 'error-text' : status == 'Ok' ? 'ok-text' : 'text-colors';
  const bgStyles = () => status == 'Error' ? 'hover:error-box' : status == 'Ok' ? 'hover:selected-box' : 'hover:selected-box';
  const outlineStyles = () => status == 'Error' ? 'outline-error' : status == 'Ok' ? 'outline-ok' : 'outline-default';
  const envTextStyles = () => status == 'Loading' ? 'loading-text' : env == 'local' ? 'label-colors' : env == 'dev' ? 'ok-text' : env == 'stage' ? 'warning-text' : 'primary-text';

  return (
    <div ref={ref} className={`dropdown-link-container ${bgStyles()} relative overflow-hidden`}>
      <div className="span-1 rowStart items-center gap-2">
        <Icon variant={getStatusIcon()} styles={`dropdown-link-icon ${getTextStyles()}`} />

        <span className={`dropdown-env ${envTextStyles()}`}>
          { env }
        </span>
      </div>
      

      <div className="span-9 rowStart items-center gap-1">
        <span className={`pl-2 pr-1 mb-[2px] italic ${status == 'Loading' ? 'loading-text' : 'text-colors'}`}> name: </span>
        <HashLink label={label} url={url} opts={{ type: 'page' }} styles={`dropdown-link-text ${getTextStyles()}`} />

        
        
        <span className={`pl-8 pr-1 mb-[2px] italic ${status == 'Loading' ? 'loading-text' : 'text-colors'}`}> url: </span>
        <HashLink label={url} url={url} opts={{ type: 'page' }} styles={`dropdown-link-text ${getTextStyles()}`} />
      </div>
      
      <div className="span-2 rowStart gap-1">
      </div>


      {/* Loading bar animation */}
      <div className={`${status == 'Loading' ? 'animate-loading-bar opacity-75' : 'opacity-0'} 
          absolute bottom-0 left-0 p-[1px] w-2/3 
          bg-blue-600 dark:bg-blue-500
      `}
      style={{ animationDelay: `${index * 100}ms` }}
      />
    </div>
  );
}


// Styled components
const Container = styled.div``;
const Text = styled.p``;

/* 
  Link:
    status icon, url as label
      - initial loading bar when the dropdown for this item is opened
      - effect to check url to find it's status, before transitioning from skeleton loaders
      - color coded based on site status
*/


export const MockDatabaseLinks: QuickLinkProps[] = [
  {
    url: 'https://react.dev/learn',
    label: 'Local - Mock Database',
    id: 'MockDatabase-local',
    env: 'local'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Dev - Mock Database',
    id: 'MockDatabase-dev',
    env: 'dev'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Stage - Mock Database',
    id: 'MockDatabase-stage',
    env: 'stage'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Prod - Mock Database',
    id: 'MockDatabase-prod',
    env: 'prod'
  },
];

export const InsuranceAppLinks: QuickLinkProps[] = [
  {
    url: 'https://react.dev/learn',
    label: 'Local - Insurance Application Demo',
    id: 'InsuranceApp-local',
    env: 'local'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Dev - Insurance Application Demo',
    id: 'InsuranceApp-dev',
    env: 'dev'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Stage - Insurance Application Demo',
    id: 'InsuranceApp-stage',
    env: 'stage'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Prod - Insurance Application Demo',
    id: 'InsuranceApp-prod',
    env: 'prod'
  },
];

export const SpotifyDemoLinks: QuickLinkProps[] = [
  {
    url: 'https://react.dev/learn',
    label: 'Local - Spotify Demo',
    id: 'SpotifyDemo-local',
    env: 'local'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Dev - Spotify Demo',
    id: 'SpotifyDemo-dev',
    env: 'dev'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Stage - Spotify Demo',
    id: 'SpotifyDemo-stage',
    env: 'stage'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Prod - Spotify Demo',
    id: 'SpotifyDemo-prod',
    env: 'prod'
  },
];

export const SSAutoSaveLinks: QuickLinkProps[] = [
  {
    url: 'https://react.dev/learn',
    label: 'Local - ServerSide Autosave',
    id: 'ServerSideAutosave-local',
    env: 'local'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Dev - ServerSide Autosave',
    id: 'ServerSideAutosave-dev',
    env: 'dev'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Stage - ServerSide Autosave',
    id: 'ServerSideAutosave-stage',
    env: 'stage'
  },
  {
    url: 'https://react.dev/learn',
    label: 'Prod - ServerSide Autosave',
    id: 'ServerSideAutosave-prod',
    env: 'prod'
  },
];
