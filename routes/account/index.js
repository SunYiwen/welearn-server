const { parseUserInfo } = require('../../utils');
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

router.post('/user-auth', async function (ctx, next) {
  const body = ctx.request.body;
  const { Code, IV, EncryptedData } = body;
  console.log(IV, EncryptedData, Code);
  let { session_key } = await login(Code);
  console.log('session_key', session_key);

  if (!session_key) {
    session_key = 'WhGo9wxl3qxoSgDhBAZf3Q==';
  }
  parseUserInfo(session_key, EncryptedData, IV);
  ctx.body = 'user-auth';
});



module.exports = router;