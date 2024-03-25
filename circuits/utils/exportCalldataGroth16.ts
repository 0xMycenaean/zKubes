// @ts-ignore
import { groth16 } from 'snarkjs';
import { InputSignals } from '../types/proof.types';

export async function exportCalldataGroth16(
  input: InputSignals,
  wasmPath: string,
  zkeyPath: string
): Promise<string> {
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

  return await groth16.exportSolidityCallData(_proof, _publicSignals);
}
