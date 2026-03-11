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
  const getSliderStyles = (): string => `size-5 mr-5 rounded-full shadow-sm ring-1 ring-slate-400 dark:ring-slate-700`;
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
          outline-init
          ${value ? 'bg-blue-600 dark:bg-blue-600  outline-blue-500 dark:outline-blue-500' 
                  : 'bg-slate-300 dark:bg-slate-800 outline-slate-300 dark:outline-slate-600'}
        `}
      >
        <SliderButton className={`
          bg-white dark:bg-slate-200 transition-transform duration-200 ease-out 
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
const SliderButton = styled.div``;
const Button = styled.button``;
