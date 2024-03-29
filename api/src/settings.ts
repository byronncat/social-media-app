import dotenv = require('dotenv');
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import logger from 'morgan';
import { userDataDB } from './db'; // Run the database connection
import { logger as log } from '@utils';
var cors = require('cors');

const app: Express = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.disable('etag');

// Passport + session
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 10 },
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes
const setRoutes = require('./routes/routes');
setRoutes(app);

// Catch 404 and forward to error handler
app.use(function (next: NextFunction) {
  next(createError(404));
});

// Error handler
app.use(function (err: any, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  log.error(err, 'Main Error Handler');
});

module.exports = app;
