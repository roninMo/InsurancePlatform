import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect, useId, useState } from 'react';
import { Icon, IconTypes } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './Modal.module.scss';


export interface ModalProps {
  label?: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onCloseModal?: () => void;
  isModalOpen: boolean;
  
  containerStyles?: string; // Container Background / Border styles
  overlayStyles?: string; // Custom overlay styles
  headerStyles?: string; // Header font styles
  alignmentStyles?: string; // Classes added to the topmost container - used to position the actual modal container (ex: flex item-center justify-center)
  dimensionStyles?: string; // Preset or custom dimensions - @note adjusting the padding here may affect the container's alignment
  removeContentShadow?: boolean; // The scrollbar container's inverse shadow for help w/visually scrolling
  
  closeModalButton?: boolean; // Default = true
  closeIconStyles?: string; // Icon styling for the close button
  closeIcon?: IconTypes; // Optional custom close icon
  
  // Rendered content
  children: ReactNode;
}

export const Modal = ({
  label, setModalOpen, onCloseModal, isModalOpen, 
  containerStyles, overlayStyles, headerStyles, 
  alignmentStyles, dimensionStyles, removeContentShadow, 
  closeModalButton = true, closeIconStyles, closeIcon = 'Close',
  children
}: ModalProps) => {
  const [isModalRendered, setIsModalRendered] = useState<boolean>(false);
  const modalId = useId();
  const renderedModalId = `modal-${label}-${modalId}`;
  const closeModalId = `modal-element`;

  const closeModal = () => {
    // console.log('modal setState function', {isModalOpen, setModalOpen});
    setModalOpen(false);
    if (onCloseModal) onCloseModal();
  }

  //------------------------------------------------//
  // Modal Fade in Logic                            //
  //------------------------------------------------//
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // keyframe animations fade in smoothly
    if (isModalOpen) {
      setIsModalRendered(true);
    }

    // Wait a second to unmount this component to allow it to fade out of view gracefully
    else if (isModalRendered && !isModalOpen) {
      timeoutId = setTimeout(() => setIsModalRendered(false), 200);
      return () => clearTimeout(timeoutId);
    }

    // If the effect was called again before the timer completes
    return () => {
      clearTimeout(timeoutId);
    }
  }, [isModalOpen]);


  //------------------------------------------------//
  // Close Modal Events                             //
  //------------------------------------------------//
  const userClicked = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const element: any = event?.target as HTMLElement;

    // Checks element and ancestors
    const isWithinModal = element.closest(`#${closeModalId}`);
    if (!isWithinModal) {
      closeModal();
      return;
    }
  }

  if (isModalRendered) return (
      <Overlay
        id={renderedModalId}
        onClick={(e) => userClicked(e)}
        className={`modal-base 
          ${isModalOpen ? 'animate-fade-in' : 'bg-transparent'} 
          ${overlayStyles ? overlayStyles : 'modal-overlay'}
          ${alignmentStyles ? alignmentStyles : 'modal-alignment'}
      `}>
        <ModalContainer id={closeModalId} className={`modal-container
          ${isModalOpen ? 'opacity-100' : 'opacity-0'} 
          ${containerStyles}
        `}>
          { (label || closeModalButton) && 
          <Header className='modal-header-c'>
            <label className={`${headerStyles ? headerStyles : 'modal-header'}`}>
              { label }
            </label>

            <CloseButton onClick={() => closeModal()}>
              { closeModalButton && <Icon variant={closeIcon} styles={closeIconStyles ? closeIconStyles : 'modal-icon'} /> }
            </CloseButton>
          </Header>
          }

          {/* User Content */}
          <Container className={`modal-content ${dimensionStyles} ${removeContentShadow ? '' : 'modal-content-shadow'}`}>
            { children }
          </Container>
        </ModalContainer>
      </Overlay>
  );

  return <></>;
}

// Styled Components
const Overlay = styled.div``;
const Container = styled.div``;
const Header = styled.div``;
const CloseButton = styled.div``;
const ModalContainer = styled.div``;
