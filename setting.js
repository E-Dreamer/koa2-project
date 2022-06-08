/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 13:52:16
 * @LastEditTime: 2022-06-06 14:17:37
 * @LastEditors: E-Dreamer
 * @Description:
 */
const secret = 'blog-nodejs'
//解密token
const jsonwebtoken = require('jsonwebtoken')
const util = require('util')
// 将jwt.verify函数promise化
const verify = util.promisify(jsonwebtoken.verify)

async function getPayload(ctx) {
  const token = ctx.header.authorization
  const payload = await verify(token.split(' ')[1], secret)
  return payload
}
module.exports = {
  secret, // token 密钥
  getPayload
}
