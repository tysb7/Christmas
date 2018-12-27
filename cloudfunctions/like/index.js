
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('toFriendDate').doc(event.id).update({
      data: {
        like: _.inc(1),
        liked: _.push(event.openid)
      }
    })
  } catch (e) {
    console.error(e)
  }
}