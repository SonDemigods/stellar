'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.register(require('@fastify/swagger'))
  fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/doc',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  })
})
