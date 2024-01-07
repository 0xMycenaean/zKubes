import { Dispatch, SetStateAction } from "react";

export enum PuzzleFunctionState {
	remaining = "remaining",
	chosen = "chosen",
}

export type PuzzleFunctions = Record<PuzzleFunctionState, number[]>;

export type PuzzleContext = {
	initConfig: PuzzleInit;
	functions: PuzzleFunctions;
	setFunctions: Dispatch<SetStateAction<PuzzleFunctions>>;
};

export type PuzzleInit = {
	startingGrid: number[][];
	finalGrid: number[][];
	availableFunctions: number[];
};
