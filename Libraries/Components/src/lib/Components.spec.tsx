import { render } from '@testing-library/react';

import OrgComponents from './Components';

describe('OrgComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgComponents />);
    expect(baseElement).toBeTruthy();
  });
});
