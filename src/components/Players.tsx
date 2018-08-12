import * as React from "react";
import {Component} from "react";
import {Player} from "../model";
import {Grid, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {draftAPI} from "../api";
import {PlayerFilter} from "./PlayerFilter";

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

    public filterPlayers = (lastname: string) => {
        let filteredPlayers = this.state.players;
        filteredPlayers = filteredPlayers.filter((player) => {
            return player.lastname.toLowerCase().startsWith(lastname.toLowerCase())
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
                <a href={row.url} target='_blank'>{row.lastname}, {row.firstname}</a>
            );
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
                width: '20%'
            },
            headerStyle: {
                width: '20%'
            }
        }, {
            dataField: 'position',
            text: 'Pos',
            sort: true,
            style: {
                width: '8%'
            },
            headerStyle: {
                width: '8%'
            }
        }, {
            dataField: 'team',
            text: 'Team',
            sort: true,
            style: {
                width: '8%'
            },
            headerStyle: {
                width: '8%'
            }
        }, {
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
            text: 'Points',
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
            <Grid>
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
            </Grid>
        );
    }
}