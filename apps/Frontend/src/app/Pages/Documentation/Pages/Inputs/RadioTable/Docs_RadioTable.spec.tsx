import { render } from '@testing-library/react';

import DocsRadioTable from './Docs_RadioTable';

describe('DocsRadioTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsRadioTable />);
    expect(baseElement).toBeTruthy();
  });
});
