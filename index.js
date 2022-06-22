/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 09:44:58
 * @LastEditTime: 2022-06-22 14:56:36
 * @LastEditors: E-Dreamer
 * @Description:
 */
const Koa = require('koa')
const app = new Koa()
const { secret } = require('./setting')
//用于解析post请求解析body参数
const bodyParser = require('koa-bodyparser')
const jwtKoa = require('koa-jwt')
app.use(bodyParser())
//解决跨域问题
const cors = require('koa-cors')
app.use(cors())
const router = require('./router')

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
  await next().catch((err) => {
    //catch 获取的需要token的接口
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        msg: '未登录,请先登录',
        success: true,
      }
    } else {
      throw err
    }
  }) // next is now a function
})
//去除一些不需要通过jwt验证的
app.use(
  jwtKoa({ secret: secret}).unless({
    path: [/^\/login/, /^\/register/, /^\/swagger/,/^\/api-docs/],
  })
)
const koaSwagger = require('koa-swagger-generator-api')(app)

let options = {
  swaggerDefinition: {
    info: {
      title: 'koa2项目访问地址',
      version: '1.0.0',
      description: 'API',
    },
    host: 'localhost:5000',
    basePath: '/',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['./api.js'], //Path to the API handle folder
}
koaSwagger(options)

// koa2-swagger-ui 和 swagger-jsdoc
// const swagger = require('./swagger') // 存放swagger.js的位置，可以自行配置，我放在了根目录
// const { koaSwagger } = require('koa2-swagger-ui')

// // 接口文档配置
// app.use(swagger.routes(), swagger.allowedMethods())
// app.use(
//   koaSwagger({
//     routePrefix: '/swagger', // 接口文档访问地址
//     swaggerOptions: {
//       url: '/swagger.json', // example path to json 其实就是之后swagger-jsdoc生成的文档地址
//     },
//   })
// )
//未使用swagger的时候使用

// router.prefix('/api')  // api前缀
app.use(router.routes())
/*
  请求方式不匹配的时候,会报请求方式不被允许
*/
app.use(router.allowedMethods())

// 错误处理,默认情况下Koa会将所有错误信息输出到 stderr，
// app.on('error', (err) => {
//   log.error('server error', err)
// })

const port = '5000'
const host = 'http://127.0.0.1'
app.listen(port, () => {
  console.log(`API server listening  on ${host}:${port}`)
})
