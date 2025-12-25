import { Icon_AttachFile } from "./AttachFile/AttachFile";
import { Icon_DarkTheme } from "./DarkTheme/DarkTheme";
import { Icon_DropdownArrow } from "./DropdownArrow/DropdownArrow";
import { Icon_Envelope } from "./Envelope/Envelope";
import { Icon_Error } from "./Error/Error";
import { Icon_InfoBox } from "./InfoBox/InfoBox";
import { Icon_LightTheme } from "./LightTheme/LightTheme";

type IconTypes = 
  'AttachFile' |
  'DarkTheme' |
  'DropdownArrow' |
  'Envelope' |
  'Error' |
  'InfoBox' |
  'LightTheme'
;

export interface IconAttributes {
  styles?: string;
}

interface IconProps {
  variant: IconTypes;
  styles?: string;
}

const defaultIconStyles = `size-5 self-center justify-self-center text-slate-500 sm:size-4 dark:text-slate-400`;
export const Icon = ({ variant, styles = ''}: IconProps) => {
  const iconStyles = styles ? styles : defaultIconStyles;

  if (variant == 'AttachFile') return (<Icon_AttachFile styles={iconStyles}></Icon_AttachFile>);
  if (variant == 'DarkTheme') return (<Icon_DarkTheme styles={iconStyles}></Icon_DarkTheme>);
  if (variant == 'DropdownArrow') return (<Icon_DropdownArrow styles={iconStyles}></Icon_DropdownArrow>);
  if (variant == 'Envelope') return (<Icon_Envelope styles={iconStyles}></Icon_Envelope>);
  if (variant == 'Error') return (<Icon_Error styles={styles ? styles : defaultIconStyles + ` text-red-500 sm:size-4 dark:text-red-400`}></Icon_Error>);
  if (variant == 'InfoBox') return (<Icon_InfoBox styles={iconStyles}></Icon_InfoBox>);
  if (variant == 'LightTheme') return (<Icon_LightTheme styles={iconStyles}></Icon_LightTheme>);
  return (<div></div>);
}

