import { render } from '@testing-library/react';

import CCInformation from '../CCInformation';

describe('CCInformation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CCInformation />);
    expect(baseElement).toBeTruthy();
  });
});
