import { Button } from "@Project/ReactComponents"
import { Dispatch, SetStateAction } from "react";
import { Modal } from "../../../../../Components/Utils/Modal/Modal";
import { Docs_Card } from "../../Content/Card/Docs_Card";
import { Docs_Input } from "../../Inputs/Input/Docs_Input";


export const Example_ModalOpener = ({ isModalOpen, setIsModalOpen }: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div>
      <Button 
        displayText="Click me"
        onClick={toggleModal}

        color="primary"
      />
    </div>
  )
}

export const Example_Modal = ({ isModalOpen, setIsModalOpen }: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  
  const modalClosed = () => {
    console.log('The user closed the modal.');
  }

  return (
    <Modal 
      label="Example Modal" 
      isModalOpen={isModalOpen} 
      setModalOpen={setIsModalOpen} 
      onCloseModal={modalClosed}

      containerStyles='col gap-4 w-[70vw] h-[65vh]'
    >
      <div className="p-4">
        {/* fix the padding error here. To align the modal, container styles shouldn't override padding,
        so add a nested element in the modal that applies the styles from the modal prop */}
        <Docs_Input />
      </div>
    </Modal>
  )
}