import { render } from '@testing-library/react';

import ContactUsSection from './ContactUsSection';

describe('ContactUsSection', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContactUsSection />);
    expect(baseElement).toBeTruthy();
  });
});
