var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var async = require('async');

var stock = require('../model/stock');
var stockInfo = require('../model/stockInfo');

var nodemailer = require('nodemailer');
var crypto = require('crypto');
var Asset = require('../model/asset');
var User = require('../model/user');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

//Deploy local strategy of passport
passport.use(new LocalStrategy( function(username, password, done) {
		console.log('username, password:', username, password);
		User.getUserByUsername(username, function(err, user){
			if(err) done(err);
			if(!user){
				return done(null, false, {message: 'User you typed does not exist.'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) done(err);
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Password does not match username.'});
				}
			});
		});
}));

router.get('/assete', function(req,res,next){
    var user_id = 1;
    Asset.getAssete(user_id,(err,total_assetes,total_amount)=> {
		var result = {
			total_amount: total_amount,
			total_assetes: total_assetes
		}
        res.json(result);
    });
    
});
/* GET users listing. */
router.get('/signup', function(req, res, next) {
	//res.send('respond with a resource');
	if (req.user) {
  		req.flash('error_msg', 'invalid Attempt');
  		res.redirect('/');
  	} else {
  		stockInfo.searchPriceByFamousSymbol(function(callback) {
			 res.render('signup', {
			    aapl : callback['AAPL']['quote']['latestPrice'],
			    amzn : callback['AMZN']['quote']['latestPrice'],
			    goog : callback['GOOG']['quote']['latestPrice'],
			    nflx : callback['NFLX']['quote']['latestPrice'],
			    adbe : callback['ADBE']['quote']['latestPrice'],
			    gs : callback['GS']['quote']['latestPrice'],
			    jpm : callback['JPM']['quote']['latestPrice'],
			    c : callback['C']['quote']['latestPrice'],
			    ms : callback['MS']['quote']['latestPrice'],
			    bx : callback['BX']['quote']['latestPrice'],
			    ibm : callback['IBM']['quote']['latestPrice']
			 });	
	  	});
	}
});

router.get('/login', function(req, res, next) {
  //res.send('respond with a resource');
  	if (req.user) {
  		req.flash('error_msg', 'invalid Attempt');
  		res.redirect('/');
  	} else {
	
		stockInfo.searchPriceByFamousSymbol(function(callback) {
			 res.render('login', {
			    aapl : callback['AAPL']['quote']['latestPrice'],
			    amzn : callback['AMZN']['quote']['latestPrice'],
			    goog : callback['GOOG']['quote']['latestPrice'],
			    nflx : callback['NFLX']['quote']['latestPrice'],
			    adbe : callback['ADBE']['quote']['latestPrice'],
			    gs : callback['GS']['quote']['latestPrice'],
			    jpm : callback['JPM']['quote']['latestPrice'],
			    c : callback['C']['quote']['latestPrice'],
			    ms : callback['MS']['quote']['latestPrice'],
			    bx : callback['BX']['quote']['latestPrice'],
			    ibm : callback['IBM']['quote']['latestPrice']
			 });	
	  	});
	}
});

router.get('/profile', function(req, res, next) {
	if (!req.user) {
		req.flash('error_msg', 'invalid Attempt');
		res.redirect('/');
	} else {
	  	stockInfo.searchPriceByFamousSymbol(function(callback) {
			res.render('profile', {
				aapl : callback['AAPL']['quote']['latestPrice'],
				amzn : callback['AMZN']['quote']['latestPrice'],
				goog : callback['GOOG']['quote']['latestPrice'],
				nflx : callback['NFLX']['quote']['latestPrice'],
				adbe : callback['ADBE']['quote']['latestPrice'],
				gs : callback['GS']['quote']['latestPrice'],
				jpm : callback['JPM']['quote']['latestPrice'],
				c : callback['C']['quote']['latestPrice'],
				ms : callback['MS']['quote']['latestPrice'],
				bx : callback['BX']['quote']['latestPrice'],
				ibm : callback['IBM']['quote']['latestPrice'],
				username : req.user.username,
				password : req.user.password,
				email : req.user.email,
				notification_value : req.user.notification_value,
				user : req.user
			});	
		});
	}
});

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success_msg', 'Successfully logged Out');
	res.redirect('/');
})


