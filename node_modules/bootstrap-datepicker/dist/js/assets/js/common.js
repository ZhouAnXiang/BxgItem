/**
 * 这里就完成其他页面公共要使用的功能!
 * 功能1: 判断用户是否登陆
 * 功能2: 从cookie读取用户的资料，并展示
 * 功能3: 导航菜单交互(展开与收起!)
 * 功能4: 退出登陆
 * 功能5: 让页面打开时有进度条，让每个ajax发送过程有进度
 */
define(['jquery', 'nprogress', 'cookie'], function ($, NProgress) {
  NProgress.start()
  validSignIn() // 验证是否登录过了
  getInfo()     // 获取用户资料并展示
  navToggle()   // 导航菜单交互
  signOut()     // 退出登陆
  globalAjaxEvent() // 注册全局的ajax事件，添加进度条!

  // 功能1:
  // 为什么要放到一个函数里，就是为了咱们看起来清楚一些
  function validSignIn () {
    // 思路是获取cookie中的PHPSESSID这个cookie,只要它的值存在，就说明登陆，反之就没有登陆
    var sessionID = $.cookie('PHPSESSID')
    console.log(sessionID)
    if (!sessionID) {
      // 如果没有登陆，则跳转到登陆页面
      // window.location.href = 'http://localhost/views/index/login.html'
      window.location.href = '/views/index/login.html'
    }
  }

  // 功能2:
  function getInfo () {
    var userInfo = JSON.parse($.cookie('userinfo'))
    // 头像
    $('.profile img').attr('src', userInfo.tc_avatar)
    // 用户名
    $('.profile h4').text(userInfo.tc_name)
  }

  // 功能3:
  function navToggle () {
    $('.navs li a').on('click', function (e) {
      $(this).next('ul').slideToggle() // slideToggle是jquery控制元素展示与隐藏的方法
    })
  }

  // 功能4: 退出登陆
  function signOut () {
    // <div><div><li><button parent></button></li></div></div>
    // button.parents('div') = 两个div
    // button.closest('div') = 1个div, 选器所定义的最接近自己父级() // 只选择最近的div
    // parents
    $('.fa-sign-out').closest('li').on('click', clickHandler)
    function clickHandler (e) {
      var options = {
        // url: 'http://api/boute.com/logout'
        url: '/api/logout',
        type: 'post',
        success: function (data) {
          if (data.code == 200) {
            window.location.href = '/views/index/login.html'
          }
        }
        // > 当状态码>= 200 <400 执行success
        // > 当前状态码>=400 时执行error
        // error: function (err) {
        //     // if (e)
        // }
      }
      $.ajax(options)
    }
  }

  // signIn 登陆
  // signOut 退出
  // signUp 注册


  // 功能5:
  function globalAjaxEvent() {
    $(document).ajaxStart(function () {
      NProgress.start()
    })
    $(document).ajaxStop(function () {
      NProgress.done()
    })
  }
  $(function () {
    NProgress.done()
  })
})
