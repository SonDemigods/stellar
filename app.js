'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')

// 服务配置
const options = {}

module.exports = async function (fastify, opts) {

  // 从plugins目录加载插件
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // 从routes目录加载路由
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
  
}

module.exports.options = options
