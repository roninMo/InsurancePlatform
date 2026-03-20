import { useState, useId } from 'react';
import styled from '@emotion/styled';
import { Navbar } from '../../Components/Navbar/Navbar';

import styles from './Home.module.scss';
import { WelcomeSection } from './WelcomeSection/WelcomeSection';
import { PreviousWorksSection } from './PreviousWorksSection/PreviousWorksSection';
import { Footer } from './Footer/Footer';
import { Card } from '../../Components/Layouts/Card/Card';
import { ContactUsSection } from './ContactUsSection/ContactUsSection';
import { Experiences } from './Experiences/Experiences';




export const Home = () => {
  // Image generation text - Beautiful Downtown City Night, Colorful Vibrant Lights with Surreal Weather

  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      <MainContent className='spacing gap-0'>
        <WelcomeSection />

        {/* Add a section for tech and language experience -> header -> frontend/backend/cloud/automation flex-wrap w/ TechIcon components */}
        {/* Finish up the footer links */}

        {/* Documentation project */}
        {/* Add an additional stylesheet for this project */}
        {/* left sidebar component for link lists of sections to navigate to */}
        {/* right sidebar component for route / id links params to navigate to different parts of the page */}
          {/* find a way to smoothly scroll between each part of the page */}
        {/* Add a ShowcaseComponent that shows with tabs to for component and it's jsx code */}
        {/* Add a ShowcaseParamsComponent for passing in a list of key/type/description  */}
          {/* Add theme colors for param types */}
        {/* Add a LinkRef component for the @seeComponentOrFunction reference / param reference */}

        {/* MockDatabase project */}
        {/* Sidebar for tables, and the ability to select foreign key tables to render when retrieving lists of data */}
        {/* Bottom popover bar for creating, selecting, and editing current databases  */}
        {/* Add the main section with three primary tabs: Information, Values, and Edit for tables */}
          {/* Information Section - displaying the database and currently selected table information (name, params, entries) */}
          {/* Values Section - A list of the current values for the table */}
            {/* with the ability to drag/drop and adjust the order of items (A separate hash table stored in localStorage for this) */}
            {/* The ability to select and edit a specific value, and save it on the backend (modal) */}
            {/* With the table sidebar a db join icon to select with other tables for adding current table's relational information */}
            {/* Compact and expanded views for each of the values, and buttons to show/hide everything */}
            {/* Chronological fade in animations when loaded, skeleton loading with a brief delay before anything is rendered */}
          {/* Edit page to add/edit/delete param values, db param config options, and additional options for how they're displayed */}
            {/* a table of params with (Name - Type - char/int limit/id required) and a separate section below  */}
            {/* Separate section for values to show param (ex: name, id) as header in values section list, header and id, flex placement */}
            {/* Additionally we need a way to autofill relevant information (names, phone numbers, etc) via options for each param */}
          {/* Eventually (for demos specifically) preset db's to check out */}

          {/* Eventual additional page for created databases to construct artificial routes to retrieve "queried" or standard data  */}
          {/* Ex: select user's table, choose between id/all, and select whether to include foreign key information */}
            {/* Once one of these is created, returns a url to the frontend to use for retrieving this information (store in db for persistent retrieval) */}
 
          {/* Eventually find a way to refactor this (or navigate to a "read only" version) to neatly display db and table structure, and the current routes to use */}

        {/* Previous Works */}
        <div className='spacing bg-div'>
          <div className='span-1 hidden lg:block' />
          <PreviousWorksSection additionalStyles='span-12 lg:span-10' />
          <div className='span-1 hidden lg:block' />
        </div>

        <Experiences />
        <ContactUsSection />
        <Footer />
      </MainContent>
    </>
  );
}

const MainContent = styled.div``;
const Container = styled.div``;
const SelectElement = styled.button``;
const CurrentlySelected = styled.div``;
const DropdownItems = styled.div``;
const PrecedingSelectItemElements = styled.div``;
const SubsequentSelectItemElements = styled.div``;
