'use strict';

const { framework, db, domain } = require('framework');

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
      await db.findById('projects', id) :
      await db.findAll('projects');
    if (id && !data) throw new client.Error('Project not found', 404);
    return { data };
  },
});

framework.post({
  scheme: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 4,
        maxLength: 50,
      },
      description: {
        type: 'string',
        maxLength: 4000,
      },
      logo: {
        type: 'string',
        maxLength: 200,
        pattern: '^https://[a-zA-Z0-9]+'
      },
      'start_date': {
        type: 'string',
      },
      'end_date': {
        type: 'string',
      },
    },
    required: ['title', 'start_date'],
    additionalProperties: false,
  },
  handler: async (client) => {
    const { user } = client.state;
    const { title } = client.body;
    const project = await db.findOne('projects', { title });
    if (project)
      throw new client.Error('Project with this title already exists');
    const data = await domain.projects.create(user, client.body);
    return { data, httpCode: 201 };
  },
});

framework.patch({
  scheme: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      title: {
        type: 'string',
        minLength: 4,
        maxLength: 50,
      },
      description: {
        type: 'string',
        maxLength: 4000,
      },
      logo: {
        type: 'string',
        maxLength: 200,
        pattern: '^https://[a-zA-Z0-9]+'
      },
      'start_date': {
        type: 'string',
      },
      'end_date': {
        type: 'string',
      },
    },
    required: ['id'],
    additionalProperties: false,
  },
  handler: async (client) => {
    const { id, ...data } = client.body;
    const exists = await db.exists('projects', id);
    if (!exists) throw new client.Error('Project not found', 404);
    const isOwner = await domain.projects.checkOwnership(id, client.state.user);
    if (!isOwner) throw new client.Error(
      'Only manager can change project',
      { httpCode: 403 }
    );
    const { title } = data;
    if (title) {
      const booked = await db.findOne('projects', { title });
      if (booked)
        throw new client.Error('Project with this title already exists');
    }
    const updated = await db.updateById('projects', id, data);
    return { project: updated };
  },
});

framework.delete({
  scheme: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
    },
    required: ['id'],
  },
  handler: async (client) => {
    const { id } = client.body;
    const exists = await db.exists('projects', id);
    if (!exists) throw new client.Error('Project not found', 404);
    const isOwner = await domain.projects.checkOwnership(id, client.state.user);
    if (!isOwner) throw new client.Error(
      'Only manager can delete project',
      { httpCode: 403 }
    );
    await db.deleteById('projects', id);
    return { httpCode: 204 };
  },
});

framework.nested('/members', (instance) => {
  instance.post({
    scheme: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
        'user_id': {
          type: 'integer',
        },
      },
      required: ['id', 'user_id'],
    },
    handler: async (client) => {
      const { id, user_id: userId } = client.body;
      const exists = await db.exists('projects', id);
      if (!exists) throw new client.Error('Project not found', 404);
      const isOwner =
        await domain.projects.checkOwnership(id, client.state.user);
      if (!isOwner) throw new client.Error(
        'Only manager can add members',
        { httpCode: 403 }
      );
      const role = await domain.roles.getRoleId('member');
      const member = await domain.projects.addMember(id, userId, role);
      if (!member) throw new client.Error('Member already exists');
      return { member, httpCode: 201 };
    },
  });

  instance.delete({
    scheme: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
        'user_id': {
          type: 'integer',
        },
      },
      required: ['id', 'user_id'],
    },
    handler: async (client) => {
      const { id, user_id: userId } = client.body;
      const exists = await db.exists('projects', id);
      if (!exists) throw new client.Error('Project not found', 404);
      const isOwner =
        await domain.projects.checkOwnership(id, client.state.user);
      if (!isOwner) throw new client.Error(
        'Only manager can delete members',
        { httpCode: 403 }
      );
      const deleted = await domain.projects.deleteMember(id, userId);
      if (!deleted) throw new client.Error('Member cannot be deleted');
      return { httpCode: 204 };
    },
  });
});
