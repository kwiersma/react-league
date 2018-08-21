import * as React from "react";
import {Component} from "react";
import {FantasyTeam} from "../model";
import {draftAPI} from "../api";
import {Panel} from "react-bootstrap";

interface ITeamsState {
    teams: FantasyTeam[];
}

export class DraftOrder extends Component<{}, ITeamsState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            teams: [],
        };
    }

    public componentDidMount() {
        draftAPI.getFantasyTeams().then((teams: FantasyTeam[]) => {
            this.setState({teams});
        });
    }

    public render() {
        let {teams} = this.state;

        if (teams === undefined) {
            teams = [];
        }

        const teamRows = teams.map((team, idx) => {
            return (
                <li key={team.id}>
                    {team.name}<br/>
                    ({team.owner})
                </li>
            );
        });

        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Draft Order</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <ol>
                        {teamRows}
                    </ol>
                </Panel.Body>
            </Panel>
        );
    }
}