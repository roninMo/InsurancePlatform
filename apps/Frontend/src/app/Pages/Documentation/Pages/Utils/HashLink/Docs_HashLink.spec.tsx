import { render } from '@testing-library/react';

import DocsHashLink from './Docs_HashLink';

describe('DocsHashLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsHashLink />);
    expect(baseElement).toBeTruthy();
  });
});
