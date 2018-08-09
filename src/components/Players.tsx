import * as React from "react";
import {Component, Props} from "react";
import {Player} from "../model";
import {Grid, PageHeader, Row} from "react-bootstrap";
import {draftAPI} from "../api";
import ReactTable from "react-table";

interface IPlayersState {
    players: Player[];
}

export class Players extends Component<Props<any>, IPlayersState> {

    constructor(props: Props<any>) {
        super(props);

        this.state = {
            players: [],
        };
    }

    public componentDidMount() {
        draftAPI.getPlayers().then((players: Player[]) => {
            this.setState({players});
        });
    }

    public render() {
        let {players} = this.state;

        if (players === undefined) {
            players = [];
        }

        const columns = [{
            Header: 'Player',
            accessor: 'lastname',
            Cell: (props: any) =>
                <a href={props.original.url} target='_blank'>{props.original.lastname}, {props.original.firstname}</a>
        }, {
            Header: 'Position',
            accessor: 'position',
        }, {
            Header: 'Team',
            accessor: 'team'
        }, {
            Header: 'Rank',
            accessor: 'rank'
        }, {
            Header: 'Points',
            accessor: 'points'
        }, {
            Header: 'Bye',
            accessor: 'byeweek'
        }, {
            Header: 'ADP',
            accessor: 'avgpick'
        }, {
            Header: 'R, P',
            accessor: 'round',
            Cell: (props: any) => <span>R {props.original.round}, P {props.original.pick}</span>
        }, {
            Header: 'Fantasy Team',
            accessor: 'fantasyteam',
            Cell: (props: any) => <span>{props.original.fantasyteam} ({props.original.owner})</span>
        }, {
            Header: '',
            accessor: 'button',
            sortable: false,
            Cell: (props: any) => <button className="btn btn-default">Edit</button>
        }];

        const tbodyProps = () => ({className: "table-striped"});

        return (
            <Grid>
                <Row>
                    <PageHeader>Players</PageHeader>
                </Row>
                <Row>
                    <ReactTable
                        columns={columns}
                        data={players}
                        resizable={false}
                        defaultSorted={[
                            {
                                id: "rank",
                                asc: true
                            }
                        ]}
                        defaultPageSize={10}
                        getTbodyProps={tbodyProps}
                    />
                </Row>
            </Grid>
        );
    }
}