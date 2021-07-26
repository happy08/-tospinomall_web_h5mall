<template>
  <!-- 我的-设置-收货地址-选择电话区号 -->
  <div class="bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.address.areacodeTitle')" />

    <van-index-bar :highlight-color="'#42b7ae'" :index-list="indexList" class="page-slider-bar">
      <div v-for="(item, name) in countrylists" :key="name">
        <van-index-anchor :index="name" />
        <van-cell class="plr-20" :title="country.country" v-for="(country, index) in item" :key="index" @click="goBack(country.phonePrefix)" />
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
              this.countrylists[pref].push({
                country: item.country + item.phonePrefix,
                phonePrefix: item.phonePrefix
              });
            }
          })
        })
      })
    },
    goBack(phonePrefix) {
      this.$router.push({
        name: 'me-address-make',
        query: {
          phonePrefix: phonePrefix
        }
      });
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