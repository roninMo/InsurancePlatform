import { useState, useMemo, SetStateAction, Dispatch, useContext, memo } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { getSourceCode, getValuesFromType, Icon, IconTypes, TooltipContextActions, TooltipService } from "@Project/ReactComponents";

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import IconCodeSnippets from './Docs_IconJsxComponents.tsx?raw';
import { 
  Example_Icon, 
} from './Docs_IconJsxComponents';


export const Docs_Icon = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const { show, hide } = useContext(TooltipService);
  const [currentTab, setCurrentTab] = useState<string>('default');
  const tabs: string[] = ['default'];
  const tabLabels: string[] = ['Default'];

  const showTabContent = (tab: string) => tab == currentTab ? 'grid-rows-[1fr] order-[-1]' : 'grid-rows-[0fr] opacity-0';
  const tabStyles = (tab: string) => `tab-default text-base ${tab == currentTab ? 'tab-active' : ''}`;

  const onClickTab = (tab: string) => {
    setCurrentTab(tab);
    // updateParamContexts(tab);
  }

  //--------------------------------//
  // Param Table State              //
  //--------------------------------//
  const paramTableItems = useMemo(() => {
    const baseParamList: string[] = defaultParams || [];
    const contextParams: ParamContext[] = paramContextsList[currentTab]; 
    const params: (ParamItem | 'spacing')[] = getParamsTableItems(
      baseParamList, contextParams, childParamsList, paramTypeElements, paramDescriptionElements);
    
    // Variant specific params
    const variantParams: string[] = variantParamsList[currentTab] || [];
    const variantContextParams = paramContextsList[currentTab];
    if (variantParams?.length > 0) {
      const spacing: (ParamItem | 'spacing')[] = ['spacing'];
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(
        variantParams, variantContextParams, childParamsList, paramTypeElements, paramDescriptionElements);

      params.push(...spacing, ...variantParamItems);
    }

    return params;
  }, [currentTab]);


  //--------------------------------//
  // Input State Management         //
  //--------------------------------//
  const defaultIcons = getValuesFromType<IconTypes>(SourceIconSnippets, 'DefaultIconTypes') || [];
  const alertIcons = getValuesFromType<IconTypes>(SourceIconSnippets, 'AlertIconTypes') || [];
  const mediaIconTypes = getValuesFromType<IconTypes>(SourceIconSnippets, 'MediaIconTypes') || [];
  const techIconTypes = getValuesFromType<IconTypes>(SourceIconSnippets, 'TechIconTypes') || [];
  const companyIconTypes = ['LibertyLogo', 'StateAutoLogo', 'DemandJump'] as IconTypes[];
  const iconListNames = ['Default Icons', 'Alert Icons', 'Media Icons', 'Tech Icons', 'Company Icons'];


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2 docs-showcase-header">
        Alert Component
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          The <Kw>Icon</Kw> component is a list of our own icons for this project. I could use a theme for them,
          but I wanted the ability to have my own list of icons that are actually used, and allow for 
          custom <Kw>styling</Kw> along with less space taken up from imports.
          
          There are lots of icon types listed below, give them a try.
        </div>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container'>
        { tabs.map((tab: string, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} key={`showcase-input-tab-${tab}-${index}`} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabLabels[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2' id="showcase-variants">
        { currentTab == 'default' && 
          <ShowcaseElement jsx={getSourceCode(IconCodeSnippets, "Example_Icon")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-12 p-8'>
              <Example_Icon />
            </div>
          </ShowcaseElement>
        }
      </Variants>


      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Select Parameters' openByDefault>
          <ParamTable 
            params={paramTableItems} 
            additionalStyles='mt-4' 
          />
        </Dropdown>
      </div>
      

      <div className='spacing'>
        <h3 className="span-12 p-2 pt-12 docs-showcase-header">
          The icons for this project
        </h3>
        <div className='span-12 px-2 pb-0 showcase-text'>
          Hover over an icon to access it's variant
        </div>
      </div>

      {[defaultIcons, alertIcons, mediaIconTypes, techIconTypes, companyIconTypes].map((icons, index) =>
        <div className='span-12 lg:span-8 p-2 pt-12' key={`iconList-${index}`}>
          <h5 className="span-12 pb-4 docs-showcase-header">
            { iconListNames?.[index] || 'Icons' }
          </h5>
          <Card type="default" additStyles="span-12 rowStart gap-4 p-8 flex-wrap bg-div" noBackground hoverTheme>
            { icons.map((variant: IconTypes) => 
              <DisplayedIcon 
                variant={variant} 
                styles={
                  iconListNames?.[index] == 'Tech Icons' ? '[&_svg]:size-14' :
                  iconListNames?.[index] == 'Company Icons' ? '[&_svg]:size-32 [&_svg]:lg:size-52 [&_svg]:mx-6' : 
                  '[&_svg]:size-12'
                }
              />
            )}
          </Card>
        </div>
      )}
    </Container>
  );
}


const DisplayedIcon = memo(({ variant, styles }: {
  variant: IconTypes;
  styles?: string;
}) => {
  const { show, hide } = useContext(TooltipService);
  const tooltipText = { code: dParArg('variant', variant) };
  
  return (
    <div 
      onMouseEnter={() => show(tooltipText)}
      onMouseLeave={() => hide()}
      className={`${styles} [&_svg]:hover:scale-125`}
    >
      <Icon variant={variant} />
    </div>
  );
});


// Styled Components
const Container = styled.div``;
const Tabs = styled.div``;
const Variants = styled.div``;


//---------------------------------------------//
// Component param table logic                 //
//---------------------------------------------//
// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'variant', 'styles' 
];

// Variant's contextual params
const variantParamsList: Record<string, string[]> = {
}

// Nested Params
const childParamsList: Record<string, string[]> = {
};


// variant specific context params
const paramContextsList: Record<string, ParamContext[]> = {
  "none": [],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// Static FC component functions do not take up memory or increase load times, they're static and diffing is nominal
const paramTypeElements: Record<string, React.FC> = {
  'variant': () => <ParamType type="IconTypes" tooltip={{ code: Code_IconTypes }} />,
  'styles': () => <ParamType type="string" optional tooltip={{ code: dParArg('styles', 'icon-default') }} />,
};

// Code Snippets
import SourceIconSnippets from '@lib-rc/Common/Icons/Icon.tsx?raw';
import { Card } from '../../../../../Components/Content/Card/Card';
const Code_IconTypes = getSourceCode(SourceIconSnippets, 'IconTypes', 'type');


const paramDescriptionElements: Record<string, React.FC> = {
  'variant': () => 
    <div className='param-item-desc-text'>
      The icon you want to display.
    </div>,
  'styles': () => 
    <div className='param-item-desc-text'>
      If you want custom styles for the icon.
    </div>,
};

