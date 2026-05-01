import { render } from '@testing-library/react';

import DocsSelect from './Docs_Select';

describe('DocsSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsSelect />);
    expect(baseElement).toBeTruthy();
  });
});
