// Note: This clones an array of Pieces representing a board state, not a Board itself.
export const cloneBoardState = (boardState) => {
  const tempBoardState = boardState.map((piece) =>
    piece.clone()
  );

  return tempBoardState
};
