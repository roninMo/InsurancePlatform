import { JSX } from "react";

import { Icon_AtSymbol } from "./Default/AtSymbol/AtSymbol";
import { Icon_AttachFile } from "./Default/AttachFile/Icon_AttachFile";
import { Icon_Calendar } from "./Default/Calendar/Icon_Calendar";
import { Icon_Checkbox } from "./Default/Checkbox/Icon_Checkbox";
import { Icon_CodeBracket } from "./Default/CodeBracket/CodeBracket";
import { Icon_DarkTheme } from "./Default/DarkTheme/Icon_DarkTheme";
import { Icon_Database } from "./Default/Database/Icon_Database";
import { Icon_DropdownArrow } from "./Default/DropdownArrow/Icon_DropdownArrow";
import { Icon_Envelope } from "./Default/Envelope/Icon_Envelope";
import { Icon_Error } from "./Default/Error/Icon_Error";
import { Icon_InfoBox } from "./Default/InfoBox/Icon_InfoBox";
import { Icon_LightTheme } from "./Default/LightTheme/Icon_LightTheme";
import { Icon_Link } from "./Default/Link/Link";
import { Icon_LinkedIn } from "./SocialMedia/LinkedIn/Icon_LinkedIn";
import { Icon_Phone } from "./Default/Phone/Icon_Phone";
import { Icon_Plus } from "./Default/Plus/Icon_Plus";
import { Icon_Profile } from "./Default/Profile/Icon_Profile";
import { Icon_SelectArrow } from "./Default/SelectArrow/SelectArrow";
import { Icon_Smile } from "./Default/Smile/Smile";
import { Icon_Sort } from "./Default/Sort/Icon_Sort";
import { Icon_System } from "./Default/System/System";
import { Icon_Tag } from "./Default/Tag/Icon_Tag";
import { Icon_Trash } from "./Default/Trash/Icon_Trash";
import { Icon_RxJs } from "./Tech/Frontend/RxJs/Icon_RxJs";
import { Icon_Bue } from "./Tech/Frontend/Vue/Icon_Vue";
import { Icon_Facebook } from "./SocialMedia/Facebook/Icon_Facebook";
import { Icon_Github } from "./SocialMedia/Github/Icon_Github";
import { Icon_Instagram } from "./SocialMedia/Instagram/Icon_Instagram";
import { Icon_Youtube } from "./SocialMedia/Youtube/Icon_Youtube";
import { Icon_Redux } from "./Tech/Frontend/Redux/Icon_Redux";
import { Icon_React } from "./Tech/Frontend/React/Icon_React";
import { Icon_Playwright } from "./Tech/Frontend/Playwright/Icon_Playwright";
import { Icon_ReactHookForms } from "./Tech/Frontend/ReactHookForms/Icon_ReactHookForms";
import { Icon_Jest } from "./Tech/Frontend/Jest/Icon_Jest";
import { Icon_Axios } from "./Tech/Frontend/Axios/Icon_Axios";
import { Icon_Angular } from "./Tech/Frontend/Angular/Icon_Angular";
import { Icon_GCP } from "./Tech/Cloud/GCP/Icon_GCP";
import { Icon_Azure } from "./Tech/Cloud/Azure/Icon_Azure";
import { Icon_AWS } from "./Tech/Cloud/AWS/Icon_AWS";
import { Icon_Postgres } from "./Tech/Backend/Postgres/Icon_Postgres";
import { Icon_Orleans } from "./Tech/Backend/Orleans/Icon_Orleans";
import { Icon_Node } from "./Tech/Backend/Node/Icon_Node";
import { Icon_Net } from "./Tech/Backend/Net/Icon_Net";
import { Icon_Mongo } from "./Tech/Backend/Mongo/Icon_Mongo";
import { Icon_Express } from "./Tech/Backend/Express/Icon_Express";
import { Icon_Kubernetes } from "./Tech/Automation/Kubernetes/Icon_Kubernetes";
import { Icon_Docker } from "./Tech/Automation/Docker/Icon_Docker";
import { Icon_Bamboo } from "./Tech/Automation/Bamboo/Icon_Bamboo";
import { Icon_AzureDevops } from "./Tech/Automation/AzureDevops/Icon_AzureDevops";
import { Icon_AwsCdk } from "./Tech/Automation/AwsCdk/Icon_AwsCdk";
import { Icon_Atlassian } from "./Tech/Automation/Atlassian/Icon_Atlassian";
import { Icon_ApolloGraphQl } from "./Tech/Backend/Apollo/Icon_Apollo";
import { Icon_Twitter } from "./SocialMedia/Twitter/Icon_Twitter";
import { Icon_VennDiagram } from "./Default/VennDiagram/Icon_VennDiagram";
import { Icon_Close } from "./Default/Close/Icon_Close";
import { Icon_LibertyLogo } from "./Companies/LibertyLogo/Icon_LibertyLogo";
import { Icon_LibertyMutual } from "./Companies/LibertyMutual/Icon_LibertyMutual";
import { Icon_StateAutoLogo } from "./Companies/StateAutoLogo/Icon_StateAutoLogo";
import { Icon_StateAuto } from "./Companies/StateAuto/Icon_StateAuto";
import { Icon_Computer } from "./Default/Computer/Icon_Computer";
import { Icon_Cloud } from "./Default/Cloud/Icon_Cloud";
import { Icon_DataDog } from "./Tech/Analytics/DataDog/Icon_DataDog";
import { Icon_Loading } from "./Default/Loading/Icon_Loading";
import { Icon_Demandjump } from "./Companies/Demandjump/Icon_Demandjump";
import { Icon_DocText } from "./Default/DocText/Icon_DocText";
import { Icon_CircleCheck } from "./Default/CircleCheck/Icon_CircleCheck";
import { Icon_CircleError } from "./Default/CircleError/Icon_CircleError";
import { Icon_CirclePause } from "./Default/CirclePause/Icon_CirclePause";
import { Icon_Eye } from "./Default/Eye/Icon_Eye";
import { Icon_EyeSlash } from "./Default/EyeSlash/Icon_EyeSlash";
import { Icon_CreditCard } from "./Default/CreditCard/Icon_CreditCard";
import { Icon_ChevronDown } from "./Default/ChevronDown/Icon_ChevronDown";
import { Icon_ChevronUp } from "./Default/ChevronUp/Icon_ChevronUp";
// TODO: LazyLoading

