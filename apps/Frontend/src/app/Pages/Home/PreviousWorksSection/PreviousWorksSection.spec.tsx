import { render } from '@testing-library/react';

import PreviousWorksSection from './PreviousWorksSection';

describe('PreviousWorksSection', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PreviousWorksSection />);
    expect(baseElement).toBeTruthy();
  });
});
