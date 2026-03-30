import { render } from '@testing-library/react';

import Keyword from './Keyword';

describe('Keyword', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Keyword />);
    expect(baseElement).toBeTruthy();
  });
});
