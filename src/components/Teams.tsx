import * as React from 'react';
import { Component } from 'react';
import { Container, Row, Table } from 'react-bootstrap';

import { FantasyTeam } from '../model';

interface TeamsProps {
  teams: FantasyTeam[];
}

export class Teams extends Component<TeamsProps, object> {
  public render() {
    let { teams } = this.props;

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
      <Container>
        <Row>
          <h1>Teams</h1>
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
            <tbody>{teamRows}</tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}
