import * as React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import "./App.css";
import {Navigation} from "./components/Navigation";
import {Teams} from "./components/Teams";
import {Players} from "./components/Players";


class App extends React.Component {

    public render() {
        return (
            <BrowserRouter>
                <div>
                    <Navigation/>
                    <Switch>
                        <Route exact={true} path="/teams" component={Teams}/>
                        <Route exact={true} path="/players" component={Players}/>
                        <Redirect to="/teams"/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
