import { render } from '@testing-library/react';

import DocsAlert from './Docs_Alert';

describe('DocsAlert', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsAlert />);
    expect(baseElement).toBeTruthy();
  });
});
