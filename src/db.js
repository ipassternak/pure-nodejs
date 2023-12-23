'use strict';

const npm = require('./npm.js');

const valueOps = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  ne: '<>',
};

const pairOps = {
  between: 'BETWEEN',
  nbetween: 'NOT BETWEEN',
};

const listOps = {
  in: 'IN',
  nin: 'NOT IN',
};

valueOps.build = (operator, i) => {
  const op = valueOps[operator];
  return { res: `${op} $${i}`, i };
};

pairOps.build = (operator, i) => {
  const op = pairOps[operator];
  return { res: `${op} $${i} AND $${i + 1}`, i: i + 1 };
};

listOps.build = (operator, i, list) => {
  const op = listOps[operator];
  const params = list.map((_, j) => `$${i + j}`).join(', ');
  return { res: `${op} (${params})`, i: i + list.length - 1 };
};

const build = (operator, i, val) => {
  for (const type of [valueOps, pairOps, listOps])
    if (type[operator]) return type.build(operator, i, val);
  throw new Error(`Invalid operator: ${operator}`);
};

const buildWhereClause = (clause) => {
  const statement = [];
  let param = 1;
  for (const [key, val] of Object.entries(clause)) {
    if (typeof val === 'object') {
      const [operator, value] = Object.entries(val)[0];
      const { res, i } = build(operator, param, value);
      param = i;
      statement.push(`${key} ${res}`);
    } else {
      statement.push(`${key} = $${param}`);
    }
    param++;
  }
  return statement.join(' AND ');
};

module.exports = (options, pool = new npm.pg.Pool(options)) => ({
  healthcheck: () => pool.query('SELECT true::BOOLEAN AS healthcheck;'),

  async query(sql, values = []) {
    const res = await pool.query(sql, values);
    return res.rows;
  },

  async findById(entity, id, fields = ['*']) {
    const columns = fields.join(', ');
    const res = await pool.query(`
      SELECT ${columns}
      FROM ${entity}
      WHERE id = $1;
    `, [id]);
    return res.rows[0];
  },

  async findMany(entity, where, fields = ['*']) {
    const columns = fields.join(', ');
    const clause = buildWhereClause(where);
    if (!clause) return this.findAll(entity, fields);
    const values = Object.values(where).map((val) =>
      typeof val === 'object' ? Object.values(val)[0] : val
    ).flat();
    const res = await pool.query(`
      SELECT ${columns}
      FROM ${entity}
      WHERE ${clause};
    `, values);
    return res.rows;
  },

  async findOne(entity, where, fields = ['*']) {
    const res = await this.findMany(entity, where, fields);
    return res[0];
  },

  async findAll(entity, fields = ['*']) {
    const columns = fields.join(', ');
    const res = await pool.query(`
      SELECT ${columns}
      FROM ${entity};
    `);
    return res.rows;
  },

  async insert(entity, data, fields = ['*']) {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const returning = fields.join(', ');
    const res = await pool.query(`
      INSERT INTO ${entity} (${columns})
        VALUES (${params})
        RETURNING ${returning};
    `, values);
    return res.rows[0];
  },

  async updateById(entity, id, data, fields = ['*']) {
    const entries = Object
      .keys(data)
      .map((key, i) => `${key}=$${i + 2}`)
      .join(', ');
    const values = Object.values(data);
    const returning = fields.join(', ');
    const res = await pool.query(`
      UPDATE ${entity}
      SET ${entries}
      WHERE id = $1
      RETURNING ${returning};
    `, [id, ...values]);
    return res.rows[0];
  },

  async deleteById(entity, id, fields = ['*']) {
    const returning = fields.join(', ');
    const res = await pool.query(`
      DELETE FROM ${entity}
      WHERE id = $1
      RETURNING ${returning};
    `, [id]);
    return res.rows[0];
  },

  async exists(entity, id) {
    const res = await pool.query(`
        SELECT * 
        FROM ${entity}
        WHERE id = $1;
    `, [id]);
    return !!res.rows[0];
  }
});
