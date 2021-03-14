const router = require('koa-router')();
const { parseSessionToken } = require('../../utils');
const { query } = require('../../utils/mysql/db');

/* 设置路由前缀 */
router.prefix('/group');

router.post('/register', async function (ctx, next) {
  /* 获取请求参数 */
  const body = ctx.request.body;
  console.log('body', body);
  const { GroupName, SchoolName, Subject } = body;

  const { token } = ctx.request.headers;
  console.log('token', parseSessionToken(token));


  /* 查询学校id */
  const searchSchoolSql = 'select * from school where schoolName = ?';
  const results = await query(searchSchoolSql, [SchoolName]);
  const schoolID = results[0].schoolID;
  console.log('id', schoolID);

  /* 往数据库中插入数据 */
  const sql = 'INSERT INTO class set ?';
  const result = await query(sql, { groupName: GroupName, schoolName: SchoolName, subject: Subject, schoolID: schoolID, });
  const groupID = result.insertId;

  /* 往角色表中添加数据 */

  ctx.body = {
    groupID: groupID,
  };

});

module.exports = router;