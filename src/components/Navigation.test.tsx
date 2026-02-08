import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { Navigation } from './Navigation';

const renderNavigation = () =>
  render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>,
  );

describe('Navigation', () => {
  it('renders brand text', () => {
    renderNavigation();
    expect(screen.getByText('Ghetto League 2025')).toBeInTheDocument();
  });

  it('renders Players link with correct href', () => {
    renderNavigation();
    const playersLink = screen.getByRole('link', { name: 'Players' });
    expect(playersLink).toHaveAttribute('href', '/draft2/players');
  });

  it('renders Teams link with correct href', () => {
    renderNavigation();
    const teamsLink = screen.getByRole('link', { name: 'Teams' });
    expect(teamsLink).toHaveAttribute('href', '/draft2/teams');
  });
});
