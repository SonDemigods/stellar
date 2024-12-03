'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  // 创建http响应模板
  fastify.decorateReply('baseResponse', function (data) {
    this
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ 
        errorCode: data.status || 200, 
        response: data.data || null, 
        message: data.message || 'success'
      })
  })
})
