const fs = require('fs');
const https = require('https');
var WXBizDataCrypt = require('./WXBizDataCrypt');
const jwt = require('jsonwebtoken');

/* 自动注册routes文件夹下的路由 */
const useRoutes = (app) => {
  const dirname = 'routes';

  // 读取路由文件下所有文件
  const dirs = fs.readdirSync(dirname);

  // 遍历所有文件
  dirs.forEach((dir) => {
    const files = fs.readdirSync(dirname + '/' + dir);

    files.map(file => {
      if (/index.js/.test(file)) {
        const path = '../routes/' + dir + '/index.js';
        const router = require(path);
        return app.use(router.routes(), router.allowedMethods())
      }
    });
  });
};

/* 合成get请求参数地址 */
const complexPath = (options) => {
  const { path, params } = options;

  /* 合成参数 */
  let paramsString = '';
  for (let key of Object.keys(params)) {
    if (paramsString !== '') {
      paramsString += '&';
    }
    paramsString += (key + '=' + params[key]);
  }


  if (paramsString) {
    return path + '?' + paramsString;
  }
  return path;
}


// 发起https请求
const request = (options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, function (res) {
      res.setEncoding('utf-8');

      // 不存在中文字符，直接使用二进制流相加即可
      let content = '';
      res.on('data', function (chunk) {
        content += chunk;
      });

      res.on('end', () => {
        resolve(content);
      });

      res.on('error', (err) => {
        reject(err);
      })
    });

    req.end();
  });
}

const parseUserInfo = (session_key, EncryptedData, IV) => {
  const appid = 'wx94376f6218f2b6b6';
  const pc = new WXBizDataCrypt(appid, session_key);
  const data = pc.decryptData(EncryptedData, IV);
  console.log('user', data);
  return data;
}


/* 生成JWT token */
const createJWT = (userInfo, openid) => {
  const profile = {
    openid: userInfo.wxOpenID,
    userid: userInfo.userID,
  };
  const expiresIn = 60 * 60 * 24 * 7;
  const token = jwt.sign(profile, 'welearn', { expiresIn });
  return token;
}

module.exports = {
  useRoutes,
  complexPath,
  request,
  parseUserInfo,
  createJWT,
} 