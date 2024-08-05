import React from "react";
import Pusher, { Channel } from 'pusher-js';
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./components/Navigation";
import { Teams } from "./components/Teams";
import { Players } from "./components/Players";
import { Picks } from "./components/Picks";
import { FantasyTeam, Pick, Player } from "./model";
import { draftAPI } from "./api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface State {
    teams: FantasyTeam[];
    players: Player[];
    picks: Pick[];
    showPickbar: boolean;
}

class App extends React.Component<{}, State> {

    currentPick: number = 0;
    pusher: Pusher | undefined;
    channel: Channel | undefined;

    constructor(props: {}) {
        super(props);

        this.state = {
            teams: [],
            players: [],
            picks: [],
            showPickbar: false,
        };
    }

    public componentDidMount() {
        draftAPI.getFantasyTeams().then((teams: FantasyTeam[]) => {
            this.setState({ teams });
        });
        draftAPI.getPlayers().then((players: Player[]) => {
            this.setState({ players });
        });
        draftAPI.getPicks().then((picks: Pick[]) => {
            this.setState({ picks });
        });

        this.pusher = new Pusher('1c799ff10581875222b7', { 'cluster': 'mt1' });
        this.channel = this.pusher.subscribe('draftedPlayers');
        this.channel.bind('playerDrafted', (data: any) => {
            console.log("playerDrafted notification received", data);
            toast.success(data[2].player + " was picked by " + data[2].owner);
            this.setState({ showPickbar: false, picks: data }, () => {
                this.processPicks();
            });
        });
    }

    componentWillUnmount() {
        if (this.channel) {
            this.channel.unbind_all();
        }
        if (this.pusher) {
            this.pusher.unsubscribe('draftedPlayers');
        }
    }

    processPicks() {
        let { picks, players } = this.state;

        var pickHasChanged = false;

        // this.currentRound = picks[0].round;
        // this.currentPickNo = this.calculatePickNumber(picks[0].round,
        //     picks[0].pick);
        if (this.currentPick !== picks[0].pick) {
            pickHasChanged = true;
            this.currentPick = picks[0].pick;
            //this.pickTimerStart = new Date(picks[2].picktime).getTime();
        }

        // this.currentTeamID = parseInt(picks[0].fantasyteam_id);
        // for (var i = 0; i < this.teams.length; i++) {
        //     var team = this.teams[i];
        //     if (team.id == this.currentTeamID) {
        //         this.currentTeam = team;
        //         break;
        //     }
        // }

        //this.nextTeamID = parseInt(picks[1].fantasyteam_id);

        /* console.log('currentRound = ' + currentRound +
         ' currentPick = ' + currentPick +
         " pickHasChanged = " + pickHasChanged);
         console.log('just drafted player_id = ' + picks[2].player_id);
         console.log('players.length = ' + players.length); */

        // loop through picks and update the players array with new picks
        var found = 0;
        if (pickHasChanged) {
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (picks[2] && player.id === picks[2].player_id) {
                    found++;
                    player.fantasyteam_id = parseInt(picks[2].fantasyteam_id);
                    player.round = picks[2].round;
                    player.pick = picks[2].pick;
                    player.pickNo = picks[2].pickNo;
                    player.fantasyteam = picks[2].fantasyteam;
                    player.owner = picks[2].owner;
                    //console.log('player matched for just drafted');
                } else {
                    if (picks[3] && player.id === picks[3].player_id) {
                        found++;
                        player.fantasyteam_id = parseInt(picks[3].fantasyteam_id);
                        player.round = picks[3].round;
                        player.pick = picks[3].pick;
                        player.pickNo = picks[3].pickNo;
                        player.fantasyteam = picks[3].fantasyteam;
                        player.owner = picks[3].owner;
                        //console.log('player previous matched');
                    }
                }
                if (found === 2) {
                    break;
                }
            }
            this.setState({ showPickbar: true });
        }
    }

    public render() {
        const { teams, players, picks } = this.state;
        return (
            <>
                <Navigation />
                <Routes>
                    <Route path="/draft2">
                        <Route path="/draft2/teams"
                            element={<Teams teams={teams} />} />
                        <Route path="/draft2/players"
                            element={<Players players={players} teams={teams} picks={picks} />} />
                        <Route path="*" element={<Teams teams={teams} />} />
                    </Route>
                </Routes>
                <Picks picks={picks} />
                <ToastContainer theme="colored" />
            </>
        );
    }
}

export default App;
