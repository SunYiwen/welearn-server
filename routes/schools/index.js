const router = require('koa-router')();
const { createProviceList, createCityList, createSchoolList } = require('../../utils/index');

/* 路由前缀 */
router.prefix('/school');

/* 获取学校 */
router.get('/', function (ctx, next) {
  let { provice, city } = ctx.request.query;
  const schoolList = createSchoolList(provice, city);
  ctx.body = {
    schoolList,
  }
});


/* 获取省份列表 */
router.get('/provice', function (ctx, next) {
  const proviceList = createProviceList();
  ctx.body = {
    proviceList
  }
});

/* 获取对应省份的城市列表 */
router.get('/city', function (ctx, next) {
  let params = ctx.request.query;
  const cityList = createCityList(params.provice);

  ctx.body = {
    cityList
  }
});





module.exports = router;