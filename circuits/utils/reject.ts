import { writeFileSync } from 'fs';
import path from 'path';
import { Colors, Puzzles } from '../types/circuitFunctions.types';
const puzzles: Puzzles = require('../test/data/puzzles.json');

export function reject(column: Array<Colors>, color: Colors): Array<Colors> {
  if (column.length === 1) return column;

  const [firstElement, ...restOfColumn] = column;
  const [elementToAddFirst, elementToAddLast] =
    firstElement === color ? [[], [0]] : [[firstElement], []];

  return [
    ...elementToAddFirst,
    ...reject(restOfColumn, color),
    ...elementToAddLast,
  ];
}

export function rejectGrid(
  grid: Array<Array<Colors>>,
  color: Colors
): Array<Array<Colors>> {
  return grid.map((col) => reject(col, color));
}
