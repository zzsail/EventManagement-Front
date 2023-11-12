<template>
  <div v-infinite-scroll="load" class="mainContainer" infinite-scroll-distance="1" style="overflow:auto; height: 700px;">
    <el-card v-for="(event, index) in infoData" :key="index" shadow="hover" class="card" :cover="true">
      <el-image class="img" :src="require('../../assets/' + event.eventImage)" />
      <div class="textContainer">{{ event.eventDescription }}</div>
      <div class="eventNameContainer">{{ event.eventName }}</div>
    </el-card>
  </div>
</template>

<script>
import { load } from '@/api/event'

export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 4,
      infoData: [],
      loading: false,
      hasMoreData: true,
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
      showOverlayIndex: null
    }
  },
  methods: {
    load() {
      if (this.loading || !this.hasMoreData) return // 正在加载或者没有更多数据
      this.loading = true
      load(this.pageNum, this.pageSize).then((response) => {
        const newData = response.data.list.records
        if (newData.length > 0) {
          this.pageNum += 1
          console.log(this.pageNum)
          this.infoData = this.infoData.concat(newData)
        } else {
          this.hasMoreData = false
        }
        this.loading = false // 加载完成
      })
    }
  }
}
</script>

<style>
.mainContainer {
  margin: 10px 0 10px 10px;
  width: 98%;
  display: flex;
  flex-wrap: wrap;
  gap: 1%;
}
.card {
  width: 24%; /* 或者使用 calc(25% - 1%) 以便考虑间隔 */
  margin-bottom: 1%;
  /* overflow: auto; */
}
.card:hover {
  cursor: pointer;
  margin-top: -5px
}
.img {
  width: 100%;
}
.textContainer {
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
.el-card__header {
  padding: 0;
}
.el-card__body {
 padding: 0;
}
</style>
