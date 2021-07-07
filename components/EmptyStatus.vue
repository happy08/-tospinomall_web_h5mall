<template>
  <!-- 空状态页面 -->
  <van-empty :description="description" class="w-100" :image="image">
    <BmButton :type="'info'" v-if="btn">{{ btn }}</BmButton>
  </van-empty>
  <!-- <div class="center w-100 flex column hstart" :style="'height:' + empty.height">
    <van-image
      width="3rem"
      height="3rem"
      :src="require('@/assets/images/empty/' + status + '.png')"
    />
    <p v-if="empty.tip" class="fs-14 empty-single__tip">{{ empty.tip }}</p>
    <BmButton class="mt-12" :type="'info'" v-if="empty.btnEvent">shop now</BmButton>
  </div> -->
</template>

<script>
import { Empty } from 'vant';

export default {
  name: 'Empty',
  components: {
    vanEmpty: Empty
  },
  props: {
    // status: {
    //   type: String,
    //   default: 'order'
    // },
    image: {
      type: String,
      default: 'default'
    },
    description: { // 提示文案
      type: String,
      default: ''
    },
    btn: {
      type: String,
      default: ''
    },
    // empty: {
    //   type: Object,
    //   default: function () {
    //     return {
    //       tip: null, // 提示语
    //       btnEvent: false, // 是否有按钮
    //       height: '70vh'
    //     }
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.empty-single__tip{
  color: #BFBFBF;
  line-height: 18px;
}
</style>