pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/comparators.circom";
include "./transform.circom";
include "./stack.circom";
include "./transformtwo.circom";

template ZKubes(W, H, F) {
    // public
    signal input initialGrid[W][H];
    signal input finalGrid[W][H];
    // TODO: include address to prevent frontrunning
    signal input account;
    // private
    // F rounds of F available functions with 3 args
    signal input selectedFunctions[F][F][3];

    signal finishingGrid[W][H];
    // F rounds for each of the Function
    component transform[F];
    component stack[F];
    component transformTwo[F]; 

    for(var i = 0; i < F; i++) {
        var onOffCount = 0;
        for(var j = 0; j     < F; j++) {
            // checking if onOff is 0 or 1
            assert(0 == selectedFunctions[i][j][0] || 1 == selectedFunctions[i][j][0]);
            // checking that if onOff is 0 then all other elements are 0
            if(selectedFunctions[i][j][0] == 0) {
                assert(selectedFunctions[i][j][1] == 0);
                assert(selectedFunctions[i][j][2] == 0);
            }
            onOffCount += selectedFunctions[i][j][0];
        }
        // checking there is only one onOff == 1
        assert(0 == onOffCount || 1 == onOffCount);
    }

    // 1. check - if onOff == 0 then all other elements should be 0
    // 2. check - there could be only 1 element == 1 at the same index in all calls combined


    // having +1 because we are assigning current value to the next one
    // F intermediate grids, corresponding to possible Functions. Of width W and height H
    signal intermediateGrids[F+1][F+1][W][H];

    for (var i = 0; i < W; i++) {
        for (var j = 0; j < H; j++) {
            intermediateGrids[0][0][i][j] <== initialGrid[i][j];
        }
    }  

     for (var i = 0; i < F; i++) {
        // for (var j = 0; j < F; j++) {
            var indexPlusOne = i + 1;
            var indexPlusTwo = i + 2;

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
            transformTwo[i].outColor <== selectedFunctions[i][2][2];

            intermediateGrids[indexPlusOne][0] <== transformTwo[i].out;
    }

    finishingGrid <== intermediateGrids[F][0];

    var widthPlusOne = W + 1; 
    
    component isEqGrid[widthPlusOne];
    component isEqGridNested[W][H];

    signal finalMask[widthPlusOne][H];
    finalMask[0][7] <== 1;

    for (var i = 1; i < widthPlusOne; i++) {
        var prevIndex = i - 1;
        // hacky
        isEqGrid[i] = IsEqual();
        // checking for == 1
        isEqGrid[i].in[0] <== finalGrid[i - 1][0];
        isEqGrid[i].in[1] <== finishingGrid[i - 1][0];
        finalMask[i][0] <== finalMask[i-1][7] * isEqGrid[i].out;
        for (var j = 1; j < H; j++) {
            isEqGridNested[prevIndex][j] = IsEqual();
            // checking for == 1
            isEqGridNested[prevIndex][j].in[0] <== finalGrid[prevIndex][j];
            isEqGridNested[prevIndex][j].in[1] <== finishingGrid[prevIndex][j];
            finalMask[i][j] <==  isEqGridNested[prevIndex][j].out * finalMask[i][j - 1];
        }

    }

    component eqCheck;
    // compairng the final results
    eqCheck = ForceEqualIfEnabled();
    // if not equal no proof, sorry
    eqCheck.enabled <== 1;
    eqCheck.in[0] <== finalMask[8][7];
    eqCheck.in[1] <== 1;
}

component main { public [initialGrid, finalGrid, account] } = ZKubes(8, 8, 3);
