/**
 * 个人资料页面:
 * 功能1: 获取个人资料并展示
 * 功能2: 上传头像功能(插件版, 原生js版本)
 * 功能3: 省市联动功能
 * 功能4: 日期插件初始化
 * 功能5: 表单验证插件初始化
 */
require(['/assets/js/config.js'], function () {
  require(['jquery',
    'template',
    'webuploader',
    'form',
    'validate',
    'datepicker',
    '/assets/js/common.js'], function ($, template, WebUploader) {
    getUserInfo()

    // * 功能1: 获取个人资料并展示
    function getUserInfo () {
      var options = {
        url: '/api/teacher/profile',
        type: 'get',
        success: function (data) {
          if (data.code === 200) {
            var result = template('tmpl', {item: data.result})
            $('.settings').html(result)

            uploadAvatarPlugin() // 初始化上传头像功能!
            pcd() // 三级联动
            validateInit() // 验证插件初始化
            datepickerInit() // 日期插件初始化
          }
        }
      }
      $.ajax(options)
    }
    // * 功能2: 上传头像功能(插件版, 原生js版本)
    function uploadAvatarPlugin () {
      window.alert('111')
      var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,
        // swf文件路径
        // swf: BASE_URL + '/js/Uploader.swf',
        swf: '/node_modules/webuploader/dist/Uploader.swf',
        // 文件接收服务端。
        // server: 'http://webuploader.duapp.com/server/fileupload.php',
        // server: 'http://api.botue.com/uploader/avatar',
        server: '/api/uploader/avatar',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        // pick: '#upload',
        fileVal: 'tc_avatar', // 参数名
        // 只允许选择图片文件。
        accept: {
          title: 'Images',
          extensions: 'gif,jpg,jpeg,bmp,png'
          // mimeTypes: 'image/*'
        }
      })
      uploader.on('uploadSuccess', function (xx, data) {
        console.log(arguments)
        $('.preview img').attr('src', data.result.path)
      })
    }
    function uploadAvatarNative () {}
    // * 功能3: 省市联动功能
    function pcd () {
      var pcd = {}
      var options = {
        url: '/assets/region.json',
        type: 'post',
        success: function (data) {
          pcd = data
          setOptions('000000', $Province, 'p')
        }
      }
      $.ajax(options)
      var $Province = $('[name="tc_province"]')
      var $City = $('[name="tc_city"]')
      var $District = $('[name="tc_district"]')

      // 让指定的数据添加到指定的select中
      // code 编号
      // oSelect 将数据添加到哪个select中
      // type 从pcd对象的哪个属性中获取数据
      function setOptions (code, $Select, type) {
        var options = pcd[type][code]
        var str = ''
        for (var key in options) {
          // console.log(options[key])
          str += `<option value="${key}">${options[key]}</option>`
        }
        $Select.html(str)
        // typeof oSelect.onchange === 'function' && oSelect.onchange()
        $Select.trigger('change')
      }
      $Province.on('change', function () {
        setOptions(this.value, $City, 'c')
      })
      $City.on('change', function () {
        setOptions(this.value, $District, 'd')
      })
    }
    // * 功能4: 日期插件初始化
    function datepickerInit () {
      $('[name="tc_birthday"],[name="tc_join_date"]').datepicker({
        format: 'yyyy/mm/dd'
      })
    }
    // * 功能5: 表单验证插件初始化
    function validateInit () {
      // validate插件监听的是form的submit不是某个按钮的点击事件
      $('form').validate({
        submitHandler: function () {
          var options = {
            url: '/api/teacher/modify',
            type: 'post',
            data: {
              tc_id: 872
            },
            success: function (data) {
              if (data.code === 200) {
                window.alert('修改成功')
              }
            }
          }
          $('form').ajaxSubmit(options)
        },
        rules: {
          tc_roster: {
            required: true
          }
        },
        messages: {
          tc_roster: {
            required: '不能为空'
          }
        }
      })
    }
  })
})
