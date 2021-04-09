const { getFileData } = require('../../utils/fs');

const fs = require('fs');
const { query } = require('../../utils/mysql/db');
const { distributeRecord } = require('../../utils/source/index');
const router = require('koa-router')();

// 设置路由前缀
router.prefix('/file');

// 上传任务文件解析
router.post('/upload-task', async function (ctx, next) {

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
router.post('/upload-file', async function (ctx, next) {
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
      status: userType === 1 ? 0 : 1,
    });

    const fileID = result.insertId;

    // 3、数据库写入上传记录
    if (userType === 1) {
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


module.exports = router;