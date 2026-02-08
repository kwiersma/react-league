import { render, fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect } from 'vitest';

import { createFantasyTeam, createPlayer } from '../test/factories';

import { TeamPlayers } from './TeamPlayers';

const teams = [
  createFantasyTeam({ id: 1, name: 'Bears', owner: 'Alice', draftorder: 1 }),
  createFantasyTeam({ id: 3, name: 'Lions', owner: 'Bob', draftorder: 2 }),
  createFantasyTeam({ id: 5, name: 'Packers', owner: 'Charlie', draftorder: 3 }),
];

const players = [
  createPlayer({
    id: 1,
    firstname: 'Patrick',
    lastname: 'Mahomes',
    position: 'QB',
    fantasyteam_id: 3,
    round: 2,
    pick: 3,
    byeweek: 6,
  }),
  createPlayer({
    id: 2,
    firstname: 'Travis',
    lastname: 'Kelce',
    position: 'TE',
    fantasyteam_id: 3,
    round: 1,
    pick: 2,
    byeweek: 6,
  }),
  createPlayer({
    id: 3,
    firstname: 'Aaron',
    lastname: 'Jones',
    position: 'RB',
    fantasyteam_id: 1,
    round: 1,
    pick: 1,
    byeweek: 10,
  }),
  createPlayer({
    id: 4,
    firstname: 'Davante',
    lastname: 'Adams',
    position: 'WR',
    fantasyteam_id: 5,
    round: 1,
    pick: 5,
    byeweek: 13,
  }),
];

describe('TeamPlayers', () => {
  it('renders team dropdown with all teams', () => {
    render(<TeamPlayers teams={teams} players={players} />);

    expect(screen.getByText('Bears (Alice)')).toBeInTheDocument();
    expect(screen.getByText('Lions (Bob)')).toBeInTheDocument();
    expect(screen.getByText('Packers (Charlie)')).toBeInTheDocument();
  });

  it('shows players filtered by default selected team (id=3)', () => {
    render(<TeamPlayers teams={teams} players={players} />);

    // Team 3 (Lions) players
    expect(screen.getByText(/Mahomes/)).toBeInTheDocument();
    expect(screen.getByText(/Kelce/)).toBeInTheDocument();
    // Team 1 player should not be shown
    expect(screen.queryByText(/Jones/)).not.toBeInTheDocument();
  });

  it('changing dropdown updates displayed players', () => {
    render(<TeamPlayers teams={teams} players={players} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    expect(screen.getByText(/Jones/)).toBeInTheDocument();
    expect(screen.queryByText(/Mahomes/)).not.toBeInTheDocument();
  });

  it('shows player name, position, bye week columns', () => {
    render(<TeamPlayers teams={teams} players={players} />);

    expect(screen.getByText('Player')).toBeInTheDocument();
    expect(screen.getByText('Pos')).toBeInTheDocument();
    expect(screen.getByText('Bye')).toBeInTheDocument();
  });

  it('sorts players by round', () => {
    render(<TeamPlayers teams={teams} players={players} />);

    // Kelce is round 1, Mahomes is round 2 — Kelce should appear first
    const rows = screen.getAllByRole('row');
    // rows[0] is header, rows[1] is first data row
    expect(rows[1]).toHaveTextContent(/Kelce/);
    expect(rows[2]).toHaveTextContent(/Mahomes/);
  });

  it('handles team with no matching players', () => {
    const emptyTeams = [createFantasyTeam({ id: 3, name: 'Lions', owner: 'Bob' })];
    render(<TeamPlayers teams={emptyTeams} players={[]} />);

    // Should render the table with header only
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });
});
