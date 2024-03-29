// Models
import Board from "models/Board";
import Position from "models/Position";
import Player from 'models/Player';
import Piece from 'models/Pieces/Piece';
import King from 'models/Pieces/King';
import Rook from 'models/Pieces/Rook';
import Pawn from 'models/Pieces/Pawn';

// Enums
import { PieceType } from 'enums/PieceType';
import { TeamType } from 'enums/TeamType';

export const PLAYERS = [new Player(TeamType.WHITE), new Player(TeamType.BLACK)];

export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const GRID_SIZE = 100;

export const initialBoard = new Board([
  new Pawn(new Position(0, 1), TeamType.WHITE),
  new Pawn(new Position(1, 1), TeamType.WHITE),
  new Pawn(new Position(2, 1), TeamType.WHITE),
  new Pawn(new Position(3, 1), TeamType.WHITE),
  new Pawn(new Position(4, 1), TeamType.WHITE),
  new Pawn(new Position(5, 1), TeamType.WHITE),
  new Pawn(new Position(6, 1), TeamType.WHITE),
  new Pawn(new Position(7, 1), TeamType.WHITE),

  new Pawn(new Position(0, 6), TeamType.BLACK),
  new Pawn(new Position(1, 6), TeamType.BLACK),
  new Pawn(new Position(2, 6), TeamType.BLACK),
  new Pawn(new Position(3, 6), TeamType.BLACK),
  new Pawn(new Position(4, 6), TeamType.BLACK),
  new Pawn(new Position(5, 6), TeamType.BLACK),
  new Pawn(new Position(6, 6), TeamType.BLACK),
  new Pawn(new Position(7, 6), TeamType.BLACK),

  new Rook(new Position(0, 0), TeamType.WHITE, true),
  new Rook(new Position(7, 0), TeamType.WHITE, true),
  new Piece(new Position(1, 0), PieceType.KNIGHT, TeamType.WHITE),
  new Piece(new Position(6, 0), PieceType.KNIGHT, TeamType.WHITE),
  new Piece(new Position(2, 0), PieceType.BISHOP, TeamType.WHITE),
  new Piece(new Position(5, 0), PieceType.BISHOP, TeamType.WHITE),
  new King(new Position(3, 0), TeamType.WHITE, true),
  new Piece(new Position(4, 0), PieceType.QUEEN, TeamType.WHITE),

  new Rook(new Position(0, 7), TeamType.BLACK, true),
  new Rook(new Position(7, 7), TeamType.BLACK, true),
  new Piece(new Position(1, 7), PieceType.KNIGHT, TeamType.BLACK),
  new Piece(new Position(6, 7), PieceType.KNIGHT, TeamType.BLACK),
  new Piece(new Position(2, 7), PieceType.BISHOP, TeamType.BLACK),
  new Piece(new Position(5, 7), PieceType.BISHOP, TeamType.BLACK),
  new King(new Position(3, 7), TeamType.BLACK, true),
  new Piece(new Position(4, 7), PieceType.QUEEN, TeamType.BLACK),
], PLAYERS[0]);
