export enum OnOff {
  On = 1,
  Off = 0,
}

export enum Colors {
  White = 0,
  Yellow = 1,
  Red = 2,
  Blue = 3,
}

export interface Puzzles {
  [lvl: string]: {
    initial: Colors[][];
    availableFunctions: CircuitFunctions[];
    target: Colors[][];
    transform: Colors[][];
    stack: Colors[][];
    transformTwo: Colors[][];
    reverse: Colors[][];
  };
}

export type AvailableFunctions =
  | 'EMPTY'
  | 'TRANSFORM'
  | 'STACK'
  | 'TRANSFORMTWO';

export const FUNCTION_ORDER = {
  TRANSFORM: 0,
  STACK: 1,
  TRANSFORMTWO: 2,
} as const;

export const circuitFunctionsArray = [
  'EMPTY',
  // position 0
  'TRANSFORM_YELLOW_RED',
  'TRANSFORM_YELLOW_BLUE',
  'TRANSFORM_RED_YELLOW',
  'TRANSFORM_RED_BLUE',
  'TRANSFORM_BLUE_YELLOW',
  'TRANSFORM_BLUE_RED',
  // position 1
  'STACK_YELLOW',
  'STACK_RED',
  'STACK_BLUE',
  // position 2
  'TRANSFORMTWO_YELLOW_YELLOW_RED',
  'TRANSFORMTWO_YELLOW_YELLOW_BLUE',
  'TRANSFORMTWO_YELLOW_RED_YELLOW',
  'TRANSFORMTWO_YELLOW_RED_BLUE',
  'TRANSFORMTWO_YELLOW_BLUE_YELLOW',
  'TRANSFORMTWO_YELLOW_BLUE_RED',
  'TRANSFORMTWO_RED_RED_YELLOW',
  'TRANSFORMTWO_RED_RED_BLUE',
  'TRANSFORMTWO_RED_YELLOW_RED',
  'TRANSFORMTWO_RED_YELLOW_BLUE',
  'TRANSFORMTWO_RED_BLUE_YELLOW',
  'TRANSFORMTWO_RED_BLUE_RED',
  'TRANSFORMTWO_BLUE_BLUE_YELLOW',
  'TRANSFORMTWO_BLUE_BLUE_RED',
  'TRANSFORMTWO_BLUE_YELLOW_BLUE',
  'TRANSFORMTWO_BLUE_YELLOW_RED',
  'TRANSFORMTWO_BLUE_RED_YELLOW',
  'TRANSFORMTWO_BLUE_RED_BLUE',
] as const;

export type CircuitFunctions = (typeof circuitFunctionsArray)[number];
