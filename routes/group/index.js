const router = require('koa-router')();
const { query } = require('../../utils/mysql/db');
const { uuid } = require('../../utils/index');

/* 设置路由前缀 */
router.prefix('/group');

router.post('/register', async function (ctx, next) {
  /* 获取请求参数 */
  const body = ctx.request.body;
  const { GroupName, SchoolName, Subject, UserID } = body;

  /* 查询学校id */
  const searchSchoolSql = 'select * from school where schoolName = ?';
  const results = await query(searchSchoolSql, [SchoolName]);
  const schoolID = results[0].schoolID;


  let codeResults = [];
  let code = '';
  do {
    /* 班级码 */
    code = uuid();

    codeResults = await query('SELECT * FROM code WHERE code = ?', [code]);
  } while (codeResults.length > 0);

  /* 随机码插入数据库 */
  await query('INSERT INTO code SET ?', { code: code });

  /* 往数据库中插入数据 */
  const sql = 'INSERT INTO class SET ?';
  const result = await query(sql, { groupName: GroupName, schoolName: SchoolName, subject: Subject, schoolID: schoolID, code: code });
  const groupID = result.insertId;

  /* 查询用户数据信息 */
  const searchUserSql = "select * from user where userID = ?";
  const userResults = await query(searchUserSql, [UserID]);
  const userInfo = userResults[0];


  /* 添加用户角色 */
  const roleSql = "INSERT INTO role set ?";
  await query(roleSql, { userID: UserID, userType: 2, groupID: groupID, groupName: GroupName, subject: Subject, schoolName: SchoolName });

  ctx.body = {
    groupID: groupID,
  };

});

/* 学生加入班级 */
router.post('/join', async function (ctx, next) {
  /* 获取请求参数 */
  const body = ctx.request.body;
  const { GroupCode, UserID } = body;
  const searchGroupSql = 'SELECT * FROM class WHERE code = ?';
  const groupResults = await query(searchGroupSql, [GroupCode]);
  const length = groupResults.length;

  /* 班级码不存在的情况 */
  if (length === 0) {
    return ctx.body = {
      Msg: 'fail',
      GroupID: 0
    }
  }

  const groupInfo = groupResults[0];
  const { groupID, groupName, subject, schoolName } = groupInfo;
  /* 添加用户角色 */
  const roleSql = "INSERT INTO role set ?";
  await query(roleSql, { userID: UserID, userType: 1, groupID, groupName, subject, schoolName });

  return ctx.body = {
    Msg: 'success',
    GroupID: groupID
  }

});

/* 学生根据班级码进入班级 */

module.exports = router;