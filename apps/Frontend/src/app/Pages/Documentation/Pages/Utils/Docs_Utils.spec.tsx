import { render } from '@testing-library/react';

import DocsUtils from './Docs_Utils';

describe('DocsUtils', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsUtils />);
    expect(baseElement).toBeTruthy();
  });
});
