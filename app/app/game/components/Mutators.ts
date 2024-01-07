// we have to do this to get a real copy of the array
function getNewCopy(grid: number[][]): number[][] {
  const newGrid: number[][] = [];
  const numberOfColumns = grid.length;
  for (let i = 0; i < numberOfColumns; i++) {
    const columnLength = grid[i].length;
    newGrid.push([]);
    for (let j = 0; j < columnLength; j++) {
      newGrid[i].push(grid[i][j]);
    }
  }
  return newGrid;
}

export function stack(grid: number[][], colour: number): number[][] {
  // if transparent, change to colour
  const newGrid = getNewCopy(grid);
  for (const [columnIndex, column] of newGrid.entries()) {
    for (const [cubeIndex, cube] of column.entries()) {
      if (cube == 0) {
        newGrid[columnIndex][cubeIndex] = colour;
        break;
      }
    }
  }
  return newGrid;
}

export function transform(
  grid: number[][],
  fromColour: number,
  toColour: number
): number[][] {
  const newGrid = getNewCopy(grid);
  for (const [columnIndex, column] of newGrid.entries()) {
    for (const [cubeIndex, cube] of column.entries()) {
      if (cube == fromColour) {
        newGrid[columnIndex][cubeIndex] = toColour;
      }
    }
  }
  return newGrid;
}
