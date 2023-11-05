<template>
  <div class="app-container">
    <div class="filter-container">
      
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
    >
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="lastUpdateTime" label="最后操作时间" />
      <el-table-column prop="registerTime" label="注册时间" />
      <el-table-column prop="ban" label="状态" />

    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: null,
      tableLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        username: ''
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.tableLoading = true
      this.$store.dispatch('user/page', this.listQuery).then((response) => {
        this.tableData = response.data.items.records
        this.tableData.foreach(item => {
          item.lastUpdateTime = item.lastUpdateTime
        })
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>
