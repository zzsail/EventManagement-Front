<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tableQuery.awardName" placeholder="搜索奖项名" maxlength="20" style="width: 200px; margin-right: 5px;" />
      <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" size="medium" @click="handleCreate">添加奖项</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="awardName" label="奖项名称" width="100" align="center" />
      <el-table-column prop="eventName" label="赛事名称" width="200" align="center" />
      <el-table-column prop="awardDescription" label="奖项描述" width="600" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" :loading="btnLoading" size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-button :loading="btnLoading" size="small" @click="handleAwards(row)">颁奖</el-button>
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
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="奖项名" prop="awardName">
          <el-input v-model="temp.awardName" placeholder="请输入奖项名" />
        </el-form-item>
        <el-form-item label="赛事名" prop="eventName">
          <el-input v-model="temp.eventName" placeholder="请输入赛事名" />
        </el-form-item>
        <el-form-item label="奖项描述" prop="awardDescription">
          <el-input v-model="temp.awardDescription" type="textarea" placeholder="请输入奖项描述" />
        </el-form-item>
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
    <el-dialog title="颁奖" :visible.sync="dialogAwardVisible" width="300px">
      <el-input v-model="username" placeholder="请输入用户名" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAwardVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="awards">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, update, create, deleteAward } from '@/api/award'
import { awards } from '@/api/awardWinner'
export default {

  data() {
    return {
      tableData: [],
      username: '',
      temp: {
        awardId: '',
        awardName: '',
        awardDescription: '',
        eventId: '',
        eventName: ''
      },
      dialogFormVisible: false,
      dialogAwardVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑奖项',
        create: '添加奖项'
      },
      tableLoading: false,
      total: 0,
      tableQuery: {
        pageNum: 1,
        pageSize: 5,
        awardName: ''
      },
      btnLoading: false
    }
  },
  created() {
    this.getTableData()
  },

  methods: {
    ressetUsername() {
      this.username = ''
    },
    // 颁奖
    handleAwards(row) {
      this.dialogAwardVisible = true
      this.ressetUsername()
      this.temp = row
    },
    awards() {
      this.changeBtnLoading(true)
      awards(this.temp.awardId, this.username).then((res) => {
        this.sideMessageBox('颁奖成功', '颁奖', 'success')
        this.changeBtnLoading(false)
      })
      this.dialogAwardVisible = false
    },
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
            const award = res.data.award
            this.tableData.unshift(award)
            this.changeBtnLoading(false)
            this.dialogFormVisible = false
            this.sideMessageBox('添加成功', '添加奖项', 'success')
            this.total += 1
          })
        }
      }).catch(() => {
        this.changeBtnLoading(false)
      })
    },
    // 添加
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
            const award = res.data.award
            const index = this.tableData.findIndex(v => v.participantId === this.temp.participantId)
            this.tableData.splice(index, 1, award)
            this.changeBtnLoading(false)
            this.dialogFormVisible = false
            this.sideMessageBox('修改成功', '编辑奖项', 'success')
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.changeBtnLoading(false)
    },
    // 删除
    handleDelete(row, index) {
      this.confirmMessageBox('确定删除该奖项？', '删除').then(() => {
        this.changeBtnLoading(true)
        deleteAward(row.awardId).then(() => {
          this.changeBtnLoading(false)
          this.sideMessageBox('删除奖项' + row.awardName, '删除成功', 'success')
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
        awardId: '',
        awardName: '',
        awardDescription: '',
        eventId: '',
        eventName: ''
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
