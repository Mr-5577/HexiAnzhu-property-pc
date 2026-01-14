<template>
  <div id="EstContainer">
    <el-container :style="'height:' + baseDatas.bodyHeight">
      <el-aside width="12.5rem" v-if="baseDatas.isOpenMenuList">
        <div class="logo-word">
          <img src="http://z.hexianzhu.com/source/logo/logo-title.png" alt="logo" />
        </div>
        <div class="menu-person" onselectstart="return false;">
          <div class="menu-person-body">
            <div class="menu-person-info" @click.stop="baseDatas.isUpPersonMenu = !baseDatas.isUpPersonMenu">
              <span>{{ baseDatas.realname }}</span>
              <span>{{ baseDatas.posname }}</span>
              <i class="fa fa-caret-up" v-if="baseDatas.isUpPersonMenu"></i>
              <i class="fa fa-caret-down" v-else></i>
            </div>
            <ul class="menu-person-more" v-if="baseDatas.isUpPersonMenu">
              <li @click="passwordEdit">修改密码</li>
              <li @click="sysSignOut">安全退出</li>
            </ul>
          </div>
        </div>
        <el-scrollbar style="height: calc(100% - 8.18rem);">
          <ul class="menu-ul">
            <li :class="[
                'menu-li',
                $route.path == v.routePath ||
                (v.routePath && $route.path.startsWith(v.routePath))
                  ? 'menu-li-active'
                  : '',
                menuList[i + 1]
                  ? $route.path == menuList[i + 1].routePath ||
                    (menuList[i + 1].routePath &&
                      $route.path.startsWith(menuList[i + 1].routePath))
                    ? 'menu-li-before'
                    : ''
                  : '',
                menuList[i - 1]
                  ? $route.path == menuList[i - 1].routePath ||
                    (menuList[i - 1].routePath &&
                      $route.path.startsWith(menuList[i - 1].routePath))
                    ? 'menu-li-after'
                    : ''
                  : ''
              ]" v-for="(v, i) in menuList" :key="i">
              <div class="menu-list">
                <div class="menu-list-content" @click="routerHref(i)" v-if="v.routePath">
                  <workIcon :name="v.icon" :active="$route.path.startsWith(v.routePath)"></workIcon>
                  <span>{{ v.name }}</span>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </el-aside>
      <el-aside width="6rem" v-else>
        <div class="logo-word-small">
          <img src="http://z.hexianzhu.com/source/logo/logo-title.png" alt="logo" />
        </div>
        <div class="menu-person-small" onselectstart="return false;">
          <div class="menu-person-body-small">
            <el-tooltip class="item" effect="dark" :content="baseDatas.posname" placement="right">
              <div class="menu-person-info-small" @click.stop="
                  baseDatas.isUpPersonMenu = !baseDatas.isUpPersonMenu
                ">
                <span>{{ baseDatas.realname }}</span>
                <i class="fa fa-caret-up" v-if="baseDatas.isUpPersonMenu"></i>
                <i class="fa fa-caret-down" v-else></i>
              </div>
            </el-tooltip>
            <ul class="menu-person-more-small" v-if="baseDatas.isUpPersonMenu">
              <li @click="passwordEdit">修改密码</li>
              <li @click="sysSignOut">安全退出</li>
            </ul>
          </div>
        </div>
        <el-scrollbar style="height: calc(100% - 9.5rem)">
          <ul class="menu-ul-small">
            <li :class="[
                'menu-li',
                $route.path == v.routePath ||
                (v.routePath && $route.path.startsWith(v.routePath))
                  ? 'menu-li-active'
                  : '',
                menuList[i + 1]
                  ? $route.path == menuList[i + 1].routePath ||
                    (menuList[i + 1].routePath &&
                      $route.path.startsWith(menuList[i + 1].routePath))
                    ? 'menu-li-before'
                    : ''
                  : '',
                menuList[i - 1]
                  ? $route.path == menuList[i - 1].routePath ||
                    (menuList[i - 1].routePath &&
                      $route.path.startsWith(menuList[i - 1].routePath))
                    ? 'menu-li-after'
                    : ''
                  : ''
              ]" v-for="(v, i) in menuList" :key="i">
              <div class="menu-list">
                <el-tooltip class="item" effect="dark" :content="v.name" placement="right">
                  <div class="menu-list-content" @click="routerHref(i)" v-if="v.routePath">
                    <workIcon :name="v.icon" :active="$route.path.startsWith(v.routePath)"></workIcon>
                  </div>
                </el-tooltip>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </el-aside>
      <el-container :style="'height:' + baseDatas.bodyHeight">
        <el-header height="3.5rem">
          <div class="header-left" @click="baseDatas.isOpenMenuList = !baseDatas.isOpenMenuList">
            <workIcon name="menu-open-close" :active="baseDatas.isOpenMenuList"></workIcon>
          </div>
          <div class="header-right">
            <span>{{ baseDatas.realname }}</span>
            <span>{{ baseDatas.posname }}</span>
            <i class="fa fa-sign-out" title="安全退出" @click="sysSignOut"></i>
          </div>
          <el-badge v-if="choseVillageInfo.vid" :is-dot="hasNewMsg" class="badge">
            <i class="message el-icon-bell" @click="messageCenter"></i>
          </el-badge>

          <div class="village-select">
            <span class="common-chose-info" @click="$refs.showFilterVillage.showDialog()">
              <workIcon name="build"></workIcon>
              {{ choseVillageInfo.name }}
            </span>
          </div>
        </el-header>
        <el-main class="tip" v-if="!choseVillageInfo.vid">
          <div class="tip">
            <img src="@/assets/common/img/error.png" alt="" />
            <div>请选择项目后再试</div>
          </div>
        </el-main>
        <el-main v-else>
          <router-view v-if="menuList.length > 0 && $menu.state.childRoleList.length > 0" />
        </el-main>
        <el-footer height="1.5rem">
          <span class="ricon">备</span>
          <span>{{ $common.state.frame_copyright }}</span>
        </el-footer>
      </el-container>
    </el-container>

    <!-- 选择项目 -->
    <filter-village ref="showFilterVillage" :vid="choseVillageInfo.vid" @choseInfo="filterVillage"></filter-village>
    <!-- 选择项目 -->

    <!-- 修改密码弹框 开始 -->
    <el-dialog class="editDialog" :visible.sync="showEditDialog" title="修改密码" width="25%" :close-on-click-modal="false">
      <el-scrollbar style="height: 100%;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :hide-required-asterisk="true">
          <el-form-item label="旧密码" prop="old">
            <el-input show-password v-model="ruleForm.old" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new">
            <el-input show-password v-model="ruleForm.new" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm">
            <el-input show-password v-model="ruleForm.confirm" placeholder="请确认密码"></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="editSubmit">
          提交保存
        </el-button>
        <el-button :loading="isCommit" type="info" round @click="showEditDialog = false">
          取消
        </el-button>
      </span>
    </el-dialog>
    <!-- 修改密码弹框 结束 -->

    <!-- 消息中心弹框 开始 -->
    <el-dialog class="messageDialog" :visible.sync="showMsgDialog" title="消息中心" width="50%"
      :close-on-click-modal="false">
      <el-scrollbar style="height: calc(100% - 2.1rem);" v-loading="isLoading">
        <div v-if="messageList.length === 0" class="empty">暂无数据！</div>
        <ul class="list" v-else>
          <li v-for="(item, index) in messageList" :key="index">
            <span class="name">{{ item.select_text }}</span>
            <span class="time">{{ item.create_time }}</span>
            <span class="icon" v-if="item.select_error == 1">
              <img src="@/assets/common/img/load-error.png" alt="" />
              <span>查询失败</span>
            </span>
            <span class="icon" v-else-if="item.status == 2">
              <img class="Rotation" src="@/assets/common/img/load.png" alt="" />
              <span>查询中...</span>
            </span>
            <span class="icon" v-else-if="item.status == 0 || item.status == 1">
              <img class="Rotation" src="@/assets/common/img/load-disable.png" alt="" />
              <span>等待中...</span>
            </span>
            <span class="icon" v-else-if="item.status == 3">
              <img src="@/assets/common/img/load-success.png" alt="" />
              <span>已完成</span>
            </span>

            <span class="operate">
              <el-button v-if="item.status != 3" size="mini" :loading="item.isCancel" type="danger" plain round
                @click="queryCancel(item, index)">
                取消
              </el-button>
              <!-- <el-button
                v-if="item.status == 3 && item.res_type == 1"
                size="mini"
                :loading="isCommit"
                type="primary"
                plain
                round
                @click="enterDetail(item.id)"
              >
                详情
              </el-button> -->
              <el-button v-if="item.status == 3 && item.res_type == 2" size="mini" :loading="item.isdownload"
                type="primary" plain round @click="queryDownload(item, index)">
                下载
              </el-button>
              <el-button v-if="item.select_error == 1" size="mini" type="primary" plain round @click="queryAgain(item)">
                重新查询
              </el-button>
            </span>
          </li>
        </ul>
      </el-scrollbar>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage"
        :page-sizes="[20, 50, 100, 300]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"></el-pagination>
    </el-dialog>
    <!-- 消息中心弹框 结束 -->

    <!-- 查询结果弹框 开始 -->
    <el-dialog class="queryDialog" :visible.sync="showQueryDialog" :title="queryTitle" width="80%"
      :close-on-click-modal="false">
      <!-- 报表组件部分 -->
      <Tables v-if="showQueryDialog" :tableId="tableId"></Tables>
    </el-dialog>
    <!-- 查询结果弹框 结束 -->
  </div>
