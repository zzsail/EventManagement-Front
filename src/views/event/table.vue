<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tableQuery.eventName" placeholder="搜索赛事" maxlength="12" style="width: 200px; margin-right: 5px;" />
      <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" size="medium" @click="handleCreateEvent">添加赛事</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="eventName" label="赛事名" width="180" align="center" />
      <el-table-column prop="eventLocation" label="赛事地点" width="200" align="center" />
      <el-table-column prop="eventDate" label="赛事日期" width="200" align="center" />
      <el-table-column prop="eventDescription" label="赛事介绍" width="250" align="center" />
      <el-table-column prop="categoryName" label="赛事分类" width="150" align="center" />
      <el-table-column prop="ratingValue" label="赛事评分" width="100" align="center" />
      <el-table-column prop="participantNum" label="参与人数" width="100" align="center" />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success" effect="dark">筹备中</el-tag>
          <el-tag v-if="!scope.row.status" type="danger" effect="dark">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" :loading="btnLoading" size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.status" :loading="btnLoading" size="small" @click="handleBan(row, '终止', $index)">终止</el-button>
          <el-button v-if="!row.status" :loading="btnLoading" type="success" size="small" @click="handleBan(row, '重启', $index)">重启</el-button>
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
        <el-form-item label="赛事名" prop="eventName">
          <el-input v-model="temp.eventName" placeholder="请输入赛事名" />
        </el-form-item>
        <el-form-item label="赛事地点" prop="eventLocation">
          <el-input v-model="temp.eventLocation" placeholder="请输入赛事地点" />
        </el-form-item>
        <el-form-item label="赛事日期" prop="eventDate">
          <!-- 只可以选择未来的时间 -->
          <el-date-picker v-model="temp.eventDate" type="date" :picker-options="timeChange" placeholder="请选择赛事日期" />
        </el-form-item>
        <el-form-item label="赛事分类" prop="category">
          <el-select v-model="temp.categoryName" placeholder="请选择分类">
            <el-option v-for="option in categoryOptions" :key="option" :value="option" :label="option" />
            <el-option label="新建分类" @click.native="handleCreateCategory" />
          </el-select>
        </el-form-item>
        <el-form-item label="赛事介绍" prop="eventDescription">
          <el-input v-model="temp.eventDescription" type="textarea" maxlength="500" placeholder="请输入赛事介绍" show-word-limit />
        </el-form-item>
        <el-form-item label="赛事图片" prop="eventImage">
          <el-upload
            class="avatar-uploader"
            action="''"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-change=" uploadImage"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
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
    <el-dialog :title="categoryTextMap[categoryDialogStatus]" :visible.sync="categoryDialogFormVisible" width="600px" style="top: 10%;">
      <el-form ref="categoryForm" :model="categoryTemp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分类名" prop="categoryName">
          <el-input v-model="categoryTemp.categoryName" placeholder="请输入分类名" />
        </el-form-item>
        <el-form-item label="分类介绍" prop="categoryDescription">
          <el-input v-model="categoryTemp.categoryDescription" placeholder="请输入分类介绍" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="categoryDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="categoryDialogStatus==='createCategory'?createCategory():updateCategory()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createCategory, listCategory } from '@/api/eventCategory'
