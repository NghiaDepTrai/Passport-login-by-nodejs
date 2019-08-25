const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const passport = require('passport');
//db config
const db = require('./config/keys').mongooseURI;
require('./config/passport')(passport);
// connect monogoose
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('mongoDB connected...'))
    .catch(err => console.log(err));
// EJS//
app.set('view engine', 'ejs');
app.set('views', './views');
//BodyParse
app.use(express.urlencoded({ extended: false }));
// exprss_session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//pastport middleware
app.use(passport.initialize());
app.use(passport.session());
// connect_flash
app.use(flash());
//global varible
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//router//
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.listen(PORT, console.log(`server started on post $(PORT) `));