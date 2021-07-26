<template>
  <!-- 我的-设置-收货地址-选择国家或地区 -->
  <div class="bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.address.countryTitle')" />

    <van-search
      v-model="searchVal"
      shape="round"
      placeholder="请输入搜索关键词"
      class="plr-20 bg-white ptb-12"
    />

    <van-index-bar :highlight-color="'#42b7ae'" :index-list="indexList" class="page-slider-bar">
      <div v-for="(item, name) in countrylists" :key="name">
        <van-index-anchor :index="name" />
        <van-cell class="plr-20" :title="country" v-for="(country, index) in item" :key="index" />
      </div>
    </van-index-bar>
  </div>
</template>

<script>
import { IndexBar, IndexAnchor, Cell, Search } from 'vant';
import { getPhonePrefix } from '@/api/login';

export default {
  middleware: 'authenticated',
  components: {
    vanIndexBar: IndexBar,
    vanIndexAnchor: IndexAnchor,
    vanCell: Cell,
    vanSearch: Search
  },
  data() {
    return {
      searchVal: '',
      countrylists: {},
      indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  created() {
    this.getLists();
  },
  methods: {
    getLists() { // 获取国家列表
      
      getPhonePrefix().then(res => {
        // 数据格式化
        this.countrylists = {};
        this.indexList.forEach(pref => {
          this.countrylists[pref] = [];
          res.data.forEach(item => {
            const _first = item.country.substring(0, 1).toUpperCase();
            if (_first == pref) {
              this.countrylists[pref].push(item.country);
            }
          })
        })
      })
    }
  },
}
</script>

<style lang="less">
.page-slider-bar .van-index-bar__sidebar{
  padding: 4px;
  border-radius: 9px;
  background-color: #F5F5F5;
  right: 12px;
  .van-index-bar__index{
    padding-left: 0;
    padding-right: 0;
    line-height: 18px;
    color: #999;
  }
}
</style>