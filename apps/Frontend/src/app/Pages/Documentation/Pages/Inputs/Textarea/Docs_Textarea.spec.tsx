import { render } from '@testing-library/react';

import DocsTextarea from './Docs_Textarea';

describe('DocsTextarea', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsTextarea />);
    expect(baseElement).toBeTruthy();
  });
});
