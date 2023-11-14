<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tableQuery.participantName" placeholder="搜索用户名" maxlength="12" style="width: 200px; margin-right: 5px;" />
      <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" size="medium" @click="handleCreate">添加用户</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="participantName" label="姓名" width="100" align="center" />
      <el-table-column prop="username" label="用户名" width="100" align="center" />
      <el-table-column prop="participantGender" label="性别" width="50" align="center" />
      <el-table-column prop="participantAge" label="年龄" width="50" align="center" />
      <el-table-column prop="participantContactInfo" label="联系方式" width="200" align="center" />
      <el-table-column prop="eventName" label="赛事名称" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" :loading="btnLoading" size="small" @click="handleUpdate(row)">编辑</el-button>
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
        <el-form-item label="姓名" prop="participantName">
          <el-input v-model="temp.participantName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="participantContactInfo">
          <el-input v-model="temp.participantContactInfo" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="赛事名称" prop="eventName">
          <el-input v-model="temp.eventName" placeholder="请输入赛事名" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="participantGender">
              <el-select v-model="temp.participantGender" value-key="" placeholder="请选择">
                <el-option value="男" />
                <el-option value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="participantAge">
              <el-input v-model="temp.participantAge" placeholder="请输入" />
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
import { page, update, create, delelteParticipant } from '@/api/participant'
export default {

  data() {
    const validateParticipantName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入姓名'))
      } else if (value.length < 2) {
        callback(new Error('姓名长度至少为2位'))
      } else if (value.length > 12) {
        callback(new Error('姓名长度至多为12位'))
      } else if (!/[^\d]/g.test(value)) {
        callback(new Error('姓名不能为纯数字'))
      } else if (!/^[\u4e00-\u9fa5a-zA-Z]+$/.test(value)) {
        callback(new Error('姓名仅可包含中文和字母'))
      } else if (this.originalName !== '' && this.originalName === value) {
        callback()
      } else {
        callback()
      }
    }
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
      } else {
        callback()
      }
    }
    const validateEventName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('赛事不能为空'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱不能为空'))
      } else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
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
    return {
      rules: {
        participantName: [{ required: true, trigger: 'blur', validator: validateParticipantName }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        eventName: [{ required: true, trigger: 'blur', validator: validateEventName }],
        participantContactInfo: [{ required: true, trigger: 'blur', validator: validateEmail }],
        participantAge: [{ required: true, trigger: 'blur', validator: validateAge }],
        participantGender: [{ required: true, trigger: 'blur', validator: validateGender }]
      },
      tableData: [],
      originalName: '',
      temp: {
        participantId: '',
        participantName: '',
        participantGender: '',
        participantAge: '',
        participantContactInfo: '',
        eventId: '',
        eventName: '',
        userId: '',
        username: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑参赛者',
        create: '添加参赛者'
      },
      tableLoading: false,
      total: 0,
      tableQuery: {
        pageNum: 1,
        pageSize: 5,
        participantName: ''
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
          create(tempData).then((res) => {
            const participant = res.data.participant
            this.tableData.unshift(participant)
            this.changeBtnLoading(false)
            this.dialogFormVisible = false
            this.sideMessageBox('添加成功', '添加参赛者', 'success')
            this.total += 1
          })
        }
      }).catch(() => {
        this.changeBtnLoading(false)
      })
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
    // 编辑确认
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.changeBtnLoading(true)
          const tempData = Object.assign({}, this.temp)// 拷贝数据
          update(tempData).then((res) => {
            const participant = res.data.participant
            const index = this.tableData.findIndex(v => v.participantId === this.temp.participantId)
            this.tableData.splice(index, 1, participant)
            this.changeBtnLoading(false)
            this.dialogFormVisible = false
            this.sideMessageBox('修改成功', '编辑参赛者', 'success')
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.changeBtnLoading(false)
    },
    // 删除参赛者
    handleDelete(row, index) {
      this.confirmMessageBox('确定删除该参赛者？', '删除').then(() => {
        this.changeBtnLoading(true)
        delelteParticipant(row.participantId).then(() => {
          this.changeBtnLoading(false)
          this.sideMessageBox('删除参赛者' + row.participantName, '删除成功', 'success')
          this.tableData.splice(index, 1)
          this.total -= 1
        }).catch(() => {
          this.changeBtnLoading(false)
        })
      })
    },
    getTableData() {
      this.tableLoading = true
      page(this.tableQuery).then((res) => {
        this.tableData = res.data.items.records
        this.total = res.data.items.total
        setTimeout(() => { this.tableLoading = false }, 300) // 来点缓冲时间，增加体验感
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 重置temp数据
    resetTemp() {
      this.temp = {
        participantId: '',
        participantName: '',
        participantGender: '',
        participantAge: '',
        participantContactInfo: '',
        eventId: '',
        eventName: '',
        userId: '',
        username: ''
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
