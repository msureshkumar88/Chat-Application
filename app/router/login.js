var app = require('../app');
var user_module = require('../module/user_module');
var md5 = app.locals.md5;
exports.login_route = function (req, res, next) {
//console.log(cook.test);
    //console.log(app.get('test'))
    //console.log(app.locals.title);
    var str = app.locals.str;
    var async = app.locals.async;
    var cookies = app.locals.cookie;
    var sess = req.session;
    var err = '';
    var submit = '';
    var username = ' ';
    var password = '';
    var login_success = false;
    var remember_me='';
    async.series([
        function (callback) {
            submit = req.body.submit;

            if (submit != '' && submit == 'Log in') {
                username = req.body.username;
                password = req.body.password;
                remember_me = req.body.remember_me;
                
                username = str(username).trim().s;
                password = str(password).trim().s;
                if (username == '' || password == '') {
                    err = 'Incorect Username or password';
                }
                callback();
            } else {
                callback();
            }
        }, function (callback) {
            if (err == '' && submit != '' && submit == 'Log in') {
                user_module.userCkeck(username, md5(password), function (user_info) {
                    if (user_info.length > 0) {
                        //console.log(user_info);
                        login_success = true;
                        sess.username = user_info[0].username;
                        sess.is_logged_in = true;
                        if(remember_me == 'Remember me'){
                            res.cookie('is_logged_in_cook', true,{ expires: new Date(Date.now() + 90000000), httpOnly: true });
                            res.cookie('username', user_info[0].username,{ expires: new Date(Date.now() + 90000000), httpOnly: true });
                            
                        }
                        callback();
                    } else {
                        err = 'Incorect Username or password';
                        callback();
                    }
                });
            } else {
                callback();
            }
        }
    ], function () {
        if (!sess.is_logged_in) {
            if (submit != '' && submit == 'Log in') {
                if (err != '') {
                    var data = {
                        "err": err
                    };
                    res.render('login.html', data);
                } else {
                    if (login_success) {
                        res.redirect('/account');
                    }
                }
            } else {
                res.render('login.html');
            }
        } else {
            res.redirect('/account');
        }
    });

};