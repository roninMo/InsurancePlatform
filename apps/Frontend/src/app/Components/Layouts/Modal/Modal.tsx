import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect, useState } from 'react';
import styled from '@emotion/styled';

import styles from './Modal.module.scss';


export interface ModalProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onCloseModal?: () => void;
  additionalStyles?: string;
  children?: ReactNode;
}

export const Modal = ({isModalOpen, setModalOpen, onCloseModal, additionalStyles, children}: ModalProps) => {
  const [startModalFade, setStartModalFade] = useState<boolean>(false);
  const overlayId = 'overlay-element';

  const closeModal = () => {
    setModalOpen(false);
    setStartModalFade(false);
    if (onCloseModal) onCloseModal();
  }

  const onClickedOutsideOfModal = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const element: any = event?.target;
    const isOverlayElement = element?.id == overlayId;
    
    // console.log('mouse event target: ', { isOverlayElement, element });
    if (isOverlayElement) {
      closeModal();
      return;
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      // Set a timeout to run a function after 2000 milliseconds (2 seconds)
      const timeoutId = setTimeout(() => {
        setStartModalFade(true);
      }, 50);
  
      // Clear the timeout if the component unmounts 
      return () => clearTimeout(timeoutId);
    }
  }, [isModalOpen]);

  if (isModalOpen) return (
    <Overlay 
      id={overlayId} onClick={(e) => onClickedOutsideOfModal(e)}
      className={`fixed top-0 left-0 min-w-full min-h-full z-40 
        bg-black opacity-bg-40 rounded-none 
        row justify-center items-center
        op-init ${startModalFade && 'op-render'} 
        ${additionalStyles}
      `} 
    >
      { children }
    </Overlay>
  );

  return <></>;
}

// Styled Components
const Overlay = styled.div``;