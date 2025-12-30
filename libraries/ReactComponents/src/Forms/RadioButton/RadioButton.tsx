import { EventHandlers } from '../../Common/Utilities/Utils';

import styles from './RadioButton.module.scss';


export interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioButtonProps {
  variant?: 'default' | 'column' | 'list' | 'table';
  id: string;
  name: string;
  label: string;
  description: string;

  values: RadioItem[];
  value: RadioItem;
  onSelect: (item: RadioItem, index: number, currentValue: RadioItem) => void;
  defaultValue?: RadioItem;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;

  aria?: string;
}


export const RadioButton = ({
  variant = 'default', id, name, label, description,
  values, value, onSelect, defaultValue,
  error = false, errorMessage, disabled = false, required = false, aria,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave, ...props
}: EventHandlers & RadioButtonProps) => {
  return (
    <div className={styles['container']}>
      <h1>Welcome to RadioButton!</h1>
    </div>
  );
}
