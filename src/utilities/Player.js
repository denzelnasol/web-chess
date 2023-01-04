import { TeamType } from "enums/TeamType"

export function otherPlayerTeamType(player) {
  return player.TeamType === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
}