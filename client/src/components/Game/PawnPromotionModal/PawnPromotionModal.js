import React from "react";

// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';

// Styles
import './style.scss';

/**
 * @description Displays a pawn promotion modal
 * @param {Piece} promotionPawn - Callback function to update board on pawn promotion
 * @param {Boolean} showPawnPromotionModal - Boolean to show modal
 *
 * @returns
 *
 * @example
 */
function PawnPromotionModal({ ...props }) {
  const promotionTeamType = () => {
    return (props.promotionPawn?.teamType === TeamType.WHITE) ? TeamType.WHITE.toLowerCase() : TeamType.BLACK.toLowerCase();
  };

  return (
    <div className={`pawn-promotion-modal ${props.showPawnPromotionModal ? "" : "hidden"}`}>
      <div className="modal-body">
        <img onClick={() => props.promotePawn(PieceType.ROOK, false, props.promotionPawn)} src={`/images/${promotionTeamType()}-rook.png`} />
        <img onClick={() => props.promotePawn(PieceType.BISHOP, false, props.promotionPawn)} src={`/images/${promotionTeamType()}-bishop.png`} />
        <img onClick={() => props.promotePawn(PieceType.KNIGHT, false, props.promotionPawn)} src={`/images/${promotionTeamType()}-knight.png`} />
        <img onClick={() => props.promotePawn(PieceType.QUEEN, false, props.promotionPawn)} src={`/images/${promotionTeamType()}-queen.png`} />
      </div>
    </div>
  );
}

export default PawnPromotionModal;