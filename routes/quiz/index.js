const router = require('koa-router')();
const { query } = require('../../utils/mysql/db');
const { initAnswerStatus, updatAnswerStats } = require('../../utils/quiz/index');

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
    quizItem = {
      QuizID,
      AnswerIndexList,
      IsRight
    }
    questions.push(quizItem);
  }
  scoreInfo = { ...scoreInfo, questions };

  // 更新数据库
  await query('UPDATE job SET scoreInfo = ?,status = ? WHERE jobID = ?', [JSON.stringify(scoreInfo), 3, JobID]);

  // 更新task中的answerStatus字段
  const taskID = job.taskID;
  const results = await query('SELECT * FROM task WHERE taskID = ?', [taskID]);
  const task = results[0];

  // 获取task答题详情
  let answerStatus = task.answerStatus;

  const contentDetail = JSON.parse(task.contentDetail);

  // 不存在answerStatus
  if (!answerStatus) {
    answerStatus = JSON.parse(answerStatus);
    await initAnswerStatus(taskID, quizItem, contentDetail.questions, answerStatus);
  } else {
    answerStatus = JSON.parse(answerStatus);
    await updatAnswerStats(taskID, quizItem, contentDetail.questions, answerStatus);
  }

  // 响应
  ctx.body = {
    Msg: 'success'
  };

});

/* 获取学生任务详情 */
router.get('/detail', async (ctx, next) => {
  let { JobID } = ctx.request.query;

  // 获取作业信息
  const jobs = await query('SELECT * FROM job WHERE jobID = ?', [JobID]);

  const job = jobs[0];
  const answerList = JSON.parse(job.scoreInfo).questions;

  const { taskID } = job;

  // 查询任务信息
  const tasks = await query('SELECT * FROM task WHERE taskID = ?', [taskID]);
  const task = tasks[0];

  const quizList = JSON.parse(task.contentDetail).questions;

  // 响应
  ctx.body = {
    quizList, answerList
  };
});

/* 获取班级任务详情 */
router.get('/group-detail', async (ctx, next) => {
  let { TaskID } = ctx.request.query;

  // 查询任务信息
  const tasks = await query('SELECT * FROM task WHERE taskID = ?', [TaskID]);
  const task = tasks[0];

  const answerStats = JSON.parse(task.answerStatus);
  const quizList = JSON.parse(task.contentDetail).questions;
  const submitJob = await query('SELECT * FROM job WHERE taskID = ? AND status = 3', [TaskID]);
  const unfinishedJob = await query('SELECT * FROM job WHERE taskID = ? AND status = 0', [TaskID]);
  task.finishNumber = submitJob.length;
  task.undoneNumber = unfinishedJob.length;


  // 响应
  ctx.body = {
    answerStats,
    quizList,
    task
  };

});

module.exports = router;