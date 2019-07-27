import * as React from "react";
import {Component, FormEvent} from "react";
import {FantasyTeam, Player} from "../model";
import {draftAPI} from "../api";
import {Panel, Table} from "react-bootstrap";

interface ITeamPlayersState {
    teams: FantasyTeam[];
    players: Player[];
    filteredPlayers: Player[];
    selectedTeamID: string;
}

export class TeamPlayers extends Component<{}, ITeamPlayersState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            teams: [],
            selectedTeamID: "3",
            players: [],
            filteredPlayers: []
        };
    }

    public componentDidMount() {
        draftAPI.getFantasyTeams().then((teams: FantasyTeam[]) => {
            this.setState({teams});
        });
        draftAPI.getPlayers().then((players: Player[]) => {
            this.setState({players, filteredPlayers: players});
            this.updatePlayers();
        });
    }

    public handleSelectedTeamChange = (e: FormEvent<HTMLSelectElement>) => {
        this.setState(
            { selectedTeamID: e.currentTarget.value},
            this.updatePlayers);
    };

    public updatePlayers = () => {
        let filteredPlayers = this.state.players;
        const selectedTeamID = this.state.selectedTeamID;
        filteredPlayers = filteredPlayers.filter((player) => {
            return player.fantasyteam_id.toString() === selectedTeamID;
        });
        this.setState({
            filteredPlayers
        })
    };

    public render() {
        let {teams, filteredPlayers} = this.state;

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
                    <td>{player.lastname}, {player.firstname}</td>
                    <td>{player.position}</td>
                    <td>{player.byeweek}</td>
                    <td>{player.round}, {player.pick}</td>
                </tr>
            )
        });

        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title>
                        <select
                            className="form-control"
                            value={this.state.selectedTeamID}
                            onChange={this.handleSelectedTeamChange}>
                            {teamRows}
                        </select>
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Table>
                        <thead>
                        <tr>
                            <th>Player</th>
                            <th>Pos</th>
                            <th>Bye</th>
                            <th>R, P</th>
                        </tr>
                        </thead>
                        <tbody>
                            {playerRows}
                        </tbody>
                    </Table>
                </Panel.Body>
            </Panel>
        );
    }
}