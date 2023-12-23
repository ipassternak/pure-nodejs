'use strict';

const config = require('./config.js');
const node = require('./src/node.js');
const npm = require('./src/npm.js');
const common = require('./src/common.js');
const server = require('./src/server.js');
const connectToDb = require('./src/db.js');
const createLogger = require('./src/logger.js');
const createLoader = require('./src/loader.js');

const APP = node.path.join(node.cwd, config.app.path);
const API = node.path.join(APP, './api');
const LIB = node.path.join(APP, './lib');
const DOMAIN = node.path.join(APP, './domain');
const application = [API, DOMAIN, LIB];

const console = createLogger(config.log);
const db = connectToDb(config.db);

const sandbox = node.vm.createContext({ console });
const modules = {
  db,
  node,
  npm,
  config,
  common,
};

const loader = createLoader(sandbox, modules, config.server);

(async () => {
  db.healthcheck();
  for (const dir of application) await loader.loadDir(dir);
  server({ ...config.server, console });
})();
