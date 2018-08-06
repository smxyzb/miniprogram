import request from './service/request';
const regeneratorRuntime = require('./utils/regenerator-runtime');
// app.js
App({
  globalData: {
    userInfo: {},
    apiHost: 'https://paile.quguangjie.cn/test',
    version: '20180803'
  },
  onLaunch: function(options) {},
  onShow: function() {
    this.checkUpdate();
    this.getSystemInfo();
    this.checkLogin(null);
  },

  async toLogin(userData, cb) {
    wx.showLoading({
      title: '登录中...',
    })
    let code = await this.wxLogin();
    userData.code = code;
    this.apiLogin(userData, cb);
  },
  // 微信的登陆方法,主要获取code
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 3000,
        complete: function(res) {},
        success: function(res) {
          var code = res.code;
          resolve(code);
        },
        fail: (res) => {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
          reject(res);
        }
      })
    })
  },
  //授权过的情况，自动获取用户信息并登陆
  async getUserInfo(obj) {
    var that = this;
    //调用登录接口
    let code = await this.wxLogin();
    //get wx user simple info
    wx.getUserInfo({
      fail: function(res) {
        // typeof obj === 'object' && obj.setData({
        //   showLogin: true
        // })
      },
      success: function(res) {
        let userData = {
          encryptedData: res.encryptedData,
          iv: res.iv,
          signature: res.signature,
          code,
          ...res.userInfo
        }
        that.apiLogin(userData, obj.constructor === Function ? obj : null)
      }
    });
  },
  // 后台登陆
  apiLogin: function(userInfo, cb) {
    const self = this
    request({
      app: this,
      url: '/api/v1/login/mini',
      data: {
        code: userInfo.code,
        nickName: userInfo.nickName,
        gender: userInfo.gender,
        avatarUrl: userInfo.avatarUrl,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        agent_id: 0
      },
      notCheckLogin: true,
      success: res => {
        if (res.success) {
          let newUserInfo = {
            timeStamp: new Date().getTime(),
            ...userInfo,
            ...res,
          }
          self.globalData.userInfo = newUserInfo;
          wx.setStorage({
            key: 'userInfo',
            data: newUserInfo,
          })
          wx.showToast({
            title: '登陆成功',
          })
          cb && cb(newUserInfo)
        } else {
          wx.reportAnalytics('loginfailed', {
            login: 1,
            info: JSON.stringify(userInfo)
          });
          wx.showModal({
            content: res.message,
            showCancel: false
          })
        }

      },
    });
  },

  fmtTime: function(time) {
    const dateObj = new Date(time)
    const pad = num => num < 10 ? '0' + num : num
    return dateObj.getFullYear() + '-' + pad(dateObj.getMonth() + 1) + '-' + pad(dateObj.getDate()) + ' ' + pad(dateObj.getHours()) + ':' + pad(dateObj.getMinutes())
  },
  // 图片url 修正
  processImg: function(url, fixedImg) {
    if (url.indexOf('http') < 0) {
      url = 'https://imgs.quguangjie.cn/Data/' + url
    }
    url = url + '?imageMogr2/auto-orient/strip/quality/80/'
    if (fixedImg) {
      url += 'thumbnail/' + fixedImg + 'x'
    }
    return url
  },
  // 表单提交
  submitForm: function(event) {
    if (!this.globalData.userInfo.uid) return
    const formId = event.detail.formId;
    request({
      app: this,
      url: '/api/v1/user/formid/update',
      data: {
        formid: formId
      },
      success: res => {
        if (res.success) {
          console.log('formId提交成功:' + formId)
        }
      }
    }, true)
  },
  //获取系统信息
  getSystemInfo() {
    const _this = this
    wx.getSystemInfo({
      success: function(res) {
        const {
          brand,
          model,
          pixelRatio,
          platform,
          screenHeight,
          screenWidth,
          statusBarHeight,
          system,
          version,
          windowHeight,
          windowWidth,
          SDKVersion
        } = res
        let pixelRatioStr = ''
        switch (pixelRatio) {
          case 1:
            pixelRatioStr = 'pixel-ratio-1'
            break;
          case 2:
            pixelRatioStr = 'pixel-ratio-2'
            break;
          case 3:
            pixelRatioStr = 'pixel-ratio-3'
            break;
        }
        res.pixelRatioStr = pixelRatioStr
        _this.globalData.systemInfo = res
      },
    })
  },

  // 设备信息
  setAppInfo(page) {
    let _this = this
    page.setData({
      pixelRatioStr: _this.globalData.systemInfo.pixelRatioStr,
      sytemInfo: _this.globalData.systemInfo
    })
  },
  //检查登陆状态
  checkLogin2(callback) {
    const self = this
    wx.checkSession({
      success: function(res) {
        let userInfo = wx.getStorageSync('userInfo');
        self.globalData.userInfo = userInfo
        callback && callback(userInfo)
      },
      fail: function() {
        console.log('login timeout')

      }
    })
  },
  checkLogin(page, callback) {
    const self = this,
      now = new Date().getTime(),
      effectiveTime = 7 * 24 * 3600 * 1000;
    let userInfo = wx.getStorageSync('userInfo');
    if (now - userInfo.timeStamp < effectiveTime) {
      console.log('login intime')
      self.globalData.userInfo = userInfo;
      page && page.setData({
        userInfo: userInfo
      })
      callback && callback(userInfo);
    } else {
      console.log('login timeout');
      //this.getUserInfo(page);
      let url = '/pages/login/login';
      if (page) {
        url += `?from=/${page.route}&params=${JSON.stringify(page.options)}`;
      }
      // wx.redirectTo({
      //   url
      // })
    }
  },
  //检查更新
  checkUpdate() {
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager();
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '刷脸特卖小程序新版本已经准备好，是否重启应用？',
          success: function(res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
  },
  showLoading: function(page, content) {
    if (wx.showLoading) {
      wx.showLoading({
        title: content || '加载中...',
      })
    } else {
      toast.showLoading(page, content)
    }
  },

  hideLoading: function(page) {
    if (wx.hideLoading) {
      wx.hideLoading()
    } else {
      toast.hideLoading(page)
    }
  },
  stopPullDownRefresh(page) {
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  }
});