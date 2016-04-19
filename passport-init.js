var mongoose = require('mongoose'),
		User = require('./models/user'),
		LocalStrategy   = require('passport-local').Strategy,
		FacebookStrategy = require('passport-facebook').Strategy,
		GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
		configAuth = require('./config/auth'),
		bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			//console.log('deserializing user:',user.username);
			done(err, user);
		});
	});

	passport.use('local-login', new LocalStrategy({
			passReqToCallback : true,
			usernameField: 'email',
			passwordField: 'password'
		},
		function(req, email, password, done) {

			// check in mongo if a user with email exists or not
			User.findOne({ 'email' :  email },
				function(err, user) {
					// In case of any error, return using the done method
					if (err)
						return done(err);
					// Username does not exist, log the error and redirect back
					if (!user){
						console.log('User Not Found with email '+email);
						return done(null, false);
					}
					// User exists but wrong password, log the error
					if (user.password !== password){
						console.log('Invalid Password');
						return done(null, false); // redirect back to login page
					}
					else {
						return done(null,user);
					}

			});
		}
	));

	passport.use('sign-up', new LocalStrategy({
			passReqToCallback : true,// allows us to pass back the entire request to the callback
			usernameField: 'email',
			passwordField: 'password'
		},

		function(req, email, password, done) {
			// find a user in mongo with provided email
			User.findOne({ 'email' :  email }, function(err, user) {
				console.log("In Register now");
				// In case of any error, return using the done method
				if (err){
					console.log('Error in register: '+err);
					return done(err);
				}
				// already exists
				if (user) {
					console.log('User already exists:');
					return done(null, false);
				} else {
					// if there is no user, create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.email = email;
					newUser.password = password;
					newUser.firstName = req.body.firstName;
          newUser.lastName=req.body.lastName;
					// save the user
					newUser.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);
							throw err;
						}
						console.log(newUser.email + ' Registration succesful');
						return done(null, newUser);
					});
				}
			});
		})
	);

	passport.use(new FacebookStrategy({
		    clientID: configAuth.facebookAuth.clientID,
		    clientSecret: configAuth.facebookAuth.clientSecret,
		    callbackURL: configAuth.facebookAuth.callbackURL,
				profileFields:['id','email','name','displayName','photos']
		  },
		  function(accessToken, refreshToken, profile, done) {
		    	process.nextTick(function(){
		    		User.findOne({'facebook.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user) {
								console.log('Saved directly from Facebook');
		    				return done(null, user);
		    			} else {
		    				var newUser = new User();
		    				newUser.facebook.id = profile.id;
		    				newUser.facebook.token = accessToken;
		    				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
		    				newUser.facebook.email = profile.emails[0].value;

		    				newUser.save(function(err){
		    					if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    			//	console.log(profile);

		    			}
		    		});
		    	});
		    }

		));

		passport.use(new GoogleStrategy({
		    clientID: configAuth.googleAuth.clientID,
		    clientSecret: configAuth.googleAuth.clientSecret,
		    callbackURL: configAuth.googleAuth.callbackURL
		  },
		  function(accessToken, refreshToken, profile, done) {
		    	process.nextTick(function(){
		    		User.findOne({'google.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user)
		    				return done(null, user);
		    			else {
		    				var newUser = new User();
		    				newUser.google.id = profile.id;
		    				newUser.google.token = accessToken;
		    				newUser.google.name = profile.displayName;
		    				newUser.google.email = profile.emails[0].value;

		    				newUser.save(function(err){
		    					if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    			}
		    		});
		    	});
		    }

		));




	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.local.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
