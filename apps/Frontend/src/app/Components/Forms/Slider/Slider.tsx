import styled from '@emotion/styled';
import styles from './Slider.module.scss';

export interface SliderProps {
  type?: 'default';
  
  name: string;
  label?: string;
  description?: string;
  value: boolean;
  onChange: () => void;
  id: string;

  error?: boolean;
  errorMessage?: string | null;
  required?: boolean;
  disabled?: boolean;

  aria?: string | null;
}

export const Slider = ({
  type = 'default', name, label, description, value, onChange, id,
  error = false, errorMessage, required = false, disabled = false,
  aria, ...props
}: SliderProps) => {
  const getSliderStyles = (): string => `size-5 mr-5 rounded-full shadow-sm ring-1 ring-gray-800`;
  const getSliderTranslateStyles = (): string => `translate-x-5`; 

  return (
    <Container className='w-full row justify-between items-center gap-8'>
      <div className='colStart gap-1 pb-4 p-2'>
        { label && <Label htmlFor={name}>{ label }</Label> }
        { description && <Description>{ description }</Description> }
        { error && <Description className='error-text'>{ errorMessage }</Description>}
      </div>
      
      <Button 
        onClick={() => onChange()} 
        {...props}
        className={`
          min-w-max rowStart gap-2 p-[1px] rounded-full 
          outline outline-1 -outline-offset-1  
          ${value ? 'bg-blue-500 outline-blue-400' : 'outline-default'}
        `}
      >
        <SliderPanel className={`
          bg-white transition-transform duration-200 ease-out 
          ${getSliderStyles()} 
          ${value && getSliderTranslateStyles()} 
        `}/>
        
      </Button>

      {/* Captured input */}
      <input 
        type="checkbox" 
        name={name} 
        aria-label={aria || ''} 
        className="absolute hidden opacity-0" 
        checked={value}
        onChange={() => {}} // Button handles the change event
      />
    </Container>
  );
}

const Container = styled.div``;
const Label = styled.label``;
const Description = styled.p``;
const SliderPanel = styled.div``;
const Button = styled.button``;


/*
  flex min-w-max p-0.5 w-11 rounded-full 
  transition-colors duration-200 ease-in-out 

  inset-ring 
  outline-css 
  has-focus-visible:outline has-focus-visible:outline-2 


  inset-ring-gray-900/5 dark:inset-ring-white/10 
  outline-focus

  ${value ? 'bg-blue-500 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-white/5'}
*/