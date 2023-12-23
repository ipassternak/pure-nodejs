'use strict';

const { framework, db, domain } = require('framework');

framework.domain({
  async create(user, projectOptions) {
    const roleId = await domain.roles.getManagerRoleId();
    const project = await db.insert('projects', {
      ...projectOptions,
      status: 'active',
    });
    const projectId = project.id;
    const member = await domain.members.create(user.id, roleId, projectId);
    const memberId = member.id;
    return { project, 'member_id': memberId };
  },

  async checkOwnership(projectId, user) {
    const roleId = await domain.roles.getManagerRoleId();
    const member = await db.findOne('members', {
      'user_id': user.id,
      'project_id': projectId,
      'role_id': roleId,
    });
    return !!member;
  },

  async addMember(projectId, userId, roleId) {
    const member = await db.findOne('members', {
      'user_id': userId,
      'project_id': projectId,
    });
    if (member) return null;
    return domain.members.create(userId, roleId, projectId);
  },

  async getMembers(projectId) {
    const members = await db.findAll('members', {
      'project_id': projectId,
    });
    return members;
  },

  async deleteMember(projectId, userId) {
    const manager = await domain.roles.getManagerRoleId();
    const member = await db.findOne('members', {
      'user_id': userId,
      'project_id': projectId,
    });
    if (!member || member.role_id === manager) return false;
    await db.deleteById('members', member.id);
    return true;
  },
});
