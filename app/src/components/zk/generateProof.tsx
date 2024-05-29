import { useProof } from '../../hooks/useProof';
import { ZKProof } from '../../types/Proof';
import styles from '../../styles/actions.module.scss';
import { InputSignals } from 'circuits/types/proof.types';
import { useState } from 'react';

export function GenerateProof({
  inputSignals,
  onResult,
}: {
  inputSignals?: InputSignals;
  onResult: (proof: ZKProof) => void;
}) {
  const proofCallback = useProof('/zk/zkube.wasm', '/zk/zkube_final.zkey');
  const [generatingProof, setGenerationgProof] = useState(false);

  if (!inputSignals)
    return (
      <button disabled={true} className={styles.disabledButton}>
        Submit Solution
      </button>
    );

  const {
    initialGrid,
    finalGrid,
    account,
    selectedFunctionsIndexes,
    availableFunctionsIndexes,
  } = inputSignals;

  return (
    <button
      className="border-2 bg-black text-white border-black p-2 rounded-md w-full cursor-pointer font-bold"
      disabled={
        !initialGrid ||
        !finalGrid ||
        !account ||
        !selectedFunctionsIndexes ||
        !availableFunctionsIndexes ||
        generatingProof
      }
      onClick={async () => {
        if (!initialGrid) alert('Initial grid is not ready');
        else if (!finalGrid) alert('finalGrid is not ready');
        else if (!account) alert('account is not ready');
        else if (!selectedFunctionsIndexes)
          alert('selectedFunctionsIndexes is not ready');
        else {
          setGenerationgProof(true);
          proofCallback({
            initialGrid,
            finalGrid,
            account,
            selectedFunctionsIndexes,
            availableFunctionsIndexes,
          }).then((res) => {
            setGenerationgProof(false);
            onResult(res as unknown as ZKProof);
          });
        }
      }}
    >
      {generatingProof ? (
        <div className="animate-spin h-6 w-6  border-b-2 border-gray-100 rounded-full mx-auto "></div>
      ) : (
        'Submit Solution'
      )}
    </button>
  );
}
