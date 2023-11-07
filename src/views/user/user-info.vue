<template>
  <div class="app-container">
    <div class="filter-container">
      
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%;"
    >
      <el-table-column prop="username" label="用户名" width="170" align="center" />
      <el-table-column prop="email" label="邮箱" width="250" align="center" />
      <el-table-column prop="gender" label="性别" width="70" align="center" />
      <el-table-column prop="age" label="年龄" width="80" align="center" />
      <el-table-column prop="power" label="用户权限组" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.power === 1" type="danger">Admin</el-tag>
          <el-tag v-if="scope.row.power === 2" type="warning">管理员</el-tag>
          <el-tag v-if="scope.row.power === 3">用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateTime" label="最后操作时间" width="270" align="center" />
      <el-table-column prop="registerTime" label="注册时间" width="270" align="center" />
      <el-table-column prop="ban" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ban" type="success" effect="dark">正常</el-tag>
          <el-tag v-if="!scope.row.ban" type="danger" effect="dark">封禁</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" :loading="btnLoading" size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.ban" :loading="btnLoading" size="small" @click="handleBan(row, '封禁', )">封禁</el-button>
          <el-button v-if="!row.ban" :loading="btnLoading" type="success" size="small" @click="handleBan(row, '解禁')">解禁</el-button>
          <el-button type="danger" :loading="btnLoading" size="small" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="temp.gender" value-key="" placeholder="请选择性别">
                <el-option value="男" />
                <el-option value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="temp.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户权限组" prop="power">
              <el-select v-model="temp.power" placeholder="请选择用户权限组">
                <el-option value="3" label="用户" />
                <el-option value="2" label="管理员" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="ban">
          
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      temp: {
        userId: '',
        username: '',
        email: '',
        password: '',
        gender: '',
        age: 0,
        power: 3,
        ban: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      tableLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        username: ''
      },
      btnLoading: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    //
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // 复制对象
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加用户
    handleCreate(row) {
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
        age: 0,
        power: 3,
        ban: 1
      }
    },
    // 删除用户
    handleDelete(row, index) {
      this.confirmMessageBox('确定删除该用户？', '删除').then(() => {
        this.changeBtnLoading()
        this.$store.dispatch('user/deleteUser', row.userId).then(() => {
          this.changeBtnLoading()
          this.sideMessageBox('删除成功', '删除用户' + row.username, 'success')
          this.tableData.splice(index, 1)
        }).catch(() => {
          this.changeBtnLoading()
        })
      })
    },
    // 封解禁用户
    handleBan(row, msg) {
      this.confirmMessageBox('确定' + msg + '该用户？', msg).then(() => {
        this.changeBtnLoading()
        this.$store.dispatch('user/ban', row.userId).then(() => {
          row.ban = !row.ban
          this.changeBtnLoading()
          this.sideMessageBox(msg + '成功', msg, 'success')
        }).catch(() => {
          this.changeBtnLoading()
        })
      })
    },
    getTableData() {
      this.tableLoading = true
      this.$store.dispatch('user/page', this.listQuery).then((response) => {
        this.tableData = response.data.items.records
        this.tableData.forEach(item => {
          // 将时间戳中的T字符替换为空格
          item.lastUpdateTime = item.lastUpdateTime.replace(/T/, ' ')
          item.registerTime = item.registerTime.replace(/T/, ' ')
        })
        console.log(this.tableData)
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    changeBtnLoading() {
      this.btnLoading = !this.btnLoading
    }
  }
}
</script>
