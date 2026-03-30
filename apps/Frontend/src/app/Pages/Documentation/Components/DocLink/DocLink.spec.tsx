import { render } from '@testing-library/react';

import DocLink from './DocLink';

describe('DocLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocLink />);
    expect(baseElement).toBeTruthy();
  });
});
