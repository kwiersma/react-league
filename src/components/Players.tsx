import * as React from 'react';
import { Component, FormEvent } from 'react';
import { Badge, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import DataTable, { TableColumn, Theme } from 'react-data-table-component';

import { draftAPI } from '../api';
import { FantasyTeam, Pick, Player } from '../model';

import { DraftOrder } from './DraftOrder';
import { PlayerFilter, PlayersFilter } from './PlayerFilter';
import { TeamPlayers } from './TeamPlayers';

interface PlayersState {
  playersFilter: PlayersFilter;
  isTvMode: boolean;
  isEditMode: boolean;
  showPlayerEdit: boolean;
  selectedPlayer?: Player;
  selectedTeamID?: string;
  currentRound: number;
  currentPick: number;
  picks: Pick[];
}

interface PlayersProps {
  players: Player[];
  teams: FantasyTeam[];
  picks: Pick[];
}

// Colors reference Bootstrap's own CSS variables so the table follows the app's
// data-bs-theme attribute automatically, without any JS-side dark mode detection.
const bootstrapTableTheme: Partial<Theme> = {
  text: {
    primary: 'var(--bs-body-color)',
    secondary: 'var(--bs-secondary-color)',
    disabled: 'var(--bs-tertiary-color)',
  },
  background: { default: 'var(--bs-body-bg)' },
  context: { background: 'var(--bs-primary)', text: 'var(--bs-white)' },
  divider: { default: 'var(--bs-border-color)' },
  button: {
    default: 'var(--bs-body-color)',
    hover: 'var(--bs-tertiary-bg)',
    focus: 'var(--bs-tertiary-bg)',
    disabled: 'var(--bs-secondary-color)',
  },
  selected: { default: 'var(--bs-tertiary-bg)', text: 'var(--bs-body-color)' },
  highlightOnHover: { default: 'var(--bs-tertiary-bg)', text: 'var(--bs-body-color)' },
  striped: { default: 'var(--bs-secondary-bg)', text: 'var(--bs-body-color)' },
};

const ADP_ENABLED = false;

export class Players extends Component<PlayersProps, PlayersState> {
  constructor(props: PlayersProps) {
    super(props);

    const playersFilter = new PlayersFilter();

    let isTvMode = false;
    if (this.getUrlParamByName('istvmode') === '1') {
      isTvMode = true;
      playersFilter.isAvailable = 'drafted';
    }
    let isEditMode = false;
    if (this.getUrlParamByName('iseditmode') === '1') {
      isEditMode = true;
    }

    const currentTeamID = this.determineCurrentTeamID();

    this.state = {
      playersFilter: playersFilter,
      isTvMode: isTvMode,
      isEditMode: isEditMode,
      showPlayerEdit: false,
      selectedPlayer: undefined,
      selectedTeamID: currentTeamID,
      currentRound: 1,
      currentPick: 1,
      picks: props.picks,
    };
  }

  static getDerivedStateFromProps(
    props: Readonly<PlayersProps>,
    state: Readonly<PlayersState>,
  ): Partial<PlayersState> | null {
    if (props.picks === state.picks) {
      return null;
    }
    let currentTeamID = Players.computeCurrentTeamID(props.picks, props.teams);
    let currentRound = 0;
    let currentPick = 0;
    if (props.picks.length > 0) {
      currentTeamID = props.picks[0].fantasyteam_id;
      currentRound = props.picks[0].round;
      currentPick = props.picks[0].pick;
    }
    return { picks: props.picks, selectedTeamID: currentTeamID, currentRound, currentPick };
  }

  getUrlParamByName(name: string): string {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    const value = results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : '';
    return value;
  }

  public onPlayersFilterChange = (playersFilter: PlayersFilter) => {
    this.setState({ playersFilter });
  };

  private static computeCurrentTeamID(picks: Pick[], teams: FantasyTeam[]): string {
    let currentTeamID = '';
    if (picks.length > 0 && picks[0].fantasyteam_id !== '') {
      currentTeamID = picks[0].fantasyteam_id;
    } else if (teams.length > 0) {
      currentTeamID = teams[0].id.toString();
    }
    return currentTeamID;
  }

  private determineCurrentTeamID(): string {
    return Players.computeCurrentTeamID(this.props.picks, this.props.teams);
  }

  private filterPlayers = (): Player[] => {
    const playersFilter = this.state.playersFilter;
    let filteredPlayers = this.props.players;
    filteredPlayers = filteredPlayers.filter((player) => {
      let lastNameMatch = true;
      if (playersFilter.lastname && playersFilter.lastname !== '') {
        lastNameMatch = player.lastname.toLowerCase().startsWith(playersFilter.lastname.toLowerCase());
      }

      let positionMatch = true;
      if (playersFilter.position && playersFilter.position !== '') {
        positionMatch = player.position === playersFilter.position;
      }

      let isAvailableMatch = true;
      if (playersFilter.isAvailable && playersFilter.isAvailable === 'drafted') {
        isAvailableMatch = player.fantasyteam !== '';
      } else if (playersFilter.isAvailable && playersFilter.isAvailable === 'available') {
        isAvailableMatch = player.fantasyteam === '';
      }

      return lastNameMatch && positionMatch && isAvailableMatch;
    });
    return filteredPlayers;
  };

  handleClosePlayerEdit = () => {
    this.setState({ showPlayerEdit: false, selectedPlayer: undefined });
  };

  saveSelectedPlayer = () => {
    const { picks } = this.props;
    const { selectedTeamID, selectedPlayer } = this.state;
    console.log('saveSelectedPlayer', {
      teamID: selectedTeamID,
      p: selectedPlayer,
    });

    let currentRound = 0;
    let currentPick = 0;
    if (picks.length > 0) {
      currentRound = picks[0].round;
      currentPick = picks[0].pick;
    }

    if (selectedPlayer && selectedTeamID) {
      selectedPlayer.fantasyteam_id = parseInt(selectedTeamID);
      console.log('about to call savePlayer', {
        p: this.state.selectedPlayer,
        r: currentRound,
        pick: currentPick,
      });
      draftAPI.savePlayer(selectedPlayer, currentRound, currentPick);
    }
    this.setState({ showPlayerEdit: false, selectedPlayer: undefined });
  };

  handleShowPlayerEdit = (player: Player) => {
    const currentTeamID = this.determineCurrentTeamID();
    this.setState({
      showPlayerEdit: true,
      selectedPlayer: player,
      selectedTeamID: currentTeamID,
    });
  };

  public handleSelectedTeamChange = (e: FormEvent<HTMLSelectElement>) => {
    this.setState({ selectedTeamID: e.currentTarget.value });
  };

  public render() {
    let filteredPlayers = this.filterPlayers();
    const { teams, players, picks } = this.props;
    const { isTvMode, isEditMode, selectedPlayer, currentRound, currentPick } = this.state;

    if (filteredPlayers === undefined) {
      filteredPlayers = [];
    }

    let defaultSorted = 'rank';
    let defaultSortAsc = true;

    let filterRow = <></>;
    let teamPlayers = <></>;
    if (!isTvMode) {
      filterRow = (
        <Row>
          <PlayerFilter onChange={this.onPlayersFilterChange} />
        </Row>
      );
      teamPlayers = <TeamPlayers players={players} teams={teams} />;
    } else {
      defaultSorted = 'pickNo';
      defaultSortAsc = false;
    }

    let columns: TableColumn<Player>[] = [
      {
        name: 'Player',
        selector: (row: Player) => row.lastname,
        sortable: true,
        wrap: true,
        width: '20%',
        cell: (row: Player) => (
          <div>
            <a href={row.url} target="_blank" rel="noopener noreferrer">
              {row.lastname}, {row.firstname}
            </a>{' '}
            <br />
            <span style={{ fontSize: '10px', paddingRight: '4px' }}>
              {row.team} - {row.position}
            </span>
            <Badge bg="danger">{row.nfl_status}</Badge>
          </div>
        ),
      },
      {
        name: 'Rank',
        id: 'rank',
        width: '11%',
        selector: (row: Player) => row.rank,
        sortable: true,
      },
      {
        name: 'Pts',
        selector: (row: Player) => row.points,
        sortable: true,
        width: '10%',
      },
      {
        name: 'Bye',
        selector: (row: Player) => row.byeweek,
        width: '10%',
      },
    ];

    if (ADP_ENABLED) {
      columns = columns.concat([
        {
          name: 'ADP',
          selector: (row: Player) => row.avgpick,
          sortable: true,
          width: '11%',
        },
      ]);
    }
    columns = columns.concat([
      {
        name: 'Pick #',
        id: 'pickNo',
        selector: (row: Player) => row.pickNo,
        sortable: true,
        width: '11%',
      },
      {
        name: 'Fantasy Team',
        selector: (row: Player) => row.fantasyteam,
        sortable: true,
        width: '30%',
        cell: (row: Player) => {
          const team = row.fantasyteam ? (
            <div>
              {row.fantasyteam} ({row.owner})
            </div>
          ) : null;
          let editBtn = <></>;
          if (isEditMode && !row.fantasyteam) {
            editBtn = <Button onClick={() => this.handleShowPlayerEdit(row)}>Edit</Button>;
          }
          return (
            <div>
              {team}
              {editBtn}
            </div>
          );
        },
      },
    ]);

    const teamRows = teams.map((team, idx) => {
      return (
        <option key={team.id} value={team.id}>
          {team.name} ({team.owner})
        </option>
      );
    });

    return (
      <>
        <Container fluid>
          <Row>
            <Col xs={5} md={3} style={{ paddingRight: '20px' }}>
              <Row>
                <DraftOrder teams={teams} picks={picks} />
                {teamPlayers}
              </Row>
            </Col>
            <Col xs={12} md={9}>
              {filterRow}
              <Row>
                <DataTable
                  theme={bootstrapTableTheme}
                  data={filteredPlayers}
                  columns={columns}
                  pagination
                  striped
                  defaultSortFieldId={defaultSorted}
                  defaultSortAsc={defaultSortAsc}
                />
              </Row>
            </Col>
          </Row>
        </Container>

        <Modal show={this.state.showPlayerEdit} onHide={this.handleClosePlayerEdit}>
          <Modal.Header closeButton>
            <Modal.Title>
              Edit Player: {selectedPlayer?.firstname} {selectedPlayer?.lastname}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong>Player: </strong> {selectedPlayer?.firstname} {selectedPlayer?.lastname}
            <br />
            <strong>Round &amp; Pick: </strong> {currentRound} - {currentPick} <br />
            <strong>Team:</strong>
            <Form.Select onChange={this.handleSelectedTeamChange} value={this.state.selectedTeamID}>
              {teamRows}
            </Form.Select>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClosePlayerEdit}>Close</Button>
            <Button variant="primary" onClick={this.saveSelectedPlayer}>
              Save Player
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
