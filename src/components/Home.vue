<template>
  <el-container class="homeContainer">
<!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/mallLogo.jpg" alt="" id="mallLogo">
        <span>教务系统</span>
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
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" class="setTextLeft">
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
      menulist: [{
        id: 101,
        authName: '个人信息',
        path: 'info',
        children: [{
          id: 105,
          authName: '个人信息',
          path: 'subinfo',
          children: []
        }]
      }, {
        id: 102,
        authName: '课程信息',
        path: 'course',
        children: [{
          id: 106,
          authName: '课程信息',
          path: 'subcourse',
          children: []
        }]
      }, {
        id: 103,
        authName: '课程成绩',
        path: 'sc',
        children: [{
          id: 107,
          authName: '课程成绩',
          path: 'subsc',
          children: []
        }]
      }, {
        id: 104,
        authName: '用户管理',
        path: 'user',
        children: [{
          id: 108,
          authName: '用户管理',
          path: 'subuser',
          children: []
        }]
      }],
      iconsObj: {
        104: 'el-icon-s-custom',
        103: 'el-icon-s-operation',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order'
      },
      // 侧边栏是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      // 用户uid
      uid: '',
      // 用户权限
      pow: ''
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
    this.uid = window.sessionStorage.getItem('uid')
    this.pow = window.sessionStorage.getItem('pow')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
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

  .setTextLeft{
    text-align: left;
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
