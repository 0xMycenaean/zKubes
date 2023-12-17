"use client";
import { Canvas } from "@react-three/fiber";
import { Grid } from "./Grid";
import { useState } from "react";
import { Vector3 } from "three";
import styles from "../styles/puzzle.module.scss";
import { functionMapping, idToMutator } from "../Puzzles";

export function Puzzle({
	startingGrid,
	finalGrid,
	availableFunctions,
}: {
	startingGrid: number[][];
	finalGrid: number[][];
	availableFunctions: number[];
}) {
	const [grids, setGrids] = useState<number[][][]>([]);
	const [chosenFunctions, setChosenFunctions] = useState<number[]>([]);
	const [remainingFunctions, setRemainingFunctions] =
		useState<number[]>(availableFunctions);

	let xGap = 10 / (availableFunctions.length + 1);
	let xPos = -5;
	const gridElements = grids.map((grid, index) => {
		xPos += xGap;
		return <Grid key={index} grid={grid} position={{ x: xPos, y: 0, z: 0 }} />;
	});

	const remainingFunctionsElements = remainingFunctions.map(
		(functionId, index) => (
			<button
				key={index}
				onClick={() => {
					setRemainingFunctions((prev) => prev.toSpliced(index, 1));
					setChosenFunctions((prev) => prev.concat(functionId));
				}}>
				{functionMapping[functionId]}
			</button>
		)
	);

	const chosenFunctionsElements = chosenFunctions.map((functionId, index) => (
		<button
			key={index}
			onClick={() => {
				setChosenFunctions((prev) => prev.toSpliced(index, 1));
				setRemainingFunctions((prev) => prev.concat(functionId));
			}}>
			{functionMapping[functionId]}
		</button>
	));
    const mutatedGrids: number[][][] = []
    chosenFunctions.forEach((functionId, index) => {
        if (index == 0) {
            console.log("mutating starting grid")
            const grid = idToMutator[functionId](startingGrid)
            mutatedGrids.push(grid)
            console.log(startingGrid)
        }
        else {
            const grid = idToMutator[functionId](mutatedGrids[index - 1])
            mutatedGrids.push(grid)
        }
    })
    console.log(mutatedGrids)

	return (
		<div className={styles.Puzzle}>
			<div className={styles.canvasContainer}>
				<Canvas
					className={styles.canvas}
					orthographic
					camera={{
						position: new Vector3(0.5, 0.5, 1),
						left: -10,
						right: 10,
						top: 10,
						bottom: -10,
						zoom: 60,
						near: -20,
						far: 20,
					}}>
					<ambientLight intensity={Math.PI} />1
					<Grid
						grid={startingGrid}
						position={{ x: -5, y: 0, z: 0 }}
					/>
					{gridElements}
					<Grid grid={finalGrid} position={{ x: 5, y: 0, z: 0 }} />
				</Canvas>
			</div>

			<div className={styles.gameUI}>
				<div className={styles.availableFunctions}>
					{remainingFunctionsElements}
				</div>
				<div className={styles.chosenFunctions}>
					{chosenFunctionsElements}
				</div>
				<div className={styles.actions}>
					<button>submit solution</button>
				</div>
			</div>
		</div>
	);
}
