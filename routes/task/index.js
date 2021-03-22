
const router = require('koa-router')();

// 设置路由前缀
router.prefix('/task');

router.post('/task', async function (ctx, next) {

  return ctx.body = {
    Mag: 'hhh'
  }
});

router.get('/task', async function (ctx, next) {

  return ctx.body = {
    Mag: 'hhh'
  }
});
module.exports = router;