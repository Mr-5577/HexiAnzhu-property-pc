<template>
  <div id="init" v-loading="loading" element-loading-text="登录中..."  element-loading-background="rgba(173 ,216, 230, 0.8)"></div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true
      }
    },
    mounted() {
      if (!this.$route.query.code || !this.$route.query.state) {
        this.$router.push("/SignIn");
      } else {
        this.getUserInfoByqy();
      }
    },
    methods: {
      getUserInfoByqy() {
        let _this = this;
        const params = {
          code: this.$route.query.code,
          state: this.$route.query.state
        };
        _this.$axios({
          url: _this.$api.state.Login.login_qy.url,
          method: 'post',
          responseType: 'json',
          data: params
        }).then(res => {
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
            let msg = res.Message ? res.Message : "获取用户信息失败！";
            _this.$message({
              message: msg,
              type: 'success'
            })
            this.$router.push("/SignIn");
          }
        })
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
      // background-color: var(--theme-bg-color);
    }

    .right-wp.expand {
      width: calc(100vw - 250px);
    }
  }
</style>
