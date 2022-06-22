/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 10:08:31
 * @LastEditTime: 2022-06-22 10:39:51
 * @LastEditors: E-Dreamer
 * @Description:
 */
const koaRouter = require('koa-router')
const router = koaRouter()
const api = require('./api')

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 登入
 *     description: 登入
 *     tags:
 *       - 用户
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         description: 用户名
 *         type: string
 *       - name: password
 *         in: query
 *         required: true
 *         description: 密码
 *         type: string
 *     responses:
 *       200:
 *         description: 登录成功
 */
router.post('/login', (ctx) => {
  return api.login(ctx)
})
router.delete('/logout', (ctx) => {
  return api.logout(ctx)
})

/**
 * @swagger
 * /register:
 *   post:
 *     summary: 注册
 *     description: 注册
 *     tags:
 *       - 用户
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         description: 用户名
 *         type: string
 *       - name: password
 *         in: query
 *         required: true
 *         description: 密码
 *         type: string
 *     responses:
 *       200:
 *         description: 注册成功
 */
router.post('/register', (ctx) => {
  return api.register(ctx)
})


router.get('/user',(ctx)=>{
  return api.user(ctx)
})
module.exports = router
