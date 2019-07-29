import * as React from "react";
import {Component} from "react";
import {FantasyTeam} from "../model";
import {Panel} from "react-bootstrap";

interface TeamsProps {
    teams: FantasyTeam[];
}

export class DraftOrder extends Component<TeamsProps, {}> {

    render() {
        let {teams} = this.props;

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