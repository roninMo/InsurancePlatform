import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from '../Utils/HashLink/HashLink';
import { SidebarLinkProps, SubPageLinkProps } from '../Sidebar/Sidebar';

import styled from '@emotion/styled';
import styles from './Hashbar.module.scss';
import { DocumentationPage_SidebarLinks } from '../../Pages/Documentation/Documentation';


export const Hashbar = () => {
  const [hashLinks, setHashLinks] = useState<SubPageLinkProps[]>([]);
  const { pathname } = useLocation();

  // When the location updates, update the current page's hash links
  useEffect(() => {
    const hashLinkMap = pathname as UrlToHashLinkMap;
    const links: SubPageLinkProps[] = getPageHashLinks(hashLinkMap);
    console.log('current pathname: ', pathname);
    setHashLinks(links);
  }, [pathname]);


  return (
    <Container className="hashbar col gap-2 p-4 pt-16">
      {/* TODO: should we add this to the mobile popover navbar? Perhaps tabbing between nav and this page */}
      {/* TODO: Find out how you can make this behave like a fixed component scroll wise (or if it should just be fixed) */}
      
      <h4 className="pb-2 label-colors font-semibold">
        On This Page
      </h4>

      { hashLinks.map(({ sectionLink, subLinks }: SubPageLinkProps, index: number) => 
        <HashbarLinks 
          sectionLink={sectionLink} 
          subLinks={subLinks} 
          key={`hashbar-section-${sectionLink.label}-${index}`} 
        />
      )}
    </Container>
  );
}


export const HashbarLinks = ({ sectionLink, subLinks }: SubPageLinkProps) => {
  return (
    <div className="colStart pb-4">
      <HashLink 
        url={sectionLink.url} label={sectionLink.label} 
        styles="pb-2 hashbar-link-header" 
      />

      { subLinks.map(({url, label}: SidebarLinkProps, index: number) =>
        <HashLink 
          label={label} 
          url={url} 
          styles="pl-4 hashbar-link"
          key={`hashbar-link(${index})-${label}`} 
        />
      )}
    </div>
  );
}


// HashLinks map function for different pages TODO: Find a better way to do this?
export type UrlToHashLinkMap = 
  '/Documentation'
| '/Documentation/Forms' 
| '/Documentation/Forms/Button' 
| '/Documentation/Forms/Checkbox' 
| '/Documentation/Forms/Input' 
| '/Documentation/Forms/Radio' 
| '/Documentation/Forms/RadioTable' 
| '/Documentation/Forms/Select' 
| '/Documentation/Forms/Slider' 
| '/Documentation/Forms/Textarea' 
| '/Documentation/Content' 
| '/Documentation/Content/Card' 
| '/Documentation/Content/Container' 
| '/Documentation/Utils' 
| '/Documentation/Utils/DragAndDrop' 
| '/Documentation/Utils/Modal' 
| '/Documentation/Utils/Notifications' 
| ''; 
const getPageHashLinks = (url: UrlToHashLinkMap): SubPageLinkProps[] => {
  if (url == '/Documentation') return [];
  if (url == '/Documentation/Forms' ) return [];
  if (url == '/Documentation/Forms/Button' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Forms/Checkbox' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Forms/Input' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Forms/Radio' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Forms/RadioTable' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Forms/Select' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Forms/Slider' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Forms/Textarea' ) return GenericDocHashLinkList;

  if (url == '/Documentation/Content' ) return [];
  if (url == '/Documentation/Content/Card' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Content/Container' ) return GenericDocHashLinkList;
  
  if (url == '/Documentation/Utils' ) return [];
  if (url == '/Documentation/Utils/DragAndDrop' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Utils/Modal' ) return GenericDocHashLinkList;
  if (url == '/Documentation/Utils/Notifications' ) return GenericDocHashLinkList;
  return [];
}

// Styled Components
const Container = styled.div``;


export const GenericDocHashLinkList: SubPageLinkProps[] = [
  // Inputs Page and Subroutes
  {
    sectionLink: { label: "Input", url: "" }, 
    subLinks: [
      { label: 'Variants', url: '#showcase-element' },
      { label: 'Parameters', url: '#param-table' },
      { label: 'Event Handlers ', url: '#event-handler-table' },
    ]
  },
];