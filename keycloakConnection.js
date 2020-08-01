const fs = require('fs');
const Keycloak = require('keycloak-connect');
const session = require('express-session');

let keycloak = null;

function connectKeycloak(server) {
  if (fs.existsSync('./config/keycloak.json')) {
    const memoryStore = new session.MemoryStore();

    server.use(session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    }));

    keycloak = new Keycloak({ store: memoryStore }, './config/keycloak.json');
    server.use(keycloak.middleware());
  }
}

function protect() {
  if (keycloak) {
    return keycloak.protect();
  }
  return (req, res, next) => {
    next();
  };
}

module.exports.connectKeycloak = connectKeycloak;
module.exports.protect = protect;
