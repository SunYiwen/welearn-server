const { getFileData } = require('../../utils/fs');

const fs = require('fs');
const router = require('koa-router')();

// 设置路由前缀
router.prefix('/file');

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

module.exports = router;