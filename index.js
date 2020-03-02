const program = require('commander');
const { runSeeker } = require('./src/flight').default;

program.version('0.0.1');

program.requiredOption('-t, --to <to>, origin of the travel');
program.requiredOption('-f, --from <from>, destination of the travel');
program.requiredOption('-d, --departure <departure>, day of departure');
program.requiredOption('-r, --return <return>, day of return');
program.requiredOption('-m, --maximum <maximum>, maximum price');
program.parse(process.argv);

runSeeker(program);
