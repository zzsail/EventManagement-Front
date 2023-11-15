<template>
  <div class="app-container">
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="eventName" label="赛事名称" align="center" />
      <el-table-column prop="awardName" label="奖项名称" align="center" />
      <el-table-column prop="participantName" label="获奖者" align="center" />
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
  </div>
</template>

<script>
import { page } from '@/api/awardWinner'
export default {

  data() {
    return {
      tableData: [],
      username: '',
      temp: {
        winnerId: '',
        awardId: '',
        awardName: '',
        participantId: '',
        participantName: '',
        eventId: '',
        eventName: ''
      },
      tableLoading: false,
      total: 0,
      tableQuery: {
        pageNum: 1,
        pageSize: 5
      },
      btnLoading: false
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
        winnerId: '',
        awardId: '',
        awardName: '',
        participantId: '',
        participantName: '',
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
