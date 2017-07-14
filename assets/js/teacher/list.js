/**
 * 讲师列表页面
 * 功能1: 获取讲师的信息并展示
 * 功能2: 点击查看，展示讲师详细信息
 */

require(['/assets/js/config.js'], function () {
  // 第一个require函数执行后，就会加载config.js， config.js加载后,别名就配置完成了!
  // 就会执行这里的回调函数
  // 我们在这个函数里又调用了一个require函数,加载其他的js
  require(['jquery', 'template', 'bootstrap', '/assets/js/common.js'], function ($, template) {
    getTeacherList()
    getDetailInfo()
    stopOrStart() // 注销启用

    // 功能1:
    function getTeacherList () {
      var options = {
        url: '/api/teacher',
        // type: 'get'
        success: function (data) {
          if (data.code === 200) {
            // 把数据呈现到页面上去!
            var result = template('tmpl-list', {list: data.result})
            $('#list').html(result)
          } else {
            window.alert('没有得到数据！')
          }
        },
        error: function () {
          window.alert('哈哈，不允许你获取数据!')
        }
      }
      $.ajax(options)
    }

    // 查看
    function getDetailInfo () {
      // #list 是tbody
      $('#list').on('click', '.preview', function () {
        // $('模态框').modal() // 弹出模态框
        $('#teacherModal').modal()
        // 要发请求获取讲师的详细信息
        var tcId = $(this).closest('tr').attr('tc-id')
        var options = {
          url: '/api/teacher/view',
          type: 'get',
          data: {
            // 这里的tc_id取决于我点击的是哪个条数据!
            tc_id: tcId
          },
          success: function (data) {
            if (data.code === 200) {
              // data.result
              // es6f 模板字符串 用反引号`` ${}
              var obj = data.result
              var result = `
              <tr>
                      <th>姓名:</th>
                                <td>${obj.tc_name}</td>
                                <th>职位:</th>
                                <td colspan="3">讲师</td>
                                <td rowspan="4" width="128">
                                    <div class="avatar">
                                        <img src="${obj.tc_avatar}" alt="">
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>花名:</th>
                                <td>${obj.tc_roster}</td>
                                <th>年龄:</th>
                                <td colspan="3">${getAge(obj.tc_birthday)}</td>
                            </tr>
                            <tr>
                                <th>性别:</th>
                                <td>${obj.tc_gender === '0' ? '男' : '女'}</td>
                                <th>入职日期日期:</th>
                                <td colspan="3">${obj.tc_join_date}</td>
                            </tr>
                            <tr>
                                <th>手机号码:</th>
                                <td colspan="2">${obj.tc_cellphone}</td>
                                <th>邮箱:</th>
                                <td colspan="2">${obj.tc_email}</td>
                            </tr>
                            <tr>
                                <th>籍贯:</th>
                                <td colspan="6">${obj.tc_hometown}</td>
                            </tr>
                            <tr>
                                <td colspan="7">
                                    <div class="introduce">
                                    ${obj.tc_introduce}
                                    </div>
                                </td>
                  </tr>
              `
              $('#modal-list').html(result)
            }
          },
          error: function () {
            console.log('出错了')
          }
        }
        $.ajax(options)
        console.log(tcId)
      })
    }

    // 注销或者启用
    function stopOrStart () {
      $('#list').on('click', '.start-stop', function () {
        var $this = $(this)
        var $tr = $this.closest('tr')
        var tcId = $tr.attr('tc-id') // 讲师id : 29
        var tcStatus = $tr.attr('tc-status') // 状态: 0
        var options = {
          url: '/api/teacher/handle',
          type: 'post',
          data: {
            tc_id: tcId,
            tc_status: tcStatus
          },
          success: function (data) {
            if (data.code === 200) {
              // 0 是启用状态， 1 是注销状态
              // 请求成功之后，要把原来是注销改为启用
              // 原来是启用，改为注销
              // data.result.tc_status 就是后端修改后讲师的状态，根据这个状态来显示是什么字
              var str = data.result.tc_status === 0 ? '注销' : '启用'
              // 把新的讲师状态，保存到tr中,因为下次点击a标签时需要使用它
              $tr.attr('tc-status', data.result.tc_status)
              $this.text(str)
            }
          }
        }
        $.ajax(options)
      })
    }

    // 传入出生日期，返回年龄
    function getAge (birth) {
      var birthYear = new Date(birth).getFullYear() // 根据参数生成对应的时间
      var nowYear = new Date().getFullYear()
      return nowYear - birthYear
    }
    // 让所有的artemplate模板中可以使用getTecAge这个方法
    // template.defaults.imports是固定的
    // 过滤器，给模板中提供方法。
    template.defaults.imports.getTecAge = getAge
    // tmeplate.helper
  })
})
