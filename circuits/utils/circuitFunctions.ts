import {
  CircuitFunctions,
  Colors,
  OnOff,
} from '../types/circuitFunctions.types';

export function argumentBuilder(
  arg: CircuitFunctions
): [OnOff.On, Colors, Colors, Colors] {
  const colorIn = arg.split('_')[1];
  const colorOutOne = arg.split('_')[2];
  const colorOutTwo = arg.split('_')[3];

  return [
    OnOff.On,
    colorIn === 'YELLOW'
      ? Colors.Yellow
      : colorIn === 'RED'
        ? Colors.Red
        : colorIn === 'BLUE'
          ? Colors.Blue
          : Colors.White,
    colorOutOne === 'YELLOW'
      ? Colors.Yellow
      : colorOutOne === 'RED'
        ? Colors.Red
        : colorOutOne === 'BLUE'
          ? Colors.Blue
          : Colors.White,
    colorOutTwo === 'YELLOW'
      ? Colors.Yellow
      : colorOutTwo === 'RED'
        ? Colors.Red
        : colorOutTwo === 'BLUE'
          ? Colors.Blue
          : Colors.White,
  ];
}
