<template>
  <div >
    <el-row v-infinite-scroll="load" style="overflow-y:  auto;height: 900px;">
      <el-col :span="6" v-for="i in count" :key="i">
        <el-card shadow="hover" class="card">
          <el-image style="width: 320px;height: 250px;" :src="require('../../assets/test.jpg')" />
          <div class="textContainer">你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予「神之眼」，导引元素之力。你将扮演一位名为「旅行者」的神秘角色，在自由的旅行中邂逅性格各异、能力独特的同伴们，和他们一起击败强敌，找回失散的亲人——同时，逐步发掘「原神」的真相。</div>
          <div class="eventNameContainer">第一届原神电子信息大赛</div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <el-row v-for="i in count" :key="i" :gutter="10" style="margin: 10px 0 10px 10px">
      <el-col :span="6">
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="card"></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="card"></el-card>
      </el-col>
      <el-col :span="6"><el-card shadow="hover" class="card"></el-card></el-col>
    </el-row> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 4,
      temp: {
        eventId: '',
        eventName: '',
        eventDate: '',
        eventLocation: '',
        eventDescription: '',
        categoryName: '',
        ratingValue: '', // 评分
        participantNum: '', // 参赛人数
        status: ''
      }
    }
  },
  methods: {
    load() {
      this.count += 4
    }
  }
}
</script>

<style>
.textContainer {
  margin-left: 5px;
  font-size: 15px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.eventNameContainer {
  margin-left: 5px;
  margin-bottom: 0px;
  color: #92939c;
  font-size: 20px;
  font-weight: bolder;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card {
  margin: 5px 0 10px 10px;
  height: 300px;
  width: 320px
}
.el-card__header {
  padding: 0;
}
.el-card__body {
 padding: 0;
}
</style>
