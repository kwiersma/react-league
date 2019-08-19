import * as React from "react";
import {Component} from "react";
import {FantasyTeam, Player, Pick} from "../model";
import {Col, Grid, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {PlayerFilter, PlayersFilter} from "./PlayerFilter";
import {DraftOrder} from "./DraftOrder";
import {TeamPlayers} from "./TeamPlayers";

interface PlayersState {
    playersFilter: PlayersFilter;
    isTvMode: boolean;
    isEditMode: boolean;
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

        this.state = {
            playersFilter: playersFilter,
            isTvMode: isTvMode,
            isEditMode: isEditMode
        };
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

    public render() {
        let filteredPlayers = this.filterPlayers();
        const {teams, players, picks} = this.props;
        const {isTvMode, isEditMode} = this.state;

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
                    {row.team} - {row.position}
                </>);
        };

        const teamNameFormatter = (cell: any, row: any) => {
            const team = row.fantasyteam ? <div>{row.fantasyteam} ({row.owner})</div> : null;
            let editBtn = <></>;
            if (isEditMode) {
                editBtn = <button className="btn btn-default">Edit</button>
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

        return (
            <Grid fluid={false}>
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
            </Grid>
        );
    }
}