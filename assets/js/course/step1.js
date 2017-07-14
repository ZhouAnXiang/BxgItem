require(['/assets/js/config.js', '/assets/js/common.js'], function () {
  require(['jquery',
    '/assets/js/getarg.js',
    'template', 'validate', 'form'], function ($, args, template) {
    getCourseInfo()
    // 获取课程信息
    function getCourseInfo () {
      var options = {
        url: '/api/course/basic',
        type: 'get',
        // data: {
        //   cs_id: args.cs_id
        // }
        data: args, // {cs_id: 99}
        success: function (data) {
          // 利用模板引擎呈现数据！
          var result = template('tmpl', {item: data.result})
          $('.content').html(result)
          //  注册一级分类的change事件
          $('#top').on('change', function () {
            var cgId = $(this).val()
            var options = {
              url: '/api/category/child',
              type: 'get',
              data: {
                cg_id: cgId
              },
              success: function (data) {
                var str = ''
                data.result.forEach(function (item) {
                  str += '<option value="' + item.cg_id + '">' + item.cg_name + '</option>'
                })
                $('#childs').html(str)
              }
            }
            $.ajax(options)
          })
          validateInit()
        }
      }
      $.ajax(options)
    }

    // 表单验证
    function validateInit () {
      var options = {}
      options.submitHandler = function () {
        var options = {
          url: '/api/course/update/basic',
          type: 'post',
          data: {
            cs_id: args.cs_id
          },
          success: function (data) {
            if (data.code === 200) {
              window.location.href = './step2.html?cs_id=' + data.result.cs_id
            }
          }
        }
        $('form').ajaxSubmit(options)
      }
      options.rules = {
        cs_name: {
          required: true,
          rangelength: [2, 10]
        },
        cs_tags: {
          required: true,
          rangelength: [2, 50]
        }
      }
      options.messages = {
        cs_name: {
          required: '亲，不要为空！',
          rangelength: '长度不对'
        },
        cs_tags: {
          required: '亲，不能为空',
          rangelength: '2，50'
        }
      }
      $('form').validate(options)
    }
  })
})


//  form 提交事件 submit
//  点击form中的button按钮就会触发这个submit事件
// 由于validate插件是监听的form的submit
// 这个插件验证通过 就会调用submitHandler方法
