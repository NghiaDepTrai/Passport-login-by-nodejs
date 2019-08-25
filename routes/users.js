const express = require('express');
const router = express.Router();
const User = require('../model/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});
// router handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    //check required filed
    async function checkRequireFiled() {
        if (!name || !email || !password || !password2) {
            await errors.push({ message: 'fill in all filed' });
        }
    }
    //check password same password2 ?
    async function checkPassword() {
        if (password !== password2)
            await errors.push({ message: 'your password2 not the same password..please check it out' });
    }

    //check length of password 
    async function checkLengthPassword() {
        if (password.length < 6)
            await errors.push({ message: 'length of password is too short' });
    }
    // check another error
    function checkErrors() {
        if (errors.length > 0) {
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        } else {

            //validation(xac nhan) pass
            User.findOne({ email: email })
                .then(user => {
                    if (user) {
                        errors.push({ message: 'email already register...' });
                        res.render('register', {
                            errors,
                            email,
                            name,
                            password,
                            password2,
                        });
                    } else {
                        function SendMessageToClient() {
                            const newUser = new User({
                                name,
                                email,
                                password,
                            });
                            console.log(newUser);
                            // encrypt password
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    // set password to hashed
                                    newUser.password = hash;
                                    //save user
                                    newUser.save()
                                        .then(user => {
                                            req.flash('success_msg', 'you are now register');
                                            res.redirect('/users/login');
                                        })
                                        .catch(err => console.log(err));
                                });
                            });
                            console.log('encrypt password!!!');
                        }
                        SendMessageToClient();
                    }

                })
        }
    }
    checkRequireFiled();
    checkPassword();
    checkLengthPassword();
    checkErrors();

});
// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});
//logout
router.get('/logout',(req,res) => {
    req.logOut();
    req.flash('success_msg','you log out successfull');
    res.redirect('/users/login');
})

module.exports = router;