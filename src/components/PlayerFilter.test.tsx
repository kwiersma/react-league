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
});
