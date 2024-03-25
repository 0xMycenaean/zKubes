pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/gates.circom";
include "./transform.circom";
include "./stack.circom";
include "./transformtwo.circom";

function indexToArgs(index) {
    assert(index >= 0 && index <= 27);
    // "EMPTY"
    if(index == 0) {
        return [0, 0, 0, 0];
    }
    // "TRANSFORM_YELLOW_RED",
    else if (index == 1) {
        return [1, 1, 2, 0];
    // "TRANSFORM_YELLOW_BLUE",
    } else if (index == 2) {
        return [1, 1, 3, 0];
    // "TRANSFORM_RED_YELLOW",
    } else if (index == 3) {
        return [1, 2, 1, 0];
    // "TRANSFORM_RED_BLUE",
    } else if (index == 4) {
        return [1, 2, 3, 0];
    // "TRANSFORM_BLUE_YELLOW",
    } else if (index == 5) {
        return [1, 3, 1, 0];
    // "TRANSFORM_BLUE_RED",
    } else if (index == 6) {
        return [1, 3, 2, 0];
    // "STACK_YELLOW",
    } else if (index == 7) {
        return [1, 1, 0, 0];
    // "STACK_RED",
    } else if (index == 8) {
        return [1, 2, 0, 0];
    // "STACK_BLUE",
    } else if (index == 9) {
        return [1, 3, 0, 0];
    // 'TRANSFORMTWO_YELLOW_YELLOW_RED',
    } else if (index == 10) {
        return [1, 1, 1, 2];
    // 'TRANSFORMTWO_YELLOW_YELLOW_BLUE',
    } else if (index == 11) {
        return [1, 1, 1, 3];
    // 'TRANSFORMTWO_YELLOW_RED_YELLOW',
    } else if (index == 12) {
        return [1, 1, 2, 1];
    // 'TRANSFORMTWO_YELLOW_RED_BLUE',
    } else if (index == 13) {
        return [1, 1, 2, 3];
    // 'TRANSFORMTWO_YELLOW_BLUE_YELLOW',
    } else if (index == 14) {
        return [1, 1, 3, 1];
    // 'TRANSFORMTWO_YELLOW_BLUE_RED',
    } else if (index == 15) {  
        return [1, 1, 3, 2];
    // 'TRANSFORMTWO_RED_RED_YELLOW',
    } else if (index == 16) {
        return [1, 2, 2, 1];
    // 'TRANSFORMTWO_RED_RED_BLUE',
     } else if (index == 17) {
        return [1, 2, 2, 3];
    // 'TRANSFORMTWO_RED_YELLOW_RED',  
    } else if (index == 18) {
        return [1, 2, 1, 2];
    // 'TRANSFORMTWO_RED_YELLOW_BLUE', 
    } else if (index == 19) {
        return [1, 2, 1, 3];
    // 'TRANSFORMTWO_RED_BLUE_YELLOW', 
    } else if (index == 20) {
        return [1, 2, 3, 1];
    // 'TRANSFORMTWO_RED_BLUE_RED',  
    } else if (index == 21) {
        return [1, 2, 3, 2];
    // 'TRANSFORMTWO_BLUE_BLUE_YELLOW',  
    } else if (index == 22) {
        return [1, 3, 3, 1];
    // 'TRANSFORMTWO_BLUE_BLUE_RED',
    } else if (index == 23) {
        return [1, 3, 3, 2];
    // 'TRANSFORMTWO_BLUE_YELLOW_BLUE',
    } else if (index == 24) {
        return [1, 3, 1, 3];
    // 'TRANSFORMTWO_BLUE_YELLOW_RED',
    } else if (index == 25) {
        return [1, 3, 1, 2];
    // 'TRANSFORMTWO_BLUE_RED_YELLOW',
    } else if (index == 26) {
        return [1, 3, 2, 1];
    // 'TRANSFORMTWO_BLUE_RED_BLUE',
    } else if (index == 27) {
        return [1, 3, 2, 3];
    } 

    return [0, 0, 0, 0];
}

template ZKube(W, H, F) {
    // public
    signal input initialGrid[W][H];
    signal input finalGrid[W][H];
    signal input selectedFunctionsIndexes[F][F];
    signal input availableFunctions[F][F];
    signal input account;
    signal finalGridForPlayer[W][H];
    // F rounds for each of the Function
    component transform[F];
    component stack[F];
    component transformTwo[F]; 

    // having +1 because we are assigning current value to the next one
    // F intermediate grids, corresponding to possible Functions. Of width W and height H
    signal intermediateGrids[F+1][F+1][W][H];

    for (var i = 0; i < W; i++) {
        for (var j = 0; j < H; j++) {
            intermediateGrids[0][0][i][j] <== initialGrid[i][j];
        }
    }  

    signal selectedFunctions[F][F][4];
    for (var i = 0; i < F; i++) {
        var indexPlusOne = i + 1;
        var indexPlusTwo = i + 2;
        
        for (var j = 0; j < 3; j++) {
          selectedFunctions[i][j] <-- indexToArgs(selectedFunctionsIndexes[i][j]);
          selectedFunctions[i][j][0] === selectedFunctions[i][j][0] * selectedFunctions[i][j][0];
        }

        transform[i] = Transform(W, H);
        transform[i].grid <== intermediateGrids[i][0];
        transform[i].onOff <== selectedFunctions[i][0][0];
        transform[i].inColor <== selectedFunctions[i][0][1];
        transform[i].outColor <== selectedFunctions[i][0][2];
        intermediateGrids[i][1] <== transform[i].out;

        stack[i] = Stack(W, H);
        stack[i].grid <== intermediateGrids[i][1];
        stack[i].onOff <== selectedFunctions[i][1][0];
        stack[i].color <== selectedFunctions[i][1][1];
        intermediateGrids[i][2] <== stack[i].out;

        transformTwo[i] = TransformTwo(W, H);
        transformTwo[i].grid <== intermediateGrids[i][2];
        transformTwo[i].onOff <== selectedFunctions[i][2][0];
        transformTwo[i].inColor <== selectedFunctions[i][2][1];
        transformTwo[i].outColorBot <== selectedFunctions[i][2][2];
        transformTwo[i].outColorTop <== selectedFunctions[i][2][3];

        intermediateGrids[indexPlusOne][0] <== transformTwo[i].out;
    }

    finalGridForPlayer <== intermediateGrids[F][0];

    component isEq[W][H];
    var counter = 0;
    for (var i = 0; i < W; i++) {
        for (var j = 0; j < H; j++) {
            isEq[i][j] = IsEqual();
            isEq[i][j].in[0] <== finalGridForPlayer[i][j];
            isEq[i][j].in[1] <== finalGrid[i][j];
            counter += isEq[i][j].out;
        }
    }

    component eqCheck;
    // compairng the final results
    eqCheck = ForceEqualIfEnabled();
    // if not equal no proof, sorry
    eqCheck.enabled <== 0;
    eqCheck.in[0] <== counter;
    eqCheck.in[1] <== W*H;
}

component main { public [initialGrid, finalGrid, availableFunctions, account] } = ZKube(8, 8, 3);
