import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { draftAPI } from './api';
import App from './App';

const returnEmptyArray = () => Promise.resolve([]);

describe('should render app', () => {
  const teamsMock = vi.spyOn(draftAPI, 'getFantasyTeams');
  const playersMock = vi.spyOn(draftAPI, 'getPlayers');
  const picksMock = vi.spyOn(draftAPI, 'getPicks');

  teamsMock.mockImplementation(returnEmptyArray);
  playersMock.mockImplementation(returnEmptyArray);
  picksMock.mockImplementation(returnEmptyArray);

  it('should render headline', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    const navbar = screen.getByText('Ghetto League 2025');
    expect(navbar).toBeInTheDocument();
  });
});
