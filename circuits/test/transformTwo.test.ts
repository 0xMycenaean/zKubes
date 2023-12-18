import hre from "hardhat";
import { assert } from "chai";
import { CircuitTestUtils } from "hardhat-circom";
import { Colors, Puzzles } from "./data/puzzles.types";
import config from "../config";
import { transformTwo } from "../utils/transformTwo";
import { argumentBuilder } from "../utils/circuitFunctions";
const puzzles: Puzzles = require("./data/puzzles.json");

describe.only("transformtwo circuit", () => {
  let circuit: CircuitTestUtils;

  const sanityCheck = true;
  const initialGrid = puzzles[0.4].initial;

  before(async () => {
    circuit = await hre.circuitTest.setup("test/transformtwo_test");
  });

  it("produces a witness with valid constraints", async () => {
    const [onOff, inColor, outColor] = argumentBuilder(
      "TRANSFORMTWO_YELLOW_RED"
    );

    const witness = await circuit.calculateWitness(
      { grid: initialGrid, onOff, inColor, outColor },
      sanityCheck
    );

    await circuit.checkConstraints(witness);
  });

  it("has expected witness values for onOff == 1", async () => {
    const [onOff, inColor, outColor] = argumentBuilder(
      "TRANSFORMTWO_YELLOW_RED"
    );
    const witness = await circuit.calculateLabeledWitness(
      { grid: initialGrid, onOff, inColor, outColor },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.out[${i}][${j}]`,
          String(puzzles[0.1].transformTwo[i][j])
        );
      }
    }
  });

  it("has expected witness values for onOff == 0", async () => {
    const [inColor, outColor] = argumentBuilder("TRANSFORMTWO_YELLOW_RED");
    const witness = await circuit.calculateLabeledWitness(
      { grid: initialGrid, onOff: 0, inColor, outColor },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.out[${i}][${j}]`,
          String(initialGrid[i][j])
        );
      }
    }
  });

  it("produces expected witness values", async () => {
    const [onOff, inColor, outColor] = argumentBuilder(
      "TRANSFORMTWO_YELLOW_RED"
    );
    const witness = await circuit.calculateLabeledWitness(
      { grid: initialGrid, onOff, inColor, outColor },
      sanityCheck
    );

    assert.notPropertyVal(
      witness,
      "main.out[0][0]",
      String(puzzles[0.2].target[0][0])
    );
  });

  ["0.1", "0.2", "0.3", "0.4"].forEach((lvl: string) => {
    it(`transform witness values for level ${lvl} equals transform function return values`, async () => {
      const [onOff, inColor, outColor] = argumentBuilder(
        "TRANSFORMTWO_YELLOW_BLUE"
      );
      const witness = await circuit.calculateLabeledWitness(
        { grid: initialGrid, onOff, inColor, outColor },
        sanityCheck
      );

      for (let i = 0; i < config.gridWidth; i++) {
        const column = transformTwo(initialGrid[i], Colors.Yellow, Colors.Blue);

        for (let j = 0; j < config.gridHeight; j++) {
          assert.propertyVal(
            witness,
            `main.out[${i}][${j}]`,
            String(column[j])
          );
        }
      }
    });
  });
});
