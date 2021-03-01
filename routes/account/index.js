const { parseUserInfo, createJWT } = require('../../utils');
const code2Session = require('./login');
const { query } = require('../../utils/mysql/db');
const router = require('koa-router')();

// 设置路由前缀
router.prefix('/account');

router.get('/', function (ctx, next) {
  ctx.body = 'account';
});


router.post('/login', async function (ctx, next) {
  const body = ctx.request.body;
  const { code } = body;
  const { openid } = await code2Session(code);

  /* 数据库查询 */
  const sql = 'SELECT * FROM user where wxOpenID = ?';
  const results = await query(sql, [openid]);

  /* 生成token */
  const token = createJWT(results[0], openid);

  const res = {
    UserInfoDetail: results[0],
    Token: token,
  };

  ctx.body = res;
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