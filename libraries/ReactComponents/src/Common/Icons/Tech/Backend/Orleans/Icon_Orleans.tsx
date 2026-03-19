import { IconAttributes } from "../../../Icon";

export const Icon_Orleans = ({ styles }: IconAttributes) => {
  return ( 
    <svg className={styles} width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org">
      {/* <!-- Top Side --> */}
      <path d="M50 5 L90 27.5 L77 35 L50 20 Z" fill="#6A42E5"/>
      {/* <!-- Top Right Side --> */}
      <path d="M90 27.5 L90 72.5 L77 65 L77 35 Z" fill="#5D35D9"/>
      {/* <!-- Bottom Right Side --> */}
      <path d="M90 72.5 L50 95 L50 80 L77 65 Z" fill="#512BD4"/>
      {/* <!-- Bottom Side --> */}
      <path d="M50 95 L10 72.5 L23 65 L50 80 Z" fill="#4622C1"/>
      {/* <!-- Bottom Left Side --> */}
      <path d="M10 72.5 L10 27.5 L23 35 L23 65 Z" fill="#3B19AF"/>
      {/* <!-- Top Left Side --> */}
      <path d="M10 27.5 L50 5 L50 20 L23 35 Z" fill="#4B28BE"/>
    </svg>
  );
}
