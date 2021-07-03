<template>
  <!-- 首页-头部-搜索页面 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('common.search')"></BmHeaderNav>
    <!-- 搜索 -->
    <van-search
      v-model="searchVal"
      shape="round"
      placeholder="请输入搜索关键词"
      class="plr-20 bg-white ptb-12"
    />

    <div class="mlr-20 mt-12">
      <!-- 搜索历史 -->
      <h2 class="fs-14 black flex between vcenter">{{ $t('search.history') }} <i class="iconfont icon-shanchu delete-style" @click="deleteFn"></i></h2>
      <div class="mt-20">
        <span class="plr-10 round-8 mr-12 iblock mb-10 tag-name" v-for="(tag, index) in $t('me.feedback.typeLists')" :key="index">{{ tag }}</span>
      </div>
      <!-- 搜索发现 -->
      <h2 class="fs-14 black">{{ $t('search.found') }}</h2>
      <div class="mt-20">
        <span class="plr-10 round-8 mr-12 iblock mb-10 tag-name" v-for="(tag, index) in $t('me.feedback.typeLists')" :key="index">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Search } from 'vant';

export default {
  components: {
    vanSearch: Search
  },
  data() {
    return {
      searchVal: ''
    }
  },
  methods: {
    deleteFn() { // 删除历史记录
      this.$dialog.confirm({
        message: '确认删除全部历史记录',
      }).then(() => { // 确认删除历史记录

      })
    }
  },
}
</script>

<style lang="less" scoped>
.tag-name{
  line-height: 17px;
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #F8F8F8;
}
.delete-style{
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
}
</style>