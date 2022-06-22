/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 09:53:37
 * @LastEditTime: 2022-06-22 15:48:02
 * @LastEditors: E-Dreamer
 * @Description:
 */
const query = require('./db')
const { SuccessMsg, ErrorMsg } = require('./msg')

const { secret } = require('./setting')
const { sign,verify } = require('jsonwebtoken')
const {encrypt,decrypt} = require('./bcrypt')

//使用map 模拟redis操作
let redis = new Map()
const auth = (ctx)=>{
  const {authorization} = ctx.request.headers
  const token = authorization.split(' ')[1]

  return new Promise((resolve,reject)=>{
    verify(token,secret,(err,decode)=>{
      if(err){
        if(err.name === 'JsonWebTokenError'){
          resolve('无效的token') 
        }
        if(err.name === 'TokenExpiredError'){
          resolve('token已过期') 
        }
      }
      if(!redis.get(`token_${decode.name}`)){
        resolve('无效token')
      }
    })
  })

}
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
      let token = sign({ name }, secret, { expiresIn: '24h' }) // token有效期3个小时
      token =  `Bearer ${token}`
      ctx.cookies.set('token', token, {
        domain: 'localhost', //设置cookie的域
        path: '/', //设置cookie的路径
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        overwrite: true, //是否覆盖已有的cookie设置
      })

      redis.set(`token_${name}`,token)
      ctx.body = new SuccessMsg('登录成功', token)
    } else {
      ctx.body = new ErrorMsg('登录失败,不存在用户名或密码')
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
  const {authorization} = ctx.request.headers
  const token = authorization.split(' ')[1]
  verify(token,secret,(err,decode)=>{
    if(err){
      if(err.name === 'JsonWebTokenError'){
       return ctx.body = new ErrorMsg('无效的token')
      }
      if(err.name === 'TokenExpiredError'){
        return ctx.body = new ErrorMsg('token已过期')
      }
    }
    redis.delete(`token_${decode.name}`)
    ctx.response.body = new SuccessMsg('退出成功')
  })
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
  const sql1 = 'select * from user where name=?'
  let res1 = await query('pool_2',sql1,[name]).catch(err=>{
    ctx.response.body = new ErrorMsg(err.sqlMessage)
  })
  if(res1.legnth){
    ctx.response.body = new ErrorMsg('已存在用户名')
  }
  let res = await query('pool_2', sql, value).catch((err) => {
    ctx.response.body = new ErrorMsg(err.sqlMessage)
  })
  if (res) {
    ctx.response.body = new SuccessMsg('注册成功')
  }
}

/** 
 * 查询用户
 * @route POST /register
 * @group 用户 - Operations about user
 * @param {int} page - 页数
 * @param {int} size - 条数
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
*/
const user =async (ctx)=>{
  let msg =await auth(ctx)
  if(msg){
    return ctx.body = new ErrorMsg(msg)
  }
  const sql = 'select name,id from user limit ?,?'
  const { page, size } = ctx.query
  const pageInt = parseInt(page)
  const sizeInt = parseInt(size)
  const value0 = (pageInt - 1) * sizeInt < 0 ? 0 : (pageInt - 1) * sizeInt
  const value = [value0,sizeInt]
  let res = await query('pool_2',sql,value).catch(err=>{
    ctx.body = new ErrorMsg(err.sqlMessage)
  })
  if (res) {
    ctx.body = new SuccessMsg('查询成功',res)
  }
}

module.exports = {
  login,
  logout,
  register,
  user
}
