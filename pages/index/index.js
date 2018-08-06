Page({
  onLoad(){
    
  },
  onReady: function() {
    this.dialog = this.selectComponent('#dialog');
  },
  openDialog: function() {
    this.dialog.setData({
      title: '提示',
      content: '这是提示ss内容',
      cancelText: '取消',
      cancelStyle: "color:#fff",
      okText: '确定',
      okStyle: "color:#fff"
    });
    this.dialog.show();
  },
  cancelEvent: function() {
    this.dialog.close();
  },
  okEvent: function() {

    this.dialog.close();
  },
  openToast() {

  }
})