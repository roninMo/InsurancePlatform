import { ReactNode } from "react";
import { IconTypes } from "../Common";


/**
 * Conditional props
 * 
 * These use union types with jsDoc's deprecated tags to leverage VSCode's intellisense dynamically based on props you add
 * * It's useful for decluttering the list of props, and adding context specific props for variants, or handling multi-option params (styling) 
 *  - Here's a list of universal styling props that let you add additive and override styling based on your needs.
 *  - Using one will disable the other, and some only show when you enable specific content. ie. using a description adds context styling options
 */




//----------------------------------------------//
// Styling Props                                //
//----------------------------------------------//
// #region Container ("styles" / "additStyles")
/** The `actual` element or it's container's conditional styling props. Adds either ***additional*** or ***explicit*** styling overrides. */
export type ContainerStyles = 
| { 
    styles?: string; 
    /** @deprecated CANNOT use 'additStyles' when 'styles' is present. */
    additStyles?: never; 
  } 
| { 
    additStyles?: string; 
    /** @deprecated CANNOT use 'styles' when 'additStyles' is present. */
    styles?: never; 
  };


// #endregion
// #region Label ("labelStyles" / "additLabelStyles")
/** `Title` element's conditional styling props. Adds either ***additional*** or ***explicit*** styling overrides. */
export type TitleStyles = 
| { 
    title: string; 
    titleStyles?: string; 
    /** @deprecated CANNOT use 'additHeaderStyles' when 'headerStyles' is present. */
    additTitleStyles?: never; 
  } 
| { 
    title: string; 
    additTitleStyles?: string; 
    /** @deprecated CANNOT use 'headerStyles' when 'additHeaderStyles' is present. */
    titleStyles?: never; 
  }
| { 
    title?: never; 
    titleStyles?: never; 
    additTitleStyles?: never; 
  };


// #endregion
// #region Label ("labelStyles" / "additLabelStyles")
/** `Label` element's conditional styling props. Adds either ***additional*** or ***explicit*** styling overrides. */
export type LabelStyleProps = 
| { 
    labelStyles?: string; 
    /** @deprecated CANNOT use 'additStyles' when 'styles' is present. */
    additLabelStyles?: never; 
  } 
| { 
    additLabelStyles?: string; 
    /** @deprecated CANNOT use 'styles' when 'additStyles' is present. */
    labelStyles?: never; 
  };


// #endregion
// #region Description ("descStyles" / "additDescStyles")
/** `Description` element's conditional styling props. Adds either ***additional*** or ***explicit*** styling overrides. */
export type DescriptionStyles = 
| { 
    description: string; 
    descStyles?: string; 
    /** @deprecated CANNOT use 'additDescStyles' when 'descStyles' is present. */
    additDescStyles?: never; 
  } 
| { 
    description: string; 
    additDescStyles?: string; 
    /** @deprecated CANNOT use 'descStyles' when 'additDescStyles' is present. */
    descStyles?: never; 
  }
| { 
    description?: never; 
    descStyles?: never; 
    additDescStyles?: never; 
  };


// #endregion
// #region Children ("contentStyles" / "additContentStyles")
/** Conditional styling props for wrapper's around the `children` prop. Adds either ***additional*** or ***explicit*** styling overrides. */
export type ContentStyles = 
| { 
    children: ReactNode; 
    contentStyles?: string; 
    /** @deprecated CANNOT use 'additContentStyles' when 'contentStyles' is present. */
    additContentStyles?: never; 
  } 
| { 
    children: ReactNode; 
    additContentStyles?: string; 
    /** @deprecated CANNOT use 'contentStyles' when 'additContentStyles' is present. */
    contentStyles?: never; 
  }
| { 
    children?: never; 
    contentStyles?: never; 
    additContentStyles?: never; 
  };


// #endregion
// #region Icon ("iconStyles" / "additIconStyles")
export type IconStyleProps = 
| { 
    icon: IconTypes;
    iconStyles?: string; 
    /** @deprecated CANNOT use 'additStyles' when 'styles' is present. */
    additIconStyles?: never; 
  } 
| { 
    icon: IconTypes;
    additIconStyles?: string; 
    /** @deprecated CANNOT use 'styles' when 'additStyles' is present. */
    iconStyles?: never; 
  }
| { 
    icon?: never; 
    iconStyles?: never; 
    additIconStyles?: never; 
  };
// #endregion




//----------------------------------------------//
// Rendering Props                              //
//----------------------------------------------//
