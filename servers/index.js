/*
 * @Author: hongye.wu hongye.wu@dounion.com
 * @Date: 2023-08-05 09:38:12
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-10-07 15:37:51
 * @FilePath: /node-server/create-schema-tool/servers/index.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// 下划线转驼峰
const formatToT = (str) => {
  return str.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase());
};
const typeNameMap = new Map([
  ['input', '输入框'],
  ['select', '下拉'],
  ['date', '日期'],
  ['dateTime', '日期时间'],
])
const fs = require('fs')
const xlsx = require('node-xlsx');
// 引入导入模块
const multiparty = require('multiparty');

const useRouter = (Router) => {
  Router.post('/sendFile', (req, res) => {
    console.log('接收文件请求');
    /* 生成multiparty对象，并配置上传目标路径 */
    let form = new multiparty.Form();
    /* 设置编辑 */
    form.encoding = 'utf-8';
    //设置文件存储路劲
    // form.uploadDir =`${process.env.NODE_ENV === 'production' ? './servers/' : './'}tmplFile`;
    form.uploadDir =`./servers/tmplFile`;

    //设置文件大小限制
    // form.maxFilesSize = 1 * 1024 * 1024;
    form.parse(req, function (err, fields, files) {
      console.log('测试--+');
      try {
        let inputFile = files.file[0];
        let uploadedPath = inputFile.path;
        let newPath = form.uploadDir + "/" + inputFile.originalFilename;
        //同步重命名文件名 fs.renameSync(oldPath, newPath)
        fs.renameSync(inputFile.path, newPath);

        let { data} = xlsx.parse(newPath)[0];

        // 解析表
        const columns = [];
        data.slice(3).forEach((item) => {
          // 判断是否属于表单字段
          if (item[8] === 'Y') {
            // 获取dataIndex
            const dataIndex = formatToT(item[0].toLocaleLowerCase())
            // 获取sysCode
            const ucenterCode = item[9];
            let type = ucenterCode ? 'select' : 'input';
            // 获取title
            const title = item[4];
            const subTitle = title.substring(title.length - 2)
            if (subTitle === '时间') {
              type = 'dateTime';
            } else if (subTitle === '日期') {
              type = 'date';
            }
            // 判断是否必填
            const requied = item[5];
            const col = { dataIndex, title, type, typeName: typeNameMap.get(type) || '输入框' };
            if (ucenterCode) {
              Object.assign(col, { ucenterCode: `10001-${ucenterCode}` })
            }
            if (requied === 'Y') {
              Object.assign(col, { requied: true })
            }
            columns.push(col)
          }
        })

        res.send({ data: columns });
        //读取数据后 删除文件
        fs.unlink(newPath, function () {
          console.log("删除上传文件");
        })
      } catch (err) {
        console.log(err);
        res.send({ err: "上传失败！" });
      };
    })
  })
}

module.exports = useRouter;
