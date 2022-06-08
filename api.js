/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 09:53:37
 * @LastEditTime: 2022-06-07 17:27:10
 * @LastEditors: E-Dreamer
 * @Description:
 */
const query = require('./db')
const { SuccessMsg, ErrorMsg } = require('./msg')

const { secret } = require('./setting')
const { sign } = require('jsonwebtoken')
const {encrypt,decrypt} = require('./bcrypt')

/**
 * 登录
 * @route POST /login
 * @group 用户 - Operations about user
 * @param {string} name.query.required - 用户名
 * @param {string} password.query.required - 密码
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
const login = async (ctx) => {
  const { name, password } = ctx.request.body
  const sql = 'select * from user where name=? and password=?'
  console.log(encrypt(password))
  console.log(decrypt(password,encrypt(password)))
  const value = [name, password]
  const res = await query('pool_2', sql, value).catch((err) => {
    ctx.response.body = new ErrorMsg(err.sqlMessage)
  })
  if (res) {
    if (res.length > 0) {
      // ctx.session.user = name
      const token = sign({ name }, secret, { expiresIn: '3h' }) // token有效期3个小时
      ctx.cookies.set('token', token, {
        domain: 'localhost', //设置cookie的域
        path: '/', //设置cookie的路径
        maxAge: 3 * 60 * 60 * 1000,
        httpOnly: true,
        overwrite: true, //是否覆盖已有的cookie设置
      })
      ctx.response.body = new SuccessMsg('登录成功', token)
    } else {
      ctx.response.body = new ErrorMsg('登录失败,不存在用户名或密码')
    }
  }
}
/**
 * 退出登录
 * @route POST /logout
 * @group 用户 - Operations about user
 * @param {token} token.query.required - token
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
const logout = async (ctx) => {
  ctx.body = {
    success: true,
    data: [],
    msg: '请求成功',
  }
}

/**
 * 注册
 * @route POST /register
 * @group 用户 - Operations about user
 * @param {string} name.query.required - 用户名
 * @param {string} password.query.required - 密码
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
const register = async (ctx) => {
  const { name, password } = ctx.request.body
  const sql = 'INSERT INTO user (name,password) values(?,?)'
  const value = [name, password]
  let res = await query('pool_2', sql, value).catch((err) => {
    ctx.response.body = new ErrorMsg(err.sqlMessage)
  })
  if (res) {
    ctx.response.body = new SuccessMsg('注册成功')
  }
}


module.exports = {
  login,
  logout,
  register,
}
