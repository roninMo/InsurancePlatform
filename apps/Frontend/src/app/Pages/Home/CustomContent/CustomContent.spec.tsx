import { render } from '@testing-library/react';

import CustomContent from './CustomContent';

describe('CustomContent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomContent />);
    expect(baseElement).toBeTruthy();
  });
});
