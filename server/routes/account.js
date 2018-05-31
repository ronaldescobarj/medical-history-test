var express = require('express');
var router = express.Router();
var dbConnection = require("../lib/dbConnection");

function prepareResponse(req) {
    var response = {
        success: false,
        response: [],
        message: ""
    };
    return response;
}

router.get('/authenticate', function (req, res) {
    var username = req.query.username;
    var password = req.query.password;
    var response = prepareResponse(req);
    dbConnection.pool.connect(function (error, connection, done) {
        if (error) {
            console.error("error");
            res.json(response);
        } else {
            var userQueryString = "SELECT * FROM medical_history.account WHERE username='" +
                username + "';";
            var userQuery = connection.query(userQueryString, function (err, resultUserObj) {
                if (err) {
                    console.error(JSON.stringify(err));
                    res.json(response);
                } else {
                    if (resultUserObj.rows.length > 0) {
                        var passwordQueryString = "SELECT * FROM medical_history.account WHERE username='"
                            + username + "' and password='" + password + "';";
                        var passwordQuery = connection.query(passwordQueryString, function (err, resultPasswordObj) {
                            done();
                            if (err) {
                                console.error(JSON.stringify(err));
                            } else {
                                if (resultPasswordObj.rows.length > 0) {
                                    response.success = true;
                                    response.response = resultPasswordObj.rows[0];
                                }
                                else {
                                    response.message = "Contraseña incorrecta";
                                }
                            }
                            res.json(response);
                        });
                    }
                    else {
                        response.message = "Nombre de usuario incorrecto";
                        res.json(response);
                    }
                }
            });
        }
    });
});

router.get('/get', function (req, res) {
    var id = req.query.id;
    var queryString = 'SELECT * FROM medical_history.account WHERE id=' + id;
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
                    var rows = resultObj.rows[0];
                    response.success = true;
                    response.response = rows;
                }
                res.json(response);
            });
        }
    });
});

router.post('/create', function (req, res, next) {
    var data = req.body;
    var checkQueryString = "SELECT * FROM medical_history.account WHERE username='" + data.username + "';";
    var response = prepareResponse(req);
    dbConnection.pool.connect(function (error, connection, done) {
        if (error) {
            console.error("error");
            res.send(JSON.stringify(response));
        } else {
            var checkQuery = connection.query(checkQueryString, function (err, checkResultObj) {
                if (err) {
                    console.error(JSON.stringify(err));
                    res.send(JSON.stringify(response));
                } else {
                    if (checkResultObj.rows.length == 0) {
                        var insertQueryString = "insert into medical_history.account values (" +
                            data.id + ", '" + data.username + "', '" + data.password + "')";
                        var insertQuery = connection.query(insertQueryString, function (err, insertResultObj) {
                            done();
                            if (err) {
                                console.error(JSON.stringify(err));
                            } else {
                                response.success = true;
                            }
                            res.send(JSON.stringify(response));
                        });
                    }
                    else {
                        response.message = "El nombre de usuario ya existe";
                        res.send(JSON.stringify(response));
                    }
                }
            });
        }
    });




});

router.post('/update', function (req, res, next) {
    var data = req.body;
    var queryString = "update medical_history.account set username='" + data.username +
        "', password='" + data.password + "' where id=" + data.id + ";";
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
                }
                response.response = {};
                res.send(JSON.stringify(response));
            });
        }
    });
});

router.post('/delete', function (req, res, next) {
    var data = req.body;
    var queryString = "delete from medical_history.account where id=" + data.id;
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
                }
                response.response = {};
                res.send(JSON.stringify(response));
            });
        }
    });
});
module.exports = router;
