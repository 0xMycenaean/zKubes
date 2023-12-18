import { Colors, OnOff } from "../test/data/puzzles.types";
import { CircuitFunctions } from "./enums/circuitFunctions.enum";

const FUNCTION_ORDER = ["TRANSFORM", "STACK", "TRANSFORMTWO"];

export function argumentBuilder(
  arg: keyof typeof CircuitFunctions
): [OnOff.On, Colors, Colors] {
  const colorIn = arg.split("_")[1];
  const colorOut = arg.split("_")[2];

  return [
    OnOff.On,
    colorIn === "YELLOW"
      ? Colors.Yellow
      : colorIn === "RED"
      ? Colors.Red
      : Colors.Blue,
    colorOut === "YELLOW"
      ? Colors.Yellow
      : colorOut === "RED"
      ? Colors.Red
      : Colors.Blue,
  ];
}

export function argumentBuilderMain(
  args: (keyof typeof CircuitFunctions)[]
): number[][][] {
  const numSelectedFunctions = args.length;
  const numAvailableFunctions = FUNCTION_ORDER.length;
  // cannot set nested array in JS only with fill due to object references
  const argumentsArray = Array(numSelectedFunctions)
    .fill(null)
    .map((_) => {
      return Array(numAvailableFunctions).fill(Array(3).fill(0));
    });

  args.forEach((arg, i) => {
    const func = arg.split("_")[0];
    const index = FUNCTION_ORDER.indexOf(func);
    argumentsArray[i][index] = argumentBuilder(arg);
  });

  return argumentsArray;
}
