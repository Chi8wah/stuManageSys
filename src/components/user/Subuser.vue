<template>
  <div>
    <!--    搜索与添加区域-->
    <el-button type="primary" @click="addDialogVisible = true">
          添加用户
    </el-button>
    <!--      用户列表区-->
    <el-table
      class="userTable"
      :data="userlist"
      :border="true"
      :stripe="true">
      <el-table-column
        prop="uid"
        label="uid"
      ></el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
      ></el-table-column>
      <el-table-column
        prop="password"
        label="密码"
      ></el-table-column>
      <el-table-column
        prop="pow"
        label="身份"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="180px">
        <template slot-scope="scope">
          <!--            修改按钮-->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
          <!--            删除按钮-->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.uid)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!--      内容主体区-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-radio-group v-model="addForm.pow">
            <el-radio label="teacher" :disabled="addPowFlag">教师</el-radio>
            <el-radio label="student">学生</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!--      底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--    修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="uid">
          <el-input v-model="editForm.uid" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-input v-model="editForm.pow" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Subuser',
  data () {
    return {
      uid: '',
      pow: '',
      userlist: [],
      // 控制添加用户对话框的显示隐藏
      addDialogVisible: false,
      addPowFlag: false,
      addForm: {
        username: '',
        password: '',
        pow: 'student'
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            min: 3,
            max: 10,
            message: '用户名长度在3~10字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 15,
            message: '密码长度在6~15字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改用户对话框的显示
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
        username: '',
        password: '',
        uid: '',
        pow: ''
      },
      editFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            min: 3,
            max: 10,
            message: '用户名长度在3~10字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 15,
            message: '密码长度在6~15字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.setInfo()
    this.getUserList()
  },
  methods: {
    setInfo () {
      this.uid = window.sessionStorage.getItem('uid')
      this.pow = window.sessionStorage.getItem('pow')
      if (this.pow === 'teacher') {
        this.addPowFlag = true
      }
    },
    async getUserList () {
      const { data: res } = await this.$http.get('user', {
        params: {
          pow: this.pow
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.message)
      } else {
        this.$message.success('查询用户列表成功')
      }
      this.userlist = res.userlist
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('user', this.addForm)
        if (res.meta.status !== 200) {
          this.$message.error(res.message)
        } else {
          this.$message.success('添加用户成功')
        }
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    showEditDialog (editForm) {
      this.editForm.username = editForm.username
      this.editForm.password = editForm.password
      this.editForm.uid = editForm.uid
      this.editForm.pow = editForm.pow
      this.editDialogVisible = true
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改请求
        const { data: res } = await this.$http.put('user', this.editForm)
        if (res.meta.status !== 200) {
          this.$message.error(res.message)
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },
    async removeUserById (uid) {
      // 不可删除自己
      if (uid === this.uid) {
        return this.$message.error('不可删除自己')
      }
      // 弹框确认
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('user', {
        data: { // 隐式用data, 显式用params
          uid: uid
        }
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.message)
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.userTable {
  border-radius: 15px;
  margin-top: 10px;
}
</style>
