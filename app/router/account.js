var user_module = require('../module/user_module');
exports.account = function (req, res, next) {
    var app = require('../app');
    var sess = req.session;
    var username;
    var async = app.locals.async;
    if (sess.is_logged_in || req.cookies.is_logged_in_cook) {

        if (typeof sess.is_logged_in != 'undefined') {
            username = sess.username;
        }
        if (req.cookies.is_logged_in_cook && typeof req.cookies.is_logged_in_cook != 'undefined') {
            username = req.cookies.username;
        }
        /*
         async.series([
         function (callback) {
         
         //console.log(sess.username);
         if (typeof sess.is_logged_in != 'undefined') {
         username = sess.username;
         }
         if (req.cookies.is_logged_in_cook && typeof req.cookies.is_logged_in_cook != 'undefined') {
         username = req.cookies.username;
         }
         callback();
         
         
         }, function (callback) {
         user_module.getUserInfo(username, function (data) {
         console.log(data);
         callback();
         });
         }
         ], function () {
         res.render('account.html');
         
         });
         */
        var user_info = '';
        var reg_users = '';
        async.series([
            function (callback) {
                user_module.getUserInfo(username, function (data) {
                    //console.log(data);
                    user_info = data[0];
                    callback();
                });
            },
            function (callback) {
                user_module.getAllusers(function (data_users) {
                    //console.log(data_users);
                    reg_users = data_users;
                    callback();
                });
            }
        ], function () {
            var data = {
                user_info: user_info,
                reg_users: reg_users,
                logged_user:username
            };
            //console.log(data);
            res.render('account.html', data);
        });

    } else {
        res.redirect('/login');
    }



    /*
     //console.log(req.cookies.is_logged_in_cook);
     if (sess.is_logged_in || req.cookies.is_logged_in_cook) {
     //console.log(sess.username);
     if (typeof sess.is_logged_in != 'undefined') {
     username = sess.username;
     }
     if (req.cookies.is_logged_in_cook != 'undefined') {
     username = req.cookies.username;
     }
     
     user_module.getUserInfo(username, function (data) {
     console.log(data);
     });
     res.send('welcome' + username);
     
     } else {
     res.redirect('/login');
     }*/
}

