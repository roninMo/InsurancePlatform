import { render } from '@testing-library/react';

import DocsSlider from './Docs_Slider';

describe('DocsSlider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsSlider />);
    expect(baseElement).toBeTruthy();
  });
});
