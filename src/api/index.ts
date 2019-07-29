import {FantasyTeam, Player, Pick} from "../model";

const baseUrl = "";
let teams: FantasyTeam[];
let players: Player[];

const getFantasyTeams = (): Promise<FantasyTeam[]> => {
    const teamsUrl = baseUrl + "/api2/teams";
    if (teams) {
        return new Promise<FantasyTeam[]>((resolve) => {
            return resolve(teams)
        });
    } else {
        return fetch(teamsUrl, {credentials: "include"})
            .then((response) => {
                if (response.status === 404) {
                    return null;
                }
                return response.json();
            })
            .then((response: any): FantasyTeam[] => {
                teams = response as FantasyTeam[];
                console.log('teams fetched', teams);
                return teams;
            });
    }
};

const getPlayers = (): Promise<Player[]> => {
    const playersUrl = baseUrl + "/api2/players";
    if (players) {
        return new Promise<Player[]>((resolve) => {
            return resolve(players)
        });
    } else {
        return fetch(playersUrl, {credentials: "include"})
            .then((response) => {
                if (response.status === 404) {
                    return null;
                }
                return response.json();
            })
            .then((response: any): Player[] => {
                players = response as Player[];
                console.log('players fetched', players.length);
                return players;
            });
    }
};

const getPicks = (): Promise<Pick[]> => {
    const picksUrl = baseUrl + "/api2/picks";

    return fetch(picksUrl, {credentials: "include"})
        .then((response) => {
            if (response.status === 404) {
                return null;
            }
            return response.json();
        })
        .then((response: any): Pick[] => {
            let picks = response as Pick[];
            console.log('picks fetched', picks);
            return picks;
        });
};

export const draftAPI = {
    getFantasyTeams,
    getPlayers,
    getPicks,
};
