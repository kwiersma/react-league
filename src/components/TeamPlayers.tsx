import * as React from 'react';
import { Component, FormEvent } from 'react';
import { Card, Form, Table } from 'react-bootstrap';

import { FantasyTeam, Player } from '../model';

interface TeamPlayersState {
  filteredPlayers: Player[];
  selectedTeamID: string;
}

interface TeamPlayersProps {
  teams: FantasyTeam[];
  players: Player[];
}

export class TeamPlayers extends Component<TeamPlayersProps, TeamPlayersState> {
  constructor(props: TeamPlayersProps) {
    super(props);

    this.state = {
      selectedTeamID: '3',
      filteredPlayers: [],
    };
  }

  public handleSelectedTeamChange = (e: FormEvent<HTMLSelectElement>) => {
    this.setState({ selectedTeamID: e.currentTarget.value });
  };

  private updatePlayers = (): Player[] => {
    let filteredPlayers = this.props.players;
    const selectedTeamID = this.state.selectedTeamID;
    filteredPlayers = filteredPlayers.filter((player) => {
      return player.fantasyteam_id.toString() === selectedTeamID;
    });
    const sortedPlayers = filteredPlayers.sort((a: Player, b: Player) => {
      return a.round - b.round;
    });
    return sortedPlayers;
  };

  public render() {
    let filteredPlayers = this.updatePlayers();
    let { teams } = this.props;

    if (teams === undefined) {
      teams = [];
    }

    const teamRows = teams.map((team, idx) => {
      return (
        <option key={team.id} value={team.id}>
          {team.name} ({team.owner})
        </option>
      );
    });

    if (filteredPlayers === undefined) {
      filteredPlayers = [];
    }

    const playerRows = filteredPlayers.map((player, idx) => {
      return (
        <tr key={player.id}>
          <td>
            {player.lastname}, {player.firstname}
            <br />
            (R {player.round}, P {player.pick})
          </td>
          <td>{player.position}</td>
          <td>{player.byeweek}</td>
        </tr>
      );
    });

    return (
      <Card>
        <Card.Header>
          <Form.Select value={this.state.selectedTeamID} onChange={this.handleSelectedTeamChange}>
            {teamRows}
          </Form.Select>
        </Card.Header>
        <Card.Body>
          <Table striped={true}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Pos</th>
                <th>Bye</th>
              </tr>
            </thead>
            <tbody>{playerRows}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}
