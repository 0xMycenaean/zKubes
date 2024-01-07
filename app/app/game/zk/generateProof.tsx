import { useProof } from './hooks/useProof';
import { InputSignals, Proof } from './types';

export function GenerateProof({
  inputSignals: { initialGrid, finalGrid, account, selectedFunctions },
  onResult,
}: {
  inputSignals: InputSignals;
  onResult: (proof: Proof | string) => void;
}) {
  const proofCallback = useProof('./zk/main.wasm', './zk/main.zkey');

  return (
    <button
      disabled={!initialGrid || !finalGrid || !account || !selectedFunctions}
      onClick={async () => {
        if (!initialGrid) alert('Initial grid is not ready');
        else if (!finalGrid) alert('finalGrid is not ready');
        else if (!account) alert('account is not ready');
        else if (!selectedFunctions) alert('selectedFunctions is not ready');
        else {
          proofCallback({
            initialGrid,
            finalGrid,
            account,
            selectedFunctions,
          }).then((res) => {
            onResult(res);
          });
        }
      }}
    >
      Submit Solution
    </button>
  );
}
