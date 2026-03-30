import { render } from '@testing-library/react';

import DocsDragAndDrop from './Docs_DragAndDrop';

describe('DocsDragAndDrop', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsDragAndDrop />);
    expect(baseElement).toBeTruthy();
  });
});
