import { Icon_AtSymbol } from "./AtSymbol/AtSymbol";
import { Icon_AttachFile } from "./AttachFile/Icon_AttachFile";
import { Icon_Calendar } from "./Calendar/Icon_Calendar";
import { Icon_Checkbox } from "./Checkbox/Icon_Checkbox";
import { Icon_CodeBracket } from "./CodeBracket/CodeBracket";
import { Icon_DarkTheme } from "./DarkTheme/Icon_DarkTheme";
import { Icon_DropdownArrow } from "./DropdownArrow/Icon_DropdownArrow";
import { Icon_Envelope } from "./Envelope/Icon_Envelope";
import { Icon_Error } from "./Error/Icon_Error";
import { Icon_Facebook } from "./Facebook/Icon_Facebook";
import { Icon_Github } from "./Github/Icon_Github";
import { Icon_InfoBox } from "./InfoBox/Icon_InfoBox";
import { Icon_Instagram } from "./Instagram/Icon_Instagram";
import { Icon_LightTheme } from "./LightTheme/Icon_LightTheme";
import { Icon_Link } from "./Link/Link";
import { Icon_LinkedIn } from "./LinkedIn/Icon_LinkedIn";
import { Icon_Phone } from "./Phone/Icon_Phone";
import { Icon_Plus } from "./Plus/Icon_Plus";
import { Icon_Profile } from "./Profile/Icon_Profile";
import { Icon_SelectArrow } from "./SelectArrow/SelectArrow";
import { Icon_Smile } from "./Smile/Smile";
import { Icon_Sort } from "./Sort/Icon_Sort";
import { Icon_System } from "./System/System";
import { Icon_Tag } from "./Tag/Icon_Tag";
import { Icon_Trash } from "./Trash/Icon_Trash";
import { Icon_Twitter } from "./Twitter/Icon_Twitter";
import { Icon_VennDiagram } from "./VennDiagram/VennDiagram";
import { Icon_Youtube } from "./Youtube/Icon_Youtube";

export type IconTypes = 
  'AtSymbol' |
  'AttachFile' |
  'Calendar' |
  'Checkbox' |
  'CodeBracket' |
  'DarkTheme' |
  'DropdownArrow' |
  'Envelope' |
  'Error' |
  'Facebook' |
  'Github' |
  'InfoBox' |
  'Instagram' |
  'LightTheme' |
  'Link' |
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
  'Twitter' |
  'VennDiagram' |
  'Youtube'
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
  const defaultErrorStyles = defaultIconStyles + ` text-red-500 dark:text-red-400`;
  const defaultOkayStyles = defaultIconStyles + ` text-emerald-500 dark:text-emerald-400`;

  if (variant == 'AtSymbol')        return (<Icon_AtSymbol styles={iconStyles} />);
  if (variant == 'AttachFile')      return (<Icon_AttachFile styles={iconStyles} />);
  if (variant == 'Calendar')        return (<Icon_Calendar styles={styles} />);
  if (variant == 'Checkbox')        return (<Icon_Checkbox styles={styles ? styles : defaultOkayStyles} />);
  if (variant == 'CodeBracket')     return (<Icon_CodeBracket styles={iconStyles} />);
  if (variant == 'DarkTheme')       return (<Icon_DarkTheme styles={iconStyles} />);
  if (variant == 'DropdownArrow')   return (<Icon_DropdownArrow styles={iconStyles} />);
  if (variant == 'Envelope')        return (<Icon_Envelope styles={iconStyles} />);
  if (variant == 'Error')           return (<Icon_Error styles={styles ? styles : defaultErrorStyles} />);
  if (variant == 'Facebook')        return (<Icon_Facebook styles={iconStyles} />);
  if (variant == 'Github')          return (<Icon_Github styles={iconStyles} />);
  if (variant == 'InfoBox')         return (<Icon_InfoBox styles={iconStyles} />);
  if (variant == 'Instagram')       return (<Icon_Instagram styles={iconStyles} />);
  if (variant == 'LightTheme')      return (<Icon_LightTheme styles={iconStyles} />);
  if (variant == 'Link')            return (<Icon_Link styles={iconStyles} />);
  if (variant == 'Plus')            return (<Icon_Plus styles={iconStyles} />);
  if (variant == 'LinkedIn')        return (<Icon_LinkedIn styles={iconStyles} />);
  if (variant == 'Phone')           return (<Icon_Phone styles={iconStyles} />);
  if (variant == 'Profile')         return (<Icon_Profile styles={iconStyles} />);
  if (variant == 'SelectArrow')     return (<Icon_SelectArrow styles={iconStyles} />);
  if (variant == 'Smile')           return (<Icon_Smile styles={iconStyles} />);
  if (variant == 'Sort')            return (<Icon_Sort styles={iconStyles} />);
  if (variant == 'System')          return (<Icon_System styles={iconStyles} />);
  if (variant == 'Tag')             return (<Icon_Tag styles={iconStyles} />);
  if (variant == 'Trash')           return (<Icon_Trash styles={styles ? styles : defaultErrorStyles} />);
  if (variant == 'Twitter')         return (<Icon_Twitter styles={iconStyles} />);
  if (variant == 'VennDiagram')     return (<Icon_VennDiagram styles={iconStyles} />);
  if (variant == 'Youtube')         return (<Icon_Youtube styles={iconStyles} />);
  return (<div />);
}
