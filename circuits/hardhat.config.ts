import "hardhat-circom";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    compilers: [
      {
        version: "0.6.11",
      },
      {
        version: "0.8.9",
      },
    ],
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau",
    // groth16 by default
    circuits: [
      {
        name: "test/transform_test",
      },
      {
        name: "test/stack_test",
      },
      {
        name: "test/transformtwo_test",
      },
      {
        name: "main",
      },
    ],
  },
};
