<template>
  <van-pull-refresh v-model="refreshing.isFresh" @refresh="onRefresh">
    <!-- 下拉提示 -->
    <template #pulling>
      <van-loading color="#42b7ae" />
    </template>
    <!-- 加载提示 -->
    <template #loading>
      <van-loading color="#42b7ae" />
    </template>
    <!-- 加载提示 -->
    <template #loosing>
      <van-loading color="#42b7ae" />
    </template>
    <slot />
  </van-pull-refresh>
</template>

<script>
import { Loading, PullRefresh } from 'vant';

export default {
  props: {
    refreshing: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      refresh: this.refreshing
    }
  },
  activated() {
  },
  components: {
    vanLoading: Loading,
    vanPullRefresh: PullRefresh
  },
  methods: {
    onRefresh() {
      this.$emit('refresh');
    }
  },
}
</script>