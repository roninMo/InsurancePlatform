import { render } from '@testing-library/react';

import InputHandler from './InputHandlers';

describe('InputHandler', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputHandler />);
    expect(baseElement).toBeTruthy();
  });
});
