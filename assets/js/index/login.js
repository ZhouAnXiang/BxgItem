// 定义模块
/**
 * 要做什么功能
 * 1.给登陆按钮注册点击事件
 * 2.在点击事件触发时获取用户名和密码的值
 * 3.表单较验, 判断用户名和密码是否为空，如果为空则不允许发请求
 * 4.使用jquery发ajax请求，把数据发给服务器
 */
// http://doc.botue.com/  接口文档地址

// 当前你写的模块希望别的js加载时，就使用define
// 如果是用data-main加载的就用require
require(['/assets/js/config.js'], function () {
  // 这个函数就是在config.js加载完成后执行!
  require(['jquery', 'cookie'], function ($) {
  // 1.注册事件
  var $sub = $('#sub')
  $sub.on('click', clickHandler)
  function clickHandler (e) {
    e.preventDefault() // 禁用默认事件
    // 2.获取用户名和密码
    var username = $('#name').val()
    var password = $('#pass').val()
    // 3.表单较验
    // if (!username.trim() || !password.trim()) {
    //   return
    // }
    // 4.发请求
    var options = {
    //  url: 'http://api.botue.com/v1/login',
      url: '/api/login',
      type: 'post',
      data: {
        tc_name: username,
        tc_pass: password
      },
      success: function (data) {
        console.log(data)
        if (data.code === 200) {
          // window.alert('登陆成功!')
          // 跳转到首页
          // window.location.href = 'http://localhost/views/index/dashboard.html'

          // JSON.stringify
          $.cookie('userinfo', JSON.stringify(data.result), {expires: 7, path: '/'})
          window.location.href = '/views/index/dashboard.html'
        }
      }
    }
    $.ajax(options)
  }
})
})


