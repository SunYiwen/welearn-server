const login = require('./login');

const router = require('koa-router')();

// 设置路由前缀
router.prefix('/account');

router.get('/', function (ctx, next) {
  ctx.body = 'account';
});


router.post('/login', function (ctx, next) {
  const body = ctx.request.body;
  const { code } = body;
  login(code);

  ctx.body = 'account/login';
});

module.exports = router;