import { render } from '@testing-library/react';

import DocsTooltip from './Docs_Tooltip';

describe('DocsTooltip', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsTooltip />);
    expect(baseElement).toBeTruthy();
  });
});
