var app = require('../app');
var mongoclient = require("mongodb").MongoClient;

var async = app.locals.async;
function getCollection(collection, callback) {
    var connection = '';
    async.series([
        function (callback) {
            mongoclient.connect('mongodb://localhost:27017/nsm', function (err, db) {
                if (err) {
                    console.log('conection unsuccessful');
                    return console.dir(err);
                } else {
                    connection = db;
                    callback();
                }

            });

        }
    ], function () {
        if (connection != '') {
            //console.log(connection);
            connection.collection(collection, function (err, coll) {
                if (err) {
                    console.log('collection not connected');
                    return console.dir(err);
                } else {
                    callback(coll);
                }
            });
        }
    });
}

module.exports.getCollection = getCollection;