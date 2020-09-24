var express = require('express')
var app = express.Router()


// middleware that is specific to this router
app.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})



app.get('/', (req, res) => res.send('Hello World! will read db'))

app.get('/getData', (req, res) => {
  const sql = sqlObj.GETALL_SQL_NODETEST
  conn.query(sql, (err, result) => {
    if (err) return res.json({err_code: 0, msg: '查询失败', affectedRows: 0})
    res.json({
      err_code: 1, msg: result
    })
  })

})

app.get('/users/:userId', function (req, res) {
  res.send(req.params.userId)
})

app.get('/books/:bookid', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next(req.params)
}, function (req, res) {
  res.send(req.params)
})

var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])

module.exports = app