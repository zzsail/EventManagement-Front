<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tableQuery.username" placeholder="搜索用户名" maxlength="12" style="width: 200px; margin-right: 5px;" />
      <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" size="medium" @click="handleCreate">添加用户</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="username" label="用户名" width="100" align="center" />
      <el-table-column prop="email" label="邮箱" width="200" align="center" />
      <el-table-column prop="gender" label="性别" width="50" align="center" />
      <el-table-column prop="age" label="年龄" width="50" align="center" />
      <el-table-column prop="power" label="用户权限组" width="95" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.power === 1" type="danger">Admin</el-tag>
          <el-tag v-if="scope.row.power === 2" type="warning">管理员</el-tag>
          <el-tag v-if="scope.row.power === 3">用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateTime" label="最后操作时间" align="center" />
      <el-table-column prop="registerTime" label="注册时间" width="180" align="center" />
      <el-table-column prop="ban" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ban" type="success" effect="dark">正常</el-tag>
          <el-tag v-if="!scope.row.ban" type="danger" effect="dark">封禁</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" :loading="btnLoading" size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.ban" :loading="btnLoading" size="small" @click="handleBan(row, '封禁', $index)">封禁</el-button>
          <el-button v-if="!row.ban" :loading="btnLoading" type="success" size="small" @click="handleBan(row, '解禁', $index)">解禁</el-button>
          <el-button type="danger" :loading="btnLoading" size="small" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      :total="total"
      :current-page="tableQuery.pageNum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="tableQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      align="center"
      background
      style="margin-top: 10px;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="temp.gender" value-key="" placeholder="请选择">
                <el-option value="男" />
                <el-option value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="temp.age" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户权限组" prop="power">
              <el-select v-model="temp.power" placeholder="请选择">
                <el-option v-for="option in powerOptions" :key="option.value" :value="option.value" :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="ban">
              <el-select v-model="temp.ban" placeholder="请选择">
                <el-option v-for="option in banOptions" :key="option.value" :value="option.value" :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 2) {
        callback(new Error('用户名长度至少为2位'))
      } else if (value.length > 12) {
        callback(new Error('用户名长度至多为12位'))
      } else if (!/[^\d]/g.test(value)) {
        callback(new Error('用户名不能为纯数字'))
      } else if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value)) {
        callback(new Error('用户名仅可包含中文、字母、数字以及下划线'))
      } else if (this.originalName !== '' && this.originalName === value) {
        callback()
      } else {
        this.checkUsername(value).then(res => {
          if (res) {
            callback(new Error('用户名已存在'))
          } else {
            callback()
          }
        })
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码长度至少为6位'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱不能为空'))
      } else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else if (this.originalEmail !== '' && this.originalEmail === value) {
        callback()
      } else {
        this.checkEmail(value).then(res => {
          if (res) {
            callback(new Error('邮箱已被注册'))
          } else {
            callback()
          }
        })
      }
    }
    const validateAge = (rule, value, callback) => {
      if (!value) {
        callback(new Error('年龄不能为空'))
      } else if (value < 0 || value > 256) {
        callback(new Error('请输入正确的年龄'))
      } else {
        callback()
      }
    }
    const validateGender = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择性别'))
      } else {
        callback()
      }
    }
    const validatePower = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    const validateBan = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        age: [{ required: true, trigger: 'blur', validator: validateAge }],
        gender: [{ required: true, trigger: 'blur', validator: validateGender }],
        power: [{ required: true, trigger: 'blur', validator: validatePower }],
        ban: [{ required: true, trigger: 'blur', validator: validateBan }]
      },
      tableData: [],
      temp: {
        userId: '',
        username: '',
        email: '',
        password: '',
        gender: '',
        age: '',
        power: 3,
        ban: 1,
        lastUpdateTime: '',
        registerTime: ''
      },
      originalName: '',
      originalPwd: '',
      originalEmail: '',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      tableLoading: false,
      total: 0,
      tableQuery: {
        pageNum: 1,
        pageSize: 5,
        username: ''
      },
      btnLoading: false
    }
  },
  computed: {
    banOptions() {
      return [
        { value: true, label: '正常' },
        { value: false, label: '封禁' }
      ]
    },
    powerOptions() {
      // 这里定义权限组选项的映射关系
      return [
        { value: 1, label: 'admin' },
        { value: 2, label: '管理员' },
        { value: 3, label: '用户' }
      ]
    }
  },
  created() {
    this.getTableData()
  },

  methods: {
    handleFilter() {
      this.tableQuery.pageNum = 1
      this.getTableData()
    },
    // 检查邮箱是否存在
    checkEmail(email) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('user/checkEmail', email)
          .then(response => {
            console.log(response)
            resolve(response)
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
      })
    },
    // 检查用户名是否存在
    checkUsername(username) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('user/checkUsername', username)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
      })
    },
    // 监听表格大小变化
    handleSizeChange(val) {
      this.tableQuery.pageSize = val
      this.getTableData()
    },
    // 监听表格页码变化
    handleCurrentChange(val) {
      this.tableQuery.pageNum = val
      this.getTableData()
    },
    // 添加确认
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.changeBtnLoading(true)
          const tempData = Object.assign({}, this.temp)// 拷贝数据
          this.$store.dispatch('user/create', tempData).then((user) => {
            this.tableData.unshift(user)
            this.changeBtnLoading(false)
            this.dialogFormVisible = false
            this.sideMessageBox('添加成功', '添加用户', 'success')
            this.total += 1
          })
        }
      }).catch(() => {
        this.changeBtnLoading(false)
      })
    },
    // 编辑确认
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.changeBtnLoading(true)
          const tempData = Object.assign({}, this.temp)// 拷贝数据
          this.$store.dispatch('user/update', tempData).then((user) => {
            const index = this.tableData.findIndex(v => v.userId === this.temp.userId)
            this.tableData.splice(index, 1, user)
            this.changeBtnLoading(false)
            this.dialogFormVisible = false
            this.sideMessageBox('修改成功', '编辑用户', 'success')
          })
        }
      }).catch(() => {
        this.changeBtnLoading(false)
      })
    },
    // 编辑 数据回显
    handleUpdate(row) {
      this.changeBtnLoading(true)
      this.temp = Object.assign({}, row) // 复制对象
      this.originalName = this.temp.username // 保存原名
      this.originalPwd = this.temp.password // 保存原密码
      this.originalEmail = this.temp.email // 保存原邮箱
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.changeBtnLoading(false)
    },
    // 添加用户
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 删除用户
    handleDelete(row, index) {
      this.confirmMessageBox('确定删除该用户？', '删除').then(() => {
        this.changeBtnLoading(true)
        this.$store.dispatch('user/deleteUser', row.userId).then(() => {
          this.changeBtnLoading(false)
          this.sideMessageBox('删除用户' + row.username, '删除成功', 'success')
          this.tableData.splice(index, 1)
          this.total -= 1
        }).catch(() => {
          this.changeBtnLoading(false)
        })
      })
    },
    // 封解禁用户
    handleBan(row, msg, index) {
      this.confirmMessageBox('确定' + msg + '该用户？', msg).then(() => {
        this.changeBtnLoading(true)
        this.$store.dispatch('user/ban', row.userId).then((user) => {
          // row.ban = !row.ban
          this.changeBtnLoading(false)
          this.tableData.splice(index, 1, user)
          this.sideMessageBox(msg + '成功', msg, 'success')
        }).catch(() => {
          this.changeBtnLoading(false)
        })
      })
    },
    getTableData() {
      this.tableLoading = true
      this.$store.dispatch('user/page', this.tableQuery).then((data) => {
        this.tableData = data.items.records
        this.total = data.items.total
        console.log(data)
        setTimeout(() => { this.tableLoading = false }, 300) // 来点缓冲时间，增加体验感
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 重置temp数据
    resetTemp() {
      this.temp = {
        userId: '',
        username: '',
        email: '',
        password: '',
        gender: '',
        age: '',
        power: 3,
        ban: true,
        lastUpdateTime: '',
        registerTime: ''
      }
    },
    changeBtnLoading(status) {
      this.btnLoading = status
    }
  }
}

</script>

<style>
.filter-container {
  float: right;
  margin-bottom: 10px;
}
</style>
