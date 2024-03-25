import { stackGrid } from './stack';
import { transformGrid } from './transform';
import { transformTwoGrid } from './transformTwo';
import { CircuitFunctions, Colors } from '../types/circuitFunctions.types';

type ArgumentColor = 'YELLOW' | 'RED' | 'BLUE';

function selectColor(color: ArgumentColor) {
  return color === 'YELLOW'
    ? Colors.Yellow
    : color === 'RED'
      ? Colors.Red
      : color === 'BLUE'
        ? Colors.Blue
        : Colors.White;
}

export function gridMutator(
  grid: Array<Array<Colors>>,
  args: CircuitFunctions[]
) {
  if (args.length === 0) return grid;

  const splitAtguments = args[0].split('_');
  const mutator = splitAtguments[0];
  const colorIn = selectColor(splitAtguments[1] as ArgumentColor);
  //manipulate grid with calls to transformGrid, stackGrid, and/or transformTwoGrid
  switch (mutator) {
    case 'TRANSFORM': {
      const colorOut = selectColor(splitAtguments[2] as ArgumentColor);
      return gridMutator(transformGrid(grid, colorIn, colorOut), args.slice(1));
    }
    case 'STACK': {
      return gridMutator(stackGrid(grid, colorIn), args.slice(1));
    }
    case 'TRANSFORMTWO': {
      const colorOutBot = selectColor(splitAtguments[2] as ArgumentColor);
      const colorOutTop = selectColor(splitAtguments[3] as ArgumentColor);
      return gridMutator(
        transformTwoGrid(grid, colorIn, colorOutBot, colorOutTop),
        args.slice(1)
      );
    }
    default: {
      return grid;
    }
  }
}
