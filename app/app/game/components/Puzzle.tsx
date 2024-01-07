"use client";
import { createContext, useState } from "react";
import styles from "../styles/puzzle.module.scss";
import { Actions } from "./Actions";
import {
	PuzzleFunctions,
	PuzzleContext as PuzzleContextType,
	PuzzleInit,
} from "@/types/Puzzle";
import { Scene } from "./Scene";

export const PuzzleContext = createContext<PuzzleContextType>({
	initConfig: { startingGrid: [], finalGrid: [], availableFunctions: [] },
	functions: { remaining: [], chosen: [] },
	setFunctions: () => {},
});

export function Puzzle(initConfig: PuzzleInit) {
	const [functions, setFunctions] = useState<PuzzleFunctions>({
		remaining: initConfig.availableFunctions,
		chosen: [],
	});

	return (
		<PuzzleContext.Provider
			value={{
				initConfig,
				functions,
				setFunctions,
			}}>
			<div className={styles.Puzzle}>
				<Scene />
				<Actions />
			</div>
		</PuzzleContext.Provider>
	);
}
