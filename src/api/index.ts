import {FantasyTeam, Player} from "../model";

const baseUrl = "";

const getFantasyTeams = (): Promise<FantasyTeam[]> => {
    const teamsUrl = baseUrl + "/api2/teams";
    return fetch(teamsUrl, {credentials: "include"})
        .then((response) => {
            if (response.status === 404) {
                return null;
            }
            return response.json();
        })
        .then((response: any): FantasyTeam[] => {
            return response as FantasyTeam[];
        });
};

const getPlayers = (): Promise<Player[]> => {
    const playersUrl = baseUrl + "/api2/players";
    return fetch(playersUrl, {credentials: "include"})
        .then((response) => {
            if (response.status === 404) {
                return null;
            }
            return response.json();
        })
        .then((response: any): Player[] => {
            return response as Player[];
        });
};

export const draftAPI = {
    getFantasyTeams,
    getPlayers,
};
