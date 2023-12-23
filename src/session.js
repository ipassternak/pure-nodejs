'use strict';

const UNIX_EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const COOKIE_DELETE = `=deleted; Expires=${UNIX_EPOCH}; Path=/; Domain=`;

const SKEY = 'session';
const EXPIRES_KEY = '__exp';

class Session extends Map {
  #host;
  #prepared = {};
  #cleared = false;

  #parse(cookie) {
    if (!cookie) return;
    const index = cookie.indexOf(SKEY);
    if (index === -1) return;
    const start = index + SKEY.length + 1;
    const end = cookie.indexOf(';', start);
    const payload = cookie.substring(start, end === -1 ? cookie.length : end);
    try {
      const json = Buffer.from(payload, 'base64').toString();
      const data = JSON.parse(json);
      if (data[EXPIRES_KEY] === undefined) throw new Error('Invalid session');
      for (const [key, val] of Object.entries(data)) {
        if (key === EXPIRES_KEY) {
          if (val && val < Date.now()) return void this.clear();
        } else {
          super.set(key, val);
        }
      }
    } catch (err) { /* ignore */ }
  }

  constructor(client) {
    super();
    this.#host = client.host;
    this.#parse(client.headers.cookie);
  }

  set(state, expires = 0) {
    const expField = { [EXPIRES_KEY]: expires };
    Object.assign(this.#prepared, state, expField);
    for (const key of Object.keys(state))
      super.set(key, state[key]);
  }

  delete(key) {
    if (!super.delete(key)) return false;
    const state = Object.fromEntries(super.entries());
    Object.assign(this.#prepared, state, { [key]: undefined });
    if (this.isEmpty()) this.#cleared = true;
    return true;
  }

  clear() {
    super.clear();
    this.#prepared = {};
    this.#cleared = true;
  }

  isEmpty() {
    return super.size === 0;
  }

  cookie() {
    let cookie = '';
    if (this.#cleared) {
      cookie = `${SKEY}${COOKIE_DELETE}${this.#host}`;
    } else {
      if (!Object.keys(this.#prepared).length) return '';
      const exp = this.#prepared[EXPIRES_KEY];
      const expDate = exp ? new Date(exp).toUTCString() : COOKIE_EXPIRE;
      const expires = `expires=${expDate}`;
      const json = JSON.stringify(this.#prepared);
      const state = Buffer.from(json).toString('base64');
      cookie =
        `${SKEY}=${state}; ${expires}; Path=/; Domain=${this.#host} HttpOnly`;
    }
    return cookie;
  }
}

module.exports = Session;
