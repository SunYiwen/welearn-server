const { complexPath, request } = require("../../utils");

const login = async (code) => {

    // 合成请求参数
    const options = {
        path: '/sns/jscode2session',
        params: {
            appid: 'wx94376f6218f2b6b6',
            secret: '259820c3a069e61fbec5f41048304f6f',
            grant_type: 'authorization_code',
            js_code: code,
        }
    }
    const path = complexPath(options);

    // 转发请求获取wx的session_key和openid
    const data = await request({
        hostname: 'api.weixin.qq.com',
        path: path,
        method: 'GET',
        port: 443,
    });
    console.log('data', data);
}

module.exports = login;