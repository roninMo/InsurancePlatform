import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect, useId, useState } from 'react';
import { IconTypes, Icon } from '../../Icons/Icon';

import styled from '@emotion/styled';
import styles from './Modal.module.scss';


// #region Modal Props
/** The props for the {@link Modal} component. lets you handle the *open and *close* state, and all the styling for the look and dimensions of the *popup modal* component. */
export interface ModalProps {
	/** The *header* of the {@link Modal} component. */
  label?: string;
	
	/** The useState dispatch for internally *opening* and *closing* the {@link Modal}. */
  setModalOpen: Dispatch<SetStateAction<boolean>>;
	
	/** Any additional functionality ran when the {@link Modal} is *closed*. */
  onCloseModal?: () => void;
	
	/** the *useState* or custom state's value for when the {@link Modal} is open. */
  isModalOpen: boolean;
  
	/** Custom styles for the actual {@link Modal} *container*. you can edit the border and background theme with it. */
  containerStyles?: string;
	
	/** Custom styles for the overlay. By default it's a darkened blurry gradient that covers the page. */
  overlayStyles?: string; 
	
	/** Custom styles for the {@link Modal|Modal's} header(*label*). Adjust the font and padding with it */
  headerStyles?: string;
	
	/** Classes that are added to the *root* container. use this to position the actual {@link Modal} container on the *webpage*. ex. "flex items-center justify-center". */
  alignmentStyles?: string;
	
	/** Preset or custom sizes for the {@link Modal}. - **note:** adjusting the padding here may affext the container's alignment with the *close button* and the *scrollbar*. */
  dimensionStyles?: string; 
	
	/** The {@link Modal} component has an *inset* shadow to help see the content section while scrolling. set this to **true** if you'd prefer it's removed. */
  removeContentShadow?: boolean; 
  
	// ? Content specific
	// TODO: Add a close modal event when the user presses "escape".
	/** Whether to have a *close* button on the {@link Modal}. This is **true** by default, and clicking outside of the {@link Modal} or pressing *escape* will close it. */
  closeModalButton?: boolean;
	
	/** Optional custom styles for the *close* icon button.  */
  closeIconStyles?: string;
	
	/** If you want a custom icon for the *close* button. */
  closeIcon?: IconTypes;
  
	
	/** The rendered content within the {@link Modal}. */
  children: ReactNode;
}


// #endregion
/** A dynamic popup wrapper component that displays any content you pass in. Comes with custom styling and open/close options. */
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
