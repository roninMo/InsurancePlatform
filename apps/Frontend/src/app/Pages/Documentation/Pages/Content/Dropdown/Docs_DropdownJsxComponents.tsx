import { ReactNode, useEffect, useState } from "react";
import { Dropdown } from "../../../../../Components/Content/Dropdown/Dropdown";


export const Example_Dropdown = ({ isThisTabOpen, paramTable }: {
  isThisTabOpen: boolean;
  paramTable: ReactNode;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log('The dropdown is ', isDropdownOpen ? 'opened' : 'closed');
  }, [isDropdownOpen]);

  return (
    <div>
      <Dropdown 
        label='Example Dropdown' 
        openByDefault
        openListener={setIsDropdownOpen}
        
        // Custom styling
        additStyles="pt-4" // or - styles="custom-styles"
        additLabelStyles="input-colors" // or - labelStyles=""
        icon="DropdownArrow"
        iconStyles="dropdown-icon" // or - additIconStyles=""
      >
        <div className="px-4 pt-2">
          <p className="pb-4 text-base">
            Here's a list of the dropdown's parameters
          </p>

          { paramTable }
        </div>
      </Dropdown>
    </div>
  )
}
