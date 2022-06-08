/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 15:25:22
 * @LastEditTime: 2022-06-07 08:48:47
 * @LastEditors: E-Dreamer
 * @Description: koa2-swagger-ui 和 swagger-jsdoc 的配置 注解太过复杂 放弃
 */
const router = require('./router')
const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')

const swaggerDefinition = {
  info: {
      title: 'koa2项目访问地址',
      version: '1.0.0',
      description: 'API',
  },
  host: '127.0.0.1:5000',// 想着改这里，如果不修改，那么接口文档访问地址为：localhost:8000/swagger
  basePath: '/' // Base path (optional)
};
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, './router.js')], // 写有注解的router的存放地址, 最好path.join()
};
const swaggerSpec = swaggerJSDoc(options)
// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
})
module.exports = router