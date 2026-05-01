import { render } from '@testing-library/react';

import RadioTable from './RadioTable';

describe('RadioTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RadioTable />);
    expect(baseElement).toBeTruthy();
  });
});
