const Koa = require('koa')
const app = new Koa()

const mid1 = async (ctx, next) => {
    ctx.body =  '前：' + '1\n'
    await next()
    ctx.body =   ctx.body + '后：' + '1\n'
}

const mid2 = async (ctx, next) => {
    ctx.body =    ctx.body + '前：'+ '2\n'
    await next()
    ctx.body =    ctx.body + '后：'+ '2\n'
}

const mid3 = async (ctx, next) => {
    ctx.body =  ctx.body + '前：'+  '3\n'
    await next()
    ctx.body =   ctx.body + '后：'+ '3\n'
}

app.use(mid1)
app.use(mid2)
app.use(mid3)

app.listen(3000)