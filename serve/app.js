const express = require('express')
var bodyParser = require('body-parser')
const app = express()

// 连接数据库
const mysql = require('mysql')
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'qazwsx110',
//   database: 'stumanagesys'
// })

// connection.connect()
// var sql = 'SELECT * FROM websites'
// connection.query(sql, function (err, result) {
//   if (err) {
//     console.log('[SELECT ERROR] - ', err.message)
//     return
//   }
//   console.log(result)
// })
// connection.end()

// eslint-disable-next-line no-path-concat
// app.use(express.static(__dirname + '/public')) // 配置静态web目录
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// 解决跨域问题
app.use(require('cors')())
// 使用json中间件
app.use(express.json())
app.use(express.urlencoded())

app.get('/', (req, res) => {
  res.send('helloworld')
})

app.get('/login', (req, res) => { // 查询
  res.send('查询')
})

app.post('/login', async (req, res) => { // 提交
  const { username, password } = req.body
  var sql = `SELECT * FROM user WHERE username="${username}"`
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })
  connection.connect()
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 421
        },
        message: '查询出错!'
      })
    }
    connection.end()

    if ((!result[0]) || (result[0].password !== password)) {
      return res.send({
        meta: {
          status: 422
        },
        message: '用户名或密码错误!'
      })
    }

    const uid = result[0].uid
    const pow = result[0].pow
    return res.send({
      uid,
      pow,
      meta: {
        status: 200
      }
    })
  })
})

app.delete('/login', (req, res) => { // 删除
  res.send('删除')
})

app.put('/login', (req, res) => { // 更新
  res.send('更新')
})

app.listen(3000)
console.log('Server running at http://127.0.0.1:3000/')
