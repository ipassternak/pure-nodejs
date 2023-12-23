'use strict';

const { framework, db } = require('framework');

framework.get({
  access: 'public',
  scheme: {
    anyOf: [
      {},
      {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
        },
        required: ['id'],
      },
    ],
  },
  handler: async (client) => {
    const { id } = client.body;
    const data = id ?
      await db.findById('users', id, ['id', 'login', 'email', 'phone']) :
      await db.findAll('users', ['id', 'login', 'email', 'phone']);
    if (id && !data) throw new client.Error('User not found', 404);
    return { data };
  },
});
