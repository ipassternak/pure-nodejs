'use strict';

const { framework, db } = require('framework');

framework.domain({
  async getRoleId(name) {
    const role = await db.findOne('roles', { name });
    return role ? role.id : 0;
  },

  async getManagerRoleId() {
    return this.getRoleId('manager');
  },
});
