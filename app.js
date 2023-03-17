var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const verifyJWT = require('./middlewares/verifyJWT')

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/users');
var newsRouter = require('./routes/news')
var registerRouter = require('./routes/register')
var authRouter = require('./routes/auth')
var refreshRouter = require('./routes/refresh')
var logoutRouter = require('./routes/logout')




var app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/register', registerRouter)
app.use('/auth',authRouter)
app.use('/logout',logoutRouter)
app.use('/refresh',refreshRouter)
app.use('/news',newsRouter);



//Authorization below this line
app.use(verifyJWT);
app.use('/', indexRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app