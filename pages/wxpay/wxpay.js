// pages/wxpay/wxpay.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log("pay checksession...");
    let self=this;
    /*
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        self.requestPay(options);
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log("login session timeout");
        wx.login({
          success(res) {
            if (res.code) {
              app.globalData.code = res.code;
              self.requestPay(options);
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
    */

    wx.login({
      success(res) {
        if (res.code) {
          console.log("code:" + res.code);
          app.globalData.code = res.code;
          self.requestPay(options);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
  },
  

  requestPay:function(obj){
    console.log("start wxpay...");
    console.log("code:"+app.globalData.code);
    let self=this;
    wx.request({
      url: 'https://timebank.coder4game.com/action.do?act=order&method=unifiedOrder', 
      data:{
        account: obj.account,//登录账号
        token: obj.token,//令牌
        body: obj.body,//商品描述（必填）
        total_fee: obj.total_fee,//总金额(必填)
        spbill_create_ip: "127.0.0.1",//终端IP(必填)
        trade_type: "JSAPI",//交易类型(必填)
        code: app.globalData.code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method:"POST",
      success(res) {
        console.log(res.data)
        let resObj = res.data["obj"];
        self.requestWxPayment(resObj);
      }
    })
  },

  //根据 obj 的参数请求wx 支付
  requestWxPayment:function (obj) {
    //获取options的订单Id
    var orderId = Math.random()*1000+new Date().getMilliseconds;
    orderId = Math.floor(orderId);
    //调起微信支付
    console.log(obj);


    wx.requestPayment({
      //相关支付参数
      'timeStamp': obj.timestamp.toString(),
      'nonceStr': obj.nonce_str,
      'package': 'prepay_id=' + obj.prepay_id,
      'signType': 'MD5',
      'paySign': obj.sign,
      //小程序微信支付成功的回调通知
      'success': function (res) {
        //定义小程序页面集合
        var pages = getCurrentPages();
        //当前页面 (wxpay page)
        var currPage = pages[pages.length - 1];
        //上一个页面 （index page） 
        var prevPage = pages[pages.length - 2];
        //通过page.setData方法使index的webview 重新加载url  有点类似于后台刷新页面
        //此处有点类似小程序通过加载URL的方式回调通知后端 该订单支付成功。后端逻辑不做赘述。
        //prevPage.setData({
        //  url: '',
        //}),
          //小程序主动返回到上一个页面。即从wxpay page到index page。此时index page的webview已经重新加载了url 了
          //微信小程序的page 也有栈的概念navigateBack 相当于页面出栈的操作
          wx.navigateBack();
      },
      'fail':function(res) {
          console.log("pay fail:"+res);
          wx.navigateBack();
       }

    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})