router.get('/resetpw', function(req, res) {
	res.render('resetpw');
})

router.get('/reset/:token', function(req, res) {
		User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function(err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/user/resetpw');
		}
		console.log(user.username);
		res.render('reset', {token: encodeURIComponent(JSON.stringify(req.params.token))});
	});
})

router.post('/signup', function(req, res, next) {
	var signupUsername = req.body.username;
	var signupEmail = req.body.email;
	var signupPassword = req.body.password;
	var signupConfirmPassword = req.body.passwordConfirm;

	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password', 'Password can not be less than 6 characters').len(6, 30);
	req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);
	var errors = req.validationErrors();

	if(errors){
		return res.render('signup',{
			errors:errors
		});
	} else {
		var newUser = new User({
			email: signupEmail,
			username: signupUsername,
			password: signupPassword,
			coin: 1000000,
			notification_value: 0
		});

		User.find({$or: [{username: signupUsername}, {email: signupEmail}]}, function(err, docs) {
			if (docs.length) {
				req.flash('error_msg', 'The username or email has already existed');
				return res.redirect('/user/signup');
			}
			else {
				User.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
				return res.redirect('/user/login');
				});
				req.flash('success_msg', 'You are registered and can now login.');
			}
		});
	}

});

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }),
  function(req, res) {
  	// NOTIFICATION UPDATE WHEN LOG IN
  	var userlist = req.user.watchlist;
	var listLength = userlist.length;
	console.log(listLength);

	for (var i = 0; i < listLength; i++) {
		stock.findOne({_id : userlist[i]}, function(err, stock){
			var sym = stock.symbol;
			
			stockInfo.searchStockBySymbl(sym, function(err, inform) {
				var s = JSON.parse(JSON.stringify(inform));
				var changePercent = s[sym]['quote']['changePercent'],
					companyName = s[sym]['quote']['companyName'],
					price = s[sym]['quote']['latestPrice'],
					pos_not_val = req.user.notification_value,
					neg_not_val = req.user.notification_value * -1,
					msg_list = req.user.alert;

				var isInArray = false,
					index = -1;

				// for (var j = 0; j < msg_list.length; j++) {
				// 	if (msg_list[j].sym === sym) {
				// 		isInArray = true;
				// 		if (isInArray) {
				// 			index = j;
				// 		}
				// 		break;
				// 	}
				// }

				if (changePercent > pos_not_val){
					var msg = companyName + " has risen by " + changePercent + "%.", 
						new_alert_msg = new Object({
							sym: sym,
							msg: msg
						});
					// if (isInArray) {
					// 	var	getIndex = 'alert.' + index + '.msg';
					// 	User.findOneAndUpdate({_id : req.user._id}, {$set: {getIndex : msg}},
					// 		function(error, success) {
					// 			if (error) {
					// 				console.log("error");
					// 				console.log(error);
					// 			} else {
					// 				console.log("success");
					// 				//console.log(success);
					// 			}
					// 		}
					// 	);
					// }

					User.findOneAndUpdate({_id : req.user._id}, {$push: {alert : new_alert_msg}},
						function(error, success) {
							if (error) {
								console.log("error");
									//console.log(error);
							} else {
								console.log("success");
								//console.log(success);
							}
						}
					);
				} else if (changePercent < neg_not_val) {
					var msg = companyName + " has dropped by " + changePercent + "%.",
						new_alert_msg = new Object({
							sym: sym,
							msg: msg
						});
					User.findOneAndUpdate({_id : req.user._id}, {$push: {alert : new_alert_msg}},
						function(error, success) {
							if (error) {
								console.log("error");
									//console.log(error);
							} else {
								console.log("success");
								//console.log(success);
							}
						}
					);
					//User.update();
				}

			})
		});
	}
	
	req.flash('success_msg', 'You are logged in');
	res.redirect('/');
 });

