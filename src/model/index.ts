export class FantasyTeam {
  public id = 0;
  public name = '';
  public owner = '';
  public draftorder = 0;
}

export class Player {
  public id = 0;
  public firstname = '';
  public lastname = '';
  public pick = 0;
  public points = 0;
  public position = '';
  public rank = 0;
  public round = 0;
  public team = '';
  public url = '';
  public fantasyteam = '';
  public owner = '';
  public fantasyteam_id = 0;
  public picktime = '';
  public avgpick = 0;
  public byeweek = 0;
  public pickNo = 0;
  public nfl_status = '';
}

export class Pick {
  public fantasyteam = '';
  public fantasyteam_id = '';
  public owner = '';
  public player = '';
  public player_id = 0;
  public round = 0;
  public pick = 0;
  public picktime = '';
  public pickNo = 0;
}
