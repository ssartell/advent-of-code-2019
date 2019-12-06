var run = require('./scaffolding');

(async () => {
    await run(5, 2);
    process.exit();
})();