router.post('/profile', function(req, res, next){

	// Get the updated information
	var newEmail = req.body.email;
	var newPassword = req.body.password;
	var newConfirmPassword = req.body.passwordConfirm;
	var newNotificationValue = req.body.newNotificationValue;

	var query = {'username': req.user.username};

	// update password
	if (newPassword === newConfirmPassword) {	
		// user does not type password
		if (newPassword.length === 0) {
			User.findOneAndUpdate(query, {
				'email': newEmail || '',
				'notification_value': newNotificationValue
			}, {upsert: true},
			function(err, user){
				if(err) throw err;
				// Validation
				req.checkBody('email', 'Email is not valid').isEmail();
				if (newPassword.length !== 0) {
					req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
				}
				var errors = req.validationErrors();
				if(errors){
					req.flash('error_msg', 'Your email is not valid or your password cannot be less than 6');
					res.redirect('/user/profile');
				} else {
					user.save(function(err){
						if (err) {
							return next(err);
						}
						req.flash('success_msg', 'Profile information has been updated.');
						res.redirect('/user/profile');
						});
				}
			});
		} else {
			// Validation
			req.checkBody('email', 'Email is not valid').isEmail();
			if (newPassword !== 0) {
				req.checkBody('password', 'Password cannot be less than 6').len(6, 30);
			}
			var errors = req.validationErrors();
			console.log(errors);
			if(errors){
				req.flash('error_msg', 'Your email is not valid or your password cannot be less than 6');
				res.redirect('/user/profile');
			} else {
				var newHashedPw = newHash(query, newPassword);
				User.findOneAndUpdate(query, {
					'email': newEmail || '',
					'password': newHashedPw
				}, {upsert: true},
				function(err, user){
					if(err) throw err;
					user.save(function(err){
						if (err) {
							return next(err);
						}
						req.flash('success_msg', 'Profile information has been updated.');
						res.redirect('/user/profile');
					});	
				});
			}
		}			
	}
	else {
		req.flash('error_msg', 'Password does not match');
	}
});

router.post('/profile/deleteAllMsg', function(req, res, next) {
	var len = req.user.alert.length;
	req.user.alert.splice(0, len);
	req.user.save();

	res.redirect('/user/profile');
});


//requesting token
router.post('/resetpw', function(req, res, next) {
	async.waterfall([
		function(done) {
			// Randomly generate a token
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({ email: req.body.email }, function(err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('/user/resetpw');
				}

				user.resetPasswordToken = token;
	        	user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	        	user.save(function(err) {
					done(err, token, user);
	        	});
	    	});
		},
		function(token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'billionaire.cs407@gmail.com',
					pass: 'hihellohi'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'billionaire.cs407@gmail.com',
				subject: 'Billionaire - Account Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/user/reset/' + token + '\r\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
		res.redirect('/user/login');
	});
});

//reset password
router.post('/reset/:token', function(req, res) {
	//console.log('token test');
	console.log(req.params.token);

	//console.log(req.user.username);
	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function(err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					console.log('reset password using token view:reset');
					return res.redirect('back');
				}
				console.log(user.username);
				var newPassword = req.body.password;
				var confirmPassword = req.body.confirmPassword;
				var query = {'username': user.username};
				newHash(query, newPassword);
		        user.resetPasswordToken = undefined;
		        user.resetPasswordExpires = undefined;

       			user.save(function(err) {
					req.logIn(user, function(err) {
						done(err, user);
					});
        		});
    		});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'billionaire.cs407@gmail.com',
					pass: 'hihellohi'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'billionaire.cs407@gmail.com',
				subject: 'Billionaire - Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
	], function(err) {
		res.redirect('/');
	});

});

var newHash = function(query, password){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			User.findOneAndUpdate(query, {
				'password': hash
			}, {upsert: true}, function(err, user){
				if(err) throw err;
			});
		});
	});
};

module.exports = router;
