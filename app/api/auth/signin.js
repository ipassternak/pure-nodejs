'use strict';

const { framework, common, api, config } = require('framework');

framework.post({
  access: 'public',
  scheme: {
    type: 'object',
    properties: {
      login: {
        type: 'string',
        minLength: 4,
        maxLength: 16,
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 32,
      },
    },
    required: ['login', 'password']
  },
  handler: async (client) => {
    const { login, password } = client.body;
    const user = await api.auth.provider.getUser(login);
    if (!user) throw new client.Error('Incorrect login or password');
    const valid = await common.validatePassword(password, user.password);
    if (!valid) throw new client.Error('Incorrect login or password');
    const token = api.auth.provider.generateToken();
    const expires = new Date(Date.now() + config.session.expires);
    await api.auth.provider.createSession(token, { user }, expires);
    client.session.set({ token }, expires.getTime());
    return { status: 'success', httpCode: 201 };
  },
});
