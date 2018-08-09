export class FantasyTeam {

    public id: number;
    public name: string;
    public owner: string;
    public draftorder: number;

}

export class Player {

    public id: number;
    public firstname: string;
    public lastname: string;
    public pick: number;
    public points: number;
    public position: string;
    public rank: number;
    public round: number;
    public team: string;
    public url: string;
    public fantasyteam: string;
    public owner: string;
    public fantasyteamID: string;
    public picktime: string;
    public avgpick: number;
    public byeweek: number;

}
