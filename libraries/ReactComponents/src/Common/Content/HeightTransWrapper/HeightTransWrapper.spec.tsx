import { render } from '@testing-library/react';

import HeightTransWrapper from './HeightTransWrapper';

describe('HeightTransWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeightTransWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
