'use strict';

const { framework, api } = require('framework');

framework.post({
  handler: async (client) => {
    const token = client.session.get('token');
    await api.auth.provider.deleteSession(token);
    client.session.clear();
    return { status: 'success' };
  },
});
