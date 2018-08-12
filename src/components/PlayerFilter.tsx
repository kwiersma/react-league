import {Component, FormEvent} from "react";
import * as React from "react";

interface IState {
    playerFilter: PlayersFilter;
}

interface IPlayerFilterProps {
    onChange: (playerFilter: PlayersFilter) => void;
}

export class PlayersFilter {
    public lastname: string;
    public position: string;
    public isAvailable: boolean;
}

export class PlayerFilter extends Component<IPlayerFilterProps, IState> {

    constructor(props: IPlayerFilterProps) {
        super(props);
        this.state = {
            playerFilter: new PlayersFilter()
        }
    }

    public handleLastNameChange = (e: FormEvent<HTMLInputElement>) => {
        const newPlayerFilter = this.state.playerFilter;
        newPlayerFilter.lastname = e.currentTarget.value;
        this.setState({
            playerFilter: newPlayerFilter
        });
        this.props.onChange(newPlayerFilter);
    };

    public handlePositionChange = (e: FormEvent<HTMLSelectElement>) => {
        const newPlayerFilter = this.state.playerFilter;
        newPlayerFilter.position = e.currentTarget.value;
        this.setState({
            playerFilter: newPlayerFilter
        });
        this.props.onChange(newPlayerFilter);
    };

    public render() {
        return (
            <div className="well">
                <label htmlFor="lastname">Last name: </label>
                <input type="text" id="lastname"
                       value={this.state.playerFilter.lastname}
                       onChange={this.handleLastNameChange}/>
                <label htmlFor="position">Position: </label>
                <select id="position"
                       value={this.state.playerFilter.position}
                       onChange={this.handlePositionChange}>
                    <option value=""/>
                    <option value="QB">QB</option>
                    <option value="RB">RB</option>
                    <option value="WR">WR</option>
                    <option value="TE">TE</option>
                    <option value="K">K</option>
                    <option value="DEF">Def</option>
                </select>
            </div>
        )
    }
}