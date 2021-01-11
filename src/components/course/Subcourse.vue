<template>
  <div>
    <!--    搜索与添加区域-->
    <el-button type="primary" @click="addDialogVisible = true" :disabled="addPowFlag">
      开设课程
    </el-button>
    <!--      课程列表区-->
    <el-table
      class="courseTable"
      :data="courselist"
      :border="true"
      :stripe="true">
      <el-table-column
        prop="cno"
        label="cno"
      ></el-table-column>
      <el-table-column
        prop="cname"
        label="课程名"
      ></el-table-column>
      <el-table-column
        prop="credit"
        label="学分"
      ></el-table-column>
      <el-table-column
        prop="tno"
        label="教师号"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="180px">
        <template slot-scope="scope">
          <!--            报名按钮-->
          <el-button type="primary" @click="applyCourse(scope.row)" :disabled="applyPowFlag">报名课程</el-button>
          <!--            删除按钮-->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCourse(scope.row)" :disabled="addPowFlag"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    开设课程的对话框-->
    <el-dialog
      title="开设课程"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!--      内容主体区-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px">
        <el-form-item label="课程号" prop="cno">
          <el-input v-model="addForm.cno"></el-input>
        </el-form-item>
        <el-form-item label="课程名" prop="cname">
          <el-input v-model="addForm.cname"></el-input>
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input v-model="addForm.credit"></el-input>
        </el-form-item>
        <el-form-item label="教师号" prop="tno" >
        <el-input v-model="addForm.tno" :disabled="editTnoFlag"></el-input>
      </el-form-item>
      </el-form>
      <!--      底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Subcourse',
  data () {
    return {
      uid: '',
      pow: '',
      num: '',
      courselist: [],
      // 控制开设课程对话框的显示隐藏
      addDialogVisible: false,
      addPowFlag: false, // 非学生时为false
      applyPowFlag: true, // 学生时为false
      editTnoFlag: false,
      addForm: {
        cno: '',
        cname: '',
        credit: '',
        tno: ''
      },
      addFormRules: {
        cno: [
          {
            required: true,
            message: '请输入课程号',
            trigger: 'blur'
          }
        ],
        cname: [
          {
            required: true,
            message: '请输入课程名',
            trigger: 'blur'
          }
        ],
        credit: [
          {
            required: true,
            message: '请输入学分',
            trigger: 'blur'
          }
        ],
        tno: [
          {
            required: true,
            message: '请输入教师号',
            trigger: 'blur'
          }
        ]
      },
      applylist: {
        cno: '',
        tno: '',
        sno: ''
      }
    }
  },
  created () {
    this.setInfo()
    this.getCourseList()
  },
  methods: {
    setInfo () {
      this.uid = window.sessionStorage.getItem('uid')
      this.pow = window.sessionStorage.getItem('pow')
      this.num = window.sessionStorage.getItem('num')
      if (this.pow === 'teacher') {
        this.addPowFlag = false
        this.applyPowFlag = true
        this.editTnoFlag = true
        this.addForm.tno = this.num
      }
      if (this.pow === 'student') {
        this.addPowFlag = true
        this.applyPowFlag = false
      }
    },
    async getCourseList () {
      const { data: res } = await this.$http.get('course', {
        params: {
          pow: this.pow,
          num: this.num
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success('查询课程信息成功')
      this.courselist = res.courselist
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addCourse () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起开设课程的网络请求
        const { data: res } = await this.$http.post('course', this.addForm)
        if (res.meta.status !== 200) {
          this.$message.error(res.message)
        } else {
          this.$message.success('开设课程成功')
        }
        // 隐藏开设课程的对话框
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getCourseList()
      })
    },
    async applyCourse (applylist) {
      // 弹框确认
      const confirmResult = await this.$confirm('是否确定报名此课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { cno, tno } = applylist
      const { data: res } = await this.$http.post('course/apply', {
        cno: cno,
        tno: tno,
        sno: this.num
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('报名课程成功')
      }
    },
    async removeCourse (removelist) {
      // 弹框确认
      const confirmResult = await this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('course', {
        data: { // 隐式用data, 显式用params
          cno: removelist.cno,
          tno: removelist.tno
        }
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除课程成功')
      }
      this.getCourseList()
    }
  }
}
</script>

<style lang="less" scoped>
  .courseTable {
    border-radius: 15px;
    margin-top: 10px;
  }
</style>
