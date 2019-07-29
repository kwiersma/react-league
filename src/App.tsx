import * as React from "react";
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
}

class App extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);

        this.state = {
            teams: [],
            players: [],
            picks: []
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
    }

    public render() {
        const { teams, players, picks } = this.state;

        return (
            <BrowserRouter>
                <div>
                    <Navigation/>
                    <Switch>
                        <Route exact={true} path="/teams"
                               component={() => <Teams teams={teams}/>} />
                        <Route exact={true} path="/players"
                               component={() => <Players players={players} teams={teams}/>}/>
                        <Redirect to="/teams"/>
                    </Switch>
                    <Picks picks={picks}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
