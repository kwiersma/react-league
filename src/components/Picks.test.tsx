import { render, screen, act } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { createPick } from '../test/factories';

import { Picks } from './Picks';

describe('Picks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders navbar but no picksTable when picks is empty', () => {
    render(<Picks picks={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders "On the clock" with picks[0] team/owner/round/pick', () => {
    const picks = [
      createPick({ fantasyteam: 'Bears', owner: 'Alice', round: 3, pick: 5 }),
      createPick({ fantasyteam: 'Lions', owner: 'Bob', round: 3, pick: 6 }),
      createPick({
        fantasyteam: 'Packers',
        owner: 'Charlie',
        player: 'P. Mahomes',
        picktime: new Date().toISOString(),
      }),
    ];

    render(<Picks picks={picks} />);
    expect(screen.getByText('On the clock:')).toBeInTheDocument();
    expect(screen.getByText(/Bears \(Alice\) \(R 3 P 5\)/)).toBeInTheDocument();
  });

  it('renders "On deck" with picks[1] team/owner', () => {
    const picks = [
      createPick({ fantasyteam: 'Bears', owner: 'Alice', round: 3, pick: 5 }),
      createPick({ fantasyteam: 'Lions', owner: 'Bob', round: 3, pick: 6 }),
      createPick({
        fantasyteam: 'Packers',
        owner: 'Charlie',
        player: 'P. Mahomes',
        picktime: new Date().toISOString(),
      }),
    ];

    render(<Picks picks={picks} />);
    expect(screen.getByText('On deck:')).toBeInTheDocument();
    expect(screen.getByText(/Lions \(Bob\)/)).toBeInTheDocument();
  });

  it('renders "Last Pick" with picks[2] player info', () => {
    const picks = [
      createPick({ fantasyteam: 'Bears', owner: 'Alice', round: 3, pick: 5 }),
      createPick({ fantasyteam: 'Lions', owner: 'Bob', round: 3, pick: 6 }),
      createPick({
        fantasyteam: 'Packers',
        owner: 'Charlie',
        player: 'P. Mahomes',
        picktime: new Date().toISOString(),
      }),
    ];

    render(<Picks picks={picks} />);
    expect(screen.getByText('Last Pick:')).toBeInTheDocument();
    expect(screen.getByText(/P. Mahomes by Packers \(Charlie\)/)).toBeInTheDocument();
  });

  it('renders "Before Last Pick" with picks[3] player info', () => {
    const picks = [
      createPick({ fantasyteam: 'Bears', owner: 'Alice', round: 3, pick: 5 }),
      createPick({ fantasyteam: 'Lions', owner: 'Bob', round: 3, pick: 6 }),
      createPick({
        fantasyteam: 'Packers',
        owner: 'Charlie',
        player: 'P. Mahomes',
        picktime: new Date().toISOString(),
      }),
      createPick({
        fantasyteam: 'Vikings',
        owner: 'Dave',
        player: 'T. Kelce',
        picktime: new Date().toISOString(),
      }),
    ];

    render(<Picks picks={picks} />);
    expect(screen.getByText('Before Last Pick:')).toBeInTheDocument();
    expect(screen.getByText(/T. Kelce by Vikings \(Dave\)/)).toBeInTheDocument();
  });

  it('renders empty cells when picks[2] and picks[3] are undefined', () => {
    const picks = [
      createPick({ fantasyteam: 'Bears', owner: 'Alice', round: 1, pick: 1 }),
      createPick({ fantasyteam: 'Lions', owner: 'Bob', round: 1, pick: 2 }),
    ];

    render(<Picks picks={picks} />);
    expect(screen.getByText('Last Pick:')).toBeInTheDocument();
    expect(screen.getByText('Before Last Pick:')).toBeInTheDocument();
  });

  it('timer displays initial "0:00" and advances with fake timers', () => {
    const now = new Date();
    const picks = [
      createPick({ fantasyteam: 'Bears', owner: 'Alice', round: 1, pick: 1 }),
      createPick({ fantasyteam: 'Lions', owner: 'Bob', round: 1, pick: 2 }),
      createPick({
        fantasyteam: 'Packers',
        owner: 'Charlie',
        player: 'P. Mahomes',
        picktime: now.toISOString(),
      }),
    ];

    render(<Picks picks={picks} />);

    const clock = screen.getByText('0:00');
    expect(clock).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // After 2 seconds the timer should still display a time format
    expect(screen.getByText(/\d+:\d{2}/)).toBeInTheDocument();
  });
});
