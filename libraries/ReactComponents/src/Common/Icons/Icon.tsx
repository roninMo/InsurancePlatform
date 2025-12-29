import { Icon_AttachFile } from "./AttachFile/Icon_AttachFile";
import { Icon_Checkbox } from "./Checkbox/Icon_Checkbox";
import { Icon_DarkTheme } from "./DarkTheme/Icon_DarkTheme";
import { Icon_DropdownArrow } from "./DropdownArrow/Icon_DropdownArrow";
import { Icon_Envelope } from "./Envelope/Icon_Envelope";
import { Icon_Error } from "./Error/Icon_Error";
import { Icon_InfoBox } from "./InfoBox/Icon_InfoBox";
import { Icon_LightTheme } from "./LightTheme/Icon_LightTheme";
import { Icon_Profile } from "./Profile/Icon_Profile";
import { Icon_SelectArrows } from "./SelectArrows/SelectArrows";
import { Icon_Sort } from "./Sort/Icon_Sort";
import { Icon_System } from "./System/System";

export type IconTypes = 
  'AttachFile' |
  'Checkbox' |
  'DarkTheme' |
  'DropdownArrow' |
  'Envelope' |
  'Error' |
  'InfoBox' |
  'LightTheme' |
  'Profile' |
  'SelectArrows' |
  'Sort' |
  'System'
;

export interface IconAttributes {
  styles?: string;
}

interface IconProps {
  variant: IconTypes;
  styles?: string;
}

const defaultIconStyles = `size-5 justify-center self-center`;
export const Icon = ({ variant, styles = ''}: IconProps) => {
  const iconStyles = styles ? styles : defaultIconStyles;

  if (variant == 'AttachFile') return (<Icon_AttachFile styles={iconStyles}></Icon_AttachFile>);
  if (variant == 'Checkbox') return (<Icon_Checkbox styles={iconStyles}></Icon_Checkbox>);
  if (variant == 'DarkTheme') return (<Icon_DarkTheme styles={iconStyles}></Icon_DarkTheme>);
  if (variant == 'DropdownArrow') return (<Icon_DropdownArrow styles={iconStyles}></Icon_DropdownArrow>);
  if (variant == 'Envelope') return (<Icon_Envelope styles={iconStyles}></Icon_Envelope>);
  if (variant == 'Error') return (<Icon_Error styles={styles ? styles : defaultIconStyles + ` text-red-500 dark:text-red-400`}></Icon_Error>);
  if (variant == 'InfoBox') return (<Icon_InfoBox styles={iconStyles}></Icon_InfoBox>);
  if (variant == 'LightTheme') return (<Icon_LightTheme styles={iconStyles}></Icon_LightTheme>);
  if (variant == 'Profile') return (<Icon_Profile styles={iconStyles}></Icon_Profile>);
  if (variant == 'SelectArrows') return (<Icon_SelectArrows styles={iconStyles}></Icon_SelectArrows>);
  if (variant == 'Sort') return (<Icon_Sort styles={iconStyles}></Icon_Sort>);
  if (variant == 'System') return (<Icon_System styles={iconStyles}></Icon_System>);
  return (<div></div>);
}
