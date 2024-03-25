type Hex = `0x${string}`;

export interface InputSignals {
  initialGrid: number[][];
  finalGrid: number[][];
  account: Hex;
  selectedFunctionsIndexes: number[][];
}

export interface Proof {
  a: [Hex, Hex];
  b: [[Hex, Hex], [Hex, Hex]];
  c: [Hex, Hex];
}
