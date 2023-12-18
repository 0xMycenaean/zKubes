"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
// import { GenerateProof } from "./zk/generateProof";
// import { Proof } from "circuits";
import { functionMapping, idToGridFunction, puzzleMapping } from "./Puzzles";
import { Grid } from "./Grid";
import { GenerateProof } from "./zk/GenerateProof";
import { InputSignals, Proof } from "./zk/types";

const mockPuzzle = puzzleMapping[2];

export default function Game() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [proof, setProof] = useState<Proof | string>();
  const [inputSignals, setInputSignals] = useState<InputSignals>({
    initialGrid: [
      [1, 1, 2, 0, 0, 0, 0, 0],
      [1, 2, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 0, 0, 0, 0, 0, 0],
      [1, 1, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    finalGrid: [
      [1, 1, 1, 2, 0, 0, 0, 0],
      [1, 1, 2, 0, 0, 0, 0, 0],
      [1, 2, 0, 0, 0, 0, 0, 0],
      [1, 2, 0, 0, 0, 0, 0, 0],
      [1, 1, 2, 0, 0, 0, 0, 0],
      [1, 1, 1, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    account: "0x123",
    selectedFunctions: [
      [
        [1, 2, 1],
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
  });
  const [grid, setGrid] = useState<Grid>();
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    console.log(sceneRef.current);
    if (sceneRef.current && !grid) {
      setGrid(new Grid(sceneRef));
      setRendered(true);
    }
    if (grid) {
      grid.start();
      grid.initStartingGrid(mockPuzzle.startingGrid);
    }
  }, [sceneRef, rendered, grid]);

  return (
    <div className={styles.gameContainer}>
      <div ref={sceneRef} className={styles.sceneContainer} />
      <div className={styles.gameUI}>
        <div className={styles.availableFunctions}>
          {mockPuzzle.availableFunctions.map((id) => (
            <button onClick={() => (idToGridFunction as any)[id](grid)}>
              {(functionMapping as any)[id]}
            </button>
          ))}
        </div>
        <div className={styles.chosenFunctions}></div>
        <div className={styles.actions}>
          <GenerateProof
            inputSignals={inputSignals}
            onResult={(result) => setProof(result)}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <h4>
          Blocks Left
          <br />
          <span>100</span>
        </h4>
        <h4>
          Score <br />
          <span>5</span>
        </h4>
      </div>
    </div>
  );
}
