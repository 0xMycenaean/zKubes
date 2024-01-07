import { puzzleMapping } from '../Puzzles';
import { Puzzle } from './Puzzle';

type PuzzleInit = {
  startingGrid: string;
  finalGrid: string;
  availableFunctions: number[];
};

type Puzzle = {
  startingGrid: number[][];
  finalGrid: number[][];
  availableFunctions: number[];
};

const mockPuzzle = puzzleMapping[1];

function mapGrid(gridString: string): number[][] {
  const gridArray = Array.from(gridString);
  const grid: number[][] = [[], [], [], [], [], [], [], []];

  gridArray.forEach((value, index) => {
    const column = Math.floor(index / 8);
    grid[column].push(Number(value));
  });

  return grid;
}

function mapPuzzle(puzzle: PuzzleInit): Puzzle {
  return {
    startingGrid: mapGrid(puzzle.startingGrid),
    finalGrid: mapGrid(puzzle.finalGrid),
    availableFunctions: puzzle.availableFunctions,
  };
}

export function Game() {
  const puzzle = mapPuzzle(mockPuzzle);
  return (
    <Puzzle
      startingGrid={puzzle.startingGrid}
      finalGrid={puzzle.finalGrid}
      availableFunctions={puzzle.availableFunctions}
    />
  );
}
