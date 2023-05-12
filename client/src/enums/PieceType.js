export const PieceType =
  Object.freeze({
    PAWN: 'PAWN',
    BISHOP: 'BISHOP',
    KNIGHT: 'KNIGHT',
    ROOK: 'ROOK',
    QUEEN: 'QUEEN',
    KING: 'KING',
  });

export const PIECE_TYPE_TO_LETTER = {
  [PieceType.PAWN]: "P",
  [PieceType.KNIGHT]: "N",
  [PieceType.BISHOP]: "B",
  [PieceType.ROOK]: "R",
  [PieceType.QUEEN]: "Q",
  [PieceType.KING]: "K"
};

export const LETTER_TO_PIECE_TYPE = Object.fromEntries(
  Object.entries(PIECE_TYPE_TO_LETTER).map(([key, value]) => [value, key])
);