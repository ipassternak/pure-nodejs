'use strict';

const { framework, api, common } = require('framework');

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
    if (user) throw new client.Error('User already exists');
    const hash = await common.hashPassword(password);
    await api.auth.provider.registerUser(login, hash);
    return { status: 'success', httpCode: 201 };
  }
});
