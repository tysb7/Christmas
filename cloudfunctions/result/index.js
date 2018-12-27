// 云函数入口文件
const cloud = require('wx-server-sdk')
const {ImageClient} = require('image-node-sdk');
let AppId = '1252809090'; // 腾讯云 AppId
let SecretId = 'AKIDIhyAG9fmiFtOh2xdDcsvmQxb6rS2ZceV'; // 腾讯云 SecretId
let SecretKey = 'oPvGS2NbhePNDsKfxCICvSp23sXAeu9D'; // 腾讯云 SecretKey
const imgClient = new ImageClient({
  AppId,
  SecretId,
  SecretKey
});
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const url = event.url;
  const result = await imgClient.faceShape({
    data: {
      appid: "1252809090",
      mode: 1,
      url,
    },
  });
  return JSON.parse(result.body);
}