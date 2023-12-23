'use strict';

const { framework, db } = require('framework');

framework.domain({
  async create(userId, roleId, projectId) {
    return await db.insert('members', {
      'user_id': userId,
      'role_id': roleId,
      'project_id': projectId,
    }, ['id']);
  },
});
