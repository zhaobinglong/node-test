const express = require('express')
const app = express()

const conn = require('./mysql')
const sqls = require('./sql')
const sqlObj = new sqls()
const port = 3001

var bb = require('./birds')
app.use('/', bb)

app.use('/static', express.static('public'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))