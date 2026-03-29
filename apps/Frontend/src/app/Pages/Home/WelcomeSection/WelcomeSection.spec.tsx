import { render } from '@testing-library/react';
import { WelcomeSection } from './WelcomeSection';

describe('WelcomePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WelcomeSection />);
    expect(baseElement).toBeTruthy();
  });
});
