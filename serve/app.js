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

app.post('/login', async (req, res) => { // 提交登录表单
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

app.get('/info', (req, res) => { // 查询个人信息
  const { uid, pow, getuid, searchForm } = req.query
  if (((pow === 'student') && (searchForm === 'teacher')) || ((pow !== 'admin') && (getuid === '1'))) {
    return res.send({
      meta: {
        status: 423
      },
      message: '超出查询权限!'
    })
  }
  if (getuid === '1') {
    return res.send({
      meta: {
        status: 200
      },
      infoForm: {
        uid: uid,
        name: '管理员',
        num: '123',
        sex: '男',
        age: '18',
        dept: '管理'
      }
    })
  }
  var sql = `SELECT * FROM ${searchForm} WHERE uid=${getuid}`
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })
  connection.connect()
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - 查询出错!', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 421
        },
        message: '查询出错!'
      })
    }
    if (result[0] === undefined) {
      console.log('[SELECT ERROR] - 查无此人!')

      connection.end()
      return res.send({
        meta: {
          status: 421
        },
        message: '查无此人!'
      })
    }
    connection.end()

    return res.send({
      meta: {
        status: 200
      },
      infoForm: {
        uid: result[0].uid,
        name: result[0].tname || result[0].sname,
        num: result[0].tno || result[0].sno,
        sex: result[0].tsex || result[0].ssex,
        age: result[0].tage || result[0].sage,
        dept: result[0].tdept || result[0].sdept
      }
    })
  })
})

app.put('/info', (req, res) => { // 更新个人信息
  const {
    name,
    num,
    sex,
    age,
    dept
  } = req.body.infoForm

  const searchForm = req.body.searchForm
  const getuid = req.body.getuid

  let sql = ''
  if (searchForm === 'teacher') {
    sql = `UPDATE teacher SET tno="${num}",tname="${name}",tsex="${sex}",tage="${age}",tdept="${dept}"  WHERE uid=${getuid}`
  }
  if (searchForm === 'student') {
    sql = `UPDATE student SET sno="${num}",sname="${name}",ssex="${sex}",sage="${age}",sdept="${dept}"  WHERE uid=${getuid}`
  }
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
          status: 423
        },
        message: '修改出错!'
      })
    }
    connection.end()

    return res.send({
      meta: {
        status: 200
      }
    })
  })
})

app.get('/user', (req, res) => { // 查询用户列表
  // select  count(*) from table
  const { pow } = req.query
  if (pow === 'student') {
    return res.send({
      meta: {
        status: 424
      },
      message: '无权访问用户信息!'
    })
  }

  let sql = ''
  if (pow === 'teacher') {
    sql = 'SELECT * FROM user WHERE (pow<>"admin")'
  } else if (pow === 'admin') {
    sql = 'SELECT * FROM user'
  }

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })
  connection.connect()
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR 查询用户列表出错 - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 425
        },
        message: '查询用户列表出错!'
      })
    }
    connection.end()

    return res.send({
      meta: {
        status: 200
      },
      userlist: result
    })
  })

  // res.send('查询')
})

app.put('/user', (req, res) => { // 更新用户信息
  const {
    uid,
    username,
    password
  } = req.body

  const sql = `UPDATE user SET username="${username}",password="${password}"  WHERE uid=${uid}`
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })
  connection.connect()
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] 修改用户出错 - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 424
        },
        message: '修改出错!'
      })
    }
    connection.end()

    return res.send({
      meta: {
        status: 200
      }
    })
    // res.send('更新')
  })
})