export type IconTypes = DefaultIconTypes | MediaIconTypes | TechIconTypes | CompanyIconTypes;
const defaultIconStyles = `size-5 justify-center self-center`;

// Used in the svg element classes
export interface IconAttributes {
  styles?: string;
}

// The place to go for specific non theme icons: https://svgicons.com/
interface IconProps {
  variant: IconTypes;
  styles?: string;
}




//------------------------------------//
// Icon Component                     //
//------------------------------------//
export type DefaultIconTypes = 
  'AtSymbol' |
  'AttachFile' |
  'Calendar' |
  'Checkbox' |
  'ChevronDown' |
  'ChevronUp' |
  'CircleCheck' |
  'CircleError' |
  'CirclePause' |
  'Close' |
  'Cloud' |
  'CodeBracket' |
  'Computer' |
  'CreditCard' |
  'DarkTheme' |
  'Database' |
  'DocText' |
  'DemandJump' |
  'DropdownArrow' |
  'Envelope' |
  'Error' |
  'Eye' |
  'EyeSlash' |
  'InfoBox' |
  'LightTheme' |
  'Link' |
  'Loading' |
  'LinkedIn' |
  'Phone' |
  'Plus' |
  'Profile' |
  'SelectArrow' |
  'Smile' |
  'Sort' |
  'System' |
  'Tag' |
  'Trash' |
  'VennDiagram' 
;

