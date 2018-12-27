//index.js
const db = wx.cloud.database()
Page({
  data: {
    lab: false,
    labData: '1510LAB是一家由西安培华学院创客中心孵化出的信息科技类相关的工作室，它以应用软硬件开发、教学器材开发与销售、网络运营维护服务、计算机计数推广服务、网页制作、通讯设备、计算机软硬件及外部设备的销售为主要业务。\n地址：西安培华学院创客中心二楼。',
    timeStampOld: 0,
    FriendDate_bar: true,
    FriendDate: '',
    like: false,
    page: 0,
    num: 0,
    data: '',
    userInfo: '',
    filePath: '',
    canvasHeight: '',
    toFriendDate: '',
    showModal: false,
    showToFriend: false,
    show: true,
    showHat: false,
    cut: false,
    imgs: 'https://7479-ty-cab6d2-1258251528.tcb.qcloud.la/WX20181209-183306@2x.png?sign=7d7c7cebf6c210c4edb34014a3c0e97b&t=1544371876'
  },
  onLoad(options) {
    if (options.id) {
      console.log(options.id)
      var data = JSON.parse(options.id)
      this.setData({
        data: data,
        showToFriend: true,
        toFriendDate: data.toFriendDate,
        show: false,
        showHat: false,
        FriendDate_bar: false
      })
      console.log(data)
    }
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      console.log(res.result.openid)
      wx.setStorageSync('openid', res.result.openid)
    })

  },
  onReady() {
    this.loadData()
    wx.loadFontFace({
      family: "AppleChancery",
      source: 'url("https://7479-ty-cab6d2-1258251528.tcb.qcloud.la/Apple Chancery.ttf?sign=81fe30a38c6f563a5ef64dded537f61d&t=1544442177")',
      complete: res => {
        this.loaded = true;
      }
    });
    var deg = 0
    var circleCount = 0;
    //圣诞老人旋转
    this.animation = wx.createAnimation({
      duration: 1000,
      success: function(res) {}
    })
    // 头像心跳的外框动画
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000,
      delay: 100,
      success: function(res) {}
    });

    setInterval(function() {
      if (circleCount % 2 == 0) {
        deg = deg + 5
        this.animation.rotate(deg).step()
        this.animationMiddleHeaderItem.scale(1.15).step();
      } else {
        deg = deg + 5
        this.animation.rotate(deg).step()
        this.animationMiddleHeaderItem.scale(1.0).step();
      }
      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export(),
        animation: this.animation.export()
      });
      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 1000);
  },
  onShow() {
    var that = this
    wx.onAccelerometerChange(function(e) {
      if (e.x > 0.8 && e.y > 0.8) {
        var i = that.data.FriendDate.length
        if (that.data.num >= i) {
          that.setData({
            page: that.data.page + 20,
            num: 0
          })
          that.loadData()
        } else {
          that.setData({
            num: that.data.num + 1
          })
          wx.vibrateShort()

        }
        wx.showToast({
          image: "/images/yidan8.png",
          duration: 1500
        })
      }
    })

    var openid = wx.getStorageSync('openid')
    const filePath = that.data.imgs
    const cloudPath = openid + "/" + Date.parse(new Date()) + filePath.match(/\.[^.]+?$/)[0];
    if (that.data.cut) {
      wx.showLoading({
        title: "检测中"
      });
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('上传成功', res.fileID)
          wx.cloud.getTempFileURL({
            fileList: [res.fileID],
            success: res => {
              console.log(res.fileList[0].tempFileURL)
              that.setData({
                imgs: res.fileList[0].tempFileURL,
                cut: false
              })

              that.test();
            },
            fail: console.error
          });
        },
      })
    } else {
      console.log("2")
    }
  },

  getuserinfo(e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
    })
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        FriendDate_bar: false
      })
      this.submit();
    }
  },

  test() {
    wx.cloud.callFunction({
      name: 'result',
      data: {
        url: this.data.imgs
      }
    }).then(res => {
      wx.setStorageSync('data', res.result.data)
      console.log(wx.getStorageSync('data').image_height)
      if (res.result.code === 0) {
        wx.hideLoading();
        wx.showToast({
          title: "检测成功！",
          image: "/images/2.png",
          duration: 1500,
          mask: true
        });
        wx.downloadFile({
          url: this.data.imgs,
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res.tempFilePath)
              this.setData({
                canvasHeight: wx.getStorageSync('data').image_height,
                imgs: res.tempFilePath,
                show: false,
                showHat: true,
                FriendDate_bar: false
              })
              this.cat()
            }
          }
        })

      } else {
        wx.hideLoading();
        wx.showToast({
          title: "请上传人脸照片",
          image: "/images/2.png",
          duration: 1500,
          mask: true
        });
      }
    })

  },

  cat() {
    var canvasHeight = this.data.canvasHeight
    console.log(canvasHeight)
    var data = wx.getStorageSync('data')
    var image_height = data.image_height
    var image_width = data.image_width
    var face_profile = data.face_shape[0].face_profile
    var left_eye = data.face_shape[0].left_eye
    var left_eyebrow = data.face_shape[0].left_eyebrow
    var mouth = data.face_shape[0].mouth
    var nose = data.face_shape[0].nose
    var right_eye = data.face_shape[0].right_eye
    var right_eyebrow = data.face_shape[0].right_eyebrow

    const ctx = wx.createCanvasContext('firstCanvas', this);
    ctx.drawImage(this.data.imgs, 0, 0, canvasHeight, canvasHeight)
    //显示五官定位点

    // for (var i = 0; i < face_profile.length; i++) {
    //   ctx.beginPath()
    //   ctx.arc((face_profile[i].x) * (canvasHeight / image_width), (face_profile[i].y) * (canvasHeight / image_height), 2, 0, 0.6 * Math.PI)
    //   ctx.setFillStyle('#fff')
    //   ctx.fill()
    // }
    // for (var i = 0; i < left_eye.length; i++) {
    //   ctx.beginPath()
    //   ctx.arc((left_eye[i].x) * (canvasHeight / image_width), (left_eye[i].y) * (canvasHeight / image_height), 2, 0, 0.6 * Math.PI)
    //   ctx.setFillStyle('#fff')
    //   ctx.fill()
    // }
    // for (var i = 0; i < left_eyebrow.length; i++) {
    //   ctx.beginPath()
    //   ctx.arc((left_eyebrow[i].x) * (canvasHeight / image_width), (left_eyebrow[i].y) * (canvasHeight / image_height), 2, 0, 0.6 * Math.PI)
    //   ctx.setFillStyle('#fff')
    //   ctx.fill()
    // }
    // for (var i = 0; i < mouth.length; i++) {
    //   ctx.beginPath()
    //   ctx.arc((mouth[i].x) * (canvasHeight / image_width), (mouth[i].y) * (canvasHeight / image_height), 2, 0, 0.6 * Math.PI)
    //   ctx.setFillStyle('#fff')
    //   ctx.fill()
    // }
    // for (var i = 0; i < nose.length; i++) {
    //   ctx.beginPath()
    //   ctx.arc((nose[i].x) * (canvasHeight / image_width), (nose[i].y) * (canvasHeight / image_height), 2, 0, 0.6 * Math.PI)
    //   ctx.setFillStyle('#fff')
    //   ctx.fill()
    // }
    // for (var i = 0; i < right_eye.length; i++) {
    //   ctx.beginPath()
    //   ctx.arc((right_eye[i].x) * (canvasHeight / image_width), (right_eye[i].y) * (canvasHeight / image_height), 2, 0, 0.6 * Math.PI)
    //   ctx.setFillStyle('#fff')
    //   ctx.fill()
    // }
    // for (var i = 0; i < right_eyebrow.length; i++) {
    //   ctx.beginPath()
    //   ctx.arc((right_eyebrow[i].x) * (canvasHeight / image_width), (right_eyebrow[i].y) * (canvasHeight / image_height), 2, 0, 0.6 * Math.PI)
    //   ctx.setFillStyle('#fff')
    //   ctx.fill()
    // }

    //帽子底部轮廓
    var k1 = (nose[0].y - nose[1].y) / (nose[0].x - nose[1].x)
    var y1 = (nose[0].y - 2.5 * (nose[0].y - nose[1].y))
    var x1 = ((y1 - nose[1].y) / k1) + nose[1].x
    var y2 = face_profile[1].y - (nose[7].y - nose[1].y)
    var z1 = (face_profile[20].x - right_eye[0].x) / (left_eye[0].x - face_profile[0].x)
    // if (z1 < 0.9){ //左侧脸
    //   var x3 = face_profile[19].x 
    //   var x6 = face_profile[19].x 
    //   var x5 = face_profile[1].x - (1 / z1) * (left_eyebrow[0].x - face_profile[1].x)
    //   var x2 = face_profile[1].x - (1/ z1) * (left_eyebrow[0].x - face_profile[1].x )
    // }
    // else if (z1 > 1.1){ //有侧脸
    //   var x2 = face_profile[1].x
    //   var x5 = face_profile[1].x
    //   var x3 = face_profile[19].x + (1 / z1) * ( face_profile[19].x - right_eyebrow[0].x)
    //   var x6 = face_profile[19].x + (1 / z1) * (face_profile[19].x - right_eyebrow[0].x)
    // }
    // else{ //正脸
    //   var x2 = face_profile[1].x - 0.5 * (left_eyebrow[0].x - face_profile[1].x)
    //   var x5 = face_profile[1].x - 0.5 * (left_eyebrow[0].x - face_profile[1].x)
    //   var x3 = face_profile[19].x + 0.5 * (left_eyebrow[0].x - face_profile[1].x)
    //   var x6 = face_profile[19].x + 0.5 * (left_eyebrow[0].x - face_profile[1].x)
    // }
    var x2 = face_profile[1].x - 0.5 * (left_eyebrow[0].x - face_profile[1].x)
    var x5 = face_profile[1].x - 0.5 * (left_eyebrow[0].x - face_profile[1].x)
    var x3 = face_profile[19].x + 0.5 * (left_eyebrow[0].x - face_profile[1].x)
    var x6 = face_profile[19].x + 0.5 * (left_eyebrow[0].x - face_profile[1].x)

    var y3 = face_profile[19].y - (nose[7].y - nose[1].y)
    //帽子中轮廓
    var y4 = (nose[0].y - 3 * (nose[0].y - nose[1].y)) + 1.5 * (left_eye[0].x - left_eye[4].x)
    var x4 = ((y1 - nose[1].y) / k1) - nose[1].x
    var y5 = face_profile[1].y - (nose[7].y - nose[1].y) + 1.5 * (left_eye[0].x - left_eye[4].x)
    var y6 = face_profile[19].y - (nose[7].y - nose[1].y) + 1.5 * (left_eye[0].x - left_eye[4].x)
    //帽子身体
    var x7 = face_profile[3].x + (face_profile[17].x - face_profile[3].x) / 3
    var y7 = y5 + (nose[1].y - nose[0].y) * 1.5
    var x8 = face_profile[3].x + (face_profile[3].x - face_profile[17].x) / 4
    var y8 = face_profile[0].y
    var x9 = x7
    var y9 = y7 - 1.1 * (right_eye[2].y - right_eyebrow[6].y)
    var x11 = right_eye[7].x
    var y11 = y6 + (right_eye[7].y - face_profile[10].y) * 0.6
    var x10 = x3 + (face_profile[10].x - face_profile[3].x) * 0.3
    var y10 = y3 - 2 * (y3 - y6)
    ctx.beginPath()
    ctx.moveTo(x5 * (canvasHeight / image_width), y5 * (canvasHeight / image_width))

    ctx.quadraticCurveTo((x7 + x5 + 0.7 * (face_profile[3].x - face_profile[17].x)) / 2 * (canvasHeight / image_width), (y7 + y5) / 2 * (canvasHeight / image_height), x7 * (canvasHeight / image_width), y7 * (canvasHeight / image_width))

    ctx.quadraticCurveTo((x7 + x5 + 0.3 * (face_profile[3].x - face_profile[17].x)) / 3 * (canvasHeight / image_width), (y7 + y5) / 1.5 * (canvasHeight / image_height), x8 * (canvasHeight / image_width), y8 * (canvasHeight / image_width))

    ctx.quadraticCurveTo((x7 + x5 + 0.7 * (face_profile[3].x - face_profile[17].x)) / 5 * (canvasHeight / image_width), (y7 + y5) * 0.2 * (canvasHeight / image_height), x11 * (canvasHeight / image_width), y11 * (canvasHeight / image_width))

    //ctx.quadraticCurveTo((x7 + x5 + 0.7 * (face_profile[3].x - face_profile[17].x)) / 5 * (canvasHeight / image_width), (y7 + y5) / 2 * (canvasHeight / image_height), x9 * (canvasHeight / image_width), y9 * (canvasHeight / image_width))
    // ctx.quadraticCurveTo(x1 * (canvasHeight / image_width), (y1 + 0.8* (face_profile[3].x - face_profile[17].x)) * (canvasHeight / image_height), x11 * (canvasHeight / image_width), y11 * (canvasHeight / image_width))
    ctx.quadraticCurveTo(x10 * (canvasHeight / image_width), y10 * (canvasHeight / image_height), x6 * (canvasHeight / image_width), y6 * (canvasHeight / image_width))
    ctx.closePath()
    ctx.setStrokeStyle('#000')
    ctx.setLineWidth(3)
    ctx.stroke()
    ctx.setFillStyle('#ae4333')
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(x2 * (canvasHeight / image_width), y2 * (canvasHeight / image_width))
    ctx.quadraticCurveTo(x1 * (canvasHeight / image_width), y1 * (canvasHeight / image_width), x3 * (canvasHeight / image_width), y3 * (canvasHeight / image_width))
    ctx.quadraticCurveTo((x3 + x6 + 0.6 * (right_eye[0].x - right_eye[4].x)) / 2 * (canvasHeight / image_width), (y3 + y6) / 2 * (canvasHeight / image_height), x6 * (canvasHeight / image_width), y6 * (canvasHeight / image_width))
    ctx.quadraticCurveTo(-x4 * (canvasHeight / image_width), y4 * (canvasHeight / image_width), x5 * (canvasHeight / image_width), y5 * (canvasHeight / image_width))
    ctx.quadraticCurveTo((x2 + x5 + 0.6 * (left_eye[0].x - left_eye[4].x)) / 2 * (canvasHeight / image_width), (y2 + y5) / 2 * (canvasHeight / image_height), x2 * (canvasHeight / image_width), y2 * (canvasHeight / image_width))

    ctx.closePath()
    ctx.setStrokeStyle('#000')
    ctx.stroke()
    ctx.setFillStyle('#ffffff')
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x8 * (canvasHeight / image_width), y8 * (canvasHeight / image_width), 10, 0, 20 * Math.PI)
    ctx.setStrokeStyle('#000')
    ctx.setLineWidth(3)
    ctx.stroke()
    ctx.fill()

    //ctx.draw()
    var that = this
    ctx.draw(true, function() {
      wx.canvasToTempFilePath({
        canvasId: 'firstCanvas',
        success: function(res) {
          var filePath = res.tempFilePath
          that.setData({
            filePath: res.tempFilePath,
          })
        }
      })
    });
  },
  cropper(e) {
    console.log(e)
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo
    })
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.chooseImage({
        success: (res) => {
          console.log(res.tempFilePaths[0])
          var img = res.tempFilePaths[0]
          wx.navigateTo({
            url: `/pages/cutInside/cutInside?img=${img}`,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      })
    }
  },
  /**
   * 添加测试图片
   */
  onAddTest() {
    this.setData({
      graph: {
        w: 120,
        h: 120,
        type: 'image',
        url: '../../assets/images/test.jpg',
      }
    });
  },

  back() {
    this.setData({
      show: true,
      showHat: false,
      FriendDate_bar: true
    })
  },
  save() {
    var filePath = this.data.filePath
    wx.saveImageToPhotosAlbum({
      filePath,
      success: res => {
        wx.showToast({
          title: '已保存至相册',
          duration: 1500,
          image: "/images/2.png",
          mask: true
        })
        this.setData({
          show: true,
          showHat: false,
          FriendDate_bar: true
        })
      }
    })
  },

  // 导出图片
  onExport() {
    var that = this
    var canvasHeight = that.data.canvasHeight
    const ctx = wx.createCanvasContext('firstCanvas')
    ctx.draw(true, function() {
      wx.canvasToTempFilePath({
        canvasId: 'firstCanvas',
        // x:0,
        // y:0,
        // width:canvasHeight,
        // height:canvasHeight,
        success: function(res) {
          console.log(res.tempFilePath)
          var filePath = res.tempFilePath
          that.setData({
            filePath: res.tempFilePath,
          })
        }
      })
    });
  },

  submit: function() {
    this.setData({
      showModal: true,
      FriendDate_bar: false
    })
  },

  preventTouchMove: function() {

  },

  closeToFriend() {
    this.setData({
      showToFriend: false,
      show: true,
      showHat: false,
      FriendDate_bar: true
    })
  },
  close: function() {
    this.setData({
      showModal: false,
      FriendDate_bar: true
    })
  },
  bindblur(e) {
    this.setData({
      toFriendDate: e.detail.value
    })
  },
  bindFormSubmit(e) {
    this.setData({
      toFriendDate: e.detail.value.textarea
    })
    var userInfo = wx.getStorageSync('userInfo')
    if (e.detail.value.textarea == '') {
      var toFriendDate = 'Merry Christmas'
    } else {
      var toFriendDate = e.detail.value.textarea
    }
    var openoid = wx.getStorageSync('openid')
    var date = new Date()
    db.collection('toFriendDate').add({
        data: {
          userInfo,
          toFriendDate,
          openoid,
          date,
          like: 0,
          liked: []
        }
      })
      .then(res => {
        console.log(res)
      })
  },
  onShareAppMessage(res) {
    var userInfo = wx.getStorageSync('userInfo')
    var data = JSON.stringify({
      userInfo: userInfo,
      toFriendDate: this.data.toFriendDate
    })
    return {
      title: `你的好友${userInfo.nickName}给你送来了一张圣诞贺卡！`,
      path: `/pages/index/index?id=${data}`,
      imageUrl: '/images/share.jpg'
    }

  },

  loadData() {
    var page = this.data.page
    db.collection('toFriendDate').skip(page).orderBy('date', 'desc').get().then(res => {
      console.log(res.data)
      if (res.data.length == 0) {
        this.setData({
          page: 0,
          num: 0
        })
        this.loadData()
      }
      wx.showToast({
        image: "/images/yidan8.png",
        duration: 1500
      })
      this.setData({
        FriendDate: res.data
      })
    })
  },
  like(e) {
    var num = 0
    var id = this.data.FriendDate[e.target.id]._id
    var liked = this.data.FriendDate[e.target.id].liked
    var openid = wx.getStorageSync('openid')
    var timeStampOld = this.data.timeStampOld
    var timeStamp = e.timeStamp
    this.setData({
      timeStampOld: e.timeStamp
    })
    if ((timeStamp - timeStampOld) < 1000) {
      for (var i = 0; i < liked.length; i++) {
        if (liked[i] == openid) {
          num = num + 1
        }
      }
      if (num = 0) {
        wx.cloud.callFunction({
          name: 'like',
          data: {
            id,
            openid
          }
        }).then(res => {
          this.setData({
            timeStampOld: 0
          })
          if (res.result.stats.updated == 1) {
            wx.showToast({
              image: "/images/like.png",
              duration: 1000
            })
          }
        })
      } else {
        wx.showToast({
          image: "/images/like.png",
          duration: 1000
        })
      }
    }
  },
  openLab() {
    this.setData({
      lab: true,
      //show: false,
      // showHat: false,
      // FriendDate_bar: false
    })
  },
  closeLab() {
    this.setData({
      lab: false
    })
  }

})