import { create, page, update, uploadImage } from '@/api/event'
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
      timeChange: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
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
      categoryOptions: [],
      imageUrl: '',
      temp: {
        eventId: '',
        eventName: '',
        eventDate: '',
        eventLocation: '',
        eventDescription: '',
        eventImage: '',
        categoryName: '',
        ratingValue: '', // 评分
        participantNum: '', // 参赛人数
        status: ''
      },
      categoryTemp: {
        categoryId: '',
        categoryName: '',
        categoryDescription: ''
      },
      originalName: '',
      originalPwd: '',
      originalEmail: '',
      dialogFormVisible: false,
      categoryDialogFormVisible: false,
      dialogStatus: '',
      categoryDialogStatus: '',
      textMap: {
        update: '编辑赛事',
        create: '添加赛事'
      },
      categoryTextMap: {
        update: '编辑赛事分类',
        create: '添加赛事分类'
      },
      tableLoading: false,
      total: 0,
      tableQuery: {
        pageNum: 1,
        pageSize: 5,
        eventName: ''
      },
      btnLoading: false
    }
  },
  created() {
    this.getTableData()
    this.getCategoryList()
  },

  methods: {
    // 上传文件函数
    // handleRemove(file, fileList) {
    //   console.log(file, fileList)
    // },
    // handlePreview(file) {
    //   console.log(file)
    // },
    uploadImage(file) {
      if (file.status !== 'ready') return
      const formData = new FormData()
      formData.append('file', file.raw) // 传给后台接收的名字 file
      uploadImage(formData).then(response => {
        console.log(response)
        this.temp.eventImage = response
        this.imageUrl = URL.createObjectURL(file.raw)
      })
    },
    // 上传前处理
    beforeUpload(file) {
      const fileSize = file.size
      const FIVE_M = 10 * 1024 * 1024
      // 大于5M，不允许上传
      if (fileSize > FIVE_M) {
        this.$message.error('最大上传10M')
        return false
      }
      // 判断文件类型
      const fileName = file.name
      const reg = /(.*).(jpg|jpeg|png)$/
      if (!reg.test(fileName)) {
        this.$message.error('只能上传jpg/png!')
        return false
      }
      return true
    },
    // 获取分类列表
    getCategoryList() {
      listCategory().then(response => {
        this.categoryOptions = response
      })
    },
    // 搜索
    handleFilter() {
      this.tableQuery.pageNum = 1
      this.getTableData()
    },
    // 检查用户名是否存在
    checkUsername(username) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('user/checkUsername', username)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
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
    // 创建分类
    handleCreateCategory() {
      this.resetCategoryTemp()
      this.categoryDialogStatus = 'createCategory'
      this.categoryDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['categoryForm'].clearValidate()
      })
      this.temp.category = ''
    },
    createCategory() {
      this.$refs['categoryForm'].validate((valid) => {
        if (valid) {
          this.changeBtnLoading(true)
          const tempData = Object.assign({}, this.categoryTemp)// 拷贝数据
          createCategory(tempData).then((category) => {
            this.changeBtnLoading(false)
            this.categoryOptions.push(category.categoryName)
            this.categoryDialogFormVisible = false
            this.sideMessageBox('添加成功', '添加赛事分类', 'success')
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
          console.log(this.temp)
          const tempData = Object.assign({}, this.temp)// 拷贝数据
          update(tempData).then((event) => {
            const index = this.tableData.findIndex(v => v.eventId === this.temp.eventId)
            this.tableData.splice(index, 1, event)
            this.changeBtnLoading(false)
            this.dialogFormVisible = false
            this.sideMessageBox('修改成功', '编辑赛事', 'success')
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
    // 添加赛事
    handleCreateEvent() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp) // 拷贝数据
          create(tempData).then((event) => {
            this.changeBtnLoading(false)
            this.tableData.unshift(event)
            this.dialogFormVisible = false
            this.sideMessageBox('添加成功', '添加赛事', 'success')
          })
        }
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
    // 终止|重启比赛
    handleBan(row, msg, index) {
      this.confirmMessageBox('确定' + msg + '该比赛？', msg).then(() => {
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
      page(this.tableQuery).then((data) => {
        this.tableData = data.records
        this.total = data.total
        setTimeout(() => { this.tableLoading = false }, 300) // 来点缓冲时间，增加体验感
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 重置temp数据
    resetTemp() {
      this.temp = {
        eventId: '',
        eventName: '',
        eventDate: '',
        eventLocation: '',
        eventDescription: '',
        categoryName: '',
        ratingValue: '',
        participantNum: '',
        status: ''
      }
    },
    resetCategoryTemp() {
      this.categoryTemp = {
        categoryId: '',
        categoryName: '',
        categoryDescription: ''
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
