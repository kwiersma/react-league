import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect } from 'vitest';

import { createTeamsList } from '../test/factories';

import { Teams } from './Teams';

describe('Teams', () => {
  it('renders table headers', () => {
    render(<Teams teams={[]} />);
    expect(screen.getByText('Order')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
  });

  it('renders team data rows with correct content', () => {
    const teams = createTeamsList(2);
    render(<Teams teams={teams} />);

    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Owner A')).toBeInTheDocument();
    expect(screen.getByText('Team B')).toBeInTheDocument();
    expect(screen.getByText('Owner B')).toBeInTheDocument();
  });

  it('renders only header row when teams is empty', () => {
    render(<Teams teams={[]} />);
    const rows = screen.getAllByRole('row');
    // Only the header row
    expect(rows).toHaveLength(1);
  });

  it('handles undefined teams without crashing', () => {
    render(<Teams teams={undefined as any} />);
    expect(screen.getByText('Order')).toBeInTheDocument();
  });
});
