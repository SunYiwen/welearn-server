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
  /* 提取请求参数 */
  const body = ctx.request.body;
  const { code } = body;
  const { openid } = await code2Session(code);

  /* 数据库查询 */
  const sql = 'SELECT * FROM user where wxOpenID = ?';
  const results = await query(sql, [openid]);

  /* 用户记录不存在 */
  if (!results || results.length === 0) {
    ctx.body = {
      Code: 2001,
      Msg: '用户记录不存在',
    };

    return ctx.response.status = 404;
  }
  /* 生成token */
  const token = createJWT(results[0], openid);

  ctx.body = {
    UserInfoDetail: results[0],
    Token: token,
  };
});

/* 注册学生信息 */
router.post('/register-student', async function (ctx, next) {
  const body = ctx.request.body;
  const { Code, Name, AvatarURL, PhoneNumber, SchoolName, Major } = body;
  let { openid } = await code2Session(Code);

  /* 往数据库中插入数据 */
  const sql = 'INSERT INTO user set ?';
  await query(sql, { name: Name, avatarURL: AvatarURL, phoneNumber: PhoneNumber, wxOpenID: openid, schoolName: SchoolName, major: Major });

  ctx.body = {
    Code: 200,
    Msg: 'success',
  }

});



module.exports = router;