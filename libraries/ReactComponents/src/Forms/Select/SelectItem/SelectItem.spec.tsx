import { render } from '@testing-library/react';

import SelectItem from './SelectItem';

describe('SelectItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectItem />);
    expect(baseElement).toBeTruthy();
  });
});
