var mongoose = require('mongoose'),
		User = require('./models/user'),
		LocalStrategy   = require('passport-local').Strategy,
		FacebookStrategy = require('passport-facebook').Strategy,
		GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
		configAuth = require('./config/auth'),
		bCrypt = require('bcrypt-nodejs');
		GitHubStrategy = require('passport-github2').Strategy;
module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log("in serialize");
		console.log(user);
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		console.log('=====Deserializing User: ', id);
		User.findById(id, function(err, user) {

			 console.log("In desrialize",user);
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
					console.log("In passport init",user);
					console.log(err);
					// In case of any error, return using the done method
					if (err)
						return done(err);
					// Email does not exist, log the error and redirect back
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
						// console.log("passing This: ");
						// console.log(user);
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
					if(req.body.firstName===undefined)
					{
					newUser.firstName = "";
				  }
					else{
						newUser.firstName=req.body.firstName;
					}
					if(req.body.lastName===undefined)
					{
					newUser.lastName = "";
				  }
					else{
						newUser.lastName=req.body.lastName;
					}
					console.log(req.body.firstName);
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

								console.log("----------" , profile.photos);
		    				var newUser = new User();
		    				newUser.facebook.id = profile.id;
		    				newUser.facebook.token = accessToken;
								newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
		    				newUser.facebook.email = profile.emails[0].value;
								newUser.firstName=profile.name.givenName;
								newUser.lastName=profile.name.familyName;
								newUser.email=profile.emails[0].value;
								newUser.photo = profile.photos[0].value ;

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

		passport.use(new GoogleStrategy({
		    clientID: configAuth.googleAuth.clientID,
		    clientSecret: configAuth.googleAuth.clientSecret,
		    callbackURL: configAuth.googleAuth.callbackURL
		  },
		  function(accessToken, refreshToken, profile, done) {
		    	process.nextTick(function(){
						console.log(profile);
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

								a=profile.displayName.split(" ");
								newUser.firstName=a[0];
								newUser.lastName=a[a.length-1];
								newUser.email=profile.emails[0].value;


		    				newUser.save(function(err){
		    					if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    				console.log(profile);
		    			}
		    		});
		    	});
		    }

		));

		passport.use(new GitHubStrategy({
			clientID: configAuth.githubAuth.clientID,
			clientSecret: configAuth.githubAuth.clientSecret,
			callbackURL: configAuth.githubAuth.callbackURL,
			passReqToCallback: true
		  },
		  function(req,accessToken, refreshToken, profile, done) {
				console.log("entering in github");
				console.log(accessToken);
				console.log(refreshToken);

		    // asynchronous verification, for effect...
		    process.nextTick(function () {
					User.findOne({'github.id': profile.id}, function(err, user){
						if(err){
							console.log(err);
							return done(err);}
						if(user){
							console.log("inside tick");

							user.github.token=accessToken;
							console.log(user);
							user.save(function(err){
								if(err)
								throw err;
								return done(null, user.github);
							})
							}
						else {
							console.log("printing accessToken");

							//req.user.github=github;
							User.findOne({'_id':req.user._id},function(err,doc){
								if(err){
									return done(err);
								}
								var github={};
								github.id=profile.id;
								github.token=accessToken;
								github.name=profile.username;
								doc.github=github;
								req.user.github=github;
								console.log("doc is",doc);
								doc.save(function(err){
									if(err)
									throw err;
									return done(null,github);
								});

							});


		      // To keep the example simple, the user's GitHub profile is returned to
		      // represent the logged-in user.  In a typical application, you would want
		      // to associate the GitHub account with a user record in your database,
		      // and return that user instead.

		    }});
		  });
		}));


	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.local.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
