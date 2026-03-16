import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useId, useState } from 'react';
import styled from '@emotion/styled';

import { Card } from '../../Components/Layouts/Card/Card';
import { CheckboxItem, Checkbox, CheckboxProps } from '../../Components/Forms/Checkbox/Checkbox';
import { MetadataTagProps, Textarea } from '../../Components/Forms/Textarea';
import { RadioTable } from '../../Components/Forms/RadioTable/RadioTable';
import { Slider } from '../../Components/Forms/Slider/Slider';
import { 
  Button, 
  Input, 
  InputProps_Email, 
  RadioGroup, 
  RadioGroupProps,
  RadioItem, 
  Select, 
  SelectItemValues, 
  TextInputTypes, 
} from '@Project/ReactComponents';

import styles from './Home.module.scss';
import { Navbar } from '../../Components/Navbar/Navbar';
import CustomContent from './CustomContent/CustomContent';


export const Home = () => {

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-navbar-spacing py-12' />
      
      <MainContent className='spacing gap-y-4 px-6 py-4'>
        {/* Welcome page w/GetStarted and Docs */}
        {/* Previous Works */}
        {/* Experience, Languages, Frameworks, Adaptability */}
        {/* Contact */}
        {/* Footer */}

        <CustomContent />

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
