'use strict';

const { framework, db, node, api } = require('framework');

framework.api({
  generateToken() {
    return node.crypto.randomUUID();
  },

  async createSession(token, data, expires) {
    const state = JSON.stringify(data);
    const record = { id: token, state };
    if (expires) {
      const date = expires.toISOString();
      Object.assign(record, { 'expires_at': date });
    }
    await db.insert('sessions', record);
  },

  async updateSession(token, data) {
    await db.pg.updateById(
      'sessions',
      token,
      { state: JSON.stringify(data) }
    );
  },

  async deleteSession(token) {
    await db.deleteById('sessions', token);
  },

  async authorize(token) {
    try {
      const session = await db.findById('sessions', token);
      return session;
    } catch (err) {
      return null;
    }
  },

  async registerUser(login, password) {
    return db.insert('users', { login, password, 'system_role': 'user' });
  },

  async getUser(login) {
    return db.findOne('users', { login }, ['id', 'login', 'password']);
  },
});

framework.addHook('onSession', async (client) => {
  const token = client.session.get('token');
  if (token) {
    const session = await api.auth.provider.authorize(token);
    if (session) {
      const exp = session.expires_at;
      if (exp && new Date(exp) < new Date()) {
        await api.auth.deleteSession(token);
        client.session.clear();
      } else {
        const { user } = JSON.parse(session.state);
        client.state.user = user;
        return;
      }
    } else {
      client.session.clear();
    }
  }
  throw new client.Error(
    'Invalid session violents access rules restrictions',
    { httpCode: 401 }
  );
});
