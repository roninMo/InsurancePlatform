import { render } from '@testing-library/react';

import ShowcaseElement from './ShowcaseElement';

describe('ShowcaseElement', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ShowcaseElement />);
    expect(baseElement).toBeTruthy();
  });
});
