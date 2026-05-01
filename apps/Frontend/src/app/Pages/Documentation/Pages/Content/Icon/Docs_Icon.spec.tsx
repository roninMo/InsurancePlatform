import { render } from '@testing-library/react';

import DocsIcon from './Docs_Icon';

describe('DocsIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsIcon />);
    expect(baseElement).toBeTruthy();
  });
});
