import { render } from '@testing-library/react';

import { ElementState } from './ElementState';

describe('ElementState', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ElementState type="default" onClick={() => {}}  />);
    expect(baseElement).toBeTruthy();
  });
});
