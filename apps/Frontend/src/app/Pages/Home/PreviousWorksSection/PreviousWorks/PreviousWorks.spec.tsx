import { render } from '@testing-library/react';

import PreviousWorks from './PreviousWorks';

describe('PreviousWorks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PreviousWorks />);
    expect(baseElement).toBeTruthy();
  });
});
