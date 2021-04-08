const { verifyToken } = require("../utils");
const { PUBLIC_API } = require("../utils/constant");

/* 对token进行解析验证用户信息 */
const parseToken = () => {
  return async (ctx, next) => {
    const url = ctx.path;
    if (!PUBLIC_API.includes(url)) {
      const { token } = ctx.request.headers;
      let data = verifyToken(token);
      if (data) {
        const userid = data.userid;
        ctx.request.body.UserID = userid;
        await next();
      } else {
        return ctx.body = {
          Msg: 'token verify fail',
        }
      }
    }
  }
}

module.exports = {
  parseToken
}

