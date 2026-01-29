/**
 * 获取当前日期时间
 * @param {string} tag - 分隔符，如 '-' 或 '/'
 * @param {string} min - 时间粒度: 'y'年 | 'm'月 | 'd'日 | 'h'时 | 'i'分 | 's'秒
 * @returns {string} 格式化后的时间字符串
 */
export function formatDate(tag = '-', min = 'd') {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')

  const formats = {
    y: () => year.toString(),
    m: () => `${year}${tag}${month}`,
    d: () => `${year}${tag}${month}${tag}${day}`,
    h: () => `${year}${tag}${month}${tag}${day} ${hour}`,
    i: () => `${year}${tag}${month}${tag}${day} ${hour}:${minute}`,
    s: () => `${year}${tag}${month}${tag}${day} ${hour}:${minute}:${second}`,
  }

  return formats[min]?.() || formats.d()
}
