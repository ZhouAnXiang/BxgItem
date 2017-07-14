//  除非common.js中没有使用别名，才可以在config.js前引入
require(['/assets/js/config.js', '/assets/js/common.js'], function () {
  require(['jquery',
    '/assets/js/getarg.js',
    'webuploader', 'jcrop'],
    function ($, args, WebUploader) {
      var coords = {} // 保存裁切图片的坐标
      // 上传图片功能
      // * 功能2: 上传头像功能(插件版, 原生js版本)
      uploadAvatarPlugin()
      subCoords()
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
          server: '/api/uploader/cover',
          // 选择文件的按钮。可选。
          // 内部根据当前运行是创建，可能是input元素，也可能是flash.
          pick: '#filePicker',
          formData: {
            cs_id: args.cs_id
          },
          // pick: '#upload',
          fileVal: 'cs_cover_original', // 参数名
          // 只允许选择图片文件。
          accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png'
            // mimeTypes: 'image/*'
          }
        })
        uploader.on('uploadSuccess', function (xx, data) {
          // console.log(arguments)
          $('.preview img').attr('src', data.result.path)
          .on('load', function () {
            // 在图片加载完成后执行裁剪插件
            jcropInit()
          })
        })
      }
      // 裁剪图片
      function jcropInit () {
        var options = {
          boxWidth: 300,  // 设置图片的宽度
          aspectRatio: 1.618, // 长宽的比例 //  长/宽
          onSelect: function (c) {
            // console.log(coords)
            coords = c
          }
        }
        $('.preview img').Jcrop(options, function () {
          // 设置默认选择的区别!
          this.setSelect([0, 20, 100, 400])
        })
      }

      // 点击裁切按钮，把坐标发给服务器
      function subCoords () {
        $('#sub').on('click', function () {
          coords.cs_id = args.cs_id
          var options = {
            url: '/api/course/update/picture',
            type: 'post',
            data: coords,
            // data: {
            //   cs_id: args.cs_id,
            //   x: coords.x,
            //   y: coords.y,
            //   w: coords.w,
            //   h: coords.h
            // }
            success: function (data) {
              if (data.code === 200) {
                window.location.href = './step3.html?cs_id=' + args.cs_id
              }
            }
          }
          $.ajax(options)
          })
      }
    })
})

