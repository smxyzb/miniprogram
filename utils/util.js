const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//日期格式化
const formatDate = function (date, format) {
  if (!date) return
  if (!format) format = 'yyyy-MM-dd'
  switch (typeof date) {
    case 'string':
      date = new Date(date.replace(/-/, '/'))
      break
    case 'number':
      date = new Date(date)
      break
  }
  if (!date instanceof Date) return
  var dict = {
    yyyy: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    MM: ('' + (date.getMonth() + 101)).substr(1),
    dd: ('' + (date.getDate() + 100)).substr(1),
    HH: ('' + (date.getHours() + 100)).substr(1),
    mm: ('' + (date.getMinutes() + 100)).substr(1),
    ss: ('' + (date.getSeconds() + 100)).substr(1)
  }
  var date = format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
    return dict[arguments[0]]
  })
  return date
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const processImg = (url, fixedImg) => {
  if (url.indexOf('http') < 0) {
    url = 'http://img.quguangjie.cn/' + url
  }
  url = url + '?imageMogr2/auto-orient/strip/quality/80/'
  if (fixedImg) {
    url += 'thumbnail/' + fixedImg + 'x'
  }
  return url
}

module.exports = {
  formatTime,
  formatDate,
  processImg
}
