export class FantasyTeam {

    public id: number = 0;
    public name: string = "";
    public owner: string = "";
    public draftorder: number = 0;

}

export class Player {

    public id: number = 0;
    public firstname: string = "";
    public lastname: string = "";
    public pick: number = 0;
    public points: number = 0;
    public position: string = "";
    public rank: number = 0;
    public round: number = 0;
    public team: string = "";
    public url: string = "";
    public fantasyteam: string = "";
    public owner: string = "";
    public fantasyteam_id: number = 0;
    public picktime: string = "";
    public avgpick: number = 0;
    public byeweek: number = 0;

}
