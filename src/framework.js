'use strict';

const node = require('./node.js');

class Hooks extends node.events.EventEmitter {
  async emit(name, ...args) {
    const handlers = super.listeners(name);
    for (const handler of handlers)
      await handler(...args);
  }
}

const routing = new Map();
const api = {};
const domain = {};
const hooks = new Hooks();

module.exports = {
  routing,
  api,
  domain,
  hooks,
};
