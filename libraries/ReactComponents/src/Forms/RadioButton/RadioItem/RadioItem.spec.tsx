import { render } from '@testing-library/react';

import RadioItem from './RadioItem';

describe('RadioItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RadioItem />);
    expect(baseElement).toBeTruthy();
  });
});
