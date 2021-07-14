<template>
  <!-- 空状态页面 -->
  <van-empty :description="description" class="w-100" :image="image">
    <BmButton :type="'info'" v-if="btn.btn" @click="btnClick">{{ btn.btn }}</BmButton>
  </van-empty>
</template>

<script>
import { Empty } from 'vant';

export default {
  name: 'Empty',
  components: {
    vanEmpty: Empty
  },
  props: {
    image: {
      type: String,
      default: 'default'
    },
    description: { // 提示文案
      type: String,
      default: ''
    },
    btn: {
      type: Object,
      default: function () {
        return {
          btn: '',
          isEmit: false
        }
      }
    },
  },
  methods: {
    btnClick() {
      if(this.btn.isEmit){
        this.$emit('btnClick');
      }
    }
  },
}
</script>

<style lang="less" scoped>
.empty-single__tip{
  color: #BFBFBF;
  line-height: 18px;
}
</style>