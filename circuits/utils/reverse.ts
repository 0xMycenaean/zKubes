import { Colors, Puzzles } from "../test/data/puzzles.types";
import { writeFileSync } from "fs";
import path from "path";
const puzzles: Puzzles = require("../test/data/puzzles.json");

function reverse(column: Array<Colors>): Array<Colors> {
  const splitIndex = column.indexOf(0);
  let reversedColumn: Array<Colors>;
  if (splitIndex === -1) {
    // doesn't make sense to do it recursively
    reversedColumn = [...column].reverse();
  } else {
    const firstPart = column.slice(0, splitIndex);
    const secondPart = column.slice(splitIndex);

    reversedColumn = [...firstPart.reverse(), ...secondPart];
  }

  return reversedColumn;
}

function reversePuzzles(obj: Puzzles) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key].reverse = obj[key].initial.map((col) => reverse(col));
    }
  }

  writeFileSync(
    path.join(__dirname, "../test/data/puzzles.json"),
    JSON.stringify(obj, null, 2)
  );
}

reversePuzzles(puzzles);
