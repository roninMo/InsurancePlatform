import { render } from '@testing-library/react';

import DocsCheckbox from './Docs_Checkbox';

describe('DocsCheckbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsCheckbox />);
    expect(baseElement).toBeTruthy();
  });
});
