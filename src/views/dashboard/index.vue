<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎您： {{ name }}</div>
    <br>
    <div style="font-size: 25px">嗨嗐嗨！交作业辣！</div>
    <br>
    <div style="font-size: 20px">点击侧边栏中的【提交作业】选项，选择一门课程，即可开始提交您的心血！</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
