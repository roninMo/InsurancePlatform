import { render } from '@testing-library/react';

import { Docs_Forms } from './Docs_Forms';


describe('DocsInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Docs_Forms />);
    expect(baseElement).toBeTruthy();
  });
});
