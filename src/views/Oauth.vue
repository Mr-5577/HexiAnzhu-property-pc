<template>
  <div id="init" v-loading="loading" element-loading-text="页面加载中..."  element-loading-background="rgba(173 ,216, 230, 0.8)"></div>
</template>
<script>
  import {
    isMobile,
    isWeiXin,
    getQueryString
  } from "@/plugins/tools.js";
  import wx from "weixin-js-sdk";
import {
  aesEncrypt,
  aesDecrypt
} from '@/plugins/encrypt.js'
  export default {
    data() {
      return {
        loading: true
      }
    },
    mounted() {
      this.goTo()
    },
    methods: {
      closeWin(times = 2000) {
        setTimeout(() => {
          window.opener = null;
          window.open("", "_self");
          window.location.href = "about:blank";
          window.close();

          document.addEventListener(
            "WeixinJSBridgeReady",
            function() {
              window.WeixinJSBridge.call("closeWindow");
            },
            false
          );
          window.WeixinJSBridge.call("closeWindow");
        }, times);
      },
      goTo() {
        let _this = this;
        if (isWeiXin()) {
          if (isMobile()) {
            _this.$message({
              message: "请通过PC端企业微信内置浏览器打开",
              type: 'error'
            })
            _this.closeWin();
          } else {
            const params = {
              auth_path:this.$route.fullPath,
            };

            _this
              .$axios({
                url: _this.$api.state.Login.qywx_jssdk.url,
                method: 'post',
                responseType: 'json',
                data: params
              })
              .then(res => {
                if (res.Code === 200) {
                  let aesDecryptData = aesDecrypt(res.Data)
                  wx.config({
                    beta: true,
                    debug: false,
                    appId: aesDecryptData.appId,
                    timestamp: aesDecryptData.timestamp,
                    nonceStr: aesDecryptData.nonceStr,
                    signature: aesDecryptData.signature,
                    jsApiList: ["openDefaultBrowser"],
                  });
                  wx.ready(function() {
                    wx.invoke(
                      "openDefaultBrowser", {
                        url: aesDecryptData.auth_url,
                      },
                      function(res) {
                        if (res.err_msg == "openDefaultBrowser:ok") {
                          _this.$message({
                            message: "打开默认浏览器成功，即将进行授权登录",
                            type: 'success'
                          })
                        } else {
                          _this.$message({
                            message: "打开默认浏览器失败，请退出后重试",
                            type: 'error'
                          })
                        }

                        _this.closeWin();
                      }
                    );
                  });
                } else {
                  let msg = res.Message ? res.Message : "一键登录失败，请重试！！";
                  _this.$message({
                    message: msg,
                    type: 'error'
                  })
                  _this.closeWin();
                }
              })

          }
        } else {
          const code = this.$route.query.code ? this.$route.query.code : getQueryString("code");
          const state = this.$route.query.state ? this.$route.query.state : getQueryString("state");
          if (!code) {
            _this.$message({
              message: "登录错误！",
              type: 'error'
            })
            this.$router.push("/SignIn");
          } else {
            window.location.href =
              `${window.location.origin}${window.location.pathname}#/init?code=${code}&state=${state}`;
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #init {
    width: 100vw;
    min-height: calc(100vh - 60px);
    display: flex;

    .right-wp {
      flex: 1;
      width: calc(100vw - 150px);
      background-color: var(--theme-bg-color);
    }

    .right-wp.expand {
      width: calc(100vw - 250px);
    }
  }
</style>
