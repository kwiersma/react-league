import { render, fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { PlayerFilter, PlayersFilter } from './PlayerFilter';

describe('PlayerFilter', () => {
  it('should render last name field', async () => {
    const changeHandler = vi.fn();
    render(<PlayerFilter onChange={changeHandler} />);

    const input = screen.getByLabelText('Last name:') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'a' } });

    expect(input.value).toBe('a');
    expect(changeHandler).toHaveBeenCalledTimes(1);
    const playerFilter = new PlayersFilter();
    playerFilter.lastname = 'a';
    expect(changeHandler).toHaveBeenCalledWith(playerFilter);
  });

  it('renders all three filter sections', () => {
    render(<PlayerFilter onChange={vi.fn()} />);
    expect(screen.getByLabelText('Last name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Position:')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
  });

  it('position dropdown triggers onChange with correct filter value', () => {
    const changeHandler = vi.fn();
    render(<PlayerFilter onChange={changeHandler} />);

    const select = screen.getByLabelText('Position:');
    fireEvent.change(select, { target: { value: 'RB' } });

    expect(changeHandler).toHaveBeenCalledTimes(1);
    const expected = new PlayersFilter();
    expected.position = 'RB';
    expect(changeHandler).toHaveBeenCalledWith(expected);
  });

  it('"Any" radio is checked by default', () => {
    render(<PlayerFilter onChange={vi.fn()} />);
    const anyRadio = screen.getByLabelText('Any');
    expect(anyRadio).toBeChecked();
  });

  it('Available radio triggers onChange with isAvailable="available"', () => {
    const changeHandler = vi.fn();
    render(<PlayerFilter onChange={changeHandler} />);

    const availableRadio = screen.getByLabelText('Available');
    fireEvent.click(availableRadio);

    expect(changeHandler).toHaveBeenCalledTimes(1);
    const expected = new PlayersFilter();
    expected.isAvailable = 'available';
    expect(changeHandler).toHaveBeenCalledWith(expected);
  });

  it('Drafted radio triggers onChange with isAvailable="drafted"', () => {
    const changeHandler = vi.fn();
    render(<PlayerFilter onChange={changeHandler} />);

    const draftedRadio = screen.getByLabelText('Drafted');
    fireEvent.click(draftedRadio);

    expect(changeHandler).toHaveBeenCalledTimes(1);
    const expected = new PlayersFilter();
    expected.isAvailable = 'drafted';
    expect(changeHandler).toHaveBeenCalledWith(expected);
  });
});
