var user_module = require('../module/user_module');
exports.register_route = function (req, res, next) {
    var app = require('../app');
    var str = app.locals.str;
    var async = app.locals.async;
    var md5 = app.locals.md5;
    var validator = app.locals.validator;
    var first_name = '';
    var last_name = '';
    var address = '';
    var username = '';
    var email = '';
    var password = '';
    var repassword = '';
    var submit = '';
    var err = '';
    var success = '';
    async.series([
        function (callback) {
            submit = req.body.register;
            if (submit != '' && submit == 'Register Me' && typeof submit != 'undefined') {
                first_name = str(req.body.first_name).trim().s;
                last_name = str(req.body.last_name).trim().s;
                address = str(req.body.address).trim().s;
                username = str(req.body.username).trim().s;
                email = str(req.body.email).trim().s;
                password = str(req.body.password).trim().s;
                repassword = str(req.body.rePassword).trim().s;

                if (first_name == '') {
                    err += '<li>First Name required</li>';
                }

                if (email != '') {
                    email = email.toString().replace(/[^A-Za-z 0-9 \.-_\+]*/g, '');
                    if (!validator.isEmail(email)) {
                        err += "<li>Please enter Valid email</li>";
                    }
                } else {
                    err += '<li>Email required</li>';
                }
                if (password == '') {
                    err += '<li>Password required</li>';
                }
                if (repassword == '') {
                    err += '<li>Retype Password required</li>';
                }

                if (password != '' && repassword != '' && password != repassword) {
                    err += '<li>Password Fields not matched</li>';
                }
                callback()
            } else {
                callback()
            }

        }, function (callback) {
            if (submit != '' && submit == 'Register Me' && typeof submit != 'undefined') {
                if (username == '') {
                    err += '<li>Username required</li>';
                    callback();
                } else {
                    user_module.checkUsername(username, function (userExist) {
                        if (userExist) {
                            err += '<li>Username Already taken</li>';
                            callback();
                        } else {
                            callback();
                        }
                    });

                }
            }else{
                callback();
            }

        }, function (callback) {
            if (err == '' && submit != '' && submit == 'Register Me' && typeof submit != 'undefined') {
                var data = {
                    first_name: first_name,
                    last_name: last_name,
                    username: username,
                    address: address,
                    email: email,
                    password: md5(password)
                };
                user_module.registerUser(data, function (status) {
                    if (status) {
                        success = 'Registration Successful';
                        callback();
                    } else {
                        callback();
                    }
                });
            } else {
                callback();
            }
        }
    ], function () {
        if (submit != '' && submit == 'Register Me' && typeof submit != 'undefined') {
            var data = {
                "err": err,
                "success": success,
                'user_data': {
                    first_name: first_name,
                    last_name: last_name,
                    username: username,
                    address: address,
                    email: email
                }
            };
            res.render('register_view.html', data);
        } else {
            res.render('register_view.html');
        }
    });
};
