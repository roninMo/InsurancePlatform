import { render } from '@testing-library/react';

import DocsInput from './Docs_Input';

describe('DocsInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsInput />);
    expect(baseElement).toBeTruthy();
  });
});
