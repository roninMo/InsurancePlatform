import { render } from '@testing-library/react';

import DocsNotifications from './Docs_Notifications';

describe('DocsNotifications', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsNotifications />);
    expect(baseElement).toBeTruthy();
  });
});
