App({
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true,
      env: 'ty-cab6d2'
    })
  }
})
