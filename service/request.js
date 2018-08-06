export default function request(opts) {
  const app = opts.app,
    page = opts.page,
    userInfo = app.globalData.userInfo,
    token = userInfo.token,
    uid = userInfo.uid,
    open_id = userInfo.open_id,
    union_id = userInfo.union_id,
    success = opts.success,
    fail = opts.fail,
    notCheckLogin = opts.notCheckLogin,
    method = opts.method || 'post';

  let url = app.globalData.apiHost + opts.url,
    data = Object.assign(opts.data, {
      token,
      uid,
      // open_id,
      // union_id,
      "client": "mini"
    })

  wx.request({
    url: url,
    data: data,
    method: opts.method || 'POST',
    dataType: opts.dataType || 'json',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      if (res.data.success) {
        success(res.data);
      } else {
        if (fail) fail(res.data)
        else Error(res.data);
      }
    },
    fail: function(res) {
      if (!res.code) {
        return wx.showToast({
          title: '网络链接不可用',
          icon: 'none'
        })
      }
      Error(res.data);
    },
    complete: function() {

    }
  })

  function Error(res, notCheckLogin) {
    wx.hideLoading();
    wx.showToast({
      title: res.message ? res.message : '网络链接不可用',
      icon: 'none'
    })
  }
}