/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 15:10:37
 * @LastEditTime: 2022-06-06 15:12:43
 * @LastEditors: E-Dreamer
 * @Description: 登录密码加密解密
 */
const bcrypt = require('bcryptjs')

const encrypt = password =>{
  let salt = bcrypt.genSaltSync(5)
  let hash = bcrypt.hashSync(password,salt)
  return hash
}

const decrypt = (password,hash)=>{
  return bcrypt.compareSync(password,hash)
} 
module.exports = {
  encrypt,
  decrypt
}