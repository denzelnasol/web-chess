export default class MoveGeneration {
  constructor(board, currentPlayer) {
    this.board = board;
    this.currentPlayer = currentPlayer;
  }

  // moveGenerationTest = (depth) => {
  //   if (depth === 0) return 1;

  //   const moves = this.board.calculateAllMoves(this.currentPlayer.teamType);
  //   let numPositions = 0;
  //   for (const move in moves) {
  //     Board.makeMove(move);
  //     numPositions += moveGenerationTest(depth - 1);
  //     Board.unmakeMove(move);
  //   }

  //   return numPositions;
  // }

  // const moveGenerationTest = (depth, teamType) => {
  //   if (depth == 0) return 1;

  //   const allPlayerPossiblePieceMoves = board.getAllPlayerPossiblePieceMoves(teamType);
  //   let moves = 0;

  //   for (let i = 0; i < allPlayerPossiblePieceMoves.length; i++) {
  //     playMove(allPlayerPossiblePieceMoves[i].piece, allPlayerPossiblePieceMoves[i].move);
  //     moves += moveGenerationTest(depth - 1, getOppositeTeamType(teamType));
  //     // unplayMove();
  //   }
  //   return moves;
  // };

}
