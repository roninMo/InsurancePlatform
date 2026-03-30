import { render } from '@testing-library/react';

import DocsButton from './Docs_Button';

describe('DocsButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsButton />);
    expect(baseElement).toBeTruthy();
  });
});
