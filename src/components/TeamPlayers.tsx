import * as React from "react";
import {Component, FormEvent} from "react";
import {FantasyTeam, Player} from "../model";
import {Panel, Table} from "react-bootstrap";

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
            selectedTeamID: "3",
            filteredPlayers: []
        };
    }

    componentDidMount(): void {
        this.updatePlayers();
    }

    public handleSelectedTeamChange = (e: FormEvent<HTMLSelectElement>) => {
        this.setState(
            { selectedTeamID: e.currentTarget.value},
            this.updatePlayers);
    };

    public updatePlayers = () => {
        let filteredPlayers = this.props.players;
        const selectedTeamID = this.state.selectedTeamID;
        filteredPlayers = filteredPlayers.filter((player) => {
            return player.fantasyteam_id.toString() === selectedTeamID;
        });
        this.setState({
            filteredPlayers
        })
    };

    public render() {
        let {filteredPlayers} = this.state;
        let {teams} = this.props;

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
                    <td>{player.lastname}, {player.firstname}<br />
                        (R {player.round}, P {player.pick})
                    </td>
                    <td>{player.position}</td>
                    <td>{player.byeweek}</td>
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
                    <Table striped={true}>
                        <thead>
                        <tr>
                            <th>Player</th>
                            <th>Pos</th>
                            <th>Bye</th>
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