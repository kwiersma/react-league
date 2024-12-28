import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import App from './App';

describe('should render app', () => {
  it('should render headline', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    const navbar = screen.getByText('Ghetto League 2024');
    expect(navbar).toBeInTheDocument();
  });
});
