require(['/assets/js/config.js'], function () {
  require([
    'jquery',
    '/assets/js/getarg.js',
    'validate',
    'form',
    'datepicker',
    '/assets/js/common.js'], function ($, obj) {
    console.log(obj)
    var options = {
      url: '/api/teacher/edit',
      txx: 'get',
      data: {
        tc_id: obj.tc_id
      },
      success: function (data) {
        if (data.code === 200) {
          console.log(data)
          // 如果用模板引擎呈现数据
          // 如果使用表单验证插件里面操作了dom,如何使用了模板引擎，对应的dom可以会被替换
          // 所以最好在模板引擎把数据呈现之后，再操作dom!**
          // document.querySelector('')
          var $tcName = $('input[name="tc_name"]')
          var $tcJoinDate = $('input[name="tc_join_date"]')
          var $tcType = $('select[name="tc_type"]')
          var $tcGender = $('input[name="tc_gender"]')
          var obj = data.result
          $tcName.val(obj.tc_name)
          $tcJoinDate.val(obj.tc_join_date)
          // $tcType.val(obj.tc_type)
          // $tcType.val(1)
          var num = obj.tc_type === 0 ? 1 : 0
          $($tcType.find('option')[num]).attr('selected', true)

          // $tcGender.val(obj.tc_gender)
          var num = obj.tc_gender === 0 ? 1 : 0
          $($tcGender[num]).attr('checked', true)
        }
      }
    }
    $.ajax(options)

    // 进行表单验证
    $('form').validate({
      submitHandler: function () {
        $('form').ajaxSubmit({
          url: '/api/teacher/update',
          type: 'post',
          data: {
            // 这个tc_id 会被追加到表单中与其他参数一同发给后端
            tc_id: obj.tc_id
          },
          success: function (data) {
            if (data.code === 200) {
              window.alert(data.msg)
            }
          },
          error: function () {}

        })
      },
      // 规则
      rules: {
        // 规则里是通过name属性值来区分的
        // 属性值是对象，就是对这个input标签值的限制条件
        tc_name: {
          required: true,
          rangelength: [2, 20]
        },
        tc_join_date: {
          required: true,
          date: true // 192/12/22
        }
      },
      // 规则对应的提示信息
      messages: {
        // 规则里是通过name属性值来区分的
        // 属性值是对象，就是对这个input标签值的提示信息
        tc_name: {
          required: '不能为空',
          rangelength: '长度不正确!'
        },
        tc_join_date: {
          required: '日期不能为空',
          date: '格式不对' // 192/12/22
        }
      }
    })

    // 日期插件
    $('input[name="tc_join_date"]').datepicker({
      format: 'yyyy/mm/dd'
    })
  })
})


// a.js  $
// b.js:  $.xx = function ()
