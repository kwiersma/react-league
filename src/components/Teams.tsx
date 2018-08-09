import * as React from "react";
import {Component} from "react";
import {FantasyTeam} from "../model";
import {Grid, PageHeader, Row, Table} from "react-bootstrap";

export class Teams extends Component<{ teams: FantasyTeam[] }> {
    public render() {
        const {teams} = this.props;

        const teamRows = teams.map((team, idx) => {
            return (
                <tr key={idx}>
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