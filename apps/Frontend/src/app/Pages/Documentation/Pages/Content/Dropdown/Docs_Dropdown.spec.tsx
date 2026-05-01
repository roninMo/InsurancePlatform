import { render } from '@testing-library/react';

import DocsDropdown from './Docs_Dropdown';

describe('DocsDropdown', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsDropdown />);
    expect(baseElement).toBeTruthy();
  });
});
