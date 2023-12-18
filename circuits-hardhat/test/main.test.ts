import hre from "hardhat";
import { CircuitTestUtils } from "hardhat-circom";
import { Puzzles } from "./data/puzzles.types";
import { argumentBuilderMain } from "../utils/circuitFunctions";
import { assert } from "chai";
import { gridMutator } from "../utils/gridMutator";
import { CircuitFunctions } from "../utils/enums/circuitFunctions.enum";
const puzzles: Puzzles = require("./data/puzzles.json");

describe.only("main circuit", () => {
  let circuit: CircuitTestUtils;

  const sanityCheck = true;
  const address = "0x123";
  const initialGrid = puzzles[0.3].initial;

  before(async () => {
    circuit = await hre.circuitTest.setup("main");
  });

  it("produces a witness with valid constraints", async () => {
    const targetGrid = gridMutator(initialGrid, [
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "TRANSFORMTWO_RED_BLUE",
    ]);

    const circuitFunctionArguments = argumentBuilderMain([
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "TRANSFORMTWO_RED_BLUE",
    ]);

    const witness = await circuit.calculateWitness(
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        account: address,
        selectedFunctions: circuitFunctionArguments,
      },
      sanityCheck
    );

    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const targetGrid = gridMutator(initialGrid, [
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "EMPTY",
    ]);

    const circuitFunctionArguments = argumentBuilderMain([
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "EMPTY",
    ]);

    const witness = await circuit.calculateLabeledWitness(
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        account: address,
        selectedFunctions: circuitFunctionArguments,
      },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.finishingGrid[${i}][${j}]`,
          String(targetGrid[i][j])
        );
      }
    }
  });

  it("produces expected witness values", async () => {
    const targetGrid = gridMutator(initialGrid, [
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "TRANSFORMTWO_RED_BLUE",
    ]);

    const circuitFunctionArguments = argumentBuilderMain([
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "TRANSFORMTWO_RED_BLUE",
    ]);

    const witness = await circuit.calculateLabeledWitness(
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        account: address,
        selectedFunctions: circuitFunctionArguments,
      },
      sanityCheck
    );

    assert.notPropertyVal(
      witness,
      "main.finishingGrid[0][4]",
      String(targetGrid[0][3])
    );
  });

  it("reverts for duplicated manipulation in same round", async () => {
    const targetGrid = gridMutator(initialGrid, [
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "TRANSFORMTWO_RED_BLUE",
    ]);

    const witnessPromise = circuit.calculateLabeledWitness(
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        account: address,
        selectedFunctions: [
          [
            [1, 1, 2],
            [0, 0, 0],
            [0, 0, 0],
          ],
          // Duplicate
          [
            [1, 1, 2],
            [1, 2, 0],
            [0, 0, 0],
          ],
          [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
        ],
      },
      sanityCheck
    );

    try {
      await witnessPromise;
      assert.fail("Expected an error but did not get one");
    } catch (error: any) {
      const expectedPattern = /Error in template ZKube/;
      assert.match(error, expectedPattern);
    }
  });

  it("reverts for a negative argument", async () => {
    const targetGrid = gridMutator(initialGrid, [
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "TRANSFORMTWO_RED_BLUE",
    ]);

    const witnessPromise = circuit.calculateLabeledWitness(
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        account: address,
        selectedFunctions: [
          [
            [1, -1, 2],
            [0, 0, 0],
            [0, 0, 0],
          ],
          [
            [0, 0, 0],
            [1, 2, 0],
            [0, 0, 0],
          ],
          [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
        ],
      },
      sanityCheck
    );

    try {
      await witnessPromise;
      assert.fail("Expected an error but did not get one");
    } catch (error: any) {
      const expectedPattern = /Error in template ZKube/;
      assert.match(error.message, expectedPattern);
    }
  });

  it("reverts for inactive function with non-zero arguments", async () => {
    const targetGrid = gridMutator(initialGrid, [
      "TRANSFORM_YELLOW_RED",
      "STACK_RED",
      "TRANSFORMTWO_RED_BLUE",
    ]);

    const witnessPromise = circuit.calculateLabeledWitness(
      {
        initialGrid: initialGrid,
        finalGrid: targetGrid,
        account: address,
        selectedFunctions: [
          [
            [1, -1, 2],
            [0, 0, 0],
            [0, 0, 0],
          ],
          [
            [0, 0, 0],
            [1, 2, 0],
            [0, 0, 0],
          ],
          [
            [0, 0, 0],
            [0, 0, 0],
            [0, 2, 3],
          ],
        ],
      },
      sanityCheck
    );

    try {
      await witnessPromise;
      assert.fail("Expected an error but did not get one");
    } catch (error: any) {
      const expectedPattern = /Error in template ZKube/;
      assert.match(error.message, expectedPattern);
    }
  });

  [
    {
      lvl: "0.1",
      args: [
        "TRANSFORM_YELLOW_RED",
        "STACK_RED",
        "TRANSFORMTWO_RED_BLUE",
      ] as (keyof typeof CircuitFunctions)[],
    },
    {
      lvl: "0.2",
      args: [
        "STACK_RED",
        "EMPTY",
        "EMPTY",
      ] as (keyof typeof CircuitFunctions)[],
    },
    {
      lvl: "0.3",
      args: [
        "STACK_RED",
        "TRANSFORM_YELLOW_RED",
        "TRANSFORMTWO_RED_YELLOW",
      ] as (keyof typeof CircuitFunctions)[],
    },
    {
      lvl: "0.4",
      args: [
        "TRANSFORM_YELLOW_BLUE",
        "STACK_RED",
        "TRANSFORMTWO_RED_YELLOW",
      ] as (keyof typeof CircuitFunctions)[],
    },
  ].forEach(
    ({
      lvl,
      args,
    }: {
      lvl: string;
      args: (keyof typeof CircuitFunctions)[];
    }) => {
      it(`witness values for level ${lvl} equals values returned for arguments ${args}`, async () => {
        const initialGrid = puzzles[lvl].initial;
        const targetGrid = gridMutator(initialGrid, [...args]);

        const circuitFunctionArguments = argumentBuilderMain([...args]);

        const witness = await circuit.calculateLabeledWitness(
          {
            initialGrid,
            finalGrid: targetGrid,
            account: address,
            selectedFunctions: circuitFunctionArguments,
          },
          sanityCheck
        );

        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            assert.propertyVal(
              witness,
              `main.finishingGrid[${i}][${j}]`,
              String(targetGrid[i][j])
            );
          }
        }
      });
    }
  );
});
