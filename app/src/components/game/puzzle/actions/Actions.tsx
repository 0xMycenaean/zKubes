import { useCallback, useContext, useEffect, useState } from 'react';
import { PuzzleContext } from '../Puzzle';
import styles from '../../../../styles/actions.module.scss';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { PuzzleFunctionState } from '@/src/types/Puzzle';
import { InputSignals } from 'circuits/types/proof.types';
import { ZKUBE_PUZZLESET_ADDRESS } from '../../../../config';
import { useZkube } from '../../../../hooks/useContract';
import { getCircuitFunctionIndex } from 'circuits';
import Function from './Function';
import { ZKProof } from '../../../../types/Proof';
import { GenerateProof } from '../../../zk/generateProof';
import { usePrivyWalletAddress } from '../../../../hooks/usePrivyWalletAddress';
import { useChainId } from 'wagmi';
import { Tick } from './Tick';

export function Actions({
  gameId,
  puzzleId,
}: {
  gameId?: string;
  puzzleId?: string;
}) {
  const { functions, setFunctions, initConfig } = useContext(PuzzleContext);
  const address = usePrivyWalletAddress();
  const chainId = useChainId();
  const [inputSignals, setInputSignals] = useState<InputSignals>();
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(false);
  const { submitPuzzle, verifyPuzzleSolution } = useZkube();

  useEffect(() => {
    if (!address) return;

    setInputSignals({
      ...initConfig,
      account: address,
      selectedFunctionsIndexes: getCircuitFunctionIndex(functions.chosen),
      availableFunctionsIndexes: getCircuitFunctionIndex(functions.available),
    });
  }, [functions, address]);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId != destination.droppableId) {
      const sourceFunctionState = source.droppableId as PuzzleFunctionState;
      const destinationFunctionState =
        destination.droppableId as PuzzleFunctionState;
      const sourceFunctions = [...functions[sourceFunctionState]];
      const [removedFunction] = sourceFunctions.splice(source.index, 1);
      const destinationFunctions = [...functions[destinationFunctionState]];
      destinationFunctions.splice(destination.index, 0, removedFunction);
      setFunctions((prev) => ({
        ...prev,
        [sourceFunctionState]: sourceFunctions,
        [destinationFunctionState]: destinationFunctions,
      }));
    } else if (source.droppableId == destination.droppableId) {
      const functionState = source.droppableId as PuzzleFunctionState;
      const reorderedFunctions = functions[functionState];
      const [removedFunction] = reorderedFunctions.splice(source.index, 1);
      reorderedFunctions.splice(destination.index, 0, removedFunction);
      setFunctions((prev) => ({
        ...prev,
        [functionState]: reorderedFunctions,
      }));
    }
  }

  const submitPuzzleSolution = useCallback(
    (result: ZKProof) => {
      try {
        if (gameId && submitPuzzle) {
          submitPuzzle(BigInt(gameId), result).then((res) => {
            if (res) {
              setPuzzleSolved(true);
            }
          });
        }
        if (puzzleId && verifyPuzzleSolution) {
          verifyPuzzleSolution(
            ZKUBE_PUZZLESET_ADDRESS[chainId],
            BigInt(puzzleId!),
            result
          ).then((res) => {
            if (res) {
              setPuzzleSolved(true);
            }
          });
        }
      } catch (e) {
        console.error('Error submitting puzzle solution', e);
      }
    },
    [gameId, submitPuzzle, verifyPuzzleSolution]
  );

  return (
    <div className="flex flex-col px-2">
      <div className="mb-2 relative">
        {puzzleSolved && (
          <div className="flex absolute -top-16 right-14">
            <Tick />
            <div>
              <h2 className="text-2xl mt-2">Puzzle Solved</h2>
            </div>
          </div>
        )}
        <GenerateProof
          inputSignals={inputSignals}
          onResult={submitPuzzleSolution}
        />
      </div>
      <div className={styles.gameUI}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={PuzzleFunctionState.remaining}>
            {(provided) => (
              <div
                className="border border-black border-solid rounded-sm "
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {functions.remaining.map((funcName, i) => (
                  <Function
                    key={`${funcName}-${i}`}
                    elementType="remaining"
                    funcName={funcName}
                    index={i}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId={PuzzleFunctionState.chosen}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                className="border border-black  rounded-sm"
                {...provided.droppableProps}
              >
                {functions.chosen.map((funcName, i) => (
                  <Function
                    key={`${funcName}-${i}`}
                    elementType="chosen"
                    funcName={funcName}
                    index={i}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
