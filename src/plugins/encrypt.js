import cryptoJs from 'crypto-js'
const publicKey = 'hH8bFiqd5s1hWmQfJxO0VPyPmbGIfjsy'
/**
 * aes加密方法
 * @param data
 * @returns {string}
 */
export function aesEncrypt(data) {
  let pcj = {
    pub_key: publicKey,
    iv: ''
  }
  pcj.pub_key = cryptoJs.enc.Utf8.parse(pcj.pub_key)
  pcj.iv = (cryptoJs.SHA1(pcj.pub_key).toString()).substr(18, 16)
  pcj.iv = cryptoJs.enc.Utf8.parse(pcj.iv)
  let srcs = cryptoJs.enc.Utf8.parse(JSON.stringify(data));
  let encrypted = cryptoJs.AES.encrypt(srcs, pcj.pub_key, {
    iv: pcj.iv,
    mode: cryptoJs.mode.CBC,
    padding: cryptoJs.pad.Pkcs7
  })
  let encrypt_datas = cryptoJs.enc.Base64.stringify(encrypted.ciphertext)
  return encrypt_datas
}


/**
 * aes解密方法
 * @param data
 * @returns {Object}
 */
export function aesDecrypt(data) {
  let pcj = {
    pub_key: publicKey,
    iv: ''
  }
  pcj.pub_key = cryptoJs.enc.Utf8.parse(pcj.pub_key)
  pcj.iv = (cryptoJs.SHA1(pcj.pub_key).toString()).substr(18, 16)
  pcj.iv = cryptoJs.enc.Utf8.parse(pcj.iv)
  // 执行解密操作
  let base64 = cryptoJs.enc.Base64.parse(data)
  let src = cryptoJs.enc.Base64.stringify(base64)
  let decrypt = cryptoJs.AES.decrypt(src, pcj.pub_key, {
    iv: pcj.iv,
    mode: cryptoJs.mode.CBC,
    padding: cryptoJs.pad.Pkcs7
  })
  //获取解密后的信息
  let datas = decrypt.toString(cryptoJs.enc.Utf8)
  if (datas == '') {} else {
    return JSON.parse(datas)
  }
}

