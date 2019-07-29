import * as React from "react";
import {Component} from "react";
import {draftAPI} from "../api";
import {Pick} from "../model";

interface PicksProps {
    picks: Pick[];
}

export class Picks extends Component<PicksProps, {}> {

    renderPicks(picks: Pick[]) {
        return (
            <table id="picksTable">
                <tbody>
                <tr style={{verticalAlign: "top"}}>
                    <td style={{textAlign: "right"}}>
                        <span className="label label-danger">On the clock: </span>
                    </td>
                    <td>
                        {picks[0].fantasyteam} ({picks[0].owner})
                        (R {picks[0].round} P {picks[0].pick})
                    </td>
                    <td style={{textAlign: "right"}}>
                        <span className="label label-success">Last Pick: </span>
                    </td>
                    <td>{picks[2].player} by {picks[2].fantasyteam} ({picks[2].owner})</td>
                    <td rowSpan={2} align="center">
                        <p style={{color: "black", fontSize: "20px", fontWeight: "bold"}}
                           id="pickClock">0:00</p>
                        <span className="label label-danger">On the clock</span>
                    </td>
                </tr>
                <tr>
                    <td style={{textAlign: "right"}}>
                        <span className="label label-warning">On deck:</span>
                    </td>
                    <td>
                        {picks[1].fantasyteam} ({picks[1].owner})
                    </td>
                    <td style={{textAlign: "right"}}>
                        <span className="label label-success">Before Last Pick: </span>
                    </td>
                    <td>{picks[3].player} by {picks[3].fantasyteam} ({picks[3].owner})</td>
                </tr>
                </tbody>
            </table>
        )
    }

    public render() {
        const {picks} = this.props;

        let picksTable = <></>;
        if (picks.length > 0) {
            picksTable = this.renderPicks(picks);
        }

        return (
            <div className="navbar navbar-fixed-bottom alert alert-info pickbarAnimate"
                 style={{marginBottom: 0}}>
                {picksTable}
            </div>
        );
    }
}