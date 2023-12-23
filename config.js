'use strict';

const { env } = require('./src/common.js');

module.exports = {
  app: {
    path: './app',
  },
  server: {
    static: './public',
    port: 8000,
    host: 'localhost',
    prefix: '/api',
    protocol: 'http',
    exitTimeout: 5000,
  },
  log: {
    path: './log',
  },
  db: {
    provider: 'postgresql',
    host: 'localhost',
    port: 5432,
    user: env('DB_USER'),
    password: env('DB_PASSWORD'),
    database: env('DB_DATABASE'),
  },
  session: {
    expires: 1000 * 60 * 60 * 24 * 30, // 1 month
  },
};
