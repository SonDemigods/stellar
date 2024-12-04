'use strict'

module.exports = async function (fastify, opts) {
  // 查询数据
  fastify.get('/', {
    schema: {
      tags: ['test'],
      summary: '查询数据',
      description: '查询数据接口',
      querystring: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          pageSize: { type: 'number' },
          pageNum: { type: 'number' }
        }
      }
    }
  }, async function (request, reply) {

    const [res] = await fastify.db.query(
      'SELECT id, name FROM test WHERE is_delete = 0 limit ? offset ?',
      [request.query.pageSize, (request.query.pageNum - 1) * request.query.pageSize]
    )
    const [resCount] = await fastify.db.query(
      'SELECT count(1) as count FROM test WHERE is_delete = 0'
    )
    reply.baseResponse({
      data: {
        data: res,
        count: resCount[0].count
      }
    })
  })

  // 添加数据
  fastify.post('/', {
    schema: {
      tags: ['test'],
      summary: '添加数据',
      description: '添加数据接口',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      }
    }
  }, async function (request, reply) {

    const [res] = await fastify.db.query(
      'INSERT INTO test (name, is_delete) VALUES (?, ?)',
      [request.body.name, 0]
    )
    reply.baseResponse({
      data: res.insertId
    })
  })

  // 修改数据
  fastify.put('/', {
    schema: {
      tags: ['test'],
      summary: '修改数据',
      description: '修改数据接口',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          id: { type: 'number' }
        },
        required: ['name', 'id']
      }
    }
  }, async function (request, reply) {

    const [res] = await fastify.db.query(
      'UPDATE test SET name = ? WHERE id = ?',
      [request.body.name, request.body.id]
    )
    reply.baseResponse({
      data: res
    })
  })

  // 删除数据
  fastify.delete('/', {
    schema: {
      tags: ['test'],
      summary: '删除数据',
      description: '删除数据接口',
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        },
        required: ['id']
      }
    }
  }, async function (request, reply) {

    const [res] = await fastify.db.query(
      'UPDATE test SET is_delete = ? WHERE id = ?',
      [1, request.body.id]
    )
    reply.baseResponse({
      data: res
    })
  })
}
