import * as React from "react";
import {Props} from "react";

import {draftAPI} from "./api";
import "./App.css";
import {FantasyTeam} from "./model";
import {Navigation} from "./components/Navigation";
import {Teams} from "./components/Teams";

interface IAppState {
    teams: FantasyTeam[];
    showAll: boolean;
}

class App extends React.Component<Props<any>, IAppState> {

    constructor(props: Props<any>) {
        super(props);

        this.state = {
            showAll: true,
            teams: [],
        };
    }

    public componentDidMount() {
        draftAPI.getFantasyTeams().then((teams: FantasyTeam[]) => {
            this.setState({teams});
        });
    }

    public render() {
        let {teams} = this.state;

        if (teams === undefined) {
            teams = [];
        }

        return (
            <div>
                <Navigation/>

                <Teams teams={teams}/>
            </div>
        );
    }
}

export default App;
