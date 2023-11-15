<template>
  <div class="home-container">
    <el-card style="width: 98%; height: 200px; margin-top: 10px; margin-left: 1%;">
      <el-row>
        <el-col :span="6" class="box">
          <div class="textHeader">当前用户数</div>
          <div class="text">{{ userNum }}</div>
        </el-col>
        <el-col :span="6" class="box">
          <div class="textHeader">近七日比赛数</div>
          <div class="text">{{ eventNum }}</div>
        </el-col>
        <el-col :span="6" class="box">
          <div class="textHeader">当前参赛者数</div>
          <div class="text">{{ participantNum }}</div>
        </el-col>
        <el-col :span="6" class="box">
          <div class="textHeader">最近获奖者</div>
          <div class="text">鹿晗</div>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="width: 98%; height: 500px; margin-top: 10px; margin-left: 1%;">
      <el-carousel trigger="click" height="500px">
        <el-carousel-item v-for="item in 5" :key="item">
          <el-image :src="require('C:/Code/Vue/EventManagement-Front/src/assets/home' + item + '.jpg')" class="image" fit="cover" />
        </el-carousel-item>
      </el-carousel>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getParticipantNum } from '@/api/participant'
import { getEventNum } from '@/api/event'

export default {
  name: 'Home',
  data() {
    return {
      tableQuery: {
        pageNum: 1,
        pageSize: 5,
        username: ''
      },
      userNum: 0,
      eventNum: 0,
      participantNum: 0
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getNum()
    this.getParticipantNum()
    this.getEventNum()
  },
  methods: {
    getNum() {
      this.$store.dispatch('user/page', this.tableQuery).then((res) => {
        this.userNum = res.items.total
      })
    },
    getParticipantNum() {
      getParticipantNum().then((res) => {
        this.participantNum = res.data.num
      })
    },
    getEventNum() {
      getEventNum().then((res) => {
        this.eventNum = res.data.num
      })
    }
  }
}
</script>

<style>
.image {
  height: 100%;
  width: 100%;
}
.box {
  margin-top: 35px;
}
.textHeader {
  font-size: 30px;
  font-weight: bolder;
  text-align: center;
}
.text {
  margin-top: 15px;
  text-align: center;
  font-size: 25px;
}
.el-card__body {
  padding: 0;
}
</style>
