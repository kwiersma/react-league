import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { createPick, createTeamsList } from '../test/factories';

import { DraftOrder } from './DraftOrder';

vi.mock('react-flip-move', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('DraftOrder', () => {
  it('renders nothing when teams is empty', () => {
    const picks = [createPick({ round: 1, pick: 1 })];
    render(<DraftOrder teams={[]} picks={picks} />);
    expect(screen.queryByText(/Round/)).not.toBeInTheDocument();
  });

  it('renders nothing when picks is empty (currentRound = 0)', () => {
    const teams = createTeamsList(3);
    render(<DraftOrder teams={teams} picks={[]} />);
    expect(screen.queryByText(/Round/)).not.toBeInTheDocument();
  });

  it('renders round header', () => {
    const teams = createTeamsList(3);
    const picks = [createPick({ round: 2, pick: 1 })];
    render(<DraftOrder teams={teams} picks={picks} />);

    expect(screen.getByText('Round 2')).toBeInTheDocument();
  });

  it('first team badge has danger style (on the clock)', () => {
    const teams = createTeamsList(3);
    const picks = [createPick({ round: 1, pick: 1 })];
    render(<DraftOrder teams={teams} picks={picks} />);

    // The first team's badge (pick #1) should have danger styling
    const badge = screen.getByText('1.');
    expect(badge).toHaveClass('bg-danger');
  });

  it('second team badge has warning style (on deck)', () => {
    const teams = createTeamsList(3);
    const picks = [createPick({ round: 1, pick: 1 })];
    render(<DraftOrder teams={teams} picks={picks} />);

    // The second team's badge (pick #2) should have warning styling
    const badge = screen.getByText('2.');
    expect(badge).toHaveClass('bg-warning');
  });

  it('odd round lists teams in forward order', () => {
    const teams = createTeamsList(3);
    const picks = [createPick({ round: 1, pick: 1 })];
    render(<DraftOrder teams={teams} picks={picks} />);

    const items = screen.getAllByText(/Team [A-C] \(Owner [A-C]\)/);
    expect(items[0]).toHaveTextContent('Team A (Owner A)');
    expect(items[1]).toHaveTextContent('Team B (Owner B)');
    expect(items[2]).toHaveTextContent('Team C (Owner C)');
  });

  it('even round lists teams in reverse order', () => {
    const teams = createTeamsList(3);
    const picks = [createPick({ round: 2, pick: 1 })];
    render(<DraftOrder teams={teams} picks={picks} />);

    const items = screen.getAllByText(/Team [A-C] \(Owner [A-C]\)/);
    expect(items[0]).toHaveTextContent('Team C (Owner C)');
    expect(items[1]).toHaveTextContent('Team B (Owner B)');
    expect(items[2]).toHaveTextContent('Team A (Owner A)');
  });
});
