const fs = require('fs');
const https = require('https');
var WXBizDataCrypt = require('./WXBizDataCrypt');
const jwt = require('jsonwebtoken');
const schoolData = require('../data/school');
let Base64 = require('js-base64').Base64;

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

/* 获取省份列表 */
const createProviceList = () => {
  const proviceList = [];
  for (let provice of schoolData) {
    proviceList.push(provice.province_name);
  }
  return proviceList;
}

/* 获取对应省份的城市列表 */
const createCityList = (proviceName) => {
  const proviceItem = schoolData.filter(item => {
    return item.province_name === proviceName;
  })[0];

  const cityList = [];
  for (let city of proviceItem.cities) {
    cityList.push(city.city_name);
  }
  return cityList;
}

/* 获取对应省份、城市的学校列表 */
const createSchoolList = (proviceName, cityName) => {
  const proviceItem = schoolData.filter(item => {
    return item.province_name === proviceName;
  })[0];

  const cityItem = proviceItem.cities.filter(city => {
    return city.city_name === cityName;
  })[0];

  return cityItem.universities;
}

/* 解析JWT数据 */
const verifyToken = (token) => {
  try {
    if (token) {
      return jwt.verify(token, 'welearn');
    }
  } catch (err) {
    console.log(err);
  }

  /* 默认返回空对象 */
  return null;
}

/** 创建唯一ID */
const uuid = (id) => {
  const code = Date.now().toString(32);

  return code.split('').reverse().slice(0, 6).join('').toLocaleUpperCase();
}

/**
 * @desc 日期时间格式化
 * @param time 时间，可以是字符串，也可以是时间戳
 * @param fmt 指定格式，字符串：'yyyy-MM-dd hh:mm:ss:S'
 * @return 时间字符串
 */
const dateTimeFormatter = (time, fmt = 'yyyy-MM-dd hh:mm:ss', isTimestamp = false) => {
  if (!time) {
    return '';
  }
  let res = fmt;
  if (isTimestamp) {
    time = `${time}`;
    if (time.length === 10) {
      time = `${time}000`;
    }
    time = parseInt(time, 10);
  }
  time = time.replace ? time.replace(/-/g, '/') : time;
  const date = new Date(time);
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(res)) {
    res = res.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(res)) {
      res = res.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
    }
  });
  return res;
};


module.exports = {
  useRoutes,
  complexPath,
  request,
  parseUserInfo,
  createJWT,
  createProviceList,
  createCityList,
  createSchoolList,
  verifyToken,
  uuid,
  dateTimeFormatter
}