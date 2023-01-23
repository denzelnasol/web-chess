import React from "react";

// Enums
import { PieceType } from "enums/PieceType";
import { TeamType } from 'enums/TeamType';

// Styles
import './style.scss';

/**
 * @description Displays a checkmate modal
 * @param {Boolean} showCheckmateModal - Boolean to show modal
 * @param {Boolean} showStalemateModal - Boolean to display stalemate
 * @param {String} teamType - The winning team
 * @param {Function} resetBoard - Reset board to its default state
 *
 * @returns
 *
 * @example
 */
function CheckmateModal({ ...props }) {
  return (
    <div className={`checkmate-modal ${props.showCheckmateModal || props.showStalemateModal ? "" : "hidden"}`}>
      <div className="modal-body">
        <div className="game-end-text">
          {props.showStalemateModal ? 'STALEMATE' : `VICTORY FOR ${props.teamType.toUpperCase()}!`}
        </div>
        <div className="new-game-button">
          <button onClick={() => props.resetBoard()}>New Game</button>
        </div>
      </div>
    </div>
  );
}

export default CheckmateModal;