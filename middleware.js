/**
 * express中间件的实现和执行顺序
 *
 * Created by BadWaka on 2017/3/6.
 */
var express = require('express');


function middlewareA(req, res, next) {
    console.log('middlewareA before next()');
    next();
    console.log('middlewareA after next()');
}

function middlewareB(req, res, next) {
    console.log('middlewareB before next()');
    next();
    console.log('middlewareB after next()');
}

function middlewareC(req, res, next) {
    console.log('middlewareC before next()');
    next();
    console.log('middlewareC after next()');
}


var app = express();
app.listen(3000, function () {
    console.log('listen 3000...');
});
app.use(middlewareA);
app.use(middlewareB);
app.use(middlewareC);

// const express = require('express')

// const app = express()

// const sleep = (mseconds) => new Promise((resolve) => setTimeout(() => {
//   console.log('sleep timeout...')
//   resolve()
// }, mseconds))

// app.use(async (req, res, next) => {
//   console.log('I am the first middleware')
//   const startTime = Date.now()
//   console.log(`================ start ${req.method} ${req.url}`, { query: req.query, body: req.body });
//   next()
//   const cost = Date.now() - startTime
//   console.log(`================ end ${req.method} ${req.url} ${res.statusCode} - ${cost} ms`)
// })
// app.use((req, res, next) => {
//   console.log('I am the second middleware')
//   next()
//   console.log('second middleware end calling')
// })

// app.get('/api/test1', async(req, res, next) => {
//   console.log('I am the router middleware => /api/test1')
//   await sleep(2000)
//   res.status(200).send('hello')
// })

// app.use(async(err, req, res, next) => {
//   if (err) {
//     console.log('last middleware catch error', err)
//     res.status(500).send('server Error')
//     return
//   }
//   console.log('I am the last middleware')
//   await sleep(2000)
//   next()
//   console.log('last middleware end calling')
// })

// app.listen(3000)
// console.log('server listening at port 3000')