import * as React from "react";
import { PlayerFilter, PlayersFilter } from "./PlayerFilter";
import { render, fireEvent } from "@testing-library/react";

test("should render last name field", async () => {
    const changeHandler = jest.fn();
    const { getByLabelText } = render(<PlayerFilter onChange={changeHandler} />);

    const input = getByLabelText("Last name:") as HTMLInputElement;
    expect(input !== undefined);

    fireEvent.change(input, { target: { value: 'a' } });

    expect(input.value).toBe('a');
    expect(changeHandler).toHaveBeenCalledTimes(1);
    let playerFilter = new PlayersFilter();
    playerFilter.lastname = "a";
    expect(changeHandler).toHaveBeenCalledWith(playerFilter);
});
