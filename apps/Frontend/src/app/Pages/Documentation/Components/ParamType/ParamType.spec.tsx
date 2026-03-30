import { render } from '@testing-library/react';

import ParamType from './ParamType';

describe('ParamType', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ParamType />);
    expect(baseElement).toBeTruthy();
  });
});
