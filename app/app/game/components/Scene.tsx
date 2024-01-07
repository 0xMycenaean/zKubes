import { useContext, useEffect, useState } from "react";
import { PuzzleContext } from "./Puzzle";
import { Grid } from "./Grid";
import { idToMutator } from "../Puzzles";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import styles from "../styles/puzzle.module.scss";

export function Scene() {
	const [grids, setGrids] = useState<number[][][]>([]);
	const { initConfig, functions } = useContext(PuzzleContext);
	const { startingGrid, finalGrid, availableFunctions } = initConfig;

	const xGap = 10 / (availableFunctions.length + 1);
	let xPos = -5;
	const gridElements = grids.map((grid, index) => {
		xPos += xGap;
		return <Grid key={index} grid={grid} position={{ x: xPos, y: 0, z: 0 }} />;
	});

	useEffect(() => {
		setGrids([]);
		const mutatedGrids: number[][][] = [];
		functions.chosen.forEach((functionId, index) => {
			if (index == 0) {
				const grid = idToMutator[functionId](startingGrid);
				mutatedGrids.push(grid);
			} else {
				const grid = idToMutator[functionId](mutatedGrids[index - 1]);
				mutatedGrids.push(grid);
			}
		});
		setGrids(mutatedGrids);
	}, [functions]);

	return (
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
				<Grid grid={startingGrid} position={{ x: -5, y: 0, z: 0 }} />
				{gridElements}
				<Grid grid={finalGrid} position={{ x: 5, y: 0, z: 0 }} />
			</Canvas>
		</div>
	);
}
