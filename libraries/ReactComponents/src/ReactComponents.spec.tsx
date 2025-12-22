import { render } from '@testing-library/react';

import ProjectReactComponents from './ReactComponents';

describe('ProjectReactComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProjectReactComponents />);
    expect(baseElement).toBeTruthy();
  });
});
