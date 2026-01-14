import { Chart } from '@antv/g2'

export default {
  name: 'home',
  data () {
    return {
      // 是否正在加载图表数据
      isLoading1: false,
      isLoading2: false,
      isLoading3: false,
      isLoading4: false,
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    this.getHomeData(1)
    this.getHomeData(2)
    this.getHomeData(3)
    this.getHomeData(4)
  },

  /**
   * 方法
   */
  methods: {
    // 获取首页数据
    getHomeData (type) {
      switch (type) {
        case 1:
          this.isLoading1 = true
          break;
        case 2:
          this.isLoading2 = true
          break;
        case 3:
          this.isLoading3 = true
          break;
        case 4:
          this.isLoading4 = true
          break;
      }
      this.$axios.post(this.$api.state.Main.home.url, { type }).then(res => {
        if (res.Code === 200) {
          const data = []
          switch (type) {
            // 实收收缴率统计
            case 1:
              res.Data.net_receipts_collectionrate.forEach(item => {
                let obj = {
                  type: item.villagename,
                  value: item.proportion
                }
                data.push(obj)
              })
              this.captureInit('captureCont', data)
              this.isLoading1 = false
              break;
            // 欠费收缴率统计
            case 2:
              res.Data.net_receipts_clearing_debts.forEach(item => {
                let obj = {
                  type: item.villagename,
                  value: item.proportion
                }
                data.push(obj)
              })
              this.captureInit('captureCont2', data)
              this.isLoading2 = false
              break;
            // 应收统计
            case 3:
              res.Data.receivable_classify.forEach(item => {
                let obj1 = { village: item.villagename, type: '物管费', value: item.wg_proportion }
                let obj2 = { village: item.villagename, type: '其它费用', value: item.not_wg_proportion }
                data.push(obj1)
                data.push(obj2)
              })
              this.barInit('barCont', data)
              this.isLoading3 = false
              break;
            // 欠费统计
            case 4:
              res.Data.arrears_classify.forEach(item => {
                let obj1 = { village: item.villagename, type: '物管费', value: item.wg_proportion }
                let obj2 = { village: item.villagename, type: '其它费用', value: item.not_wg_proportion }
                data.push(obj1)
                data.push(obj2)
              })
              this.barInit('barCont2', data)
              this.isLoading4 = false
              break;
          }
        } else {
          let msg = ''
          if (res.Message) {
            msg = res.Message
          } else {
            switch (type) {
              case 1:
                msg = '实收收缴率数据获取失败！'
                this.isLoading1 = false
                break;
              case 2:
                msg = '欠费收缴率数据获取失败！'
                this.isLoading2 = false
                break;
              case 3:
                msg = '应收统计数据获取失败！'
                this.isLoading3 = false
                break;
              case 4:
                msg = '欠费统计数据获取失败！'
                this.isLoading4 = false
                break;
            }
          }
          this.$message({
            type: 'error',
            message: msg
          })
        }
      }).catch(() => {
        switch (type) {
          case 1:
            this.isLoading1 = false
            break;
          case 2:
            this.isLoading2 = false
            break;
          case 3:
            this.isLoading3 = false
            break;
          case 4:
            this.isLoading4 = false
            break;
        }
      })
    },

    // 实收/欠费 收缴率图表初始化
    captureInit (el, data) {
      const chart = new Chart({
        container: el,
        autoFit: true,
        height: 500,
        padding: [50, 20, 50, 20],
      });
      chart.data(data);

      chart.axis('type', {
        tickLine: {
          alignTick: false,
        },
      });
      chart.axis('value', false);

      chart.legend({
        position: 'top'
      })

      chart.tooltip({
        showMarkers: false,
      });
      chart.interval().position('type*value').color('type', () => {
        return '#1890ff'
      })
      chart.interaction('element-active');

      // 添加文本标注
      data.forEach((item) => {
        chart
          .annotation()
          .text({
            position: [item.type, item.value],
            content: item.value + '%',
            style: {
              textAlign: 'center',
            },
            offsetY: -12,
          });
      });
      chart.render();
    },

    // 柱状图初始化
    barInit (el, data) {
      const chart = new Chart({
        container: el,
        autoFit: true,
        height: 500
      })
      chart.data(data)
      chart.scale('value', {
        alias: '占比（%）'
      })
      chart.axis('village', {
        tickLine: null,
        line: null
      })
      chart.axis('value', {
        label: null,
        title: {
          style: {
            fontSize: 14,
            fontWeight: 300
          }
        },
        grid: null
      })
      chart.legend({
        position: 'top'
      })
      chart.coordinate('rect').transpose()
      chart.tooltip({
        shared: true,
        showMarkers: false
      })
      chart.interaction('active-region')
      chart
        .interval()
        .adjust('stack')
        .position('village*value')
        .color('type*village', (type) => {
          if (type === '物管费') {
            return '#1890ff'
          }
          if (type === '其它费用') {
            return '#f2f2f2'
          }
        })
        .size(26)
        .label('value*type', (val, t) => {
          const color = t === '物管费' ? 'white' : '#47494b'
          if (val < 0.05) {
            return null
          }
          return {
            position: 'middle',
            offset: 0,
            style: {
              fontSize: 12,
              fill: color,
              lineWidth: 0,
              stroke: null,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            }
          }
        })
      chart.render()
    },
  }
}
