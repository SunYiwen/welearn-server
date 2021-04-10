const { query } = require('../mysql/db');

/* 初始化task的答题情况 */
const initAnswerStatus = async (taskID, quizItem, questions, answerStatus) => {
  const answerOptionStatList = [];

  const question = questions.find(question => {
    return question.quizID == quizItem.QuizID;
  });

  const options = question.options;
  options.map((option, index) => {
    const optionIndex = String.fromCharCode("A".charCodeAt(0) + index);
    let count = 0;
    if (optionIndex === quizItem.AnswerIndexList[0]) {
      count += 1;
    }

    answerOptionStatList.push({
      OptionIndex: optionIndex,
      Value: option,
      Count: count,
      IsRight: question.correct_answer === option,
    });
  });

  if (answerStatus && answerStatus.length > 0) {
    answerStatus.push({
      QuizID: quizItem.QuizID,
      RightCnt: quizItem.IsRight ? 1 : 0,
      WrongCnt: quizItem.IsRight ? 0 : 1,
      AnswerOptionStatList: answerOptionStatList
    });
  } else {
    answerStatus = [{
      QuizID: quizItem.QuizID,
      RightCnt: quizItem.IsRight ? 1 : 0,
      WrongCnt: quizItem.IsRight ? 0 : 1,
      AnswerOptionStatList: answerOptionStatList
    }];
  }

  // 更新answerStatus内容
  await query('UPDATE task set answerStatus = ? WHERE taskID = ?', [JSON.stringify(answerStatus), taskID]);

}


/* 更新task中答题情况数据 */
const updatAnswerStats = async (taskID, quizItem, questions, answerStatus) => {
  let answerStatItem = answerStatus.find(status => {
    return status.QuizID === quizItem.QuizID;
  });

  if (answerStatItem) {
    if (quizItem.IsRight) {
      answerStatItem.RightCnt += 1;
    } else {
      answerStatItem.WrongCnt += 1;
    }

    const optionItem = answerStatItem.AnswerOptionStatList.find(option => {
      return option.OptionIndex === quizItem.AnswerIndexList[0];
    });

    optionItem.Count += 1;

    // 更新answerStatus内容
    await query('UPDATE task set answerStatus = ? WHERE taskID = ?', [JSON.stringify(answerStatus), taskID]);

  } else {
    await initAnswerStatus(taskID, quizItem, questions, answerStatus);
  }

}

module.exports = {
  initAnswerStatus,
  updatAnswerStats
}