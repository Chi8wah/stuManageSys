<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" label-width="50px" inline>
      <el-form-item label="uid">
        <el-input v-model="searchForm.uid"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-select v-model="searchForm.searchForm" placeholder="请选择搜索职位">
          <el-option label="老师" value="teacher"></el-option>
          <el-option label="学生" value="student"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getInfo(searchForm.uid,searchForm.searchForm)">搜索</el-button>
        <el-button type="primary" @click="getInfo(uid,pow)">我的</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="infoFormRef" :model="infoForm" :rules="infoFormRules" label-width="80px">
      <el-form-item label="uid" prop="uid">
        <el-input v-model="infoForm.uid" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="infoForm.name"></el-input>
      </el-form-item>
      <el-form-item label="号码" prop="num">
        <el-input v-model="infoForm.num"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-input v-model="infoForm.sex"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="infoForm.age"></el-input>
      </el-form-item>
      <el-form-item label="科系" prop="dept">
        <el-input v-model="infoForm.dept"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitInfo(searchForm.uid,searchForm.searchForm)">更新信息</el-button>
        <el-button @click="getInfo(searchForm.uid,searchForm.searchForm)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Subinfo',
  data () {
    return {
      uid: '',
      pow: '',
      num: '',
      searchForm: {
        uid: '',
        searchForm: ''
      },
      infoForm: {
        uid: '',
        name: '',
        num: '',
        sex: '',
        age: '',
        dept: ''
      },
      infoFormRules: {
        uid: [{ required: true, message: '请输入uid', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        num: [{ required: true, message: '请输入号码', trigger: 'blur' }],
        sex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        dept: [{ required: true, message: '请输入科系', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.setInfo()
    this.getInfo(this.uid, this.pow)
  },
  methods: {
    reloadPage () {
      location.reload()
    },
    // 设置信息
    setInfo () {
      this.uid = window.sessionStorage.getItem('uid')
      this.pow = window.sessionStorage.getItem('pow')
    },
    // 获取信息
    async getInfo (getuid, searchForm) {
      const { data: res } = await this.$http.get('info', {
        params: {
          uid: this.uid,
          pow: this.pow,
          getuid: getuid,
          searchForm: searchForm
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success('查询成功')
      this.infoForm = res.infoForm
      this.searchForm.uid = getuid
      this.searchForm.searchForm = searchForm
    },
    // 更新信息
    submitInfo (getuid, searchForm) {
      this.$refs.infoFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完成信息填写!')
        // 发起修改请求
        const { data: res } = await this.$http.put('info', {
          infoForm: this.infoForm,
          searchForm: searchForm,
          getuid: getuid
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.message)
        }
        this.getInfo(getuid, searchForm)
        this.$message.success('更新信息成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
