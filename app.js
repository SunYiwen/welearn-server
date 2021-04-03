const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const { parseToken } = require('./middleware/index');
const https = require('https')
const sslify = require('koa-sslify').default
const fs = require('fs')

const options = {
  key: fs.readFileSync('./utils/https/welearn0.xyz.key'),
  cert: fs.readFileSync('./utils/https/welearn0.xyz.pem'),
}

const utils = require('./utils');
const createAllTables = require('./utils/mysql/createAllTables');

// 注册数据库表
createAllTables();

// error handler
onerror(app)


app.use(sslify())

// middlewares koaBody放在bodyparser之后导致post请求失败
app.use(koaBody({
  // 支持文件格式
  multipart: true,
  formidable: {
    maxFileSize: 2 * 1024 * 1024,
  }
}));

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

app.use(parseToken());

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
const useRoute = utils.useRoutes;
useRoute(app);

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

https.createServer(options, app.callback()).listen(5300);

module.exports = app
