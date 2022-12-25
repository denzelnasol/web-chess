export function samePosition(positionOne, positionTwo) {
  return positionOne.x === positionTwo.x && positionOne.y === positionTwo.y;
}

export function getPositionPointDifference(positionPointOne, positionPointTwo) {
  return positionPointOne - positionPointTwo;
}

export function sameColumn(positionOne, positionTwo) {
  return positionOne.x === positionTwo.x;
}

export function sameRow(positionOne, positionTwo) {
  return positionOne.y === positionTwo.y;
}
