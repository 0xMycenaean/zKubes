//SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

struct Game {
    Player player1;
    Player player2;
    address puzzleSet;
    uint8 interval;
    uint16 numberOfRounds;
    uint72 startingBlock;
}

struct Proof {
    uint256[2] a;
    uint256[2][2] b;
    uint256[2] c;
    uint256[138] input;
}

struct Puzzle {
    uint8[] availableFunctions;
    bytes16 finalGrid;
    bytes16 startingGrid;
}

struct PuzzleJson {
    uint8[] availableFunctions;
    bytes finalGrid;
    bytes startingGrid;
}

struct Player {
    address address_;
    uint16 score;
    uint72 totalBlocks; // for tie breaks
}

interface IZKube {
    // When a game is created, the blockstart is defined. Each turn must be made within a blockinterval no greater than 256 blocks.
    function createGame(address puzzleSet, uint8 interval, uint16 numberOfTurns) external returns (uint256 id);

    function joinGame(uint256 id) external;

    // The selectPuzzle view function uses previous block.hash to select the same puzzle for both players deterministically
    function selectPuzzle(uint256 id)
        external
        view
        returns (uint256 roundBlockNumber, Game memory game, Puzzle memory puzzle);

    // check is player and verify proof, revert if not valid proof.
    function submitPuzzle(uint256 id, Proof calldata proof) external;
}

// Please note that you should adjust the length of the inputs
interface IZKubeVerifier {
    function verifyProof(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[138] memory input)
        external
        view
        returns (bool r);
}

interface IZKubePuzzleSet {
    function getPuzzle(uint256 randomNumber) external view returns (Puzzle memory puzzle);
}
