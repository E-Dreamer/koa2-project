/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 14:19:19
 * @LastEditTime: 2022-06-06 16:40:35
 * @LastEditors: E-Dreamer
 * @Description: response返回的信息
 */
class SuccessMsg {
  constructor(msg, data = null) {
    this.msg = msg
    this.data = data
    this.code = 200
    this.success = true
  }
}
class ErrorMsg {
  constructor(msg) {
    this.msg = msg || '参数错误'
    this.data = null
    this.code = 400
    this.success = false
  }
}
module.exports = {
  SuccessMsg,
  ErrorMsg,
}
