import { render } from '@testing-library/react';

import DocsDropbox from './Docs_Dropbox';

describe('DocsDropbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsDropbox />);
    expect(baseElement).toBeTruthy();
  });
});
