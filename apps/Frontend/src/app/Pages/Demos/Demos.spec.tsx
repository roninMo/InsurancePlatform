import { render } from '@testing-library/react';

import Demos from './Demos';

describe('Demos', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Demos />);
    expect(baseElement).toBeTruthy();
  });
});
