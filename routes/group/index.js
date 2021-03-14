const router = require('koa-router')();
const { query } = require('../../utils/mysql/db');

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

  /* 往数据库中插入数据 */
  const sql = 'INSERT INTO class set ?';
  const result = await query(sql, { groupName: GroupName, schoolName: SchoolName, subject: Subject, schoolID: schoolID, });
  const groupID = result.insertId;

  /* 查询用户数据信息 */
  const searchUserSql = "select * from user where userID = ?";
  const userResults = await query(searchUserSql, [UserID]);
  const userInfo = userResults[0];


  /* 添加用户角色 */
  const roleSql = "INSERT INTO role set ?";
  await query(roleSql, {userID: UserID, userType: userInfo.userType, groupID: groupID});

  ctx.body = {
    groupID: groupID,
  };

});

module.exports = router;