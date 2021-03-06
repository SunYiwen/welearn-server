const router = require('koa-router')();
const { query } = require('../../utils/mysql/db');
const { createProviceList, createCityList, createSchoolList } = require('../../utils/index');

/* 路由前缀 */
router.prefix('/school');

/* 获取学校 */
router.get('/', async function (ctx, next) {
  let { provice, city } = ctx.request.query;
  //const schoolList = createSchoolList(provice, city);
  /* 从数据库中查找 */
  const sql = 'SELECT schoolName FROM school WHERE provice = ? AND city = ?';
  const results = await query(sql, [provice, city]);
  const schoolList = [];

  for (let item of results) {
    schoolList.push(item.schoolName);
  }

  ctx.body = {
    schoolList,
  }
});


/* 获取省份列表 */
router.get('/provice', async function (ctx, next) {
  //const proviceList = createProviceList();
  const sql = 'SELECT DISTINCT provice FROM school ';
  const results = await query(sql);
  const proviceList = [];
  for (let item of results) {
    proviceList.push(item.provice);
  }

  ctx.body = {
    proviceList,
  }
});

/* 获取对应省份的城市列表 */
router.get('/city', async function (ctx, next) {
  let params = ctx.request.query;
  //const cityList = createCityList(params.provice);

  const sql = 'SELECT DISTINCT city FROM school WHERE provice = ?';
  const results = await query(sql, [params.provice]);
  const cityList = [];
  for (let item of results) {
    cityList.push(item.city);
  }

  ctx.body = {
    cityList
  }
});

module.exports = router;