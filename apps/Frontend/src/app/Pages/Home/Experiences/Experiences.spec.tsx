import { render } from '@testing-library/react';

import Experiences from './Experiences';

describe('Experiences', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Experiences />);
    expect(baseElement).toBeTruthy();
  });
});
