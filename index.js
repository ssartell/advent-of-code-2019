(async () => {
    var run = require('./scaffolding');

    await run(5, 2);

    process.exit();
})();