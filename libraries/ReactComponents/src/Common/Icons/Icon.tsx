// #region Icon imports
import { Icon_AtSymbol } from "./Default/AtSymbol/Icon_AtSymbol";
import { Icon_AttachFile } from "./Default/AttachFile/Icon_AttachFile";
import { Icon_Calendar } from "./Default/Calendar/Icon_Calendar";
import { Icon_CodeBracket } from "./Default/CodeBracket/CodeBracket";
import { Icon_DarkTheme } from "./Default/DarkTheme/Icon_DarkTheme";
import { Icon_Database } from "./Default/Database/Icon_Database";
import { Icon_DropdownArrow } from "./Default/DropdownArrow/Icon_DropdownArrow";
import { Icon_Envelope } from "./Default/Envelope/Icon_Envelope";
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
import { Icon_OutlinePause } from "./Default/OutlinePause/Icon_OutlinePause";
import { Icon_Eye } from "./Default/Eye/Icon_Eye";
import { Icon_EyeSlash } from "./Default/EyeSlash/Icon_EyeSlash";
import { Icon_CreditCard } from "./Default/CreditCard/Icon_CreditCard";
import { Icon_ChevronDown } from "./Default/ChevronDown/Icon_ChevronDown";
import { Icon_ChevronUp } from "./Default/ChevronUp/Icon_ChevronUp";
import { Icon_Canvas } from "./Default/Canvas/Icon_Canvas";
import { Icon_CloudUpload } from "./Default/CloudUpload/Icon_CloudUpload";
import { Icon_Upload } from "./Default/Upload/Icon_Upload";
import { Icon_CircleInfo } from "./Alerts/Icon_CircleInfo";
import { Icon_CircleOkay } from "./Alerts/Icon_CircleOkay";
import { Icon_CircleQuestion } from "./Alerts/Icon_CircleQuestion";
import { Icon_CircleWarning } from "./Alerts/Icon_CircleWarning";
import { Icon_OutlineError } from "./Alerts/Icon_OutlineError";
import { Icon_OutlineInfo } from "./Alerts/Icon_OutlineInfo";
import { Icon_OutlineOkay } from "./Alerts/Icon_OutlineOkay";
import { Icon_OutlineQuestion } from "./Alerts/Icon_OutlineQuestion";
import { Icon_OutlineWarning } from "./Alerts/Icon_OutlineWarning";
import { Icon_CircleError } from "./Alerts/Icon_CircleError";
// #endregion


export type IconTypes = DefaultIconTypes 
| AlertIconTypes 
| MediaIconTypes 
| TechIconTypes 
| CompanyIconTypes;

// Used in the svg element classes
export interface IconAttributes {
  /** The override for the default icon themes */
  styles?: string;
}

// The place to go for specific non theme icons: https://svgicons.com/
interface IconProps {
  variant: IconTypes;
  styles?: string;
}


// TODO: LazyLoading option?
export const Icon = ({ variant, styles = ''}: IconProps) => {
  // Default Icon styles
  let iconStyles = 'icon-default'; 
  if (infoStyleMap?.[variant])    iconStyles = 'i-default-theme i-info-color';
  if (warningStyleMap?.[variant]) iconStyles = 'i-default-theme i-warn-color';
  if (errorStyleMap?.[variant])   iconStyles = 'i-default-theme i-err-color';
  if (okayStyleMap?.[variant])    iconStyles = 'i-default-theme i-ok-color';
  iconStyles = styles ? styles : iconStyles;
  // console.log(`\nrendered ${variant} icon, styles: `, iconStyles);
  
  // Rendered Icons
  const DefaultIcon = defaultIconMap[variant];
  if (DefaultIcon) return <DefaultIcon styles={iconStyles} />;

  const AlertIcon = alertIconMap[variant];
  if (AlertIcon) return <AlertIcon styles={iconStyles} />;

  const MediaIcon = mediaIconMap[variant];
  if (MediaIcon) return <MediaIcon styles={iconStyles} />;
  
  const TechIcon = techIconMap[variant];
  if (TechIcon) return <TechIcon styles={iconStyles} />;
  
  const CompanyIcon = companyIconMap[variant];
  if (CompanyIcon) return <CompanyIcon styles={iconStyles} />;

  return (<></>);
}


//------------------------------------//
// Default Icons                      //
//------------------------------------//
export type DefaultIconTypes = 
| 'AtSymbol' 
| 'AttachFile' 
| 'Calendar' 
| 'Canvas' 
| 'ChevronDown' 
| 'ChevronUp' 
| 'Close' 
| 'Cloud' 
| 'CloudUpload' 
| 'CodeBracket' 
| 'Computer' 
| 'CreditCard' 
| 'DarkTheme' 
| 'Database' 
| 'DocText' 
| 'DemandJump' 
| 'DropdownArrow' 
| 'Envelope' 
| 'Eye' 
| 'EyeSlash' 
| 'LightTheme' 
| 'Link' 
| 'Loading' 
| 'LinkedIn' 
| 'OutlinePause' 
| 'Phone' 
| 'Plus' 
| 'Profile' 
| 'SelectArrow' 
| 'Smile' 
| 'Sort' 
| 'System' 
| 'Tag' 
| 'Trash' 
| 'Upload' 
| 'VennDiagram';


