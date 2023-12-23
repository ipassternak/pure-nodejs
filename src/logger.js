'use strict';

const node = require('./node.js');
const { ENV } = require('./constants.js');

const COLORS = {
  info: '\x1b[1;37m',
  debug: '\x1b[1;33m',
  error: '\x1b[0;31m',
  system: '\x1b[1;34m',
  access: '\x1b[1;38m',
};

const DATE_LENGTH = 10;
const DATETIME_LENGTH = 19;

class Logger {
  constructor(logPath) {
    const dist = new Date().toISOString().substring(0, DATE_LENGTH);
    const filePath = node.path.join(logPath, `${dist}.log`);
    this.dist = dist;
    this.path = logPath;
    if (node.env === ENV.prod)
      this.stream = node.fs.createWriteStream(filePath, { flags: 'a' });
    this.regexp = new RegExp(node.path.dirname(this.path), 'g');
  }

  close() {
    return new Promise((resolve) => this.stream.end(resolve));
  }

  reopen(dist) {
    const filePath = node.path.join(this.logPath, `${dist}.log`);
    this.close();
    this.dist = dist;
    this.stream = node.fs.createWriteStream(filePath, { flags: 'a' });
  }

  write(s, type = 'info') {
    const now = new Date().toISOString();
    const date = now.substring(0, DATETIME_LENGTH);
    const color = COLORS[type];
    const line = date + '\t' + s;
    console.log(color + line + '\x1b[0m');
    if (node.env !== ENV.prod) return;
    const out = line.replace(/[\n\r]\s*/g, '; ') + '\n';
    const dist = now.substring(0, DATE_LENGTH);
    if (this.dist !== dist) this.reopen(dist);
    this.stream.write(out);
  }

  log(...args) {
    const msg = node.util.format(...args);
    this.write(msg);
  }

  dir(...args) {
    const msg = node.util.inspect(...args);
    this.write(msg);
  }

  debug(...args) {
    const msg = node.util.format(...args);
    this.write(msg, 'debug');
  }

  error(...args) {
    const msg = node.util.format(...args).replace(/[\n\r]{2,}/g, '\n');
    this.write(msg.replace(this.regexp, ''), 'error');
  }

  system(...args) {
    const msg = node.util.format(...args);
    this.write(msg, 'system');
  }

  access(...args) {
    const msg = node.util.format(...args);
    this.write(msg, 'access');
  }
}

module.exports = ({ path }) => {
  const logPath = node.path.join(node.cwd, path);
  return new Logger(logPath);
};
