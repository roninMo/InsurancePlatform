import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect, useId, useState } from 'react';
import { Icon } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './Modal.module.scss';


export interface ModalProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onCloseModal?: () => void;

  label?: string;
  overlay?: boolean;
  closeModalButton?: boolean;

  // Styles
  labelStyles?: string;
  overlayStyles?: string;
  closeIconStyles?:string;
  additionalStyles?: string;

  // Rendered content
  children?: ReactNode;
}

export const Modal = ({
  isModalOpen, setModalOpen, onCloseModal,
  label, additionalStyles,
  overlay = true, overlayStyles,
  closeModalButton = true, closeIconStyles,
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
        className={`modal-base ${overlay ? 'modal-overlay' : ''} ${isModalOpen ? 'animate-fade-in' : 'bg-transparent'} ${overlayStyles}
      `}>
        <Container id={closeModalId} className={`modal-container ${isModalOpen ? 'opacity-100' : 'opacity-0'} ${additionalStyles}`}>
          <Header className='modal-header'>
            <label className='text-xl lg:text-2xl header-colors'>
              { label }
            </label>

            <div onClick={() => closeModal()}>
              { closeModalButton &&
                <Icon variant='Close' styles={closeIconStyles ? closeIconStyles : 'modal-icon'} />
              }
            </div>
          </Header>

          {/* User Content */}
          <div className="modal-content">
            { children }
          </div>
        </Container>
      </Overlay>
  );

  return <></>;
}

// Styled Components
const Overlay = styled.div``;
const Container = styled.div``;
const Header = styled.div``;
