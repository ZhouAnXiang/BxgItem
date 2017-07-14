// /assets/js/courser/add.js
require(['../../assets/js/config.js', '../../assets/js/common.js'], function () {
  require(['jquery', 'validate', 'form'], function ($) {
    $('form').validate({
      submitHandler: function () {
        // var value = documen.xx ().value()
        // $('form')
        var options = {
          url: '/api/course/create',
          type: 'post',
          // 可以不写data, 插件会自动帮我们
          // 添加上参数
          // 但是要将input中的name值与参数名对应
          success: function (data) {
            window.location.href = './step1.html?cs_id=' + data.result.cs_id
          }
        }
        $('form').ajaxSubmit(options)
      },
      rules: {
        cs_name: {
          required: true,
          rangelength: [3, 8]
        }
      },
      messages: {
        cs_name: {
          required: '亲！要写课程名哦!',
          rangelength: '亲! 课程名长度太长或者太短!'
        }
      }
    })
  })
})
