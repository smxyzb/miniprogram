Component({
  properties: {
    title: {
      type: String,
      value: '标题'
    },
    content: {
      type: String,
      value: '内容'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    okText: {
      type: String,
      value: '确定'
    },
    cancelStyle: {
      type: String
    },
    okStyle: {
      type: String
    },
    contentStyle: {
      type: String,
      vallue: 'height:200rpx;font-size:26rpx'
    }
  },
  data: {
    isShow: false
  },
  methods: {
    show: function () {
      this.setData({
        isShow: true
      })
    },
    close: function () {
      this.setData({
        isShow: false
      })
    },
    _cancelEvent: function () {
      this.triggerEvent('cancelEvent');
    },
    _okEvent: function () {
      this.triggerEvent('okEvent');
    }
  }
})