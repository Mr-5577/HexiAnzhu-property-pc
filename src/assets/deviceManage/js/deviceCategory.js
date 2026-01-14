
export default {
  name: 'onlineDetail',
  data () {
    return {
      urlObj: {
        uploadToken: this.$api.state.Public.uploadToken.url,
        villageapplication: this.$api.state.Application.villageapplication.url,
        editvillageapp: this.$api.state.Application.editvillageapp.url
      },
    }
  },

  /**
   * 生命周期
   */
  mounted () {

  },

  /**
   * 方法
   */
  methods: {

  }
}
