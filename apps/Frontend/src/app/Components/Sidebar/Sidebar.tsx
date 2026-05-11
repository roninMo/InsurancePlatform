import { MouseEvent, Dispatch, SetStateAction, useState, useEffect} from "react";
import { HashLink } from "../Utils/HashLink/HashLink";

import styled from "@emotion/styled";
import styles from './Sidebar.module.scss';
import { useLocation } from "react-router-dom";


export interface SidebarLinkProps {
  label: string;
  url: string;
}

export interface SubPageLinkProps {
  sectionLink: SidebarLinkProps;
  subLinks: SidebarLinkProps[];
}


// TODO: Eventually make these nested
export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  onSetSidebarState: (wasOpened: boolean) => void;

  linkSections: SubPageLinkProps[];
}
export const Sidebar = ({ sidebarOpen, setSidebarOpen, onSetSidebarState, linkSections }: SidebarProps) => {
  const [currentPage, setCurrentPage] = useState<SidebarLinkProps>({ url: '', label: '' });
  const toggleSidebar = (setOpened: boolean) => {
    setSidebarOpen(setOpened);
    if (onSetSidebarState) onSetSidebarState(setOpened);
  }
  
  // Handle native browser back/forwards navigation scenarios where the sidebar's state isn't updated
  const { pathname } = useLocation();
  useEffect(() => {
    if (currentPage.url == pathname) return;

    linkSections.some((list: SubPageLinkProps) => {
      if (list.sectionLink.url == pathname) {
        setCurrentPage(list.sectionLink);
        return true;
      }

      list.subLinks.some((item) => {
        if (item.url == pathname) {
          setCurrentPage(item);
          return true;
        }
      })
    });

  }, [pathname]);
  
  return (
    <Container className="sidebar col gap-2 p-4 pr-10">
      {/* TODO: Eventual open close arrow with fixed positioning */}
      
      {/* <h4 className="py-2 pb-4 text-[1.35rem]">
        Navigation
      </h4> */}
      {/* <div className="pt-2" /> */}

      { linkSections.map(({ sectionLink, subLinks }: SubPageLinkProps, index: number) => 
        <SidebarLinks 
          sectionLink={sectionLink} 
          subLinks={subLinks} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          key={`sidebar-section-${sectionLink.label}-${index}`} 
        />
      )}
      
    </Container>
  );
}


// Sidebar nested links
interface SideBarLinkProps extends SubPageLinkProps {
  currentPage: SidebarLinkProps;
  setCurrentPage: Dispatch<SetStateAction<SidebarLinkProps>>;
}

const SidebarLinks = ({ sectionLink, subLinks, currentPage, setCurrentPage }: SideBarLinkProps) => {
  const handlePageSelected = (pageLabel: SidebarLinkProps, e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    setCurrentPage(pageLabel);
  }

  return (
    <div className="colStart pb-4">
      <HashLink 
        url={sectionLink.url} label={sectionLink.label} 
        styles="pb-2 sidebar-link-header" 
      />

      { subLinks.map((data: SidebarLinkProps, index: number) =>
        <HashLink url={data?.url} key={`sidebar-link(${index})-${data?.label}`}>
          <div 
            onClick={(e) => handlePageSelected(data, e)}
            className={`px-4 pr-8 sidebar-link ${currentPage.url == data?.url ? 'sidebar-link-selected' : ''}`}
          >
            { data?.label }
          </div>
        </HashLink>
      )}
    </div>
  );
}


// Styled Components
const Container = styled.div``;
