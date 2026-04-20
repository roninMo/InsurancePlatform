
// TODO: anything that is in the library trying to import project classes won't work until they're moved here
// TODO: universal types should be defined here, and not in the project. 
// This is just for the docs page, but duplicating code is just tedious.


//---------------------------------------------------------------//
// Tooltip props 
//---------------------------------------------------------------//
/* For components that want to optionally pass in the tooltip context and information */
export interface TooltipBundle {
  context?: TooltipActions;
  content?: TooltipProps;
}

export interface TooltipActions { // These are stable refs, calling them won't cause rerenders
  show: (config?: TooltipServiceProps) => void;
  hide: () => void;
}

export type TooltipType = 'text' | 'code' | 'custom' | 'none';

export type TooltipProps = {
  /** interface TooltipBase */
  showTooltip?: boolean
  additionalStyles?: string
  
  // And one of these three
  /** TextTooltipProps */
  text: string

  /** OR CodeTooltipProps */
  code: string
  showLineNumbers?: boolean
  type?: 'component' | 'type' | 'interface' | 'example'

  /** OR CustomTooltipProps */
  children: React.FC
};


export type TooltipServiceProps = { 
  /** TextTooltipProps */
  text: string

  /** OR CodeTooltipProps */
  code: string
  showLineNumbers?: boolean
  type?: 'component' | 'type' | 'interface' | 'example'

  /** OR CustomTooltipProps */
  children: React.FC
};



//------------------------------------------------//
// Select                                         //
//------------------------------------------------//
type IconTypes = '';

export interface SelectItem {
  value: string;
  label: string;
  iconProps?: {
    icon: IconTypes;
    placement?: 'left' | 'right';
    styles?: string;
  }
}