<template>
  <el-container class="homeContainer">
<!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/mallLogo.jpg" alt="" id="mallLogo">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
<!--    主题区域-->
    <el-container>
<!--      左侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggleButton" @click="toggleCollapse">|||</div>
<!--        侧边栏菜单区域-->
        <el-menu
          :default-active="activePath"
          :collapse-transition="false"
          :collapse="isCollapse"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :router="true">
<!--          一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
<!--            菜单模板区-->
            <template slot="title">
<!--              图标-->
              <i :class="iconsObj[item.id]"></i>
<!--              文本-->
              <span>{{item.authName}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)">
              <template slot="title">
              <!--              图标-->
              <i class="el-icon-menu"></i>
              <!--              文本-->
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      右侧内容主题-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-operation',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      },
      // 侧边栏是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //  获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>

  .homeContainer{
    height: 100%;
  }

  .el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #FFFFFF;
    font-size: 20px;

    > div{
      height: 100%;
      display: flex;
      align-items: center;

      span{
        margin-left: 15px;
      }
    }
  }

  #mallLogo{
    height: 100%;
  }

  .el-aside{
    background-color: #333744;
    transition: width 0.2s;

    .el-menu{
      border-right: none;
    }
  }

  .toggleButton{
    background-color: #4A5064;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    color: #FFFFFF;
    letter-spacing: 0.2em;
    cursor: pointer;
    user-select:none;
  }

  .el-main{
    background-color: #EAEDF1;
  }

</style>
