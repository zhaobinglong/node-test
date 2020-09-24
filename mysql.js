// 创建数据库链接
const mysql = require('mysql')
// 注意隐私
const conn = mysql.createConnection({
  host: '8.210.251.113',
  user: 'root',
  password: '9#JriZUsUslsGNv$',
  database: 'word'
})


// 注册 解析表单的body-parser
// const bodyParser = require('body-parser')
// conn.use(bodyParser.urlencoded({extended:false}))
module.exports = conn