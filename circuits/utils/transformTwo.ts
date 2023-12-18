import { Colors, Puzzles } from "../test/data/puzzles.types";
import { writeFileSync } from "fs";
import path from "path";
const puzzles: Puzzles = require("../test/data/puzzles.json");

export function transformTwo(
  column: Array<Colors>,
  inColor: Colors,
  outColor: Colors
): Array<Colors> {
  if (column.length === 0) {
    return column;
  }

  const { transformed, remaining } =
    column[0] === inColor
      ? {
          transformed: [column[0], outColor],
          remaining: column.slice(1, -1),
        }
      : { transformed: [column[0]], remaining: column.slice(1) };

  return [...transformed, ...transformTwo(remaining, inColor, outColor)];
}

export function transformTwoGrid(
  grid: Array<Array<Colors>>,
  inColor: Colors,
  outColor: Colors
): Array<Array<Colors>> {
  return grid.map((col) => transformTwo(col, inColor, outColor));
}

function transformTwoPuzzles(obj: Puzzles) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key].transformTwo = obj[key].initial.map((col) =>
        transformTwo(col, 1, 2)
      );
    }
  }

  writeFileSync(
    path.join(__dirname, "../test/data/puzzles.json"),
    JSON.stringify(obj, null, 2)
  );
}

transformTwoPuzzles(puzzles);
