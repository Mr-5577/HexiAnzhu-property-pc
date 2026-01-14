// 引入七牛云上传文件
const qiniu = require('qiniu-js')

function upload(params, qiniuDatas) {
  let file = params.file
  let token = qiniuDatas.uptoken
  let domain = qiniuDatas.domain
  let bucket = 'sunest'
  let date = new Date()
  let nowDay = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate()
  let filename = file.name
  let index = filename.lastIndexOf('.')
  let suffix = filename.substr(index)
  let random = Math.floor(Math.random() * (1 - 1000) + 1000) //1-1000随机数
  let randoms = Math.floor(Math.random() * (1 - 100) + 100) //1-100随机数
  let key = `${bucket}-${nowDay}-${new Date().getTime()}${random}-${randoms}${suffix}`
  let fileInfo = {
    filename: filename,
    qiniu_key: key,
    size: file.size,
    ext: file.type.split('/')[1]
  }
  let config = {
    useCdnDomain: true, // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
    region: null // 上传域名区域（z1为华北）,当为 null 或 undefined 时，自动分析上传域名区域
  }
  let putExtra = {
    fname: filename, // 文件原文件名
    params: {}, // 放置自定义变量： 'x:name': 'sex'
    mimeType: null // 限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
  }
  let observable = qiniu.upload(file, key, token, putExtra, config)
  let uploadInfo = {
    fileInfo: fileInfo,
    observable: observable
  }
  return uploadInfo
}

export default upload
