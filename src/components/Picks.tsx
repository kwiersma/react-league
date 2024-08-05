import * as React from "react";
import {Component} from "react";
import {Pick} from "../model";
import {Badge, Navbar} from "react-bootstrap";

interface PicksProps {
    picks: Pick[];
}

interface PicksState {
    pickTimerStart: number;
}

export class Picks extends Component<PicksProps, PicksState> {

    constructor(props: PicksProps) {
        super(props);

        let startTime = new Date().getTime();
        this.state = {
            pickTimerStart: startTime
        }
    }

    renderPicks() {
        const {picks} = this.props;

        let pickTimerStart = 0;
        if (picks.length > 2) {
            pickTimerStart = new Date(this.props.picks[2].picktime).getTime();
        } else {
            pickTimerStart = new Date().getTime();
        }

        let lastPickCell = <td></td>;
        if (picks[2] !== undefined) {
            lastPickCell = <td>{picks[2].player} by {picks[2].fantasyteam} ({picks[2].owner})</td>;
        }
        let beforeLastCell = <td></td>;
        if (picks[3] !== undefined) {
            beforeLastCell = <td>{picks[3].player} by {picks[3].fantasyteam} ({picks[3].owner})</td>;
        }

        return (
            <table id="picksTable">
                <tbody>
                <tr style={{verticalAlign: "top"}}>
                    <td style={{textAlign: "right"}}>
                        <Badge bg="danger">On the clock: </Badge>
                    </td>
                    <td>
                        {picks[0].fantasyteam} ({picks[0].owner})
                        (R {picks[0].round} P {picks[0].pick})
                    </td>
                    <td style={{textAlign: "right"}}>
                        <Badge bg="success">Last Pick: </Badge>
                    </td>
                    {lastPickCell}
                    <td rowSpan={2} align="center">
                        <Timer startTime={pickTimerStart}/>
                        <Badge bg="danger">On the clock</Badge>
                    </td>
                </tr>
                <tr>
                    <td style={{textAlign: "right"}}>
                        <Badge bg="warning">On deck:</Badge>
                    </td>
                    <td>
                        {picks[1].fantasyteam} ({picks[1].owner})
                    </td>
                    <td style={{textAlign: "right"}}>
                        <Badge bg="success">Before Last Pick: </Badge>
                    </td>
                    {beforeLastCell}
                </tr>
                </tbody>
            </table>
        )
    }

    public render() {
        const {picks} = this.props;

        let picksTable = <></>;
        if (picks.length > 0) {
            picksTable = this.renderPicks();
        }

        return (
            <Navbar fixed="bottom" className={"pickbarAnimate alert alert-info"}
                    style={{marginBottom: 0}}>
                {picksTable}
            </Navbar>
        );
    }
}

interface TimerProps {
    startTime: number
}

interface TimerState {
    output: string;
}

class Timer extends React.Component<TimerProps, TimerState> {

    interval?: any;

    constructor(props: TimerProps) {
        super(props);

        this.state = {
            output: "0:00"
        }
    }

    componentDidMount(): void {
        this.startPickTimer();
    }

    componentWillUnmount(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = null;
    }

    componentDidUpdate(prevProps: Readonly<TimerProps>,
                       prevState: Readonly<TimerState>,
                       snapshot?: any): void {
        if (prevProps.startTime !== this.props.startTime) {
            this.startPickTimer();
        }
    }

    startPickTimer() {
        var time = new Date().getTime() - this.props.startTime;
        var elapsed = Math.floor(Math.abs(time) / 100) / 10;
        elapsed = Math.round(elapsed);

        var minutes = 0;
        var seconds = elapsed;
        if (elapsed >= 60) {
            minutes = Math.floor(elapsed / 60);
            seconds = elapsed - (minutes * 60);
        }
        var secondsStr: string = "";
        if (seconds < 10) {
            secondsStr = "0" + seconds.toString();
        } else {
            secondsStr = seconds.toString();
        }
        let output = minutes.toString() + ":" + secondsStr;
        this.setState({output}, () => {
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.interval = setInterval(() => {
                this.startPickTimer();
            }, 1000);
        });
    }

    render() {
        const {output} = this.state;
        return <p style={{fontSize: "20px", fontWeight: "bold"}}
                  id="pickClock">{output}</p>;
    }
}
