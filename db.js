/*
 * @Author: E-Dreamer
 * @Date: 2022-06-06 09:50:50
 * @LastEditTime: 2022-06-06 14:30:12
 * @LastEditors: E-Dreamer
 * @Description: 数据库操作
 */
const mysql = require('mysql')
const dbConfig = {
  pool_1: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'study',
    port: '3306',
    // 解决mysql和node的时区不同
    timezone: '08:00',
  },
  pool_2: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ceshi',
    port: '3306',
    // 解决mysql和node的时区不同
    timezone: '08:00',
  },
}
const pool = mysql.createPoolCluster({
  multipleStatements: true, // 多语句查询
  canRetry: true, //值为true时，允许连接失败时重试(Default: true)
  removeNodeErrorCount: 1, // 当连接失败时 errorCount 值会增加. 当errorCount 值大于 removeNodeErrorCount 将会从PoolCluster中删除一个节点. (Default: 5)
  defaultSelector: 'RR', //RR,RANDOM,ORDER); 	默认选择器 RR:循环 RANDOM:通过随机函数选择节点. ORDER:无条件地选择第一个可用节点.
})

pool.add('pool_1', dbConfig.pool_1)
pool.add('pool_2', dbConfig.pool_2)

/**
 * @description: 链接数据库
 * @param {*} name 连接表名 pool_1,pool_2
 * @param {*} sql
 * @param {*} values
 * @return {*}
 */
let query = (name, sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(name, (err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}
module.exports = query
