import Mocha from 'mocha';
const ARGUMENT_VALUE = ['zkube', 'stack', 'transformTwo', 'transform'];

const argumentValue = process.argv[2];

if (argumentValue && !ARGUMENT_VALUE.includes(argumentValue))
  throw new Error(`Invalid argument value: ${argumentValue}`);

const mochaConfig = new Mocha({
  ui: 'bdd',
  color: true,
  require: ['ts-node/register'],
});

if (!argumentValue) {
  mochaConfig.addFile('./test/stack.test.ts');
  mochaConfig.addFile('./test/transformTwo.test.ts');
  mochaConfig.addFile('./test/transform.test.ts');
  mochaConfig.addFile('./test/zkube.test.ts');
} else {
  mochaConfig.addFile(`./test/${argumentValue}.test.ts`);
}

// Run the tests
mochaConfig.run((failures) => {
  if (failures) {
    console.error(`Test suite failed with ${failures} failures.`);
    process.exit(1);
  } else {
    console.log('Test suite completed successfully.');
    process.exit(0);
  }
});
