type TeamLike = {
  id?: string;
  teamId?: string;
  team_id?: string;
  name?: string;
  province?: string | null;
  ownerRole?: string | null;
  emblemUrl?: string | null;
  avatarUrl?: string | null;
  rating?: number | null;
  raiting?: number | null;
  [key: string]: unknown;
};

type UserLike = {
  id?: string;
  email?: string;
  name?: string;
  avatarUrl?: string | null;
  team?: TeamLike | TeamLike[] | null;
  teams?: TeamLike[] | null;
  teamId?: string;
  team_id?: string;
  [key: string]: unknown;
};

const toTeamList = (value: unknown): TeamLike[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean) as TeamLike[];
  if (typeof value === "object") return [value as TeamLike];
  return [];
};

export const getUserTeams = (user: UserLike | null | undefined): TeamLike[] => {
  if (!user) return [];

  const teams = toTeamList(user.teams);
  if (teams.length > 0) return teams;

  return toTeamList(user.team);
};

export const getActiveTeam = (user: UserLike | null | undefined): TeamLike | undefined => {
  const teams = getUserTeams(user);

  if (teams.length > 0) return teams[0];

  if (!user || !user.team || Array.isArray(user.team)) return undefined;

  return user.team;
};

export const getActiveTeamId = (user: UserLike | null | undefined): string | undefined => {
  const activeTeam = getActiveTeam(user);

  return activeTeam?.id || activeTeam?.teamId || activeTeam?.team_id || user?.teamId || user?.team_id;
};

export const normalizeUser = <T extends UserLike>(user: T): T & {
  team?: TeamLike | null;
  teams?: TeamLike[];
} => {
  const teams = getUserTeams(user);
  const activeTeam = getActiveTeam(user);

  return {
    ...user,
    teams: teams.length > 0 ? teams : undefined,
    team: activeTeam ?? (user.team && !Array.isArray(user.team) ? user.team : undefined) ?? null,
  };
};