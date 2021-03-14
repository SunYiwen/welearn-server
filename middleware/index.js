const { use } = require("../app");
const { parseSessionToken } = require("../utils");
const { PUBLIC_API } = require("../utils/constant");

/* 对token进行解析验证用户信息 */
const parseToken = () => {
  return async (ctx, next) => {
    const url = ctx.url;
    if (!PUBLIC_API.includes(url)) {
      const { token } = ctx.request.headers;
      let data = parseSessionToken(token);
      const { userid } = data;
      ctx.request.body.UserID = userid;
    }
    await next();
  }
}

module.exports = {
  parseToken
}

