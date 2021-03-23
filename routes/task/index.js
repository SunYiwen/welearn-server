const { query } = require('../../utils/mysql/db');
const { dateTimeFormatter } = require('../../utils/index');
const router = require('koa-router')();

// 设置路由前缀
router.prefix('/task');

router.post('/task', async function (ctx, next) {
  const body = ctx.request.body;

  let { taskName, groupID, UserID, status, expiredAt, createdAt, updatedAt, subject, contentDetail } = body;
  expiredAt = dateTimeFormatter(expiredAt);
  createdAt = dateTimeFormatter(createdAt);
  updatedAt = dateTimeFormatter(updatedAt);

  const createTaskSql = 'INSERT INTO task SET ?';
  const result = await query(createTaskSql, { taskName, groupID, createdUserID: UserID, status, expiredAt, createdAt, updatedAt, subject, contentDetail: JSON.stringify(contentDetail) })
  const taskID = result.insertId;

  if (status === 1) {
    /* 批量生成job */
    const studentResults = await query('SELECT userID from role WHERE groupID = ? AND userType = 1', [groupID]);
    for (let item of studentResults) {
      const { userID } = item;

      /* 查找学生相关信息 */
      const userResults = await query('SELECT * FROM user WHERE userID = ?', [userID]);
      const studentUserInfo = userResults[0];

      const createJobSql = 'INSERT INTO job SET ?';
      await query(createJobSql, {
        taskID,
        groupID,
        studentUserID: studentUserInfo.userID,
        studentName: studentUserInfo.name,
        studentAvatar: studentUserInfo.avatarURL,
        status: 0,
        updatedAt,
        expiredAt,
        createdAt,
        scoreInfo: '',
      });
    }
  }

  return ctx.body = {
    Msg: 'success',
  }
});

module.exports = router;