var express = require('express');
var router = express.Router();
var dbConnection = require("../lib/dbConnection");

function prepareResponse(req) {
    var response = {
        success: false,
        response: {}
    };
    return response;
}

router.get('/get', function (req, res) {
    var id = req.query.id;
    var userId = req.query.userId;
    var queryString = 'SELECT * FROM medical_history.analysis WHERE id=' + id + ' and user_id=' + userId + ';';
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
                    response.success = true;
                    if (resultObj.rows.length > 0)
                        response.response = resultObj.rows[0];
                }
                res.json(response);
            });
        }
    });
});

function generateQuery(data, type) {
    var query = "";
    if (type == "insert")
        query = "INSERT INTO medical_history.analysis VALUES (" + data.id + ", '" + data.summary + "', '" + data.type + "', '" + data.description + "', '" + data.hospital + "', '" + data.commentary + "', '" + data.date + "', " + data.user_id + ");";
    if (type == "update")
        query = "UPDATE medical_history.analysis SET summary='" + data.summary + "', type='" + data.type + "', description='" + data.description + "', hospital='" + data.hospital + "', commentary='" + data.commentary + "', date='" + data.date + "' WHERE id=" + data.id;
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
    var queryString = "delete from medical_history.analysis where id=" + data.id;
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