</template>

<script>
  import workIcon from '@/components/common/workIcon.vue'
  import Tables from '@/components/common/Tables.vue'

  // 导入 实收统计 json 文件
  import sreceiptsStatistics from '@/assets/report/json/sreceipts-statistics.json'
  import sreceiptsColumn from '@/assets/report/json/sreceipts-column.json'

  export default {
    name: 'EstContainer',
    components: {
      workIcon,
      Tables
    },
    data() {
      return {
        baseDatas: {
          realname: '',
          posname: '',
          bodyHeight: 960,
          isUpPersonMenu: false,
          isOpenMenuList: true
        },
        menuList: [],
        // 当前选择的项目信息
        choseVillageInfo: {
          name: '全部项目',
          vid: 0
        },
        // 是否展示修改密码弹框
        showEditDialog: false,
        // 表单对象
        ruleForm: {
          old: '',
          new: '',
          confirm: ''
        },
        rules: {
          old: [{
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }],
          new: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }],
          confirm: [{
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.ruleForm.new) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }]
        },
        // 是否正在提交数据
        isCommit: false,
        // 是否显示消息弹框
        showMsgDialog: false,
        // 消息列表
        messageList: [],
        // 当前页码数
        currentPage: 1,
        // 每页条数
        pageSize: 20,
        // 数据总条数
        pageTotal: 0,
        // 是否正在加载消息中心数据
        isLoading: false,
        // 是否显示查询结果弹框
        showQueryDialog: false,
        // 查询结果弹框标题
        queryTitle: '查询结果',
        // 是否显示条件筛选页面
        showFilter: false,
        // 当前筛选条件数据
        filterObj: {
          type: '',
          vids: [999],
          bid: [],
          unit: [],
          rooms_id: '',
          pay_type: '',
          subject_ids: []
        },
        // 表格列表
        tableList: [{
            label: '实收统计',
            name: 'count',
            tableData: [],
            columns: sreceiptsStatistics.list,
            static: true
          },
          {
            label: '实收明细',
            name: 'info',
            tableData: [],
            columns: sreceiptsColumn.list,
            static: true
          },
          {
            label: '科目汇总',
            name: 'subject',
            tableData: [],
            columns: '',
            static: false
          }
        ],
        // 当前详情表格的 id
        tableId: ''
      }
    },

    /**
     * 计算属性
     */
    computed: {
      // 正在查询 id
      queryId() {
        return this.$store.state.queryId
      },
      // 是否有新消息
      hasNewMsg() {
        return this.$store.state.hasNewMsg
      }
    },

    // 监听,当路由发生变化的时候执行
    watch: {
      $route(to, from) {
        if (this.queryId) {
          // 清空查询队列
          this.$axios
            .post(this.$api.state.Report.delselectlist.url, {
              id: this.queryId
            })
            .then(res => {
              // 清除 查询 id
              this.$store.commit('setQueryid', '')
            })
        }
      }
    },

    /**
     * 生命周期
     */
    mounted() {
      // 动态设置页面高度
      this.baseDatas.bodyHeight = document.body.offsetHeight + 'px'

      // 窗口大小改变重新设置高度
      window.onresize = () => {
        this.baseDatas.bodyHeight = document.body.offsetHeight + 'px'
      }

      //获取框架基础信息
      this.getBaseInfo()

      // 添加个人资料展开更多点击事件
      document.addEventListener('click', this.closePersonMenu)
    },

    /**
     * 方法
     */
    methods: {
      // 筛选选择项目
      filterVillage(choseInfo) {
        // 参数赋值
        this.choseVillageInfo.name = choseInfo.name
        this.choseVillageInfo.vid = choseInfo.vid
        // 将当前项目名称和id保存到sessionStorage
        sessionStorage.setItem('vid', choseInfo.vid)
        sessionStorage.setItem('vname', choseInfo.name)
        // 当前大区 id
        sessionStorage.setItem('bid', choseInfo.bg_id)
        // 当前公司 id
        sessionStorage.setItem('cid', choseInfo.city_id)
        this.$store.commit('setVillageId', choseInfo.vid)
        this.$store.commit('setBigAreaId', choseInfo.bg_id)
        // 刷新页面
        location.reload()
      },

      /* 获取框架基础信息 */
      getBaseInfo() {
        let _this = this
        // 开启左侧菜单加载状态
        var menuListLoad = _this.$loading({
          target: '.el-aside',
          lock: true,
          spinner: 'el-icon-loading',
          text: '菜单加载中...'
        })

        // 获取框架基础数据
        _this
          .$axios({
            url: _this.$api.state.Frame.info.url,
            method: 'post',
            responseType: 'json'
          })
          .then(res => {
            if (res.Code === 200) {
              if (res.Data.is_simple_pass && res.Data.is_simple_pass == 1) {
                menuListLoad.close()
                this.passwordEdit()
                return
              }
              if (!sessionStorage.getItem('uuid')) {
                let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                  /[xy]/g,
                  function(c) {
                    var r = (Math.random() * 16) | 0,
                      v = c == 'x' ? r : (r & 0x3) | 0x8
                    return v.toString(16)
                  }
                )
                sessionStorage.setItem('uuid', uuid)
              }

              sessionStorage.setItem('uid', res.Data.uid)
              sessionStorage.setItem('realname', res.Data.realname)
              let socket = null
              // websocket 链接
              if (typeof WebSocket === 'undefined') {
                _this.$message({
                  type: 'error',
                  message: '您的浏览器不支持socket'
                })
              } else {
                // 实例化socket
                socket = new WebSocket(this.$common.state.socketUrl)
              }
              // 链接websocket
              socket.onopen = () => {
                var jsondata = {
                  type: 'bind',
                  uuid: sessionStorage.getItem('uuid')
                }
                var str = JSON.stringify(jsondata)
                socket.send(str)
              }
              // 监听socket错误信息
              socket.onerror = () => {
                _this.$message({
                  type: 'warning',
                  message: 'websocket 连接失败！'
                })
              }

              window.$socket = socket
              window.$socket.onmessage = _this.messageHandle

              this.$common.commit('setCopyright', res.Data.footer_text)
              let vid = sessionStorage.getItem('vid')
              let vname = sessionStorage.getItem('vname')
              if (vid) {
                this.choseVillageInfo.vid = vid
                this.choseVillageInfo.name = vname
                this.$store.commit('setVillageId', vid)
              } else {
                this.$refs.showFilterVillage.showDialog()
              }
              // 登录用户名称
              _this.baseDatas.realname = res.Data.realname

              // 登录用户职位
              _this.baseDatas.posname = res.Data.posname

              // 加载左侧菜单列表
              if (res.Data.menuList.length > 0) {
                _this.$menu.state.list.forEach((v, i) => {
                  if (
                    (!v.name && !v.routePath) ||
                    res.Data.menuList.indexOf(v.token) > -1
                  ) {
                    _this.menuList.push(v)
                  }
                })
              }

              // 关闭左侧菜单加载状态
              menuListLoad.close()
              // 获取当前选中菜单的授权token
              let currRouteToken = ''
              _this.menuList.forEach((v, i) => {
                if (
                  String(v.routePath) === String(_this.$route.path) ||
                  (String(v.routePath) &&
                    String(_this.$route.path).startsWith(String(v.routePath)))
                ) {
                  currRouteToken = v.token
                }
              })
              // 加载子页面权限信息
              _this.loadChildRole(currRouteToken)
            } else if (res.Code === 204) {
              // 登录信息过期
              _this.$message({
                message: res.Message,
                type: 'error'
              })

              // 跳转至登录
              _this.$router.push({
                path: _this.$common.state.loginPath
              })
            } else {
              _this.$message({
                message: res.Message,
                type: 'error'
              })
            }
          })
          .catch(() => {
            _this.$message({
              message: '服务器连接失败',
              type: 'error'
            })

            // 跳转至登录
            _this.$router.push({
              path: _this.$common.state.loginPath
            })
          })
      },

      /* 点击其他区域关闭个人资料下拉框 */
      closePersonMenu(e) {
        let _this = this
        if (_this.baseDatas.isUpPersonMenu == true) {
          _this.baseDatas.isUpPersonMenu = false
        }
      },

      /* 菜单跳转 */
      routerHref(item) {
        if (
          String(this.$route.path) != String(this.menuList[item].routePath) &&
          !String(this.$route.path).startsWith(
            String(this.menuList[item].routePath)
          )
        ) {
          // 执行跳转
          this.$router.push({
            path: this.menuList[item].routePath
          })
          this.loadChildRole(this.menuList[item].token)
        }
      },

      /* 加载子页面权限信息 */
      loadChildRole(currRouteToken) {
        let _this = this
        // 初始化子权限信息
        _this.$menu.commit('setChildRoleList', [])

        // 打开遮罩层
        let childRoleLoading = _this.$loading({
          target: '.el-main',
          lock: true,
          spinner: 'el-icon-loading',
          text: '加载中...'
        })

        if (currRouteToken) {
          // 请求数据接口
          _this
            .$axios({
              url: _this.$api.state.Frame.role.url,
              method: 'post',
              responseType: 'json',
              data: {
                token: currRouteToken
              }
            })
            .then(res => {
              if (res.Code === 200) {
                // 存放子页面权限信息
                _this.$menu.commit('setChildRoleList', res.Data)
              } else if (res.Code === 204) {
                // 登录信息过期
                _this.$message({
                  message: res.Message,
                  type: 'error'
                })
                // 跳转至登录
                _this.$router.push({
                  path: _this.$common.state.loginPath
                })
              } else {
                _this.$message({
                  message: res.Message,
                  type: 'error'
                })
              }
              // 关闭遮罩层
              childRoleLoading.close()
            })
            .catch(() => {
              _this.$message({
                message: '服务器连接失败',
                type: 'error'
              })
              // 关闭遮罩层
              childRoleLoading.close()
            })
        } else {
          _this.$message({
            message: '无权限访问',
            type: 'error'
          })
          // 关闭遮罩层
          childRoleLoading.close()
        }
      },

      /* 安全退出系统 */
      sysSignOut() {
        let _this = this
        // 加载遮罩层
        let signOut = _this.$loading({
          lock: true,
          text: '安全退出中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)'
        })

        // 请求退出系统操作
        _this
          .$axios({
            url: _this.$api.state.Login.out.url,
            method: 'post',
            responseType: 'json'
          })
          .then(res => {
            if (res.Code === 200) {
              _this.$message({
                message: res.Message,
                type: 'success'
              })

              setTimeout(() => {
                // 清除遮罩层
                signOut.close()

                // 跳转至登录
                _this.$router.push({
                  path: _this.$common.state.loginPath
                })
              }, 1000)
            } else {
              // 清除遮罩层
              signOut.close()

              _this.$message({
                message: res.Message,
                type: 'error'
              })
            }
          })
          .catch(() => {
            // 清除遮罩层
            signOut.close()

            _this.$message({
              message: '服务器连接失败',
              type: 'error'
            })
          })
      },

      /** 点击修改密码处理 */
      passwordEdit() {
        // 表单验证重置
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.resetFields()
        }
        this.showEditDialog = true
      },

      /** 密码修改 */
      editSubmit() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.isCommit = true
            let data = {
              oldpass: this.ruleForm.old,
              password: this.ruleForm.new
            }
            this.$axios
              .post(this.$api.state.Frame.editpass.url, data)
              .then(res => {
                if (res.Code === 200) {
                  this.$message({
                    type: 'success',
                    message: '密码修改成功！'
                  })
                  this.showEditDialog = false
                  location.reload()
                } else {
                  let msg = res.Message ? res.Message : '密码修改失败！'
                  this.$message({
                    type: 'error',
                    message: msg
                  })
                }
                this.isCommit = false
              })
              .catch(() => {
                this.isCommit = false
              })
          }
        })
      },

      /** 监听消息处理 */
      messageHandle(res) {
        if (res.data && res.data.startsWith('{')) {
          let result = JSON.parse(res.data)
          if (result.code == 200 && result.is_excel == 1) {
            if (this.showMsgDialog) {
              // 获取一次查询结果数据
              this.currentPage = 1
              this.pageSize = 20
              this.getMessageData()
            } else {
              this.$store.commit('setMsgStatus', true)
              this.$notify({
                type: 'success',
                title: '温馨提示',
                message: '有新的报表查询完成，请到消息中心查看或下载！',
                duration: 1500
              })
            }
          }
        }
      },

      /** 点击消息图标处理 */
      messageCenter() {
        this.showMsgDialog = true
        this.getMessageData()
        this.$store.commit('setMsgStatus', false)
      },

      // 获取表格数据
      getMessageData() {
        this.isLoading = true
        let data = {
          page: this.currentPage,
          limit: this.pageSize
        }
        this.$axios
          .post(this.$api.state.Report.getquerylist.url, data)
          .then(res => {
            if (res.Code === 200) {
              this.pageTotal = res.Data.total ? res.Data.total : 0
              this.messageList = res.Data.data ? res.Data.data : []
            } else {
              let msg = res.Message ? res.Message : '获取查询记录数据失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isLoading = false
          })
      },

      // 每页条数改变处理
      sizeChange(num) {
        this.pageSize = num
        // 获取一次表格数据
        this.getMessageData()
      },

      // 当前页码改变处理
      currentChange(num) {
        this.currentPage = num
        // 获取一次表格数据
        this.getMessageData()
      },

      // 进入报表详情弹框
      enterDetail(id) {
        this.tableId = id
        this.showQueryDialog = true
      },

      // 点击消息中心取消按钮处理
      queryCancel(obj, index) {
        this.$confirm(`此操作将取消当前查询，是否继续？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            obj.isCancel = true
            this.$set(this.messageList, index, obj)
            this.$axios
              .post(this.$api.state.Report.delselectlist.url, {
                id: obj.id
              })
              .then(res => {
                if (res.Code === 200) {
                  this.$message({
                    type: 'success',
                    message: '查询任务取消成功！'
                  })
                  this.getMessageData()
                } else {
                  let msg = res.Message ? res.Message : '查询任务取消失败！'
                  this.$message({
                    type: 'error',
                    message: msg
                  })
                }
                obj.isCancel = false
                this.$set(this.messageList, index, obj)
              })
              .catch(() => {
                obj.isCancel = false
                this.$set(this.messageList, index, obj)
              })
          })
          .catch(() => {})
      },

      // 点击消息中心下载按钮处理
      queryDownload(obj, index) {
        obj.isdownload = true
        this.$set(this.messageList, index, obj)
        this.$axios({
            method: 'post',
            url: this.$api.state.Report.downloadreportfile.url,
            data: {
              id: obj.id
            },
            responseType: 'blob'
          })
          .then(res => {
            const blob = new Blob([res]) //构造一个blob对象来处理数据
            if ('download' in document.createElement('a')) {
              //支持a标签download的浏览器
              const link = document.createElement('a') //创建a标签
              link.download = obj.filename //a标签添加属性
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)
              document.body.appendChild(link)
              link.click() //执行下载
              URL.revokeObjectURL(link.href) //释放url
              document.body.removeChild(link) //释放标签
            } else {
              //其他浏览器
              navigator.msSaveBlob(blob, obj.filename)
            }
            obj.isdownload = false
            this.$set(this.messageList, index, obj)
          })
          .catch(() => {
            obj.isdownload = false
            this.$set(this.messageList, index, obj)
          })
      },

      // 重新查询处理
      queryAgain(obj) {
        this.$axios
          .post(this.$api.state.Report.againreportquery.url, {
            id: obj.id,
            uuid: sessionStorage.getItem('uuid')
          })
          .then(res => {
            if (res.Code === 200) {
              this.getMessageData()
            } else {
              let msg = res.Message ? res.Message : '重新查询失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => {})
      }
    }
  }
</script>

<style lang="less">
   .menu-list-content span{
    color: #000000 !important;
  }
  .menu-li-active span {
     color: #3ebb75 !important;
  }

  @-webkit-keyframes rotation {
    from {
      -webkit-transform: rotate(0deg);
    }

    to {
      -webkit-transform: rotate(360deg);
    }
  }

  .Rotation {
    -webkit-transform: rotate(360deg);
    animation: rotation 1.5s linear infinite;
    -moz-animation: rotation 1.5s linear infinite;
    -webkit-animation: rotation 1.5s linear infinite;
    -o-animation: rotation 1.5s linear infinite;
  }

  #EstContainer {
    >.editDialog {
      >.el-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 0 !important;
        height: 55%;

        .el-dialog__body {
          height: calc(100% - 158px);
          padding: 30px 50px;
          box-sizing: border-box;

          .el-form-item {
            margin-bottom: 15px !important;
          }
        }

        .el-dialog__footer {
          .el-button {
            width: 140px;
          }

          .el-button+.el-button {
            margin-left: 50px !important;
          }
        }
      }
    }

    >.messageDialog {
      >.el-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 0 !important;
        height: 85%;

        .el-dialog__body {
          height: calc(100% - 90px);
          padding: 0 30px;
          box-sizing: border-box;

          .empty {
            height: 50px;
            line-height: 50px;
            text-align: center;
            background-color: #fff;
            border-radius: 10px;
            margin-top: 50px;
            color: #ccc;
          }

          ul.list {
            list-style: none;

            li {
              height: 50px;
              line-height: 50px;
              display: flex;
              padding: 0 20px;
              background-color: #f7f7f7;
              border-radius: 10px;
              font-size: 14px;
              margin-top: 15px;
              overflow: hidden;

              .name {
                flex: 1;
                color: #333;
              }

              .icon {
                width: 120px;

                img {
                  width: 25px;
                  height: 25px;
                  vertical-align: middle;
                  margin-right: 7px;
                }

                >span {
                  vertical-align: middle;
                  font-size: 13px;
                }
              }

              .time {
                flex: 1;
              }

              .operate {
                flex: 1;
                text-align: right;

                .el-button {
                  width: 75px !important;
                }

                .el-button+.el-button {
                  margin-left: 10px !important;
                }
              }
            }
          }

          .el-pagination {
            margin-top: 10px;
            text-align: right;
          }
        }

        .el-dialog__footer {
          padding: 20px 30px;

          .el-button {
            width: 150px;
          }

          .el-button+.el-button {
            margin-left: 100px !important;
          }
        }
      }
    }

    >.queryDialog {
      >.el-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 0 !important;
        height: 90%;

        .el-dialog__body {
          height: calc(100% - 90px);
          padding: 0 30px;
          box-sizing: border-box;
        }
      }
    }
  }

  /*主样式*/
  #EstContainer .el-container {
    background-color: #f2f2f2;
  }

  #EstContainer .el-aside,
  #EstContainer .el-header,
  #EstContainer .el-footer {
    background-color: #ffffff;
  }

  /*主样式*/

  /*左侧菜单栏 展开样式*/
  #EstContainer .el-aside {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  #EstContainer .el-aside::-webkit-scrollbar {
    display: none;
  }

  #EstContainer .el-aside .logo-word {
    width: 100%;
    margin-top: 10px;
    text-align: center;
  }

  #EstContainer .el-aside .logo-word img {
    width: 185px;
  }

  #EstContainer .el-aside .menu-person {
    width: 100%;
    margin-top: 20px;
  }

  #EstContainer .el-aside .menu-person-body {
    width: 220px;
    margin: 0 auto;
    position: relative;
    font-size: 15px;
    text-align: center;
    cursor: pointer;
  }

  #EstContainer .el-aside .menu-person-info {
    height: 50px;
    line-height: 50px;
    background: #e1f8df;
    border-radius: 10px;
    color: #3ebb75;
  }

  #EstContainer .el-aside .menu-person-info span {
    margin-right: 15px;
  }

  #EstContainer .el-aside .menu-person-info span:first-child {
    font-weight: 600;
  }

  #EstContainer .el-aside .menu-person-more {
    position: absolute;
    top: 55px;
    width: 220px;
    line-height: 40px;
    background: #ffffff;
    color: #333333;
    z-index: 9;
    box-shadow: 0 1px 2px #ccc;
  }

  #EstContainer .el-aside .menu-person-more li {
    list-style: none;
  }

  #EstContainer .el-aside .menu-person-more li:hover {
    background: #e1f8df;
  }

  #EstContainer .el-aside .menu-ul {
    width: 235px;
    margin-left: 15px;
  }

  #EstContainer .el-aside .menu-ul .menu-li {
    list-style: none;
  }

  #EstContainer .el-aside .menu-ul .menu-li .menu-list {
    height: 60px;
    line-height: 60px;
  }

  #EstContainer .el-aside .menu-ul .menu-li:first-child .menu-list {
    height: 20px;
  }

  #EstContainer .el-aside .menu-ul .menu-li:last-child .menu-list {
    height: 30px;
  }

  #EstContainer .el-aside .menu-ul .menu-li-before,
  #EstContainer .el-aside .menu-ul .menu-li-active .menu-list,
  #EstContainer .el-aside .menu-ul .menu-li-after {
    background: #f2f2f2;
  }

  #EstContainer .el-aside .menu-ul .menu-li-before .menu-list,
  #EstContainer .el-aside .menu-ul .menu-li-after .menu-list {
    background: #ffffff;
  }

  #EstContainer .el-aside .menu-ul .menu-li-before .menu-list {
    border-bottom-right-radius: 30px;
  }

  #EstContainer .el-aside .menu-ul .menu-li-after .menu-list {
    border-top-right-radius: 30px;
  }

  #EstContainer .el-aside .menu-ul .menu-li-active .menu-list {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }

  #EstContainer .el-aside .menu-ul .menu-li .menu-list .menu-list-content {
    cursor: pointer;
    padding-left: 40px;
  }

  #EstContainer .el-aside .menu-ul .menu-li .menu-list .menu-list-content i {
    margin-right: 20px;
  }

  #EstContainer .el-aside .menu-ul .menu-li-active .menu-list .menu-list-content i {
    filter: drop-shadow(0 10px 5px rgba(62, 187, 117, 0.4));
    -webkit-filter: drop-shadow(0 10px 5px rgba(62, 187, 117, 0.4));
  }

  #EstContainer .el-aside .menu-ul .menu-li .menu-list .menu-list-content span {
    color: #999999;
    font-size: 14px;
  }

  #EstContainer .el-aside .menu-ul .menu-li-active .menu-list .menu-list-content span {
    color: #3ebb75;
    font-size: 18px;
    font-weight: 600;
  }

  #EstContainer .el-aside .menu-ul .menu-li .menu-list:hover .menu-list-content span {
    color: #3ebb75;
  }

  /*左侧菜单栏 展开样式*/

  /*左侧菜单栏 收缩样式*/
  #EstContainer .el-aside .logo-word-small {
    width: 100%;
    margin-top: 15px;
    text-align: center;
  }

  #EstContainer .el-aside .logo-word-small img {
    width: 50px;
  }

  #EstContainer .el-aside .menu-person-small {
    width: 100%;
    margin-top: 35px;
  }

  #EstContainer .el-aside .menu-person-body-small {
    width: 90px;
    margin: 0 auto;
    position: relative;
    font-size: 15px;
    text-align: center;
    cursor: pointer;
  }

  #EstContainer .el-aside .menu-person-info-small {
    height: 50px;
    line-height: 50px;
    background: #e1f8df;
    border-radius: 10px;
    color: #3ebb75;
  }

  #EstContainer .el-aside .menu-person-info-small span {
    margin-right: 10px;
  }

  #EstContainer .el-aside .menu-person-more-small {
    position: absolute;
    top: 55px;
    width: 90px;
    line-height: 40px;
    background: #ffffff;
    color: #333333;
    z-index: 9;
  }

  #EstContainer .el-aside .menu-person-more-small li {
    list-style: none;
  }

  #EstContainer .el-aside .menu-person-more-small li:hover {
    background: #e1f8df;
  }

  #EstContainer .el-aside .menu-ul-small {
    width: 105px;
    margin-left: 15px;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li {
    list-style: none;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li .menu-list {
    height: 60px;
    line-height: 60px;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li:first-child .menu-list {
    height: 20px;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li-before,
  #EstContainer .el-aside .menu-ul-small .menu-li-active .menu-list,
  #EstContainer .el-aside .menu-ul-small .menu-li-after {
    background: #f2f2f2;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li-before .menu-list,
  #EstContainer .el-aside .menu-ul-small .menu-li-after .menu-list {
    background: #ffffff;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li-before .menu-list {
    border-bottom-right-radius: 30px;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li-after .menu-list {
    border-top-right-radius: 30px;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li-active .menu-list {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li .menu-list .menu-list-content {
    padding-left: 30px;
    cursor: pointer;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li .menu-list .menu-list-content i {
    margin-right: 20px;
  }

  #EstContainer .el-aside .menu-ul-small .menu-li-active .menu-list .menu-list-content i {
    filter: drop-shadow(0 10px 5px rgba(62, 187, 117, 0.4));
    -webkit-filter: drop-shadow(0 10px 5px rgba(62, 187, 117, 0.4));
  }

  /*左侧菜单栏 收缩样式*/

  /*顶部样式*/
  #EstContainer .el-header {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 0 30px;
  }

  #EstContainer .el-header .header-left #workIcon svg {
    width: 40px;
    height: 40px;
  }

  #EstContainer .el-header .village-select {
    float: right;
    margin-right: 15px;
    margin-top: 15px;
  }

  #EstContainer .el-header .village-select .common-chose-info {
    display: inline-block;
    width: 240px;
    height: 40px;
    border-radius: 5px;
    line-height: 40px;
    background-color: #e1f8df;
    color: #3ebb75;
    padding: 0 10px;
    vertical-align: middle;
    font-size: 14px;
    cursor: pointer;
  }

  #EstContainer .el-header .village-select .common-chose-info i {
    margin-right: 5px;
    vertical-align: middle;
  }

  #EstContainer .el-header .village-select .common-chose-info #workIcon div {
    vertical-align: middle;
  }

  #EstContainer .header-left {
    display: inline-block;
    margin-top: 15px;
    cursor: pointer;
  }

  #EstContainer .header-left i {
    filter: drop-shadow(0 10px 5px rgba(62, 187, 117, 0.4));
    -webkit-filter: drop-shadow(0 10px 5px rgba(62, 187, 117, 0.4));
  }

  #EstContainer .header-right {
    float: right;
    line-height: 70px;
    font-size: 15px;
    color: #999999;
    margin: 0 auto;
    vertical-align: middle;
  }

  #EstContainer .header-right span {
    margin-right: 10px;
    vertical-align: middle;
  }

  #EstContainer .header-right i {
    margin-left: 10px;
    cursor: pointer;
    font-size: 20px;
    vertical-align: middle;
  }

  #EstContainer .badge {
    float: right;
    font-size: 20px;
    margin-right: 15px;
    margin-top: 25px;
    cursor: pointer;
    color: #999;
  }

  /*顶部样式*/

  /*内容样式*/
  #EstContainer .el-main {
    margin: 20px 25px 15px;
    padding: 0 !important;
  }

  #EstContainer .el-main.tip {
    background-color: #fff;
    border-radius: 6px;
    position: relative;
  }

  #EstContainer .el-main.tip>.tip {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 50px;
    color: #333;
    font-size: 15px;
    line-height: 20px;
    text-align: center;
  }

  #EstContainer .el-main .tip img {
    width: 130px;
    height: 130px;
    vertical-align: middle;
  }

  #EstContainer .el-main::-webkit-scrollbar {
    display: none;
  }

  /*内容样式*/

  /*底部样式*/
  #EstContainer .el-footer {
    line-height: 30px;
    text-align: center;
    overflow: hidden;
    padding: 0;
  }

  #EstContainer .el-footer span {
    font-size: 12px;
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
  }

  #EstContainer .el-footer .ricon {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    border-radius: 50%;
    border: 1px solid #3ebb75;
    font-size: 12px;
    color: #3ebb75;
    vertical-align: middle;
    box-sizing: border-box;
    margin-right: 10px;
  }

  /*底部样式*/
</style>
