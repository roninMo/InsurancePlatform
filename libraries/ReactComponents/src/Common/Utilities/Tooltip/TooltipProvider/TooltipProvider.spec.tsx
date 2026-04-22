import { render } from '@testing-library/react';

import { TooltipProvider } from './TooltipProvider';

describe('TooltipProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TooltipProvider />);
    expect(baseElement).toBeTruthy();
  });
});
