import * as React from "react";
import {Component, FormEvent} from "react";
import {FantasyTeam, Pick, Player} from "../model";
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import {PlayerFilter, PlayersFilter} from "./PlayerFilter";
import {DraftOrder} from "./DraftOrder";
import {TeamPlayers} from "./TeamPlayers";
import {draftAPI} from "../api";

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
                currentPick: currentPick, currentRound: currentRound, selectedTeamID: currentTeamID });
        }
    }

    getUrlParamByName(name: string): string {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(window.location.search);
        var value: string = results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : '';
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
        this.setState({ showPlayerEdit: false, selectedPlayer: undefined });
    }

    saveSelectedPlayer = () => {
        const { picks } = this.props;
        const { selectedTeamID, selectedPlayer } = this.state;
        console.log('saveSelectedPlayer', { teamID: selectedTeamID, p: selectedPlayer });

        let currentRound = 0;
        let currentPick = 0;
        if (picks.length > 0) {
            currentRound = picks[0].round;
            currentPick = picks[0].pick;
        }

        if (selectedPlayer && selectedTeamID) {
            selectedPlayer.fantasyteam_id = parseInt(selectedTeamID);
            console.log('about to call savePlayer', { p: this.state.selectedPlayer, r: currentRound, pick: currentPick });
            draftAPI.savePlayer(selectedPlayer, currentRound, currentPick);
        }
        this.setState({ showPlayerEdit: false, selectedPlayer: undefined });
    }

    handleShowPlayerEdit = (player: Player) => {
        this.setState({ showPlayerEdit: true, selectedPlayer: player });
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

        let defaultSorted = [{ dataField: 'rank', order: 'asc' }];

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
            defaultSorted = [{dataField: "pickNo", order: "desc"}];
        }

        const playerNameFormatter = (cell: any, row: any) => {
            return (
                <>
                    <a href={row.url}
                       target="_blank" rel="noopener noreferrer">{row.lastname}, {row.firstname}</a><br/>
                    <span style={{fontSize: '10px', paddingRight: '4px'}}>{row.team} - {row.position}</span>
                    <span className="label label-danger">{row.nfl_status}</span>
                </>);
        };

        const teamNameFormatter = (cell: any, row: Player) => {
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
        };

        const roundFormatter = (cell: any, row: any) => {
            return (
                <span>R {row.round} P {row.pick}</span>
            );
        };

        const columns = [
            {
                dataField: 'lastname',
                text: 'Player',
                sort: true,
                formatter: playerNameFormatter,
                style: {
                    width: '15%'
                },
                headerStyle: {
                    width: '15%'
                }
            },
            {
                dataField: 'rank',
                text: 'Rank',
                sort: true,
                style: {
                    width: '8%'
                },
                headerStyle: {
                    width: '8%'
                }
            }, {
                dataField: 'points',
                text: 'Pts',
                sort: true,
                style: {
                    width: '8%'
                },
                headerStyle: {
                    width: '8%'
                }
            }, {
                dataField: 'byeweek',
                text: 'Bye',
                sort: true,
                style: {
                    width: '8%'
                },
                headerStyle: {
                    width: '8%'
                }
            }, {
                dataField: 'avgpick',
                text: 'ADP',
                sort: true,
                style: {
                    width: '8%'
                },
                headerStyle: {
                    width: '8%'
                }
            }, {
                text: 'R, P',
                sort: false,
                style: {
                    width: '8%'
                },
                headerStyle: {
                    width: '8%'
                },
                formatter: roundFormatter
            }, {
                dataField: 'fantasyteam',
                text: 'Fantasy Team',
                sort: true,
                style: {
                    width: '20%'
                },
                headerStyle: {
                    width: '20%'
                },
                formatter: teamNameFormatter
            },
            {
                dataField: 'pickNo',
                text: 'Pick #',
                sort: true,
                hidden: true,
            }
        ];

        const teamRows = teams.map((team, idx) => {
            return (
                <option key={team.id} value={team.id}>
                    {team.name} ({team.owner})
                </option>
            );
        });

        return (
            <>
                <Container fluid={false}>
                    <Row>
                        <Col xs={5} md={3} style={{paddingRight: "30px"}}>
                            <Row>
                                <DraftOrder teams={teams} picks={picks}/>
                                {teamPlayers}
                            </Row>
                        </Col>
                        <Col xs={12} md={9}>
                            {filterRow}
                            <Row>
                                <BootstrapTable
                                    keyField='id'
                                    data={filteredPlayers}
                                    columns={columns}
                                    defaultSorted={defaultSorted}
                                    pagination={paginationFactory()}
                                    bordered={false} striped={true} condensed={true}/>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <Modal show={this.state.showPlayerEdit} onHide={this.handleClosePlayerEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Player: {selectedPlayer?.firstname} {selectedPlayer?.lastname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <strong>Player: </strong> {selectedPlayer?.firstname} {selectedPlayer?.lastname}<br />
                        <strong>Round &amp; Pick: </strong> {currentRound} - {currentPick} <br />
                        <strong>Team:</strong>
                        <select className="form-control"
                                onChange={this.handleSelectedTeamChange}
                                value={this.state.selectedTeamID}>
                            {teamRows}
                        </select>
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