// 基准大小，设置20px为基准，便于自己写代码时计算rem的值
const baseSize = 16;
// 设置 rem 函数
function setRem () {
  let w = document.documentElement.clientWidth;
  // 当前页面宽度相对于 960 宽的缩放比例，可根据自己需要修改。
  // const scale = w / 1920;
  // 设置页面根节点字体大小
  // document.documentElement.style.fontSize =
  //   baseSize * Math.min(scale, 2) + "px";
  if (w >= 1400) {
    document.documentElement.style.fontSize = "20px";
  } else {
    document.documentElement.style.fontSize = "16px";
  }
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem();
};
