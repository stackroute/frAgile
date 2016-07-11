var express = require('express'),
router = express.Router();
var mongoose = require('mongoose'),
User = require('../models/user.js');
var nodemailer=require('nodemailer');


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
  router.get('/github',passport.authorize('github', { scope: ['repo','user','read:org']}));
  router.get('/github/callback',passport.authorize('github', { successRedirect: '/home.html',failureRedirect: '/home.html' }),
    function(req,res){
      console.log(req);
      console.log("account is",req.account);
      res.redirect('/home.html');
    });

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
    
    router.post('/register', passport.authenticate('sign-up', {
      successRedirect: '/auth/success',
      failureRedirect: '/auth/regfailure'
    }));
      // this is for resetting the password
      router.post('/resetPassword',function(req,res,next){
        console.log("The new password is ",req.body);
        User.findOne({
          'email':req.body.email
        }).exec(function(err,user)
        {
          if(err)
            {    console.log("In data base error " , err);
        }
        else if (!user){
          console.log('User Not Found with email '+email);
          
        } else{

          console.log("User is found: old password ",user.password)

          user.password=req.body.password;
          console.log("User is found: new password ",user.password);
          user.save();
          next();
        }


      })

      });
      //verify new user starts
      router.post('/verifycode',function(req,res,next){
        var email=req.body.email;
        var code=Math.floor(Math.random()*90000) + 10000;
        User.findOne({'email':req.body.email}).exec(function(err,user){
          if(err){
            console.log(err);
            res.send({error:"Something went wrong. Please try again."});
          }else if(user){
            console.log("user is server ", user.password);

         res.send({error:"Entered email belongs to an existing account.Please login with same."})
          } else{
              var transporter=nodemailer.createTransport({

              service:'Gmail',
              auth:{
                user:'mylimberapp@gmail.com',
                pass: 'mylimber@123'
              }
            });
             
             console.log("code is in server ",code);
             var mailOption={
              from:'Limber <mylimberapp@gmail.com>',
              to:email,
              subject:'Welcome to Limber',
              text:"Your varification code is "+code+"Enter this code to register.",
              html:'<b>Limber </b>helps you to manage your project in better way.<h2>Varification code for registering Limber app </h2> Varification code :<b>'+code+'</b> <br><b>Enter this code in Limber App to register.</b>'
            }
            transporter.sendMail(mailOption,function(error,info){
              if(error){

                console.log(error);
                res.redirect('/index.html')
              }
              else{
                console.log("All done!");
                        //res.send(code);
                        console.log("new code, ",code)
                    res.send({code:code});
                    //res.redirect('/index.html')
                  }
                });

          }//main else

        });
       
        console.log("new email",email);

      });
      //verify new user ends
      //this is for forgot password
      router.post('/forgotpass',function(req,res,next)
        { var email=req.body.email;
          console.log(" in server email",req.body);
          User.findOne({
            'email': req.body.email
          }).exec(function(err,user){
            if(err){
              res.send({error:"Something went wrong. Please try again."});
            } else if(!user){
              res.send({error:"User not found. Please sign-up."});

            } else{
             var transporter=nodemailer.createTransport({

              service:'Gmail',
              auth:{
                user:'mylimberapp@gmail.com',
                pass: 'mylimber@123'
              }
            });
             var code=req.body.code;
             console.log("code is in server ",code);
             var mailOption={
              from:'Limber <mylimberapp@gmail.com>',
              to:email,
              subject:'varification',
              text:"Your varification code is "+code+"\nEnter this code to reset your password.",
              html:'<h2>Your varification code is </h2><b>Varification code :'+code+'</b> <p>Enter this code in Limber App to reset your password</p><a href="http://localhost:8080/forgot.html" target="_blank">Click here</a>'
            }
            transporter.sendMail(mailOption,function(error,info){
              if(error){

                console.log(error);
                res.redirect('/forgot.html')
              }
              else{
                console.log("All done!");
                        //res.send(code);
                        res.redirect('/forgot.html')
                      }
                    });
            } //end of final else
          })
     });
      //forgot passwords ends here




      return router;

    }
