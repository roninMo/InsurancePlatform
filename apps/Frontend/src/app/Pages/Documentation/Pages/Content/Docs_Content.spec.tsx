import { render } from '@testing-library/react';

import DocsContent from './Docs_Content';

describe('DocsContent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsContent />);
    expect(baseElement).toBeTruthy();
  });
});
