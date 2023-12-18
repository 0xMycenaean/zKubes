pragma circom 2.0.0;

include "../transformtwo.circom";

component main {public [grid, inColor, outColor]} = TransformTwo(8, 8);
