const { getFileData } = require('../../utils/fs');
const { dateTimeFormatter } = require('../../utils/index');

const fs = require('fs');
const send = require('koa-send');
const { query } = require('../../utils/mysql/db');
const { distributeRecord } = require('../../utils/source/index');
const { FILE } = require('dns');
const router = require('koa-router')();

// 设置路由前缀
router.prefix('/file');

// 上传任务文件解析
router.post('/upload-task', async (ctx, next) => {

  const file = ctx.request.files.file;
  const { name } = file;
  /* 获取文件后缀 */
  const suffix = name.split('.').reverse()[0];

  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = __dirname + '/temp.' + suffix;

  // 创建可写流
  const upStream = fs.createWriteStream(filePath);

  // 可读流通过管道写入可写流
  reader.pipe(upStream);

  // 解析文件数据
  const parsedData = await getFileData(filePath);

  return ctx.body = {
    parsedData
  }
});

// 上传文件资源
router.post('/upload-file', async (ctx, next) => {
  const { groupID, userType } = ctx.request.query;

  const { UserID } = ctx.request.body;

  const files = ctx.request.files;

  for (let key of Object.keys(files)) {
    const file = files[key];

    // 1、保存文件到本地
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = __dirname + '/files/' + key;

    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    
    // 可读流通过管道写入可写流
    reader.pipe(upStream);


    // 2、数据库中添加记录
    const result = await query('INSERT INTO file set ?', {
      fileName: key,
      filePath,
      groupID,
      ownerID: UserID,
      status: userType == 1 ? 0 : 1,
      userType,
    });

    const fileID = result.insertId;

    // 3、数据库写入上传记录
    if (userType == 1) {
      await query('INSERT INTO record set ?', {
        groupID,
        fileID,
      });
    }

    // 4、（异步）分发审批记录
    distributeRecord();

  }

  return ctx.body = {
    Msg: 'Success'
  }
});

// 文件列表
router.get('/files', async (ctx, next) => {
  const { UserID } = ctx.request.body;
  const { UserType } = ctx.request.query;

  const groups = await query('SELECT groupID from role WHERE userID = ? AND userType = ?', [UserID, UserType]);
  const fileList = [];

  for (let groupID of groups) {
    // status = 1 表示审核通过的
    const files = await query('SELECT * FROM file WHERE groupID = ? AND status = 1', [groupID]);
    for (let file of files) {
      if (file.userType == UserType && file.ownerID == UserID) {
        file.hasRight = true;
      } else {
        file.hasRight = false;
      }
      fileList.push(file);
    }
  }
  return ctx.body = {
    fileList
  }
});

// 指定班级的审核列表
router.get('/approvedList', async (ctx, next) => {
  const { UserID } = ctx.request.body;
  const groups = await query('SELECT groupID FROM role WHERE userID = ? AND userType = 2', [UserID]);
  const listMap = {};

  for (let group of groups) {
    const results = await query('SELECT fileIDList from approvedList WHERE groupID = ?', [group.groupID]);
    let fileIDList = [];

    if (results && results.length > 0) {
      fileIDList = JSON.parse(results[0].fileIDList);
    }

    let fileList = [];
    for (let fileID of fileIDList) {
      const file = await query('SELECT * FROM file WHERE fileID = ?', [fileID]);
      if (file && file.length > 0) {
        const ownerID = file[0].ownerID;
        const users = await query('SELECT * FROM user WHERE userID = ?', [ownerID]);
        const userName = users[0].name;
        fileList.push({ ...file[0], uploadUser: userName });
      }
    }
    if (fileList.length > 0) {
      // 提取班级信息
      const groupInfo = await query('SELECT * FROM class WHERE groupID = ?', [group.groupID]);
      listMap[groupInfo[0].groupName] = fileList;
    }

  }
  return ctx.body = {
    listMap,
  }

});

// 审核文件通过
router.post('/approved', async (ctx, next) => {
  const { fileID, approved, updatedAt, UserID } = ctx.request.body;
  const updatedAtTime = dateTimeFormatter(updatedAt);

  // 获取文件记录
  const files = await query('SELECT * from file WHERE fileID = ?', [fileID]);
  const file = files[0];

  const groupID = file.groupID;

  // 更新文件状态,仅同意通过的时候
  if (approved) {
    await query('UPDATE file SET status = 1 WHERE fileID = ?', [fileID]);
  }


  // 刷新复核表
  const lists = await query('SELECT fileIDList from approvedList WHERE groupID = ?', [groupID]);
  let fileIDList = JSON.parse(lists[0].fileIDList);

  const index = fileIDList.indexOf(fileID.toString());


  if (index != -1) {
    fileIDList.splice(index, 1);
  }

  await query('UPDATE approvedList SET fileIDList = ? WHERE groupID = ?', [JSON.stringify(fileIDList), groupID]);

  // 将记录存放进入历史表
  const ownerID = file.ownerID;
  const users = await query('SELECT * FROM user WHERE userID = ?', [ownerID]);
  const userName = users[0].name;
  await query('INSERT INTO historyRecord set ?', { ...file, opUserID: UserID, uploadName: userName, approved: approved ? 1 : 0, updatedAt: updatedAtTime });

  return ctx.body = {
    Msg: 'success'
  }

});


// 删除文件
router.post('/delete', async (ctx, next) => {
  const { FileID } = ctx.request.body;

  // 获取文件地址
  const files = await query('SELECT * FROM file WHERE fileID = ?', [FileID]);
  const file = files[0];

  // 删除本地文件
  fs.unlinkSync(file.filePath);

  // 删除文件记录
  await query('DELETE FROM file WHERE fileID = ?', [FileID]);

  return ctx.body = {
    Msg: 'Success'
  }

});

// 下载文件
router.get('/download', async (ctx, next) => {
  const { FileID } = ctx.request.query;
  const files = await query('SELECT * FROM file WHERE fileID = ?', [FileID]);

  const file = files[0];

  console.log("dir", __dirname);
  await send(ctx, file.fileName, { root: __dirname + '/files' });

});

// 获取审批历史记录
router.get('/history', async (ctx, next) => {
  const { UserID } = ctx.request.body;
  const records = await query('SELECT * FROM historyRecord WHERE opUserID = ?', [UserID]);

  return ctx.body = {
    historyRecords: [
      ...records,
    ]
  }
});





module.exports = router;