const fs = require('fs');
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const { ensureLoggedIn } = require('connect-ensure-login');
const passportLocal = require('passport-local');

let keycloak = null;

function connectAuthentication(server, readConfig) {
  if (fs.existsSync('./config/keycloak.json') || fs.existsSync('/opt/config/keycloak.json')) {
    const memoryStore = new session.MemoryStore();

    server.use(session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    }));

    keycloak = fs.existsSync('./config/keycloak.json')?
        new Keycloak({ store: memoryStore }, './config/keycloak.json'):
        new Keycloak({ store: memoryStore }, '/opt/config/keycloak.json');
    server.use(keycloak.middleware());
    return 'keycloak';
  }
  server.use(cookieParser());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(session({
    secret: 'superSecret',
    resave: true,
    saveUninitialized: true,
  }));
  server.use(passport.initialize());
  server.use(passport.session());
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  const LocalStrategy = passportLocal.Strategy;

  passport.use(new LocalStrategy(
    ((username, password, done) => {
      const { users } = readConfig();
      if (users) {
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
          return done(null, { username: user.username });
        }
      }
      return done(null, false, { message: 'Incorrect password.' });
    }),
  ));
  server.use('/login', express.static(`${__dirname}/login`));

  server.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    });
  return 'local';
}

function protect() {
  if (keycloak) {
    return keycloak.protect();
  }
  return ensureLoggedIn('/login');
}

module.exports.connectAuthentication = connectAuthentication;
module.exports.protect = protect;