//------------------------------------//
// Alert Icons                        //
//------------------------------------//
export type AlertIconTypes = 
| 'CircleQuestion'
| 'CircleWarning'
| 'CircleError'
| 'CircleOkay'
| 'CircleInfo'

| 'OutlineQuestion'
| 'OutlineWarning'
| 'OutlineError'
| 'OutlineOkay'
| 'OutlineInfo';


//------------------------------------//
// Media Icons                        //
//------------------------------------//
export type MediaIconTypes =
| 'Facebook' 
| 'Github' 
| 'Instagram' 
| 'Twitter' 
| 'Youtube';


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


//------------------------------------//
// Company Icons            //
//------------------------------------//
export type CompanyIconTypes = 'LibertyMutual' | 'LibertyLogo' | 'StateAuto' | 'StateAutoLogo';




//------------------------------------//
// Icon Mappings                      //
//------------------------------------//
// Icon style map
const infoStyleMap: Partial<Record<IconTypes, boolean>> = {
  'CircleQuestion': true,
  'OutlineQuestion': true, 
};

const warningStyleMap: Partial<Record<IconTypes, boolean>> = {
  'CircleWarning': true,
  'OutlineWarning': true,
};

const errorStyleMap: Partial<Record<IconTypes, boolean>> = {
  'CircleError': true,
  'OutlineError': true,
  'Trash': true,
};

const okayStyleMap: Partial<Record<IconTypes, boolean>> = {
  'CircleOkay': true,
  'OutlineOkay': true,
};


// #region Icon Maps
const defaultIconMap: Partial<Record<IconTypes, React.FC<{ styles: string }>>> = {
  'AtSymbol':        ({ styles }) => <Icon_AtSymbol styles={styles} />,
  'AttachFile':      ({ styles }) => <Icon_AttachFile styles={styles} />,
  'Calendar':        ({ styles }) => <Icon_Calendar styles={styles} />,
  'Canvas':          ({ styles }) => <Icon_Canvas styles={styles} />,
  'ChevronDown':     ({ styles }) => <Icon_ChevronDown styles={styles} />,
  'ChevronUp':       ({ styles }) => <Icon_ChevronUp styles={styles} />,
  'Close':           ({ styles }) => <Icon_Close styles={styles} />,
  'Cloud':           ({ styles }) => <Icon_Cloud styles={styles} />,
  'CloudUpload':     ({ styles }) => <Icon_CloudUpload styles={styles} />,
  'CodeBracket':     ({ styles }) => <Icon_CodeBracket styles={styles} />,
  'Computer':        ({ styles }) => <Icon_Computer styles={styles} />,
  'CreditCard':      ({ styles }) => <Icon_CreditCard styles={styles} />,
  'DarkTheme':       ({ styles }) => <Icon_DarkTheme styles={styles} />,
  'Database':        ({ styles }) => <Icon_Database styles={styles} />,
  'DocText':         ({ styles }) => <Icon_DocText styles={styles} />,
  'DemandJump':      ({ styles }) => <Icon_Demandjump styles={styles} />,
  'DropdownArrow':   ({ styles }) => <Icon_DropdownArrow styles={styles} />,
  'Envelope':        ({ styles }) => <Icon_Envelope styles={styles} />,
  'Eye':             ({ styles }) => <Icon_Eye styles={styles} />,
  'EyeSlash':        ({ styles }) => <Icon_EyeSlash styles={styles} />,
  'Instagram':       ({ styles }) => <Icon_Instagram styles={styles} />,
  'LightTheme':      ({ styles }) => <Icon_LightTheme styles={styles} />,
  'Link':            ({ styles }) => <Icon_Link styles={styles} />,
  'Loading':         ({ styles }) => <Icon_Loading styles={styles} />,
  'OutlinePause':    ({ styles }) => <Icon_OutlinePause styles={styles} />,
  'Plus':            ({ styles }) => <Icon_Plus styles={styles} />,
  'Phone':           ({ styles }) => <Icon_Phone styles={styles} />,
  'Profile':         ({ styles }) => <Icon_Profile styles={styles} />,
  'SelectArrow':     ({ styles }) => <Icon_SelectArrow styles={styles} />,
  'Smile':           ({ styles }) => <Icon_Smile styles={styles} />,
  'Sort':            ({ styles }) => <Icon_Sort styles={styles} />,
  'System':          ({ styles }) => <Icon_System styles={styles} />,
  'Tag':             ({ styles }) => <Icon_Tag styles={styles} />,
  'Trash':           ({ styles }) => <Icon_Trash styles={styles} />,
  'Upload':          ({ styles }) => <Icon_Upload styles={styles} />,
  'VennDiagram':     ({ styles }) => <Icon_VennDiagram styles={styles} />,
};

