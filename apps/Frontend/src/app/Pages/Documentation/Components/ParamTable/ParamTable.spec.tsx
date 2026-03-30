import { render } from '@testing-library/react';

import ParamTable from './ParamTable';

describe('ParamTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ParamTable />);
    expect(baseElement).toBeTruthy();
  });
});
