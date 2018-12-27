// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto');
var secretId = 'AKIDIhyAG9fmiFtOh2xdDcsvmQxb6rS2ZceV',
  secretKey = 'oPvGS2NbhePNDsKfxCICvSp23sXAeu9D',
  appid = '1252809090',
  pexpired = 86400,
  userid = 0;
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var now = parseInt(Date.now() / 1000),
    rdm = parseInt(Math.random() * Math.pow(2, 32)),
    plainText = 'a=' + appid + '&k=' + secretId + '&e=' + (now + pexpired) + '&t=' + now + '&r=' + rdm
      + userid + '&f=',
    data = new Buffer(plainText, 'utf8'),
    res = crypto.createHmac('sha1', secretKey).update(data).digest(),
    bin = Buffer.concat([res, data]);
  var sign = bin.toString('base64');
  return sign
}