import { render } from '@testing-library/react';

import Dropbox from './Dropbox';

describe('Dropbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Dropbox />);
    expect(baseElement).toBeTruthy();
  });
});
