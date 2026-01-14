<script>
export default {
  formatMoneys(
    places,
    symbol = '￥',
    thousand = ',',
    decimal = '.',
    issetMoney = true
  ) {
    /* 货币格式转换 */

    places = !isNaN((places = Math.abs(places))) ? places : ''

    if (places) {
      var number = places
      var negative = number < 0 ? '-' : ''
      var i = parseInt((number = Math.abs(+number || 0).toFixed(2)), 10) + ''
      var j = (j = i.length) > 3 ? j % 3 : 0
      return (
        symbol +
        negative +
        (j ? i.substr(0, j) + thousand : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
        (places
          ? decimal +
            Math.abs(number - i)
              .toFixed(2)
              .slice(2)
          : '.00')
      )
    } else {
      if (issetMoney === true) return symbol + '0.00'
      else return ''
    }
  },
  btnRoleAuth(role, roles) {
    /* 判断按钮是否拥有权限 */
    return roles.indexOf(role) > -1 ? true : false
  }
}
</script>
