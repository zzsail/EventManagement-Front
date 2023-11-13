<template>
  <div>
    <div class="fullscreen-overlay">
      <div class="detailContainer">
        <el-row style="height: 100%;">
          <!-- 图像 -->
          <el-col :span="14" style="height: 100%; width: 58%; border-right: 2px solid rgb(235, 235, 235);">
            <el-image class="img" :src="require('../../assets/' + temp.eventImage)" fit="cover" />
          </el-col>
          <!-- 信息页面 -->
          <el-col :span="10">
            <div style="height: 185px;   border-bottom: 2px solid rgb(235, 235, 235);">
              <!-- 比赛名称 比赛评分 参赛按钮 -->
              <el-row class="header">
                <el-col span="12"><div class="eventName">{{ temp.eventName }}</div></el-col>
                <el-col span="6"><el-rate v-model="temp.ratingValue" class="eventRate" /></el-col>
                <el-col :span="6"><el-button type="primary" style="float: right; margin-top: 5px; margin-right: 5px;">我要报名</el-button></el-col>
              </el-row>
              <!-- 比赛介绍 -->
              <div class="eventDescription">{{ temp.eventDescription }}</div>
              <el-row class="eventDate">
                <!-- 比赛日期和地点 -->
                <el-col span="12">比赛日期：{{ temp.eventDate }}</el-col>
                <el-col :span="12">比赛地点：{{ temp.eventLocation }}</el-col>
              </el-row>
            </div>
            <!-- 评论总数 -->
            <div class="commentTotal"> 共 100 条评论</div>
            <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" style="overflow-y: auto; height: 398px;">
              <el-row v-for="i in count" :key="i" class="comments">
                <el-col :span="12"><div class="commentTitle">用户1213{{ i }}</div></el-col>
                <el-col :span="12"><div style="float: right; color: rgb(121, 121, 121);">2023/11/10</div></el-col>
                <el-col :span="24" class="comment">这是评论区这是评论区这是评论区这是评论区这是评论区这是评论区这是评论区</el-col>
              </el-row>
            </div>

          </el-col>
        </el-row>
      </div>
      <router-link to="/event/info">
        <el-button type="text" style="float: right; margin-right: 50px;">
          <svg-icon icon-class="关闭2" class-name="icon-large" />
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { infoById } from '@/api/event'
export default {
  data() {
    return {
      count: 10,
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
      }
    }
  },
  mounted() {
    // 从路由参数中获取赛事ID
    console.log(this.$route.params)
    const eventId = this.$route.params.id
    console.log(eventId)
    infoById(eventId).then((response) => {
      this.temp = response.data.info
      console.log(this.temp)
    })
  }
}
</script>

<style scoped>
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999; /* Ensure it's above other elements */
}
.detailContainer {
  position: absolute;
  left: 7.5%;
  top: 10%;
  border-radius: 0.8rem;
  width: 85%;
  height: 76%;
  margin-top: 5px;
  box-shadow: -16px 28px 28px -3px rgba(0, 0, 0, 0.1), 0px 10px 61px -8px rgba(0, 0, 0, 0.1);
}
.img {
  border-radius: 0.8rem;
  height: 100%;
  width: 100%;
}
.eventName {
  margin: 10px 0 0 16px;
  font-size: 19px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体粗细 */
  color: #333; /* 设置字体颜色 */
  text-indent: 1em;

}
.eventDescription {
  text-indent: 2em;
  line-height: 1.5;
  margin: 10px 10px 10px 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: auto;
  -webkit-line-clamp: 4; /* 指定显示的行数 */

}
.eventDate {
  text-indent: 2em;
  margin: 10px 10px 10px 10px;
  line-height: 1.5;
}
.eventRate {
  margin-top: 13px;
}
.commentTotal {
  text-indent: 2em;
  margin: 10px 10px 15px 10px;
  font-size: 15px; /* 设置字体大小 */
  color: rgb(200, 200, 200);
}
.comments {
  color: rgb(121, 121, 121);
  text-indent: 2em;
  margin: 10px 10px 10px 10px;
}
.comment {
  margin-top: 10px;
  text-indent: 4em;
  color: black;
}
.icon-large {
  width: 50px;
  height: 50px;
}
</style>
