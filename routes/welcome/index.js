const router = require('koa-router')();

// 设置欢迎页
router.get('/', function (ctx, next) {
    ctx.body = "Welcome Welearn!";
});

module.exports = router;