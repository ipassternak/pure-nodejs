'use strict';

const node = require('./node.js');
const { routing, hooks, api, domain } = require('./framework.js');

const JS_EXT = '.js';
const SCRIPT_OPTIONS = { lineOffset: -1 };
const RUN_OPTIONS = {
  timeout: 5000,
  displayErrors: false,
};

class Framework {
  #prefix;
  #path;
  #route;

  #addRoute(method, handler) {
    if (!routing.has(this.#route)) routing.set(this.#route, {});
    routing.get(this.#route)[method] = handler;
  }

  #mkobj(obj) {
    let container = obj;
    const paths = this.#path.substring(1).split('/');
    for (const name of paths) {
      if (!container[name]) container[name] = {};
      container = container[name];
    }
    return container;
  }

  constructor({ prefix, path }) {
    this.#prefix = prefix;
    this.#path = path;
    this.#route = node.path.join(prefix, path);
  }

  addHook(name, hook) {
    hooks.on(name, hook);
  }

  removeHook(name, hook) {
    hooks.off(name, hook);
  }

  get(handler) {
    this.#addRoute('get', handler);
  }

  post(handler) {
    this.#addRoute('post', handler);
  }

  put(handler) {
    this.#addRoute('put', handler);
  }

  patch(handler) {
    this.#addRoute('patch', handler);
  }

  delete(handler) {
    this.#addRoute('delete', handler);
  }

  api(handlers) {
    const container = this.#mkobj(api);
    for (const [name, handler] of Object.entries(handlers)) {
      container[name] = handler;
    }
  }

  domain(handlers) {
    const container = this.#mkobj(domain);
    for (const [name, handler] of Object.entries(handlers)) {
      container[name] = handler;
    }
  }

  nested(dest, handler) {
    const path = node.path.join(this.#path, dest);
    const framework = new Framework({ prefix: this.#prefix, path });
    handler(framework);
  }
}

module.exports = (sandbox, modules, { prefix = '/' }) => {
  const inject = (route) => (id) => {
    if (id === 'framework') {
      const framework = new Framework(route);
      return {
        framework,
        api,
        domain,
        ...modules,
      };
    }
    throw new Error(`Cannot find module '${id}'`);
  };

  const toRoute = (filePath, base) => {
    const start = base.length;
    const end = filePath.length - JS_EXT.length;
    return { prefix, path: filePath.substring(start, end) };
  };

  const load = async (filePath, base) => {
    if (!filePath.endsWith(JS_EXT)) return null;
    const src = await node.fsp.readFile(filePath, 'utf8');
    const code = `(require, __filename, __dirname) => {${src}}`;
    const script = new node.vm.Script(code, SCRIPT_OPTIONS);
    const module = script.runInContext(sandbox, RUN_OPTIONS);
    const filename = node.path.basename(filePath);
    const dirname = node.path.dirname(filePath);
    const route = toRoute(filePath, base);
    const require = inject(route);
    module(require, filename, dirname);
  };

  const loadDir = async (dirPath, base = dirPath) => {
    const files = await node.fsp.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      const { name } = file;
      const location = node.path.join(dirPath, name);
      const loader = file.isFile() ? load : loadDir;
      await loader(location, base);
    }
  };

  return { load, loadDir };
};
