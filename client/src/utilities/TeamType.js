// Enums
import { TeamType } from "enums/TeamType";

export function getOppositeTeamType(teamType) {
  return teamType === TeamType.BLACK ? TeamType.WHITE : TeamType.BLACK;
}