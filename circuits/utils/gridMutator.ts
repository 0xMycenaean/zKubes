import { Colors } from "../test/data/puzzles.types";
import { stackGrid } from "./stack";
import { transformGrid } from "./transform";
import { transformTwoGrid } from "./transformTwo";
import { CircuitFunctions } from "./enums/circuitFunctions.enum";

type ArgumentColor = "YELLOW" | "RED" | "BLUE";

function selectColor(color: ArgumentColor) {
  return color === "YELLOW"
    ? Colors.Yellow
    : color === "RED"
    ? Colors.Red
    : Colors.Blue;
}

export function gridMutator(
  grid: Array<Array<Colors>>,
  args: (keyof typeof CircuitFunctions)[]
) {
  if (args.length === 0) return grid;

  const splitAtguments = args[0].split("_");
  const mutator = splitAtguments[0];
  const colorIn = selectColor(splitAtguments[1] as ArgumentColor);
  //manipulate grid with calls to transformGrid, stackGrid, and/or transformTwoGrid
  switch (mutator) {
    case "TRANSFORM": {
      const colorOut = selectColor(splitAtguments[2] as ArgumentColor);
      return gridMutator(transformGrid(grid, colorIn, colorOut), args.slice(1));
    }
    case "STACK": {
      return gridMutator(stackGrid(grid, colorIn), args.slice(1));
    }
    case "TRANSFORMTWO": {
      const colorOut = selectColor(splitAtguments[2] as ArgumentColor);
      return gridMutator(
        transformTwoGrid(grid, colorIn, colorOut),
        args.slice(1)
      );
    }
    default: {
      return grid;
    }
  }
}
