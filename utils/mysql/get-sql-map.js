const fs = require('fs');
const walkFile = require('./walk-file');

/**
 * 获取sql目录下的文件目录数据
 * @return {object} 
 */
function getSqlMap() {
    let basePath = __dirname;
    let pathArr = basePath.split('/');
    const pathDeep = pathArr.length;

    basePath = pathArr.slice(0, pathDeep - 2).join('/') + '/mysql';

    let fileList = walkFile(basePath, 'sql');
    return fileList;
}

module.exports = getSqlMap;