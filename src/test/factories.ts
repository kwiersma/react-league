import { FantasyTeam, Pick, Player } from '../model';

export function createFantasyTeam(overrides: Partial<FantasyTeam> = {}): FantasyTeam {
  const team = new FantasyTeam();
  return Object.assign(team, {
    id: 1,
    name: 'Team A',
    owner: 'Owner A',
    draftorder: 1,
    ...overrides,
  });
}

export function createPlayer(overrides: Partial<Player> = {}): Player {
  const player = new Player();
  return Object.assign(player, {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    pick: 0,
    points: 100,
    position: 'QB',
    rank: 1,
    round: 0,
    team: 'KC',
    url: 'http://example.com/player/1',
    fantasyteam: '',
    owner: '',
    fantasyteam_id: 0,
    picktime: '',
    avgpick: 1.5,
    byeweek: 6,
    pickNo: 0,
    nfl_status: '',
    ...overrides,
  });
}

export function createPick(overrides: Partial<Pick> = {}): Pick {
  const pick = new Pick();
  return Object.assign(pick, {
    fantasyteam: 'Team A',
    fantasyteam_id: '1',
    owner: 'Owner A',
    player: '',
    player_id: 0,
    round: 1,
    pick: 1,
    picktime: '',
    pickNo: 0,
    ...overrides,
  });
}

export function createTeamsList(count: number): FantasyTeam[] {
  const names = [
    'Team A',
    'Team B',
    'Team C',
    'Team D',
    'Team E',
    'Team F',
    'Team G',
    'Team H',
    'Team I',
    'Team J',
  ];
  const owners = [
    'Owner A',
    'Owner B',
    'Owner C',
    'Owner D',
    'Owner E',
    'Owner F',
    'Owner G',
    'Owner H',
    'Owner I',
    'Owner J',
  ];
  return Array.from({ length: count }, (_, i) =>
    createFantasyTeam({
      id: i + 1,
      name: names[i] || `Team ${i + 1}`,
      owner: owners[i] || `Owner ${i + 1}`,
      draftorder: i + 1,
    }),
  );
}
