import * as React from "react";
import {Component, Props} from "react";
import {Player} from "../model";
import {Grid, PageHeader, Row, Table} from "react-bootstrap";
import {draftAPI} from "../api";

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

        const playerRows = players.map((player: Player, idx) => {
            return (
                <tr key={player.id}>
                    <td><a href={player.url} target='_blank'>{player.lastname}, {player.firstname}</a></td>
                    <td>{player.position}</td>
                    <td>{player.team}</td>
                    <td>{player.rank}</td>
                    <td>{player.points}</td>
                    <td>{player.byeweek}</td>
                    <td>{player.avgpick}</td>
                    <td>R {player.round}, P {player.pick}</td>
                    <td>{player.fantasyteam}  ({player.owner})</td>
                </tr>
            );
        });

        return (
            <Grid>
                <Row>
                    <PageHeader>Players</PageHeader>
                </Row>
                <Row>
                    <Table striped={true}>
                        <thead>
                        <tr>
                            <th>Player</th>
                            <th>Pos</th>
                            <th>Team</th>
                            <th>Rank</th>
                            <th>Points</th>
                            <th>Bye</th>
                            <th>ADP</th>
                            <th>R, P</th>
                            <th>Fantasy Team</th>
                        </tr>
                        </thead>
                        <tbody>
                        {playerRows}
                        </tbody>
                    </Table>
                </Row>
            </Grid>
        );
    }
}