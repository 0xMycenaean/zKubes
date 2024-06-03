import {
  CircuitFunctions,
  Colors,
} from 'circuits/types/circuitFunctions.types';
import { Dispatch, SetStateAction } from 'react';

// all can be casted to BigInt
export type StringNumberBI = string | number | bigint;

export enum PuzzleFunctionState {
  remaining = 'remaining',
  chosen = 'chosen',
  available = 'available',
}

export type PuzzleFunctions = Record<PuzzleFunctionState, CircuitFunctions[]>;

export type PuzzleContext = {
  initConfig: Puzzle;
  functions: PuzzleFunctions;
  setFunctions: Dispatch<SetStateAction<PuzzleFunctions>>;
};

export type Puzzle = {
  initialGrid: Colors[][];
  finalGrid: Colors[][];
  availableFunctions: CircuitFunctions[];
};

export type OnChainPuzzle = {
  startingGrid: string;
  finalGrid: string;
  availableFunctions: number[];
};
