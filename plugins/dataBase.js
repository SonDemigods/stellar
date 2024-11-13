'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  
  // 创建数据库链接
  fastify.register(require('@fastify/mysql'), {
    promise: true,
    connectionString: 'mysql://root:123456@localhost:3306/stellar'
  })
  
  // 等待数据库链接完成后，创建别名
  fastify.after(() => {
    fastify.decorate('db', fastify.mysql)
  })
})