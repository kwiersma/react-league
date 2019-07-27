import * as React from "react";
import {Component} from "react";
import {Player} from "../model";
import {Col, Grid, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {draftAPI} from "../api";
import {PlayerFilter, PlayersFilter} from "./PlayerFilter";
import {DraftOrder} from "./DraftOrder";
import {TeamPlayers} from "./TeamPlayers";

interface IPlayersState {
    players: Player[];
    filteredPlayers: Player[];
}

export class Players extends Component<{}, IPlayersState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            players: [],
            filteredPlayers: []
        };
    }

    public componentDidMount() {
        draftAPI.getPlayers().then((players: Player[]) => {
            this.setState({players, filteredPlayers: players});
        });
    }

    public filterPlayers = (playersFilter: PlayersFilter) => {
        let filteredPlayers = this.state.players;
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
            if (playersFilter.isAvailable && playersFilter.isAvailable == "drafted") {
                isAvailableMatch = player.fantasyteam !== "";
            } else if (playersFilter.isAvailable && playersFilter.isAvailable == "available") {
                isAvailableMatch = player.fantasyteam === "";
            }

            return lastNameMatch && positionMatch && isAvailableMatch;
        });
        this.setState({
            filteredPlayers
        })
    };

    public render() {
        let {filteredPlayers} = this.state;

        if (filteredPlayers === undefined) {
            filteredPlayers = [];
        }

        const playerNameFormatter = (cell: any, row: any) => {
            return (
                <>
                    <a href={row.url} target='_blank'>{row.lastname}, {row.firstname}</a><br />
                    {row.team} - {row.position}
                </>);
        };

        const teamNameFormatter = (cell: any, row: any) => {
            const team = row.fantasyteam ? <div>{row.fantasyteam} ({row.owner})</div> : null;
            return (
                <div>
                    {team}
                    <button className="btn btn-default">Edit</button>
                </div>
            );
        };

        const roundFormatter = (cell: any, row: any) => {
            return (
                <span>R {row.round} P {row.pick}</span>
            );
        };

        const defaultSorted = [{
            dataField: 'rank',
            order: 'asc'
        }];

        const columns = [{
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
        // {
        //     dataField: 'position',
        //     text: 'Pos',
        //     sort: true,
        //     style: {
        //         width: '8%'
        //     },
        //     headerStyle: {
        //         width: '8%'
        //     }
        // }, {
        //     dataField: 'team',
        //     text: 'Team',
        //     sort: true,
        //     style: {
        //         width: '8%'
        //     },
        //     headerStyle: {
        //         width: '8%'
        //     }
        // },
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
            dataField: 'round',
            text: 'R, P',
            sort: true,
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
        }];

        return (
            <Grid fluid={false}>
                <Row>
                    <Col xs={5} md={3} style={{"paddingRight": "30px"}}>
                        <Row>
                            <DraftOrder />
                            <TeamPlayers />
                        </Row>
                    </Col>
                    {/*<Col xs={1} md={1}/>*/}
                    <Col xs={12} md={9}>
                        <Row>
                            <PlayerFilter onChange={this.filterPlayers}/>
                        </Row>
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