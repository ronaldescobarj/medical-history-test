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

router.get('/get', function (req, res) {
    var consultationId = req.query.consultationId;
    var queryString = 'SELECT * FROM medical_history.consultation_image WHERE consultation_id=' + consultationId;
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

function generateQuery(images) {
    var query = "INSERT INTO medical_history.consultation_image(id, base_64_image, file_name, file_type, consultation_id) VALUES ";
    for (let i = 0; i < images.length; i++) {
        query += "(" + images[i].id + ", '" + images[i].base_64_image + "', '" + images[i].file_name + "', '" + images[i].file_type + "', " + images[i].consultation_id + ")";
        if (i == images.length - 1) {
            query += ";"
        }
        else {
            query += ", ";
        }
    }
    return query;
}

router.post('/add', function (req, res, next) {
    var data = req.body;
    var queryString = generateQuery(data.images);
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
    var queryString = "";
    if (data.id)
        queryString = "delete from medical_history.consultation_image where id=" + data.id;
    if (data.analysis_id)
        queryString = "delete from medical_history.consultation_image where consultation_id=" + data.consultation_id;
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
