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
    var accountId = req.query.accountId;
    var queryString = 'SELECT * FROM medical_history.user WHERE id=' + id + ' and account_id=' +
        accountId + ';';
    var response = prepareResponse(req);
    response.response = {};
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
                    if (resultObj.rows.length > 0) {
                        response.response = resultObj.rows[0];
                    }
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
            "', '" + data.last_name + "', " + data.account_id + ", '" + data.diseases
            + "', '" + data.allergies + "', " + data.default_user + ", '" + data.birthdate + "');";
    if (type == "update")
        query = "UPDATE medical_history.user SET name='" + data.name + "', last_name='" +
            data.last_name + "', diseases='" + data.diseases + "', allergies='" +
            data.allergies + "', default_user=" + data.default_user + ", birthdate='" + data.birthdate
            + "' WHERE id=" + data.id;
    console.log(query);
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

router.post('/changeDefault', function (req, res, next) {
    var currentDefault = req.body.currentDefault;
    var newDefault = req.body.newDefault;
    var response = prepareResponse(req);
    dbConnection.pool.connect(function (error, connection, done) {
        if (error) {
            console.error("error");
            res.send(JSON.stringify(response));
        } else {
            var firstQueryString = "UPDATE medical_history.user SET default_user=true WHERE id="
                + newDefault.id;
            var firstQuery = connection.query(firstQueryString, function (err, firstResultObj) {
                if (err) {
                    console.error(JSON.stringify(err));
                    res.send(JSON.stringify(response));
                } else {
                    var secondQueryString = "UPDATE medical_history.user SET default_user=false WHERE id="
                        + currentDefault.id;
                    var secondQuery = connection.query(secondQueryString, function (err, secondResultObj) {
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
