import { TeamType } from "enums/TeamType";

export default class Referee {
  isValidMove(px, py, x, y, type, teamType) {
    console.log(`Previous Location: (${px},${py})`);
    console.log(`Current Location: (${x},${y})`);
    console.log(`Piece Type: ${type}`);
    console.log(`Tean Type: ${teamType}`);

    if (type === 'pawn') {
      if (teamType === TeamType.WHITE) {
        if (py === 1) {
          if (px === x && (y - py === 1 || y - py === 2)) {
            console.log('VALID MOVE')
            return true;
          }
        } else {
          if (px === x && y - py === 1) {
            console.log('PIECE TAKEN');
            return true;
          }
        }
      }
    }
    return false;
  }
}