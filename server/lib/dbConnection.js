
var pg = require('pg');
var config = require('../../config.js');
var pool = new pg.Pool(config.db);

pool.on('error', function (err, client) {
    console.error(__filename + '-20-pool.on error - idle client error ' + err.message + ' ' + err.stack);
});

pool.connect(function (error, connection, done) {
    if (error) console.error("Error connecting to DB " + error);
    else {
        var queryString = 'SELECT 1';
        connection.query(queryString, null, function (err, result) {
            if (err) console.error("-28-pool.connect- Error connecting to DB:" + error);
            else console.log("-29-pool.connect- Successfully connected to DB");
            done(err);
        });
    }
});
function cleanup(done) {
    console.log(__filename + "-37-cleanup- DB pool closed gracefully");
    pool.end(done());
}
module.exports.pool = pool;
module.exports.cleanup = cleanup;