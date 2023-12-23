'use strict';

const node = require('./node.js');
const npm = require('./npm.js');
const Session = require('./session.js');
const staticServer = require('./static.js');
const { routing, hooks } = require('./framework.js');
const { MIME_TYPES, HEADERS } = require('./constants.js');

const Validator = npm.ajv;
const validator = new Validator();

const receiveBody = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  return buffers;
};

const receiveJSON = async (req) => {
  const buffers = await receiveBody(req);
  if (buffers.length) {
    try {
      const data = Buffer.concat(buffers).toString();
      return JSON.parse(data);
    } catch (err) { /* Ignore */ }
  }
  return {};
};

const parsers = {
  'application/json': receiveJSON,
  default: () => ({}),
};

class ClientError extends Error {
  constructor(msg = '', { httpCode = 400 } = {}) {
    super(msg);
    this.httpCode = httpCode;
  }
}

module.exports = (options) => {
  const { console, host, port, prefix } = options;
  const serveStatic = options.static ? staticServer(options) : null;

  class Client {
    #req;
    #res;
    #url;
    state = {};
    Error = ClientError;

    static async decorate(req, res) {
      const contentType = req.headers['content-type'];
      const parser = parsers[contentType] || parsers.default;
      const body = await parser(req);
      const client = new Client(req, res, body);
      await hooks.emit('onRequest', client);
      return client;
    }

    constructor(req, res, body) {
      this.#req = req;
      this.#res = res;
      this.#url = new URL(req.url, `http://${req.headers.host}`);
      this.body = body;
      this.session = new Session(this);
    }

    get ip() {
      return this.#req.socket.remoteAddress;
    }

    get url() {
      return this.#url.pathname;
    }

    get method() {
      return this.#req.method;
    }

    get headers() {
      return this.#req.headers;
    }

    get host() {
      return this.#req.headers.host;
    }

    get query() {
      return this.#url.searchParams;
    }

    async error(err) {
      await hooks.emit('onError', err);
      const code = err instanceof this.Error ? err.httpCode : 500;
      const { message } = err;
      const { url, method } = this.#req;
      const status = node.http.STATUS_CODES[code];
      const pass = code < 500 || code > 599;
      const error = pass ? message : status || 'Unknown error';
      const reason = `${code}\t${message}`;
      console.error(`${this.ip}\t${method}\t${url}\t${reason}`);
      this.send({ error }, code);
    }

    async send(obj, code = 200) {
      const res = this.#res;
      if (res.writableEnded) return;
      const httpCode = obj?.httpCode;
      if (httpCode) {
        code = httpCode;
        if (obj) obj.httpCode = undefined;
      }
      const data = obj ? JSON.stringify(obj) : '';
      const session = this.session.cookie();
      if (session) res.setHeader('Set-Cookie', session);
      await hooks.emit('onSend');
      if (httpCode === 204 || !data) {
        res.writeHead(code, { ...HEADERS });
        res.end();
      } else {
        res.writeHead(code, { ...HEADERS, 'Content-Type': MIME_TYPES.json });
        res.end(data);
      }
    }
  }

  const server = node.http.createServer(async (req, res) => {
    if (!req.url.startsWith(prefix))
      return void await serveStatic(req, res);
    const client = await Client.decorate(req, res);
    const { url, method } = client;
    const resource = routing.get(url);
    const endpoint = resource?.[method.toLowerCase()];
    try {
      await hooks.emit('preValidation', client);
      if (!endpoint) return void client.error(new client.Error(
        `${method} ${url} could not be found`,
        { httpCode: 404 },
      ));
      const { body } = client;
      const { access, scheme, validate, handler } = endpoint;
      if (access !== 'public') {
        if (client.session.isEmpty())
          return void client.error(new client.Error(
            `${method} ${url} requires authorized access`,
            { httpCode: 401 },
          ));
        await hooks.emit('onSession', client);
      }
      const isInvalid = scheme && !validator.validate(scheme, body);
      if (isInvalid || (validate && !await validate(body)))
        return void client.error(new client.Error(
          `${method} ${url} request validation failed`,
          { httpCode: 400 },
        ));
      await hooks.emit('postValidation', client);
      const result = await handler(client);
      client.send(result);
    } catch (err) {
      client.error(err);
    }
  });

  server.listen(port, host, () => console.log(
    `Server listenning at http://${host}:${port}/`
  ));

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      setTimeout(() => {
        console.error('Process took too long to exit. Exiting forcefully');
        process.exit(1);
      }, options.exitTimeout);
      server.close(() => {
        console.log('Server closed. Exiting process');
        process.exit(0);
      });
    });
  });
};
