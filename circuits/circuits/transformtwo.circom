pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/comparators.circom";

template CalculateTotal(n) {
    signal input in[n];
    signal output out;

    signal sums[n];

    sums[0] <== in[0];

    for (var i = 1; i < n; i++) {
        sums[i] <== sums[i-1] + in[i];
    }

    out <== sums[n-1];
}

// https://github.com/darkforest-eth/circuits/blob/master/perlin/QuinSelector.circom
template DoubleQuinSelector(choices) {
    signal input in[choices];
    signal input indexOne;
    signal input indexTwo;
    signal output out[2];
    
    // Ensure that index < choices
    component lessThan = LessThan(4);
    lessThan.in[0] <== indexOne;
    lessThan.in[1] <== choices;
    lessThan.out === 1;

    component calcTotalOne = CalculateTotal(choices);
    component calcTotalTwo = CalculateTotal(choices);
    component eqsOne[choices];
    component eqsTwo[choices];

    // For each item, check whether its index equals the input index.
    for (var i = 0; i < choices; i ++) {
        eqsOne[i] = IsEqual();
        eqsOne[i].in[0] <== i;
        eqsOne[i].in[1] <== indexOne;

        eqsTwo[i] = IsEqual();
        eqsTwo[i].in[0] <== i;
        eqsTwo[i].in[1] <== indexTwo;

        // eqs[i].out is 1 if the index matches. As such, at most one input to
        // calcTotal is not 0.
        calcTotalOne.in[i] <== eqsOne[i].out * in[i];
        calcTotalTwo.in[i] <== eqsTwo[i].out * in[i];
    }

    // Returns 0 + 0 + 0 + item
    out[0] <== calcTotalOne.out;
    out[1] <== calcTotalTwo.out;
}

template TransformTwo(W, H) {
    signal input grid[W][H];
    signal input onOff;
    signal input inColor;
    signal input outColor;
    signal output out[W][H];

    assert(onOff == 0 || onOff == 1);
    
    signal transformTwoInColoring <== (onOff * inColor) - (1 - onOff);
    signal transformTwoOutColoring <== onOff * outColor;
    signal mask[W][H];
    signal mask2[W][H];

    component isEqCurr[W][H];
    component isEqPrev[W][H];
    component quinSelCurr[W][H];

    for (var i = 0; i < W; i++) {
        var noTransformations = 0;
        for (var j = 0; j < H-1; j+=2) {
            quinSelCurr[i][j] = DoubleQuinSelector(H);
            quinSelCurr[i][j].in <== grid[i];
            quinSelCurr[i][j].indexOne <== j - noTransformations;

            isEqPrev[i][j] = IsEqual();
            isEqPrev[i][j].in[0] <== j ? out[i][j-1] : -2;
            isEqPrev[i][j].in[1] <== transformTwoInColoring;

            noTransformations += isEqPrev[i][j].out;
            quinSelCurr[i][j].indexTwo <== j - noTransformations + 1;

            mask[i][j] <== (1 - isEqPrev[i][j].out) * quinSelCurr[i][j].out[0];
            out[i][j] <== mask[i][j] + isEqPrev[i][j].out * transformTwoOutColoring;

            isEqCurr[i][j] = IsEqual();
            isEqCurr[i][j].in[0] <== j ? out[i][j] : grid[i][0];
            isEqCurr[i][j].in[1] <== transformTwoInColoring;

            mask2[i][j] <== (1 - isEqCurr[i][j].out) * quinSelCurr[i][j].out[1];
            out[i][j+1] <== mask2[i][j] + isEqCurr[i][j].out * transformTwoOutColoring;

            noTransformations += isEqCurr[i][j].out;
        }
    }
}