const alertIconMap: Partial<Record<IconTypes, React.FC<{ styles: string }>>> = {
  'CircleQuestion':     ({ styles }) => <Icon_CircleQuestion styles={styles} />,
  'CircleWarning':    ({ styles }) => <Icon_CircleWarning styles={styles} />,
  'CircleError':    ({ styles }) => <Icon_CircleError styles={styles} />,
  'CircleOkay':     ({ styles }) => <Icon_CircleOkay styles={styles} />,
  'CircleInfo':     ({ styles }) => <Icon_CircleInfo styles={styles} />,

  'OutlineQuestion':    ({ styles }) => <Icon_OutlineQuestion styles={styles} />,
  'OutlineWarning':     ({ styles }) => <Icon_OutlineWarning styles={styles} />,
  'OutlineError':     ({ styles }) => <Icon_OutlineError styles={styles} />,
  'OutlineOkay':    ({ styles }) => <Icon_OutlineOkay styles={styles} />,
  'OutlineInfo':    ({ styles }) => <Icon_OutlineInfo styles={styles} />,
};

const mediaIconMap: Partial<Record<IconTypes, React.FC<{ styles: string }>>> = {
  'Facebook':   ({ styles }) => <Icon_Facebook styles={styles} />,
  'Github':     ({ styles }) => <Icon_Github styles={styles} />,
  'LinkedIn':   ({ styles }) => <Icon_LinkedIn styles={styles} />,
  'Twitter':    ({ styles }) => <Icon_Twitter styles={styles} />,
  'Youtube':    ({ styles }) => <Icon_Youtube styles={styles} />,
};

const techIconMap: Partial<Record<IconTypes, React.FC<{ styles: string }>>> = {
  // Automation
  'Atlassian':           ({ styles }) => <Icon_Atlassian styles={styles} />,
  'AWS CDK':             ({ styles }) => <Icon_AwsCdk styles={styles} />,
  'Azure Devops':        ({ styles }) => <Icon_AzureDevops styles={styles} />,
  'Bamboo':              ({ styles }) => <Icon_Bamboo styles={styles} />,
  'CI/CD Pipelines':     ({ styles }) => <Icon_Database styles={styles} />,
  'Docker':              ({ styles }) => <Icon_Docker styles={styles} />,
  'Kubernetes':          ({ styles }) => <Icon_Kubernetes styles={styles} />,
  
  // Backend
  'ApolloGraphQL':       ({ styles }) => <Icon_ApolloGraphQl styles={styles} />,
  'Express':             ({ styles }) => <Icon_Express styles={styles} />,
  'MongoDB':             ({ styles }) => <Icon_Mongo styles={styles} />,
  'Net':                 ({ styles }) => <Icon_Net styles={styles} />,
  'Node':                ({ styles }) => <Icon_Node styles={styles} />,
  'Orleans':             ({ styles }) => <Icon_Orleans styles={styles} />,
  'Postgres':            ({ styles }) => <Icon_Postgres styles={styles} />,

  // CLoud
  'AWS':                 ({ styles }) => <Icon_AWS styles={styles} />,
  'Azure':               ({ styles }) => <Icon_Azure styles={styles} />,
  'GCP':                 ({ styles }) => <Icon_GCP styles={styles} />,

  // Frontend
  'Angular':             ({ styles }) => <Icon_Angular styles={styles} />,
  'Axios':               ({ styles }) => <Icon_Axios styles={styles} />,
  'Jest':                ({ styles }) => <Icon_Jest styles={styles} />,
  'Playwright':          ({ styles }) => <Icon_Playwright styles={styles} />,
  'ReactHookForms':      ({ styles }) => <Icon_ReactHookForms styles={styles} />,
  'React':               ({ styles }) => <Icon_React styles={styles} />,

  'Redux':               ({ styles }) => <Icon_Redux styles={styles} />,
  'RxJs':                ({ styles }) => <Icon_RxJs styles={styles} />,
  'Vue':                 ({ styles }) => <Icon_Bue styles={styles} />,
  'DataDog':             ({ styles }) => <Icon_DataDog styles={styles} />,
}

const companyIconMap: Partial<Record<IconTypes, React.FC<{ styles: string }>>> = {
  'LibertyLogo':         ({ styles }) => <Icon_LibertyLogo styles={styles} />,
  'LibertyMutual':       ({ styles }) => <Icon_LibertyMutual styles={styles} />,
  'StateAuto':           ({ styles }) => <Icon_StateAuto styles={styles} />,
  'StateAutoLogo':       ({ styles }) => <Icon_StateAutoLogo styles={styles} />,
}
// #endregion