export const Icon = ({ variant, styles = ''}: IconProps) => {
  const iconStyles = styles ? styles : defaultIconStyles;
  const defaultErrorStyles = defaultIconStyles + ` text-red-500 dark:text-red-400`;
  const defaultOkayStyles = defaultIconStyles + ` text-emerald-500 dark:text-emerald-400`;
  
  
  // Default icons
  if (variant == 'AtSymbol')        return (<Icon_AtSymbol styles={iconStyles} />);
  if (variant == 'AttachFile')      return (<Icon_AttachFile styles={iconStyles} />);
  if (variant == 'Calendar')        return (<Icon_Calendar styles={iconStyles} />);
  if (variant == 'Checkbox')        return (<Icon_Checkbox styles={styles ? styles : defaultOkayStyles} />);
  if (variant == 'ChevronDown')     return (<Icon_ChevronDown styles={iconStyles} />);
  if (variant == 'ChevronUp')       return (<Icon_ChevronUp styles={iconStyles} />);
  if (variant == 'CircleCheck')     return (<Icon_CircleCheck styles={iconStyles} />);
  if (variant == 'CircleError')     return (<Icon_CircleError styles={iconStyles} />);
  if (variant == 'CirclePause')     return (<Icon_CirclePause styles={iconStyles} />);
  if (variant == 'Close')           return (<Icon_Close styles={iconStyles} />);
  if (variant == 'Cloud')           return (<Icon_Cloud styles={iconStyles} />);
  if (variant == 'CodeBracket')     return (<Icon_CodeBracket styles={iconStyles} />);
  if (variant == 'Computer')        return (<Icon_Computer styles={iconStyles} />);
  if (variant == 'CreditCard')      return (<Icon_CreditCard styles={iconStyles} />);
  if (variant == 'DarkTheme')       return (<Icon_DarkTheme styles={iconStyles} />);
  if (variant == 'Database')        return (<Icon_Database styles={iconStyles} />);
  if (variant == 'DocText')         return (<Icon_DocText styles={iconStyles} />);
  if (variant == 'DemandJump')      return (<Icon_Demandjump styles={iconStyles} />);
  if (variant == 'DropdownArrow')   return (<Icon_DropdownArrow styles={iconStyles} />);
  if (variant == 'Envelope')        return (<Icon_Envelope styles={iconStyles} />);
  if (variant == 'Error')           return (<Icon_Error styles={styles ? styles : defaultErrorStyles} />);
  if (variant == 'Eye')             return (<Icon_Eye styles={iconStyles} />);
  if (variant == 'EyeSlash')        return (<Icon_EyeSlash styles={iconStyles} />);
  if (variant == 'InfoBox')         return (<Icon_InfoBox styles={iconStyles} />);
  if (variant == 'Instagram')       return (<Icon_Instagram styles={iconStyles} />);
  if (variant == 'LightTheme')      return (<Icon_LightTheme styles={iconStyles} />);
  if (variant == 'Link')            return (<Icon_Link styles={iconStyles} />);
  if (variant == 'Loading')         return (<Icon_Loading styles={iconStyles} />);
  if (variant == 'Plus')            return (<Icon_Plus styles={iconStyles} />);
  if (variant == 'Phone')           return (<Icon_Phone styles={iconStyles} />);
  if (variant == 'Profile')         return (<Icon_Profile styles={iconStyles} />);
  if (variant == 'SelectArrow')     return (<Icon_SelectArrow styles={iconStyles} />);
  if (variant == 'Smile')           return (<Icon_Smile styles={iconStyles} />);
  if (variant == 'Sort')            return (<Icon_Sort styles={iconStyles} />);
  if (variant == 'System')          return (<Icon_System styles={iconStyles} />);
  if (variant == 'Tag')             return (<Icon_Tag styles={iconStyles} />);
  if (variant == 'Trash')           return (<Icon_Trash styles={styles ? styles : defaultErrorStyles} />);
  if (variant == 'VennDiagram')     return (<Icon_VennDiagram styles={iconStyles} />);

  // Social Media Icons
  const mediaIcon = MediaIcon({variant, styles});
  if (mediaIcon) return mediaIcon;
  
  // Tech Icons
  const techIcon = TechIcon({variant, styles});
  if (techIcon) return techIcon;
  
  // Company Icons
  const companyIcon = CompanyIcon({variant, styles});
  if (companyIcon) return companyIcon;
  

  return (<></>);
}




//------------------------------------//
// Media Icons                        //
//------------------------------------//
export type MediaIconTypes =
  'Facebook' |
  'Github' |
  'Instagram' |
  'Twitter' |
  'Youtube'
;

export const MediaIcon = ({ variant, styles = ''}: IconProps) => {
  const iconStyles = styles ? styles : defaultIconStyles;
  let Icon: JSX.Element | undefined = undefined;


  // Social media icons
  if (variant == 'Facebook')        Icon = (<Icon_Facebook styles={iconStyles} />);
  if (variant == 'Github')          Icon = (<Icon_Github styles={iconStyles} />);
  if (variant == 'LinkedIn')        Icon = (<Icon_LinkedIn styles={iconStyles} />);
  if (variant == 'Twitter')         Icon = (<Icon_Twitter styles={iconStyles} />);
  if (variant == 'Youtube')         Icon = (<Icon_Youtube styles={iconStyles} />);
  return Icon;
}




//------------------------------------//
// Tech and Language Icons            //
//------------------------------------//
export type FrontendFrameworks = 'Angular' | 'React' | 'Vue';
export type BackendFrameworks = 'Express' | '.Net' | 'Node';
export type FrontendTechs = 'RxJs' | 'ReactHookForms' | 'Redux' | 'Jest' | 'Playwright' | 'Axios' | 'ReactiveFormsModule';
export type BackendTechs = 'Orleans' | 'Postgres';
export type CloudServiceProviders = 'AWS' | 'Azure' | 'GCP';
export type AutomationTools = 'AWS CDK' |'Kubernetes' | 'Bamboo' | 'Docker';
export type AutomationKeywords = 'CI/CD Pipelines' | 'Azure Devops' | 'Atlassian Stack';

