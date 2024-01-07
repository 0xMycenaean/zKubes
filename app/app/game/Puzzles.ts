import { stack, transform } from './components/Mutators';

export const functionMapping: Record<number, string> = {
  1: 'transform(yellow, red)',
  2: 'transform(yellow, blue)',
  3: 'transform(red, yellow)',
  4: 'transform(red, blue)',
  5: 'transform(blue, red)',
  6: 'transform(blue, yellow)',
  7: 'stack(yellow)',
  8: 'stack(red)',
  9: 'stack(blue)',
  10: 'reverse()',
};

export const idToMutator: Record<number, (grid: number[][]) => number[][]> = {
  2: (grid: number[][]) => transform(grid, 1, 3),
  3: (grid: number[][]) => transform(grid, 2, 1),
  4: (grid: number[][]) => transform(grid, 2, 3),
  6: (grid: number[][]) => transform(grid, 3, 1),
  7: (grid: number[][]) => stack(grid, 1),
  8: (grid: number[][]) => stack(grid, 2),
  9: (grid: number[][]) => stack(grid, 3),
};

export const puzzleMapping = {
  0: {
    startingGrid:
      '1000000010000000100000001000000010000000100000001000000010000000',
    finalGrid:
      '1231000012310000123100001231000012310000123100001231000012310000',
    availableFunctions: [7, 8, 9],
  },
  1: {
    startingGrid:
      '1000000010000000100000001000000010000000100000001000000010000000',
    finalGrid:
      '1110000011100000111000001110000011100000111000001110000011100000',
    availableFunctions: [8, 9, 3, 6],
  },
  2: {
    startingGrid:
      '2000000020000000200000002000000020000000200000002000000020000000',
    finalGrid:
      '2222000022220000222200002222000022220000222200002222000022220000',
    availableFunctions: [7, 8, 9, 3, 6],
  },
  3: {
    startingGrid:
      '3000000030000000300000003000000030000000300000003000000030000000',
    finalGrid:
      '2232000022320000223200002232000022320000223200002232000022320000',
    availableFunctions: [7, 8, 9, 2],
  },
};
