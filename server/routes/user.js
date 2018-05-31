var express = require('express');
var router = express.Router();
var dbConnection = require("../lib/dbConnection");

function prepareResponse(req) {
    var response = {
        success: false,
        response: []
    };
    return response;
}

router.get('/list', function (req, res) {
    var accountId = req.query.accountId;
    var queryString = 'SELECT * FROM medical_history.user WHERE account_id=' + accountId;
    var response = prepareResponse(req);
    dbConnection.pool.connect(function (error, connection, done) {
        if (error) {
            console.error("error");
            res.json(response);
        } else {
            var query = connection.query(queryString, function (err, resultObj) {
                done();
                if (err) {
                    console.error(JSON.stringify(err));
                } else {
                    var rows = resultObj.rows;
                    response.success = true;
                    response.response = rows;
                }
                res.json(response);
            });
        }
    });
});

router.get('/get', function (req, res) {
    var id = req.query.id;
    var queryString = 'SELECT * FROM medical_history.user WHERE id=' + id;
    var response = prepareResponse(req);
    dbConnection.pool.connect(function (error, connection, done) {
        if (error) {
            console.error("error");
            res.json(response);
        } else {
            var query = connection.query(queryString, function (err, resultObj) {
                done();
                if (err) {
                    console.error(JSON.stringify(err));
                } else {
                    var rows = resultObj.rows;
                    response.success = true;
                    response.response = rows[0];
                }
                res.json(response);
            });
        }
    });
});

function generateQuery(data, type) {
    var query = "";
    if (type == "insert")
        query = "INSERT INTO medical_history.user VALUES (" + data.id + ", '" + data.name +
            "', '" + data.last_name + "', " + data.account_id + ");";
    if (type == "update")
        query = "UPDATE medical_history.user SET name='" + data.name + "', last_name='" +
            data.last_name + "' WHERE id=" + data.id;
    return query;
}

router.post('/create', function (req, res, next) {
    var data = req.body;
    var queryString = generateQuery(data, "insert");
    var response = prepareResponse(req);
    dbConnection.pool.connect(function (error, connection, done) {
        if (error) {
            console.error("error");
            res.send(JSON.stringify(response));
        } else {
            var query = connection.query(queryString, function (err, resultObj) {
                done();
                if (err) {
                    console.error(JSON.stringify(err));
                } else {
                    response.success = true;
                    response.response = {};
                }
                res.send(JSON.stringify(response));
            });
        }
    });

});

router.post('/update', function (req, res, next) {
    var data = req.body;
    var queryString = generateQuery(data, "update");
    var response = prepareResponse(req);
    dbConnection.pool.connect(function (error, connection, done) {
        if (error) {
            console.error("error");
            res.send(JSON.stringify(response));
        } else {
            var query = connection.query(queryString, function (err, resultObj) {
                done();
                if (err) {
                    console.error(JSON.stringify(err));
                } else {
                    response.success = true;
                    response.response = {};
                }
                res.send(JSON.stringify(response));
            });
        }
    });
});

router.post('/delete', function (req, res, next) {
    var data = req.body;
    var queryString = "delete from medical_history.user where id=" + data.id;
    var response = prepareResponse(req);
    dbConnection.pool.connect(function (error, connection, done) {
        if (error) {
            console.error("error");
            res.send(JSON.stringify(response));
        } else {
            var query = connection.query(queryString, function (err, resultObj) {
                done();
                if (err) {
                    console.error(JSON.stringify(err));
                } else {
                    response.success = true;
                    response.response = {};
                }
                res.send(JSON.stringify(response));
            });
        }
    });
});
module.exports = router;
