import { render } from '@testing-library/react';

import DocsIntroduction from './Docs_Introduction';

describe('DocsIntroduction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsIntroduction />);
    expect(baseElement).toBeTruthy();
  });
});