app.post('/user', (req, res) => { // 添加用户
  const {
    username,
    password,
    pow
  } = req.body

  let newTotal = 0
  const totalsql = 'SELECT COUNT(*) FROM user'

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })

  connection.connect()
  // 查询用户总数
  connection.query(totalsql, (err, result) => {
    if (err) {
      console.log('[SELECT ERROR 查询用户总数出错 - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 424
        },
        message: '查询总数出错!'
      })
    }
    const { 'COUNT(*)': tot } = result[0]
    newTotal = tot + 1

    // 添加用户
    const usersql = `INSERT INTO user(uid,username,password,pow) VALUES ("${newTotal}","${username}","${password}","${pow}")`
    connection.query(usersql, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] 添加用户出错 - ', err.message)

        connection.end()
        return res.send({
          meta: {
            status: 425
          },
          message: '添加用户出错!'
        })
      }

      // 在对应学生/教师表格添加用户
      let sql = ''
      if (pow === 'student') {
        sql = `INSERT INTO student(uid,sno) VALUES ("${newTotal}","${newTotal}")`
      } else {
        sql = `INSERT INTO teacher(uid,tno) VALUES ("${newTotal}","${newTotal}")`
      }
      connection.query(sql, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] 添加用户到个人列表出错 - ', err.message)

          connection.end()
          return res.send({
            meta: {
              status: 425
            },
            message: '添加用户到个人列表出错!'
          })
        }
        connection.end()

        return res.send({
          meta: {
            status: 200
          }
        })
      })
    })
  })
  // res.send('添加用户')
})

app.delete('/user', (req, res) => { // 删除用户
  const { uid } = req.body

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })

  const sql = `DELETE FROM user WHERE uid="${uid}"`
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] 删除用户出错 - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 426
        },
        message: '删除用户出错!'
      })
    }
    connection.end()

    return res.send({
      meta: {
        status: 200
      }
    })
  })
  // res.send('删除')
})

app.get('/course', (req, res) => { // 查询课程列表
  // console.log(req.query)
  const { pow, num } = req.query

  let sql = ''
  if (pow === 'teacher') {
    sql = `SELECT * FROM course WHERE (tno="${num}")`
  } else {
    sql = 'SELECT * FROM course'
  }

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })
  connection.connect()
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR 查询课程列表出错 - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 426
        },
        message: '查询课程列表出错!'
      })
    }
    connection.end()

    // console.log(result)

    return res.send({
      meta: {
        status: 200
      },
      courselist: result
    })
  })

  // res.send('查询')
})

app.post('/course', (req, res) => { // 添加课程
  const {
    cno,
    cname,
    credit,
    tno
  } = req.body

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })

  connection.connect()
  // 在course表格添加课程
  const usersql = `INSERT INTO course(cno,cname,credit,tno) VALUES ("${cno}","${cname}","${credit}","${tno}")`
  connection.query(usersql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] 开设课程出错 - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 426
        },
        message: '开设课程出错!'
      })
    }

    connection.end()

    return res.send({
      meta: {
        status: 200
      }
    })
  })
  // res.send('添加用户')
})

app.delete('/course', (req, res) => { // 删除课程
  const { cno, tno } = req.body

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })

  const sql = `DELETE FROM course WHERE (cno="${cno}" and tno="${tno}")`
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] 删除课程出错 - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 427
        },
        message: '删除课程出错!'
      })
    }
    connection.end()

    return res.send({
      meta: {
        status: 200
      }
    })
  })
  // res.send('删除')
})

app.post('/course/apply', (req, res) => { // 报名课程
  console.log(req.body)
  const { cno, tno, sno } = req.body

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazwsx110',
    database: 'stumanagesys'
  })
  connection.connect()
  // 在sc表格添加报名信息
  const usersql = `INSERT INTO sc(sno,cno,tno) VALUES ("${sno}","${cno}","${tno}")`
  connection.query(usersql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] 报名课程出错 - ', err.message)

      connection.end()
      return res.send({
        meta: {
          status: 427
        },
        message: '报名课程出错!'
      })
    }

    connection.end()

    return res.send({
      meta: {
        status: 200
      }
    })
  })
  // res.send('报名课程')
})
app.listen(3000)
console.log('Server running at http://127.0.0.1:3000/')
