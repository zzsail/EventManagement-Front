<template>
  <div v-infinite-scroll="load" class="mainContainer" infinite-scroll-distance="1" style="overflow:auto; height: 700px;">
    <el-card v-for="i in count" :key="i" shadow="hover" class="card" :cover="true">
      <!-- <div class="overlay" @mouseover="showOverlay(i)" @mouseout="hideOverlay(i)" v-show="showOverlayIndex === i"></div> -->
      <el-image class="img" :src="require('../../assets/test.jpg')" />
      <div class="textContainer">你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予「神之眼」，导引元素之力。你将扮演一位名为「旅行者」的神秘角色，在自由的旅行中邂逅性格各异、能力独特的同伴们，和他们一起击败强敌，找回失散的亲人——同时，逐步发掘「原神」的真相。</div>
      <div class="eventNameContainer">第{{ i }}届原神电子信息大赛</div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      count: 8,
      temp: {
        eventId: '',
        eventName: '',
        eventDate: '',
        eventLocation: '',
        eventDescription: '',
        eventImg: '',
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
      this.count += 4
    }
  }
}
</script>

<style>
/* body::-webkit-scrollbar{
        display: none;
    } */
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
