import { puzzleMapping } from "../Puzzles";
import { Puzzle } from "./Puzzle";

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

export function Game() {
	return (
		<Puzzle
			startingGrid={mapGrid(mockPuzzle.startingGrid)}
			finalGrid={mapGrid(mockPuzzle.finalGrid)}
			availableFunctions={mockPuzzle.availableFunctions}
		/>
	);
}
