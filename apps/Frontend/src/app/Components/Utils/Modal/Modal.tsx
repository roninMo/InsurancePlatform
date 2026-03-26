import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect, useId, useState } from 'react';
import styled from '@emotion/styled';

import styles from './Modal.module.scss';
import { Icon } from '@Project/ReactComponents';


export interface ModalProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onCloseModal?: () => void;
  
  label?: string;
  overlay?: boolean;
  closeModalButton?: boolean;
  
  labelStyles?: string;
  overlayStyles?: string;
  closeModalStyles?:string;
  additionalStyles?: string;
  
  children?: ReactNode;
}

export const Modal = ({
  isModalOpen, setModalOpen, onCloseModal,
  label, additionalStyles, 
  overlay = true, overlayStyles,
  closeModalButton = true, closeModalStyles, 
  children 
}: ModalProps) => {
  const modalId = useId();
  const renderedModalId = `modal-${label}-${modalId}`;
  const closeModalId = `modal-element`;

  const closeModal = () => {
    console.log('modal setState function', {isModalOpen, setModalOpen});
    setModalOpen(false);
    if (onCloseModal) onCloseModal();
  }

  const userClicked = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const element: any = event?.target as HTMLElement;

    // Checks element and ancestors
    const isWithinModal = element.closest(`#${closeModalId}`);
    if (!isWithinModal) {
      closeModal();
      return;
    }
  }

  if (isModalOpen) return (
    <Overlay 
      id={renderedModalId}
      onClick={(e) => userClicked(e)}
      className={`fixed top-0 left-0 min-w-full min-h-full z-40 
        row justify-center items-center 
        ${overlay ? 'bg-black bg-opacity-40 dark:bg-opacity-40' : ''} 
        animate-fade-in
        ${overlayStyles}
      `} 
    >
      <Container id={closeModalId} className={`
        col items-center gap-2 p-4 
        outline-css outline-default bg-div 
        overflow-auto overflow-x-hidden scrollbar-theme 
        ${additionalStyles}
      `}>
        
        <Header className='p-4 pt-1 pr-1 w-full row justify-between items-center'>
          <label className='text-xl lg:text-2xl header-colors'>
            { label }
          </label>

          <div onClick={() => closeModal()}>
            { closeModalButton && 
              <Icon variant='Close' styles={closeModalStyles ? closeModalStyles : 'size-8 lg:size-10 transition hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer'} />
            }
          </div>
        </Header>

        {/* User Content */}
        { children }
      </Container>
    </Overlay>
  );

  return <></>;
}

// Styled Components
const Overlay = styled.div``;
const Container = styled.div``;
const Header = styled.div``;
