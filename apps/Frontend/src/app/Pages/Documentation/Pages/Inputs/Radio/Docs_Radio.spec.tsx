import { render } from '@testing-library/react';

import DocsRadio from './Docs_Radio';

describe('DocsRadio', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsRadio />);
    expect(baseElement).toBeTruthy();
  });
});
