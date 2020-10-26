const jwt = require('jsonwebtoken')
let token = jwt.sign({user: '1234'}, 'Fizz', {expiresIn: 60 * 60})
console.log(token)


jwt.verify(token, 'Fizz', function (err, data) {
  if (err) console.log(err)
  console.log('解析的数据', data)
})