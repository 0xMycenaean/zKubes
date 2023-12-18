import { Colors, Puzzles } from "../test/data/puzzles.types";
import { writeFileSync } from "fs";
import path from "path";
const puzzles: Puzzles = require("../test/data/puzzles.json");

export function stack(column: Array<Colors>, color: Colors): Array<Colors> {
  // Find the index of the first zero element
  const firstZeroIndex = column.indexOf(0);

  // Replace the zero immediately following the last non-zero element
  if (firstZeroIndex > 0 && firstZeroIndex < column.length) {
    let newArr = [...column];
    newArr[firstZeroIndex] = color;
    return newArr;
  }

  // Return the original array if no replacement is needed
  return column;
}

export function stackGrid(
  grid: Array<Array<Colors>>,
  color: Colors
): Array<Array<Colors>> {
  return grid.map((col) => stack(col, color));
}

function stackPuzzles(obj: Puzzles) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key].stack = obj[key].initial.map((col) => stack(col, 1));
    }
  }

  writeFileSync(
    path.join(__dirname, "../test/data/puzzles.json"),
    JSON.stringify(obj, null, 2)
  );
}

stackPuzzles(puzzles);