export type TechIconTypes = 
  'Angular' | 'React' | 'Vue' | 
  'Express' | 'Net' | 'Node' | 

  'RxJs' | 'ReactHookForms' | 'Redux' | 'Jest' | 'Playwright' | 'Axios' | 
  'Orleans' | 'ApolloGraphQL' | 'Postgres' | 'MongoDB' | 

  'DataDog' |
  'AWS' | 'Azure' | 'GCP' | 

  'AWS CDK' |'Kubernetes' | 'Bamboo' | 'Docker' |
  'CI/CD Pipelines' | 'Azure Devops' | 'Atlassian'
;

export const TechIcon = ({ variant, styles = ''}: IconProps) => {
  const iconStyles = styles ? styles : defaultIconStyles;
  let Icon: JSX.Element | undefined = undefined;

  // Automation
  if (variant == 'Atlassian')           Icon = (<Icon_Atlassian styles={iconStyles} />);
  else if (variant == 'AWS CDK')             Icon = (<Icon_AwsCdk styles={iconStyles} />);
  else if (variant == 'Azure Devops')        Icon = (<Icon_AzureDevops styles={iconStyles} />);
  else if (variant == 'Bamboo')              Icon = (<Icon_Bamboo styles={iconStyles} />);
  else if (variant == 'CI/CD Pipelines')     Icon = (<Icon_Database styles={iconStyles} />);
  else if (variant == 'Docker')              Icon = (<Icon_Docker styles={iconStyles} />);
  else if (variant == 'Kubernetes')          Icon = (<Icon_Kubernetes styles={iconStyles} />);
  
  // Backend
  else if (variant == 'ApolloGraphQL')       Icon = (<Icon_ApolloGraphQl styles={iconStyles} />);
  else if (variant == 'Express')             Icon = (<Icon_Express styles={iconStyles} />);
  else if (variant == 'MongoDB')             Icon = (<Icon_Mongo styles={iconStyles} />);
  else if (variant == 'Net')                 Icon = (<Icon_Net styles={iconStyles} />);
  else if (variant == 'Node')                Icon = (<Icon_Node styles={iconStyles} />);
  else if (variant == 'Orleans')             Icon = (<Icon_Orleans styles={iconStyles} />);
  else if (variant == 'Postgres')            Icon = (<Icon_Postgres styles={iconStyles} />);

  // CLoud
  else if (variant == 'AWS')                 Icon = (<Icon_AWS styles={iconStyles} />);
  else if (variant == 'Azure')               Icon = (<Icon_Azure styles={iconStyles} />);
  else if (variant == 'GCP')                 Icon = (<Icon_GCP styles={iconStyles} />);

  // Frontend
  else if (variant == 'Angular')             Icon = (<Icon_Angular styles={iconStyles} />);
  else if (variant == 'Axios')               Icon = (<Icon_Axios styles={iconStyles} />);
  else if (variant == 'Jest')                Icon = (<Icon_Jest styles={iconStyles} />);
  else if (variant == 'Playwright')          Icon = (<Icon_Playwright styles={iconStyles} />);
  else if (variant == 'ReactHookForms')      Icon = (<Icon_ReactHookForms styles={iconStyles} />);
  else if (variant == 'React')               Icon = (<Icon_React styles={iconStyles} />);

  else if (variant == 'Redux')               Icon = (<Icon_Redux styles={iconStyles} />);
  else if (variant == 'RxJs')                Icon = (<Icon_RxJs styles={iconStyles} />);
  else if (variant == 'Vue')                 Icon = (<Icon_Bue styles={iconStyles} />);
  else if (variant == 'DataDog')             Icon = (<Icon_DataDog styles={iconStyles} />);
  return Icon;
}



export type CompanyIconTypes = 'LibertyMutual' | 'LibertyLogo' | 'StateAuto' | 'StateAutoLogo';
export const CompanyIcon = ({ variant, styles = ''}: IconProps) => {
  const iconStyles = styles ? styles : defaultIconStyles;
  let Icon: JSX.Element | undefined = undefined;

  if (variant == 'LibertyLogo')              Icon = (<Icon_LibertyLogo styles={iconStyles} />);
  else if (variant == 'LibertyMutual')       Icon = (<Icon_LibertyMutual styles={iconStyles} />);
  else if (variant == 'StateAuto')           Icon = (<Icon_StateAuto styles={iconStyles} />);
  else if (variant == 'StateAutoLogo')       Icon = (<Icon_StateAutoLogo styles={iconStyles} />);
  return Icon;
}