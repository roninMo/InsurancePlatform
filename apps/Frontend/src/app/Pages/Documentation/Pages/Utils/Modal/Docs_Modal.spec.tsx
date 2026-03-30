import { render } from '@testing-library/react';

import DocsModal from './Docs_Modal';

describe('DocsModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsModal />);
    expect(baseElement).toBeTruthy();
  });
});
