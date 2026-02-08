import { render, fireEvent, screen, within } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { draftAPI } from '../api';
import { createFantasyTeam, createPick, createPlayer } from '../test/factories';

import { Players } from './Players';

vi.mock('react-flip-move', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const teams = [
  createFantasyTeam({ id: 1, name: 'Bears', owner: 'Alice', draftorder: 1 }),
  createFantasyTeam({ id: 2, name: 'Lions', owner: 'Bob', draftorder: 2 }),
  createFantasyTeam({ id: 3, name: 'Packers', owner: 'Charlie', draftorder: 3 }),
];

const players = [
  createPlayer({
    id: 1,
    firstname: 'Patrick',
    lastname: 'Mahomes',
    position: 'QB',
    rank: 1,
    points: 300,
    avgpick: 1,
    fantasyteam: '',
    fantasyteam_id: 0,
    byeweek: 6,
    team: 'KC',
    pickNo: 0,
  }),
  createPlayer({
    id: 2,
    firstname: 'Travis',
    lastname: 'Kelce',
    position: 'TE',
    rank: 5,
    points: 200,
    avgpick: 5,
    fantasyteam: '',
    fantasyteam_id: 0,
    byeweek: 6,
    team: 'KC',
    pickNo: 0,
  }),
  createPlayer({
    id: 3,
    firstname: 'Tyreek',
    lastname: 'Hill',
    position: 'WR',
    rank: 3,
    points: 250,
    avgpick: 3,
    fantasyteam: 'Bears',
    owner: 'Alice',
    fantasyteam_id: 1,
    byeweek: 11,
    team: 'MIA',
    pickNo: 1,
  }),
  createPlayer({
    id: 4,
    firstname: 'Josh',
    lastname: 'Allen',
    position: 'QB',
    rank: 2,
    points: 290,
    avgpick: 2,
    fantasyteam: '',
    fantasyteam_id: 0,
    byeweek: 12,
    team: 'BUF',
    pickNo: 0,
  }),
  createPlayer({
    id: 5,
    firstname: 'Saquon',
    lastname: 'Barkley',
    position: 'RB',
    rank: 4,
    points: 220,
    avgpick: 4,
    fantasyteam: 'Lions',
    owner: 'Bob',
    fantasyteam_id: 2,
    byeweek: 5,
    team: 'PHI',
    pickNo: 2,
  }),
];

const picks = [createPick({ fantasyteam: 'Bears', fantasyteam_id: '1', owner: 'Alice', round: 1, pick: 1 })];

const originalSearch = window.location.search;

const setUrlSearch = (search: string) => {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, search },
    writable: true,
  });
};

describe('Players', () => {
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: originalSearch },
      writable: true,
    });
  });

  describe('basic rendering', () => {
    it('renders DataTable with player data', () => {
      render(<Players players={players} teams={teams} picks={picks} />);
      expect(screen.getByText(/Mahomes/)).toBeInTheDocument();
      expect(screen.getByText(/Kelce/)).toBeInTheDocument();
      expect(screen.getByText(/Hill/)).toBeInTheDocument();
    });

    it('renders child components in normal mode', () => {
      render(<Players players={players} teams={teams} picks={picks} />);
      // DraftOrder renders round header
      expect(screen.getByText('Round 1')).toBeInTheDocument();
      // PlayerFilter renders last name field
      expect(screen.getByLabelText('Last name:')).toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('filter by last name narrows displayed players', () => {
      render(<Players players={players} teams={teams} picks={picks} />);

      const input = screen.getByLabelText('Last name:');
      fireEvent.change(input, { target: { value: 'Ma' } });

      expect(screen.getByText(/Mahomes/)).toBeInTheDocument();
      expect(screen.queryByText(/Kelce/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Hill/)).not.toBeInTheDocument();
    });

    it('filter by position narrows displayed players', () => {
      render(<Players players={players} teams={teams} picks={picks} />);

      const posSelect = screen.getByLabelText('Position:');
      fireEvent.change(posSelect, { target: { value: 'TE' } });

      expect(screen.getByText(/Kelce/)).toBeInTheDocument();
      expect(screen.queryByText(/Mahomes/)).not.toBeInTheDocument();
    });

    it('filter by availability narrows displayed players', () => {
      render(<Players players={players} teams={teams} picks={picks} />);

      const availableRadio = screen.getByLabelText('Available');
      fireEvent.click(availableRadio);

      // Available players (no fantasyteam)
      expect(screen.getByText(/Mahomes/)).toBeInTheDocument();
      expect(screen.getByText(/Kelce/)).toBeInTheDocument();
      // Drafted players should be hidden
      expect(screen.queryByText(/Hill/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Barkley/)).not.toBeInTheDocument();
    });
  });

  describe('TV mode', () => {
    beforeEach(() => {
      setUrlSearch('?istvmode=1');
    });

    it('hides PlayerFilter and TeamPlayers', () => {
      render(<Players players={players} teams={teams} picks={picks} />);
      expect(screen.queryByLabelText('Last name:')).not.toBeInTheDocument();
    });

    it('shows only drafted players by default', () => {
      render(<Players players={players} teams={teams} picks={picks} />);
      // Drafted players should be visible
      expect(screen.getByText(/Hill/)).toBeInTheDocument();
      expect(screen.getByText(/Barkley/)).toBeInTheDocument();
      // Available players should be hidden
      expect(screen.queryByText(/Mahomes/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Kelce/)).not.toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      setUrlSearch('?iseditmode=1');
    });

    it('shows Edit buttons only for undrafted players', () => {
      render(<Players players={players} teams={teams} picks={picks} />);
      const editButtons = screen.getAllByText('Edit');
      // 3 undrafted players: Mahomes, Kelce, Allen
      expect(editButtons).toHaveLength(3);
    });

    it('clicking Edit opens modal with player name', () => {
      render(<Players players={players} teams={teams} picks={picks} />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      expect(screen.getByText(/Edit Player:/)).toBeInTheDocument();
    });

    it('Close button clears selected player', () => {
      render(<Players players={players} teams={teams} picks={picks} />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      const modal = screen.getByRole('dialog');
      const closeButton = within(modal).getByText('Close');
      fireEvent.click(closeButton);

      // After close, selectedPlayer is cleared so no player name appears in the title
      expect(screen.queryByText(/Edit Player: \w+/)).not.toBeInTheDocument();
    });

    it('Save Player calls draftAPI.savePlayer', () => {
      const saveSpy = vi.spyOn(draftAPI, 'savePlayer').mockImplementation(() => undefined as any);

      render(<Players players={players} teams={teams} picks={picks} />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      const modal = screen.getByRole('dialog');
      const saveButton = within(modal).getByText('Save Player');
      fireEvent.click(saveButton);

      expect(saveSpy).toHaveBeenCalledTimes(1);
      saveSpy.mockRestore();
    });
  });

  describe('normal mode', () => {
    it('does not show Edit buttons when not in edit mode', () => {
      render(<Players players={players} teams={teams} picks={picks} />);
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });
});
