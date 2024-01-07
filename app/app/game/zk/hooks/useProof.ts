import { useCallback } from 'react';
import { InputSignals, Proof } from '../types';
import { groth16 } from 'snarkjs';

async function exportCallDataGroth16(
  input: InputSignals,
  wasmPath: string,
  zkeyPath: string
): Promise<Proof & { Input: number[] }> {
  let _proof, _publicSignals;

  try {
    ({ proof: _proof, publicSignals: _publicSignals } = await groth16.fullProve(
      input,
      wasmPath,
      zkeyPath
    ));
  } catch (err) {
    console.error(err);
    throw new Error('Wrong answer!');
  }

  const calldata = await groth16.exportSolidityCallData(_proof, _publicSignals);

  const argv = calldata
    .replace(/["[\]\s]/g, '')
    .split(',')
    .map((x: string) => BigInt(x).toString());

  const a: Proof['a'] = [argv[0], argv[1]];
  const b: Proof['b'] = [
    [argv[2], argv[3]],
    [argv[4], argv[5]],
  ];
  const c: Proof['c'] = [argv[6], argv[7]];
  const Input = [];

  for (let i = 8; i < argv.length; i++) {
    Input.push(argv[i]);
  }

  return { a, b, c, Input };
}

export function useProof(wasmPath: string, zkeyPath: string) {
  return useCallback(
    async (input: InputSignals) => {
      let result;
      result = exportCallDataGroth16(input, wasmPath, zkeyPath).then(
        (res) => res
      );

      return result;
    },
    [wasmPath, zkeyPath]
  );
}
