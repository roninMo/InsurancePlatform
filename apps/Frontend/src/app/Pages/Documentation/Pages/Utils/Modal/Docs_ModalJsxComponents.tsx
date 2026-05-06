import { Dispatch, SetStateAction } from "react";
import { Modal } from "../../../../../Components/Utils/Modal/Modal";
import { Button } from "@Project/ReactComponents";
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

export const Example_ContentModal = ({ isModalOpen, setIsModalOpen }: {
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
      dimensionStyles='w-[70vw] h-[65vh]'
    >
      <Docs_Input />
    </Modal>
  )
}

export const Example_PopupModal = ({ isModalOpen, setIsModalOpen }: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  
  const modalClosed = () => {
    console.log('The user closed the modal.');
  }

  return (
    <Modal 
      isModalOpen={isModalOpen} 
      setModalOpen={setIsModalOpen} 
      onCloseModal={modalClosed}

      closeModalButton={false}
      alignmentStyles="flex justify-center items-start pt-8"
      dimensionStyles='min-h-14 min-w-96 px-8'
    >
      <div className="col justify-between gap-4">
        <label className="text-base font-normal">
          An example popup notification.
        </label>

        <div className="row justify-end">
          <div>
            <Button 
              displayText="Close"
              color="primary"
              onClick={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}