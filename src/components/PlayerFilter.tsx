import {Component, FormEvent} from "react";
import * as React from "react";

interface IState {
    playerFilter: PlayersFilter;
}

interface IPlayerFilterProps {
    onChange: (playerFilter: PlayersFilter) => void;
}

export class PlayersFilter {
    public lastname: string = "";
    public position: string = "";
    public isAvailable: string = "any";
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

    public handleIsAvailableChange = (e: FormEvent<HTMLInputElement>) => {
        const newPlayerFilter = this.state.playerFilter;
        newPlayerFilter.isAvailable = e.currentTarget.value;
        this.setState({
            playerFilter: newPlayerFilter
        });
        this.props.onChange(newPlayerFilter);
    };

    public render() {
        return (
            <div className="well">
                <form className="form-inline">
                    <div className="form-group">
                        <label className="control-label" htmlFor="lastname">Last name: </label>
                        <input type="text" id="lastname"
                               className="form-control"
                               value={this.state.playerFilter.lastname}
                               onChange={this.handleLastNameChange}/>
                    </div>
                    <div className="form-group" style={{'paddingLeft': '20px'}}/>
                    <label className="radio-inline">
                        <input type="radio" id="isAvailable_1"
                               value="any"
                               onChange={this.handleIsAvailableChange}
                               checked={this.state.playerFilter.isAvailable === "any"}/> Any
                    </label>
                    <div className="form-group" style={{'paddingLeft': '20px'}}/>
                    <label className="radio-inline">
                        <input type="radio" id="isAvailable_1"
                               value="available"
                               onChange={this.handleIsAvailableChange}
                               checked={this.state.playerFilter.isAvailable === "available"}/> Available
                    </label>
                    <div className="form-group" style={{'paddingLeft': '20px'}}/>
                    <label className="radio-inline">
                        <input type="radio" id="isAvailable_0"
                               value="drafted"
                               onChange={this.handleIsAvailableChange}
                               checked={this.state.playerFilter.isAvailable === "drafted"}/> Drafted
                    </label>
                    <div className="form-group" style={{'paddingLeft': '20px'}}/>
                    <div className="form-group">
                        <label className="control-label" htmlFor="position">Position: </label>
                        <select id="position"
                                className="form-control"
                                value={this.state.playerFilter.position}
                                onChange={this.handlePositionChange}>
                            <option value="">Any</option>
                            <option value="QB">QB</option>
                            <option value="RB">RB</option>
                            <option value="WR">WR</option>
                            <option value="TE">TE</option>
                            <option value="K">K</option>
                            <option value="DEF">Def</option>
                        </select>
                    </div>
                </form>
            </div>
        )
    }
}