import qrcodeImg from '@/assets/login/img/qrcode.png';
import phoneImg from '@/assets/login/img/phone.png';
import {
  aesEncrypt,
  aesDecrypt
} from '@/plugins/encrypt.js';
export default {
  data () {
    return {
      accForm: {
        account_name: '',
        account_pass: ''
      },
      rules: {
        account_name: [
          { required: true, message: '请输入用户名或手机号', trigger: 'blur' }
        ],
        account_pass: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      captcha: '',
      isSubmitLoading: false,
      changeBoxData: {
        title: '切换账户登录',
        img: phoneImg
      },
      changeType: 'qrcode',
      useLoginPass:false
    }
  },
  mounted () {
    // 清空ssetionStorage
    sessionStorage.clear()
    this.configCaptcha(false)
    this.getQrcodeData();
  },
  methods: {
    getQrcodeData() {
      let _this = this;
      _this
        .$axios({
          url: _this.$api.state.Login.qy_login_config.url,
          method: 'post',
          responseType: 'json',
        })
        .then(res => {
          if (res.Code === 200) {
            let aesDecryptData = aesDecrypt(res.Data);
            if(aesDecryptData.qyConfig.use_password_login == 1){
              this.useLoginPass= true;
            }else{
              this.useLoginPass = false;
            }
            let data = {
              id: "codeImg",
              appid: aesDecryptData.qyConfig.appid,
              agentid: aesDecryptData.qyConfig.agentid,
              redirect_uri: encodeURIComponent(`${window.location.origin}${window.location.pathname}#/Init`),
              // redirect_uri: encodeURIComponent(
              //   `http://vpn.ygddzy.cn:16041/cultural/#/init`
              // ),
              state: aesDecryptData.state,
            };
            window.WwLogin(data);
          } else {
            let msg = res.Message ? res.Message : "获取基础信息失败！";
            _this.$message({
              message: msg,
              type: 'success'
            })
          }
        })
    },
    changeBox() {
      if (this.changeType == 'phone') {
        this.changeType = 'qrcode';
        this.changeBoxData.title = '切换账户登录';
        this.changeBoxData.img = phoneImg;
        this.getQrcodeData();
      } else {
        this.changeType = 'phone';
        this.changeBoxData.title = '切换扫码登录';
        this.changeBoxData.img = qrcodeImg;
      }
    },
    // 配置腾讯防水墙(flag 是否显示滑块)
    configCaptcha (flag) {
      this.$nextTick(() => {
        this.captcha = new window.TencentCaptcha(
          this.$common.state.captcha_appid,
          this.loginSystem
        )
        if (flag) {
          // 显示007腾讯防水墙
          this.captcha.show()
        }
      })
    },

    /* 表单验证并显示007腾讯防水墙 */
    openCaptcha () {
      this.$refs.accForm.validate(valid => {
        if (valid === false) {
          // 验证不通过
          return false
        }
        if (this.captcha) {
          // 显示007腾讯防水墙
          this.captcha.show()
        } else {
          this.configCaptcha(true)
        }
      })
    },

    /* 进行授权登录 */
    loginSystem (res) {
      let _this = this
      if (res.ret === 0) {
        _this.isSubmitLoading = true

        // 插入账户信息
        res.account_name = _this.accForm.account_name
        res.account_pass = _this.accForm.account_pass

        // 获取数据
        _this
          .$axios({
            url: _this.$api.state.Login.account.url,
            method: 'post',
            responseType: 'json',
            data: res
          })
          .then(res => {
            if (res.Code === 200) {
              _this.$message({
                message: res.Message,
                type: 'success'
              })

              setTimeout(() => {
                _this.$router.push({
                  path: '/Main'
                })
              }, 1500)
            } else {
              _this.isSubmitLoading = false
              _this.$message({
                message: res.Message,
                type: 'error'
              })
            }
          })
          .catch(() => {
            _this.isSubmitLoading = false
            _this.$message({
              message: '服务器连接失败',
              type: 'error'
            })
          })
      } else {
        _this.$message({
          message: '请完成滑块验证',
          type: 'warning'
        })
      }
    },

    /** 输入框 enter */
    keyDown (e) {
      if (e.keyCode === 13) {
        this.openCaptcha()
      }
    }
  }
}
