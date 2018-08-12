import * as React from "react";
import {Component} from "react";
import {FantasyTeam} from "../model";
import {Grid, PageHeader, Row, Table} from "react-bootstrap";
import {draftAPI} from "../api";

interface ITeamsState {
    teams: FantasyTeam[];
}

export class Teams extends Component<{}, ITeamsState> {

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
                <tr key={team.id}>
                    <td>{team.draftorder}</td>
                    <td>{team.name}</td>
                    <td>{team.owner}</td>
                </tr>
            );
        });

        return (
            <Grid>
                <Row>
                    <PageHeader>Teams</PageHeader>
                </Row>
                <Row>
                    <Table striped={true}>
                        <thead>
                        <tr>
                            <th>Order</th>
                            <th>Team</th>
                            <th>Owner</th>
                        </tr>
                        </thead>
                        <tbody>
                        {teamRows}
                        </tbody>
                    </Table>
                </Row>
            </Grid>
        );
    }
}