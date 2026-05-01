import { render } from '@testing-library/react';

import DocsCard from './Docs_Card';

describe('DocsCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsCard />);
    expect(baseElement).toBeTruthy();
  });
});
