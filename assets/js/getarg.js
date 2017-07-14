/**
 * 获取地址栏中的参数，并把它转换为对象
 */
define(function () {
  // ?name=1&age=2
  var search = window.location.search

  // name=1&age=2
  var query = search.split('?')[1] || ''

  // ['name=1', 'age=2']  =>  {name:1, age:2}
  var arr = query.split('&') || ''
  var obj = {}
  arr.forEach(function (item) {
    // name=1
    var key = item.split('=')[0] // name
    var value = item.split('=')[1] // 1
    obj[key] = value
  })
  return obj
})
