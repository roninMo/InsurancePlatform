import { render } from '@testing-library/react';

import { Kw } from './Keyword';

describe('Keyword', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Kw>Keyword</Kw>);
    expect(baseElement).toBeTruthy();
  });
});
