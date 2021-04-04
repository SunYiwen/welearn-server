const router = require('koa-router')();
const { query } = require('../../utils/mysql/db');

// 设置路由前缀
router.prefix('/quiz');

/* 提交作业中的某项quiz */
router.post('/submit', async (ctx, next) => {
  const body = ctx.request.body;

  const { JobID, UserAnswer } = body;
  const { QuizID, AnswerIndexList, IsRight } = UserAnswer;

  // 查找对应的job
  const jobs = await query('SELECT * FROM job WHERE jobID = ?', [JobID]);

  const job = jobs[0];
  let { scoreInfo } = job;
  if (scoreInfo) {
    scoreInfo = JSON.parse(scoreInfo);
  }

  let questions = [];
  if (scoreInfo && scoreInfo.questions) {
    questions = scoreInfo.questions;
  }

  let quizItem;
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].QuizID === QuizID) {
      quizItem = questions[i];
      break;
    }
  }

  // 存在提交项，更新数据
  if (quizItem) {
    quizItem.AnswerIndexList = AnswerIndexList;
    quizItem.IsRight = IsRight;
  } else {
    questions.push({
      QuizID,
      AnswerIndexList,
      IsRight
    });
  }
  scoreInfo = { ...scoreInfo, questions };

  // 更新数据库
  await query('UPDATE job SET scoreInfo = ?,status = ? WHERE jobID = ?', [JSON.stringify(scoreInfo), 3, JobID]);

  // 响应
  ctx.body = {
    Msg: 'success'
  };

});
module.exports = router;