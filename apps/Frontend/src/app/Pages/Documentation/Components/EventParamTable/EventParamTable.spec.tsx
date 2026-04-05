import { render } from '@testing-library/react';

import EventParamTable from './EventParamTable';

describe('EventParamTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EventParamTable />);
    expect(baseElement).toBeTruthy();
  });
});
