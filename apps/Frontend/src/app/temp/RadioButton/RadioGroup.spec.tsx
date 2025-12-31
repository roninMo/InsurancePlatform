import { render } from '@testing-library/react';

import RadioButton from './RadioGroup';

describe('RadioButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RadioButton />);
    expect(baseElement).toBeTruthy();
  });
});
