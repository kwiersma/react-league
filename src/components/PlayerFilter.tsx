import {Component, FormEvent} from "react";
import * as React from "react";

interface IState {
    playerFilter: string;
}

interface IPlayerFilterProps {
    onChange: (lastname: string) => void;
}

export class PlayerFilter extends Component<IPlayerFilterProps, IState> {

    constructor(props: IPlayerFilterProps) {
        super(props);
        this.state = {
            playerFilter: ""
        }
    }

    public handleChange = (e: FormEvent<HTMLInputElement>) => {
        this.setState({
            playerFilter: e.currentTarget.value
        });
        this.props.onChange(e.currentTarget.value);
    };

    public render() {
        return (
            <div className="well">
                <label htmlFor="filter">Last name: </label>
                <input type="text" id="filter"
                       value={this.state.playerFilter}
                       onChange={this.handleChange}/>
            </div>
        )
    }
}