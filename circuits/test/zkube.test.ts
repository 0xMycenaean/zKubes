import { assert } from 'chai';
import { gridMutator } from '../utils/gridMutator';
import { CircuitFunctions, Puzzles } from '../types/circuitFunctions.types';
import { WasmTester, wasm } from 'circom_tester';
import path from 'path';
import { calculateLabeledWitness } from './utils/calculateLabeledWitness';
import config from '../config';
import { getCircuitFunctionIndex } from '../utils/circuitFunctionGetter';
const puzzles: Puzzles = require('./data/puzzles.json');

describe.only('zkube circuit', () => {
  let circuit: WasmTester;

  const sanityCheck = true;
  const address = '0x123';
  const initialGrid = puzzles[0.3].initial;
  const availableFunctionsCircuit = getCircuitFunctionIndex(
    puzzles[0.3].availableFunctions
  );
  const levels: { lvl: string; args: CircuitFunctions[] }[] = [
    {
      lvl: '0.1',
      args: ['TRANSFORM_YELLOW_RED', 'STACK_RED', 'TRANSFORMTWO_RED_BLUE_RED'],
    },
    {
      lvl: '0.2',
      args: ['STACK_RED', 'EMPTY', 'EMPTY'],
    },
    {
      lvl: '0.3',
      args: [
        'STACK_RED',
        'TRANSFORM_YELLOW_RED',
        'TRANSFORMTWO_RED_RED_YELLOW',
      ],
    },
    {
      lvl: '0.4',
      args: [
        'TRANSFORM_YELLOW_BLUE',
        'STACK_RED',
        'TRANSFORMTWO_BLUE_RED_YELLOW',
      ],
    },
  ];

  before(async () => {
    circuit = await wasm(path.join(__dirname, '../circuits/zkube.circom'));
  });

  it('produces a witness with valid constraints', async () => {
    const targetGrid = gridMutator(initialGrid, [
      'TRANSFORM_YELLOW_RED',
      'STACK_RED',
      'TRANSFORMTWO_RED_BLUE_RED',
    ]);
    const circuitFunctionArguments = getCircuitFunctionIndex([
      'TRANSFORM_YELLOW_RED',
      'STACK_RED',
      'TRANSFORMTWO_RED_BLUE_RED',
    ]);

    const witness = await circuit.calculateWitness(
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        availableFunctions: availableFunctionsCircuit,
        account: address,
        selectedFunctionsIndexes: circuitFunctionArguments,
      },
      sanityCheck
    );

    await circuit.checkConstraints(witness);
  });

  it('has expected witness values', async () => {
    const targetGrid = gridMutator(initialGrid, [
      'TRANSFORM_YELLOW_RED',
      'STACK_RED',
      'EMPTY',
    ]);
    const circuitFunctionArguments = getCircuitFunctionIndex([
      'TRANSFORM_YELLOW_RED',
      'STACK_RED',
      'EMPTY',
    ]);

    const witness = await calculateLabeledWitness(
      circuit,
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        availableFunctions: availableFunctionsCircuit,
        account: address,
        selectedFunctionsIndexes: circuitFunctionArguments,
      },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.finalGridForPlayer[${i}][${j}]`,
          String(targetGrid[i][j])
        );
      }
    }
  });

  it('produces expected witness values', async () => {
    const targetGrid = gridMutator(initialGrid, [
      'TRANSFORM_YELLOW_RED',
      'STACK_RED',
      'TRANSFORMTWO_RED_BLUE_RED',
    ]);

    const circuitFunctionArguments = getCircuitFunctionIndex([
      'TRANSFORM_YELLOW_RED',
      'STACK_RED',
      'TRANSFORMTWO_RED_BLUE_RED',
    ]);

    const witness = await calculateLabeledWitness(
      circuit,
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        availableFunctions: availableFunctionsCircuit,
        account: address,
        selectedFunctionsIndexes: circuitFunctionArguments,
      },
      sanityCheck
    );

    assert.notPropertyVal(
      witness,
      'main.finalGridForPlayer[0][4]',
      String(targetGrid[0][3])
    );
  });

  it('reverts for selectedFunctionIndexes greater than 27', async () => {
    const targetGrid = gridMutator(initialGrid, [
      'TRANSFORM_YELLOW_RED',
      'STACK_RED',
      'TRANSFORMTWO_RED_BLUE_RED',
    ]);

    const witnessPromise = calculateLabeledWitness(
      circuit,
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        account: address,
        availableFunctions: availableFunctionsCircuit,
        selectedFunctionsIndexes: [
          [0, 0, 45],
          [1, 0, 0],
          [2, 0, 0],
        ],
      },
      sanityCheck
    );

    try {
      await witnessPromise;
      assert.fail('Expected an error but did not get one');
    } catch (error: any) {
      const expectedPattern = /Error in template ZKube/;
      assert.match(error, expectedPattern);
    }
  });

  it('reverts for a negative value in selectedFunctionIndexes', async () => {
    const targetGrid = gridMutator(initialGrid, [
      'TRANSFORM_YELLOW_RED',
      'STACK_RED',
      'TRANSFORMTWO_RED_BLUE_RED',
    ]);

    const witnessPromise = calculateLabeledWitness(
      circuit,
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        availableFunctions: availableFunctionsCircuit,
        account: address,
        selectedFunctionsIndexes: [
          [1, 0, 0],
          [1, 0, 0],
          [-1, 0, 0],
        ],
      },
      sanityCheck
    );

    try {
      await witnessPromise;
      assert.fail('Expected an error but did not get one');
    } catch (error: any) {
      const expectedPattern = /Error in template ZKube/;
      assert.match(error.message, expectedPattern);
    }
  });

  levels.forEach(({ lvl, args }) => {
    it(`witness values for level ${lvl} equals values returned for arguments ${args}`, async () => {
      const initialGrid = puzzles[lvl].initial;
      const targetGrid = gridMutator(initialGrid, [...args]);

      const circuitFunctionArguments = getCircuitFunctionIndex([...args]);

      const witness = await calculateLabeledWitness(
        circuit,
        {
          initialGrid,
          finalGrid: targetGrid,
          availableFunctions: availableFunctionsCircuit,
          account: address,
          selectedFunctionsIndexes: circuitFunctionArguments,
        },
        sanityCheck
      );

      for (let i = 0; i < config.gridWidth; i++) {
        for (let j = 0; j < config.gridHeight; j++) {
          assert.propertyVal(
            witness,
            `main.finalGridForPlayer[${i}][${j}]`,
            String(targetGrid[i][j])
          );
        }
      }
    });
  });
});
