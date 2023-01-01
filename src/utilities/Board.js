export const cloneBoardState = (boardState) => {
  const tempBoardState = boardState.map((piece) =>
    piece.clone()
  );

  return tempBoardState
};
