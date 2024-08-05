import * as React from "react";
import {Component, FormEvent} from "react";
import {FantasyTeam, Pick, Player} from "../model";
import {Badge, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {PlayerFilter, PlayersFilter} from "./PlayerFilter";
import {DraftOrder} from "./DraftOrder";
import {TeamPlayers} from "./TeamPlayers";
import {draftAPI} from "../api";
import DataTable, {TableColumn} from "react-data-table-component";

interface PlayersState {
    playersFilter: PlayersFilter;
    isTvMode: boolean;
    isEditMode: boolean;
    showPlayerEdit: boolean;
    selectedPlayer?: Player;
    selectedTeamID?: string;
    currentRound: number;
    currentPick: number;
}

interface PlayersProps {
    players: Player[];
    teams: FantasyTeam[];
    picks: Pick[];
}

export class Players extends Component<PlayersProps, PlayersState> {

    constructor(props: PlayersProps) {
        super(props);

        let playersFilter = new PlayersFilter();

        let isTvMode = false;
        if (this.getUrlParamByName("istvmode") === "1") {
            isTvMode = true;
            playersFilter.isAvailable = 'drafted';
        }
        let isEditMode = false;
        if (this.getUrlParamByName("iseditmode") === "1") {
            isEditMode = true;
        }

        let currentTeamID = "";
        if (props.picks.length > 0) {
            currentTeamID = props.picks[0].fantasyteam_id;
        } else if (props.teams[0]) {
            currentTeamID = props.teams[0].id.toString();
        }

        this.state = {
            playersFilter: playersFilter,
            isTvMode: isTvMode,
            isEditMode: isEditMode,
            showPlayerEdit: false,
            selectedPlayer: undefined,
            selectedTeamID: currentTeamID,
            currentRound: 1,
            currentPick: 1
        };
    }

    componentDidUpdate(prevProps: Readonly<PlayersProps>,
                       prevState: Readonly<PlayersState>,
                       snapshot?: any): void {
        if (prevProps.picks !== this.props.picks) {
            let currentTeamID = '0';
            let currentRound = 0;
            let currentPick = 0;
            if (this.props.picks.length > 0) {
                currentTeamID = this.props.picks[0].fantasyteam_id;
                currentRound = this.props.picks[0].round;
                currentPick = this.props.picks[0].pick;
            }
            this.setState({
                currentPick: currentPick, currentRound: currentRound, selectedTeamID: currentTeamID
            });
        }
    }

    getUrlParamByName(name: string): string {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(window.location.search);
        var value = results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : '';
        return value;
    }

    public onPlayersFilterChange = (playersFilter: PlayersFilter) => {
        this.setState({playersFilter});
    };

    private filterPlayers = (): Player[] => {
        let playersFilter = this.state.playersFilter;
        let filteredPlayers = this.props.players;
        filteredPlayers = filteredPlayers.filter((player) => {
            let lastNameMatch = true;
            if (playersFilter.lastname && playersFilter.lastname !== '') {
                lastNameMatch = player.lastname.toLowerCase().startsWith(
                    playersFilter.lastname.toLowerCase())
            }

            let positionMatch = true;
            if (playersFilter.position && playersFilter.position !== '') {
                positionMatch = player.position === playersFilter.position;
            }

            let isAvailableMatch = true;
            if (playersFilter.isAvailable && playersFilter.isAvailable === "drafted") {
                isAvailableMatch = player.fantasyteam !== "";
            } else if (playersFilter.isAvailable && playersFilter.isAvailable === "available") {
                isAvailableMatch = player.fantasyteam === "";
            }

            return lastNameMatch && positionMatch && isAvailableMatch;
        });
        return filteredPlayers;
    };

    handleClosePlayerEdit = () => {
        this.setState({showPlayerEdit: false, selectedPlayer: undefined});
    }

    saveSelectedPlayer = () => {
        const {picks} = this.props;
        const {selectedTeamID, selectedPlayer} = this.state;
        console.log('saveSelectedPlayer', {teamID: selectedTeamID, p: selectedPlayer});

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
                pick: currentPick
            });
            draftAPI.savePlayer(selectedPlayer, currentRound, currentPick);
        }
        this.setState({showPlayerEdit: false, selectedPlayer: undefined});
    }

    handleShowPlayerEdit = (player: Player) => {
        this.setState({showPlayerEdit: true, selectedPlayer: player});
    }

    public handleSelectedTeamChange = (e: FormEvent<HTMLSelectElement>) => {
        this.setState({selectedTeamID: e.currentTarget.value});
    };

    public render() {
        let filteredPlayers = this.filterPlayers();
        const {teams, players, picks} = this.props;
        const {isTvMode, isEditMode, selectedPlayer, currentRound, currentPick} = this.state;

        if (filteredPlayers === undefined) {
            filteredPlayers = [];
        }

        let defaultSorted = "rank";
        let defaultSortAsc = true;

        let filterRow = <></>;
        let teamPlayers = <></>;
        if (!isTvMode) {
            filterRow = (
                <Row>
                    <PlayerFilter onChange={this.onPlayersFilterChange}/>
                </Row>
            );
            teamPlayers = <TeamPlayers players={players} teams={teams}/>
        } else {
            defaultSorted = "pickNo";
            defaultSortAsc = false;
        }

        const columns: TableColumn<Player>[] = [
            {
                name: 'Player',
                selector: (row: Player) => row.lastname,
                sortable: true,
                wrap: true,
                width: '20%',
                cell: (row: Player) => (
                    <div>
                        <a href={row.url}
                           target="_blank" rel="noopener noreferrer">{row.lastname}, {row.firstname}</a> <br/>
                        <span
                            style={{fontSize: '10px', paddingRight: '4px'}}>{row.team} - {row.position}</span>
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
            {
                name: 'ADP',
                selector: (row: Player) => row.avgpick,
                sortable: true,
                width: '11%',
            },
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
                    const team = row.fantasyteam ? <div>{row.fantasyteam} ({row.owner})</div> : null;
                    let editBtn = <></>;
                    if (isEditMode && !row.fantasyteam) {
                        editBtn = <Button onClick={() => this.handleShowPlayerEdit(row)}>Edit</Button>
                    }
                    return (
                        <div>
                            {team}
                            {editBtn}
                        </div>
                    );
                },
            },
        ]

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
                        <Col xs={5} md={3} style={{paddingRight: "20px"}}>
                            <Row>
                                <DraftOrder teams={teams} picks={picks}/>
                                {teamPlayers}
                            </Row>
                        </Col>
                        <Col xs={12} md={9}>
                            {filterRow}
                            <Row>
                                <DataTable
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
                        <strong>Player: </strong> {selectedPlayer?.firstname} {selectedPlayer?.lastname}<br/>
                        <strong>Round &amp; Pick: </strong> {currentRound} - {currentPick} <br/>
                        <strong>Team:</strong>
                        <Form.Select
                            onChange={this.handleSelectedTeamChange}
                            value={this.state.selectedTeamID}>
                            {teamRows}
                        </Form.Select>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClosePlayerEdit}>Close</Button>
                        <Button variant="primary" onClick={this.saveSelectedPlayer}>Save Player</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}