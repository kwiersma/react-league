import * as React from "react";
import Pusher from 'pusher-js';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import "./App.css";
import {Navigation} from "./components/Navigation";
import {Teams} from "./components/Teams";
import {Players} from "./components/Players";
import {Picks} from "./components/Picks";
import {FantasyTeam, Pick, Player} from "./model";
import {draftAPI} from "./api";

interface State {
    teams: FantasyTeam[];
    players: Player[];
    picks: Pick[];
    showPickbar: boolean;
}

class App extends React.Component<{}, State> {

    currentPick: number = 0;

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
            this.setState({teams});
        });
        draftAPI.getPlayers().then((players: Player[]) => {
            this.setState({players});
        });
        draftAPI.getPicks().then((picks: Pick[]) => {
            this.setState({picks});
        });

        const pusher = new Pusher('1c799ff10581875222b7', {'cluster': 'mt1'});
        const channel = pusher.subscribe('draftedPlayers');
        channel.bind('playerDrafted', (data) => {
            console.log("playerDrafted notification received", data);
            this.setState({showPickbar: false, picks: data}, () => {
                this.processPicks();
            });
        });
    }

    processPicks() {
        let {picks, players} = this.state;
        
        var pickHasChanged = false;

        // this.currentRound = picks[0].round;
        // this.currentPickNo = this.calculatePickNumber(picks[0].round,
        //     picks[0].pick);
        if (this.currentPick != picks[0].pick) {
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
                if (player.id == picks[2].player_id) {
                    found++;
                    player.fantasyteam_id = parseInt(picks[2].fantasyteam_id);
                    player.round = picks[2].round;
                    player.pick = picks[2].pick;
                    player.fantasyteam = picks[2].fantasyteam;
                    player.owner = picks[2].owner;
                    //console.log('player matched for just drafted');
                } else {
                    if (player.id == picks[3].player_id) {
                        found++;
                        player.fantasyteam_id = parseInt(picks[3].fantasyteam_id);
                        player.round = picks[3].round;
                        player.pick = picks[3].pick;
                        player.fantasyteam = picks[3].fantasyteam;
                        player.owner = picks[3].owner;
                        //console.log('player previous matched');
                    }
                }
                if (found == 2) {
                    break;
                }
            }
            this.setState({showPickbar: true});
            //TODO: playersQueryChanged();
        }
    }

    public render() {
        const { teams, players, picks } = this.state;

        return (
            <BrowserRouter>
                <div>
                    <Navigation/>
                    <Switch>
                        <Route exact={true} path="/teams"
                               render={() => <Teams teams={teams}/>} />
                        <Route exact={true} path="/players"
                               render={() => <Players players={players} teams={teams}/>}/>
                        <Redirect to="/teams"/>
                    </Switch>
                    <Picks picks={picks}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
