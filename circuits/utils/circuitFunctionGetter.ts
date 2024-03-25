import {
  AvailableFunctions,
  CircuitFunctions,
  FUNCTION_ORDER,
  circuitFunctionsArray,
} from '../types/circuitFunctions.types';

export function getCircuitFunctionIndexByName(funcName: CircuitFunctions) {
  const index = circuitFunctionsArray.indexOf(funcName);
  if (index === -1)
    throw new Error(`function with name ${funcName} does not exist`);
  return index;
}

export function getCircuitFunctionIndex<
  T extends CircuitFunctions | CircuitFunctions[],
>(funcName: T): T extends CircuitFunctions[] ? number[][] : number {
  if (Array.isArray(funcName)) {
    return funcName.map((name) => {
      const functionArray = [0, 0, 0];
      const funcIndex = getCircuitFunctionIndexByName(name);
      const functPreponent = name.split('_')[0] as AvailableFunctions;
      if (functPreponent !== 'EMPTY') {
        const functionPositionInCircuit = FUNCTION_ORDER[functPreponent];
        functionArray[functionPositionInCircuit] = funcIndex;
      }
      return functionArray;
    }) as T extends CircuitFunctions[] ? number[][] : number;
  } else {
    return getCircuitFunctionIndexByName(
      funcName
    ) as T extends CircuitFunctions[] ? number[][] : number;
  }
}

export function getCircuitFunctionName(index: number) {
  const funcName = circuitFunctionsArray[index];
  if (!funcName) throw new Error(`function with index ${index} does not exist`);
  return funcName;
}
