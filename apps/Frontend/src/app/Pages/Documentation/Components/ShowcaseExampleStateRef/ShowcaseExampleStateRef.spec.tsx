import { render } from '@testing-library/react';

import ShowcaseExampleStateRef from './ShowcaseExampleStateRef';

describe('ShowcaseExampleStateRef', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ShowcaseExampleStateRef />);
    expect(baseElement).toBeTruthy();
  });
});
