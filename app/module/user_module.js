var app = require('../app');
var connection = require('./connection.js');
var async = app.locals.async;

function userCkeck(username, password, callback) {
    var user = '';
    var user_info = '';
    async.series([
        function (callback) {
            connection.getCollection('user', function (coll) {
                user = coll;
                callback();
            });
        }, function (callback) {
            var criteria = {
                'username': username,
                'password': password
            };
            var optimize = {
                '_id': 0,
                'password': 0
            };
            user.find(criteria, optimize).toArray(function (err, item) {
                if (err) {
                    callback();
                } else {
                    user_info = item;
                    callback();
                }
            });

        }
    ], function () {
        callback(user_info);
    });
}


function getUserInfo(username, callback) {
    var user = '';
    var user_info = '';
    async.series([
        function (callback) {
            connection.getCollection('user', function (coll) {
                user = coll;
                callback();
            });
        }, function (callback) {
            var criteria = {
                'username': username
            };
            var optimize = {
                '_id': 0,
                'password': 0
            };
            user.find(criteria, optimize).toArray(function (err, item) {
                if (err) {
                    callback();
                } else {
                    user_info = item;
                    callback();
                }
            });

        }
    ], function () {
        callback(user_info);
    });
}

function checkUsername(username, callback) {
    var user = '';
    var user_info = '';
    async.series([
        function (callback) {
            connection.getCollection('user', function (coll) {
                user = coll;
                callback();
            });
        }, function (callback) {
            var criteria = {
                'username': username
            };
            var optimize = {
                '_id': 0,
                'password': 0,
                'email': 0,
                'first_name': 0,
                'last_name': 0,
                'address': 0
            };
            user.find(criteria, optimize).toArray(function (err, item) {
                if (err) {
                    callback();
                } else {
                    if (item.length > 0) {
                        user_info = true;
                    } else {
                        user_info = false;
                    }
                    callback();
                }
            });

        }
    ], function () {
        callback(user_info);
    });
}

function registerUser(data, callback) {
    var user = '';
    var status = '';
    async.series([
        function (callback) {
            connection.getCollection('user', function (coll) {
                user = coll;
                callback();
            });
        }, function (callback) {
            user.insert(data, {w: 1}, function (err, result) {
                if (err) {
                    callback();
                } else {
                    if (result.length > 0) {
                        status = true;
                        callback();
                    } else {
                        status = false;
                        callback();
                    }
                }
            });
        }
    ], function () {
        callback(status);
    });
}

function getAllusers(callback) {
    var user = '';
    var user_infos = '';
    async.series([
        function (callback) {
            connection.getCollection('user', function (coll) {
                user = coll;
                callback();
            });
        }, function (callback) {
            var optimize = {
                '_id': 0,
                'password': 0
            };
            user.find({},optimize).toArray(function (err, items) {
                if (err) {
                    callback();
                } else {
                    user_infos = items;
                    callback();
                }
            });

        }
    ], function () {
        callback(user_infos);
    });
}
module.exports.userCkeck = userCkeck;
module.exports.getUserInfo = getUserInfo;
module.exports.checkUsername = checkUsername;
module.exports.registerUser = registerUser;
module.exports.getAllusers = getAllusers;