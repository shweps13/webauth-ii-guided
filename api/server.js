const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions); // for storing sessions in db

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knexConfig = require('../database/dbConfig.js')

const server = express();

const sessionConfiguration = {
  name: 'ohfosho', // default wold be "sid"
  secret: 'keep it secret, keep it safe!', // use an environment var for this
  cookie: {
    httpOnly: false, // JS cannot access the cookies
    maxAge: 1000 * 60 * 60, // expiration time in milliseconds
    // secure: process.env.NODE_ENV === production ? true : false // should be true in production
    secure: false // use cookie over HTTPS only. should be tru in production
  },
  resave: false,
  saveUninitialized: true, //read about GDPR compliance about cookies
  // change to use our DB instead of memory to save the sessions
  store: new KnexSessionStore({
    knex: knexConfig,
    createtable: true, // automaticly create the sessions table
    clearInterval: 1000 * 60 * 30, // delete expired sessions every 3-
  }),
}

// global middleware

server.use(sessions(sessionConfiguration)); // session support

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
