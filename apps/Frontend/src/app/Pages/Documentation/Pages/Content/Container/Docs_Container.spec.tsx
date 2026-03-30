import { render } from '@testing-library/react';

import DocsContainer from './Docs_Container';

describe('DocsContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsContainer />);
    expect(baseElement).toBeTruthy();
  });
});
