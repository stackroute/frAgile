var express = require('express'),
  router = express.Router();

module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({error:null});
    	//res.send({redirect: '/home'});
  //  res.status(200).json();
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({ error: "Invalid Email or Password"});
		// req.session.user=null;
	});
  router.get('/regfailure', function(req, res){
		res.send({ error: "Email Id already exits"});
		// req.session.user=null;
	});

	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
  router.use('/register',function(req,res,next) {
    console.log("Request Body.",req.body);
    next();
  });
	router.post('/register', passport.authenticate('sign-up', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/regfailure'
	}));


  router.get('/logout', function(req, res) {
          req.logout();
          res.redirect('/index.html');
      });
  // router.get('/home',function(req,res) {
  //   console.log("blah");
  // });

//login using facebook
  router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

  	router.get('/facebook/callback',
  	passport.authenticate('facebook', { successRedirect: '/home.html',
  																			failureRedirect: '/index.html' }));

  	//login using google
  	router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    router.get('/google/callback',
  	passport.authenticate('google', { successRedirect: '/home.html',
  																			failureRedirect: '/index.html'}));

	return router;

}
