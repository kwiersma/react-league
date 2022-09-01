import * as React from "react";
import {Component} from "react";
import {FantasyTeam, Pick} from "../model";
import {Badge, ListGroup} from "react-bootstrap";
import FlipMove from "react-flip-move";

interface DraftOrderProps {
    teams: FantasyTeam[];
    picks: Pick[];
}

class PickRow {

    public rowType: string = "";
    public name: string = "";
    public roundPick: number = 0;
    public pickNo: number = 0;

}

export class DraftOrder extends Component<DraftOrderProps, {}> {

    setupPickRows(): PickRow[] {
        let {teams, picks} = this.props;

        let currentRound = 0;
        let currentPick = 1;
        if (picks && picks.length > 0) {
            currentRound = picks[0].round;
            currentPick = picks[0].pick;
        }
        let pickRows: PickRow[] = [];

        if (teams === undefined) {
            teams = [];
        }

        if (teams.length > 0 && currentRound > 0) {
            pickRows = this.generateRowsByRound(currentRound, currentPick, teams, pickRows);
            if (pickRows.length < 13) {
                pickRows = this.generateRowsByRound(currentRound + 1, 1, teams, pickRows);
            }
        }

        return pickRows;
    }

    generateRowsByRound(startRound: number, startRoundPick: number,
                        teams: FantasyTeam[], pickRows: PickRow[]): PickRow[] {
        var isOddRound: boolean = startRound % 2 === 1 || startRound === 0;

        var pickRow = new PickRow();
        pickRow.rowType = 'round';
        pickRow.name = 'Round ' + startRound;
        pickRows.push(pickRow);

        var i = 0;
        if (isOddRound) {
            i = startRoundPick - 1;
        } else {
            i = teams.length - startRoundPick;
        }
        var picksAdded = 1;
        while (i < teams.length && i >= 0 && pickRows.length < 13) {
            var team: FantasyTeam = teams[i];
            pickRow = new PickRow();
            pickRow.rowType = 'team';
            pickRow.name = team.name + " (" + team.owner + ")";
            pickRow.roundPick = startRoundPick + picksAdded;
            // Round 0 is keepers which don't have a pick no
            pickRow.pickNo = ((startRound - 1) * 10) + (pickRow.roundPick - 1);
            pickRows.push(pickRow);
            picksAdded++;
            if (isOddRound) {
                i++;
            } else {
                i--;
            }
        }

        return pickRows;
    }

    render() {
        const pickRows = this.setupPickRows();

        const teamRows = pickRows.map((row, idx) => {
            let itemStyle = {};
            let itemClass = "";
            let labelClass = "primary";
            let label = <></>;
            if (row.rowType !== 'round') {
                if (idx === 1) {
                    itemClass = "danger";
                    labelClass = "danger";
                } else if (idx === 2) {
                    itemClass = "warning";
                    labelClass = "warning";
                }
                label = (
                    <>
                        <Badge pill variant={labelClass}>{row.pickNo}.</Badge>
                        <span style={{paddingLeft: '5px'}}>
                            {row.name}
                        </span>
                    </>
                );
            } else {
                itemStyle = {color: 'white', backgroundColor: 'black'};
                label = (
                  <>
                      {row.name}
                  </>
                );
            }

            return (
                <ListGroup.Item key={idx} variant={itemClass} style={itemStyle}>
                    {label}
                </ListGroup.Item>
            );

        });

        return (
            <ListGroup>
                <FlipMove duration={750} easing="ease-out">
                    {teamRows}
                </FlipMove>
            </ListGroup>
        );
    }
}