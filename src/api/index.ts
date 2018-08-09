import {FantasyTeam} from "../model";

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

export const draftAPI = {
    getFantasyTeams,
};
