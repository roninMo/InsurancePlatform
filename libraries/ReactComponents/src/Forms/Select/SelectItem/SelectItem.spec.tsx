import { render } from '@testing-library/react';

import {SelectItemComponent} from './SelectItem';

describe('SelectItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectItemComponent />);
    expect(baseElement).toBeTruthy();
  });
});
