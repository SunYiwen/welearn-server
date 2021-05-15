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
    return ctx.body = {
      Code: 2001,
      Msg: '用户记录不存在',
    };
  }
  /* 生成token */
  const token = createJWT(results[0], openid);

  ctx.body = {
    UserInfoDetail: results[0],
    Token: token,
  };
});

/* 注册学生信息 */
router.post('/register-user', async function (ctx, next) {
  const body = ctx.request.body;
  const { Code, Name, AvatarURL, PhoneNumber, SchoolName, Major, UserType } = body;
  let { openid } = await code2Session(Code);

  /* 电话号码作为唯一id */
  const findUserByPhoneNumber = 'SELECT * FROM user WHERE phoneNumber = ?';
  const users = await query(findUserByPhoneNumber, [PhoneNumber]);
  if (users.length > 0) {
    return ctx.body = {
      Code: 2002,
      Msg: '该手机号码已被注册',
    }
  }

  /* 往数据库中插入数据 */
  const sql = 'INSERT INTO user set ?';
  await query(sql, { name: Name, avatarURL: AvatarURL, phoneNumber: PhoneNumber, wxOpenID: openid, schoolName: SchoolName, major: Major, userType: UserType });

  ctx.body = {
    Code: 200,
    Msg: 'success',
  }

});

router.get('/role-list', async function (ctx, next) {
  const body = ctx.request.body;
  const { UserID } = body;
  const sql = 'SELECT * FROM role WHERE userID = ?';
  const results = await query(sql, [UserID]);
  const studentList = results.filter((roleItem) => {
    return roleItem.userType == 1;
  });

  const teacherList = results.filter((roleItem) => {
    return roleItem.userType == 2;
  });

  // 往班级信息中增加课程码
  for (let i = 0; i < teacherList.length; i++) {
    const role = teacherList[i];
    const groupID = role.groupID;
    const results = await query('SELECT * FROM class WHERE groupID = ?', [groupID]);
    const code = results[0].code;
    role.code = code;
  }

  ctx.body = {
    roleList: {
      studentList,
      teacherList
    }
  }
});

/** 更新用户信息 */
router.get('/user-info', async function (ctx, next) {
  const body = ctx.request.body;
  const { UserID } = body;
  const sql = 'SELECT * FROM user WHERE userID = ?';
  const results = await query(sql, [UserID]);
  ctx.body = {
    UserInfoDetail: results[0],
  }
});

/* 老师申请学生权限 */
router.post('/be-student', async (ctx, next) => {
  const body = ctx.request.body;
  const { UserID } = body;
  const sql = 'SELECT * FROM user WHERE userID = ?';
  const results = await query(sql, [UserID]);
  const user = results[0];

  if (user.userType == 2) {
    await query('UPDATE user SET userType = 3 WHERE userID = ?', [UserID]);
    return ctx.body = {
      Msg: 'Success',
    }
  }

  return ctx.body = {
    Msg: 'Fail',
  }
});

/* 修改用户昵称 */
router.post('/user-name', async (ctx, next) => {
  const body = ctx.request.body;
  const { UserName, UserID } = body;
  await query('UPDATE user SET name = ? WHERE userID = ?', [UserName, UserID]);

  ctx.body = {
    Code: 200,
    Msg: 'success',
  }
});

/* 修改用户头像 */
router.post('/', async (ctx, next) => {
  const body = ctx.request.body;
  const { AvatarURL, UserID } = body;
  await query('UPDATE user SET avatarURL = ? WHERE userID = ?', [AvatarURL, UserID]);

  ctx.body = {
    Code: 200,
    Msg: 'success',
  }
});



module.exports = router;