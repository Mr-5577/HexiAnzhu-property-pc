/**
 *  处理多次点击
 * @param {function} methods 方法
 * @param {Object} data 参数
 * @param {Boolean} noClick  是使用页面定义 的是否还可以点击  默认为true
 * 3 秒内不可以重复点击
 */
export function noMultipleClicks(methods, data) {
  let that = this;
  if (that.noClick) {
    that.noClick = false;
    methods(data);
    setTimeout(function() {
      that.noClick = true;
    }, 3000)
  } else {
    this.$message({
      type: 'warning',
      message: '请勿重复点击！'
    })
  }
}

/**节流处理 */

export function throttle(func, wait = 1000) {
  var timeout;
  return function() {
    that = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(function() {
        timeout = null; //在setTimeout里面，也即是到达时间后执行
        func.apply(that, args)
      }, wait)
    }
  }
}
export function toStrings(arrayData) {
  let str = '';
  for (let i = 0; i < arrayData.length; i++) {
    //最后一条数据
    let lastLength = arrayData.length - 1;
    //如果不是最后一条数据加上&
    if (i !== lastLength) {
      str += arrayData[i] + ','
    } else {
      str += arrayData[lastLength]
    }
  }
  return str;
}

/**
 * @description: 判断是否是手机
 */
export function isMobile() {
	// 判断是否为移动端
	let flag = navigator.userAgent.match(
		/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
	);
	return flag;
}
export function isWeiXin() {
	// 判断是否为微信
	let ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
}
export function getQueryString(name) {
	//企业微信授权获取code问题解决办法
	const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	const result = window.location.search.substring(1).match(reg);
	if (result != null) {
		return decodeURIComponent(result[2]);
	}
	return null;
}
