const puzzles: Puzzles = require('../test/data/puzzles.json');
import { Puzzles } from '../types/circuitFunctions.types';
import { gridMutator } from '../utils/gridMutator';
import { getCircuitFunctionIndex } from '../utils/circuitFunctionGetter';
import { writeFileSync } from 'fs';

export function generateCircuitInput() {
  const initialGrid = puzzles[0.3].initial;

  const targetGrid = gridMutator(initialGrid, [
    'TRANSFORM_YELLOW_RED',
    'STACK_RED',
    'TRANSFORMTWO_RED_BLUE_YELLOW',
  ]);

  const circuitFunctionArguments = getCircuitFunctionIndex([
    'TRANSFORM_YELLOW_RED',
    'STACK_RED',
    'TRANSFORMTWO_RED_BLUE_YELLOW',
  ]);

  const availableFunctionsCircuit = getCircuitFunctionIndex(
    puzzles[0.3].availableFunctions
  );
  const address = '0x123';

  const input = {
    initialGrid,
    finalGrid: targetGrid,
    availableFunctions: availableFunctionsCircuit,
    account: address,
    selectedFunctionsIndexes: circuitFunctionArguments,
  };

  writeFileSync('./zk/input.json', JSON.stringify(input));
  process.exit();
}
