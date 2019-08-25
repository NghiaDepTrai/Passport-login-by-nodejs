const passport = require('passport-local');
const localStrategy = passport.Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// load user model
const User = require('../model/Users');
module.exports = (passport) => {
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            // match User
            User.findOne({email:email})
            .then(user => {
                if(!user) {
                    return done(null,false,{message : 'incorrect username'});
                }
                else {
                    // match password 
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;
                        if(isMatch) {
                            return done(null,user);
                        } else {
                            return done(null,user,{message : 'password incorrect !'});
                        }
                    });
                }
            })
            .catch(err => console.log(err));
            
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}