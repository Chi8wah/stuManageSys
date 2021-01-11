<template>
  <div>
    <!--    搜索与添加区域-->
    <el-form ref="searchFormRef" :model="searchForm" label-width="100px" inline>
      <el-form-item label="课程号">
        <el-input v-model="searchForm.cno"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getScList(searchForm.cno)">搜索</el-button>
        <el-button type="primary" @click="getScList()">我的</el-button>
      </el-form-item>
    </el-form>
    <!--      用户列表区-->
    <el-table
      class="scoreTable"
      :data="scorelist"
      :border="true"
      :stripe="true">
      <el-table-column
        prop="sno"
        label="学号"
      ></el-table-column>
      <el-table-column
        prop="cno"
        label="课程号"
      ></el-table-column>
      <el-table-column
        prop="tno"
        label="教师号"
      ></el-table-column>
      <el-table-column
        prop="score"
        label="分数"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="180px">
        <template slot-scope="scope">
          <!--            修改按钮-->
          <el-button type="primary" @click="showEditDialog(scope.row)" :disabled="setScoreFlag">登记成绩</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--      修改分数的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="学号">
          <el-input v-model="editForm.sno" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程号">
          <el-input v-model="editForm.cno" disabled></el-input>
        </el-form-item>
        <el-form-item label="教师号">
          <el-input v-model="editForm.tno" disabled></el-input>
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input v-model="editForm.score" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editScore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Subsc',
  data () {
    return {
      uid: '',
      pow: '',
      num: '',
      setScoreFlag: false, // 学生时为true
      scorelist: [],
      searchForm: {
        cno: ''
      },
      editDialogVisible: false,
      editForm: {
        sno: '',
        cno: '',
        tno: '',
        score: ''
      },
      editFormRules: {
        score: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.setInfo()
    this.getScList()
  },
  methods: {
    setInfo () {
      this.uid = window.sessionStorage.getItem('uid')
      this.pow = window.sessionStorage.getItem('pow')
      this.num = window.sessionStorage.getItem('num')
      if (this.pow === 'student') {
        this.setScoreFlag = true
      }
    },
    async getScList (cno) {
      if (cno === '') {
        cno = null
      }
      const { data: res } = await this.$http.get('score', {
        params: {
          pow: this.pow,
          num: this.num,
          cno: cno
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.message)
      } else {
        this.$message.success('查询成绩信息成功')
      }
      this.scorelist = res.scorelist
      this.searchForm.cno = cno
    },
    showEditDialog (editForm) {
      console.log(editForm)
      this.editForm.sno = editForm.sno
      this.editForm.cno = editForm.cno
      this.editForm.tno = editForm.tno
      this.editForm.score = editForm.score
      this.editDialogVisible = true
    },
    editScore () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改请求
        const { data: res } = await this.$http.put('score', this.editForm)
        if (res.meta.status !== 200) {
          this.$message.error(res.message)
        } else {
          this.$message.success('更新用户信息成功')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getScList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .scoreTable {
    border-radius: 15px;
    margin-top: 10px;
  }
</style>
