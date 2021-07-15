<template>
  <!-- 首页-头部-搜索页面 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('common.search')" />
    <!-- 搜索 -->
    <van-search
      v-model="searchVal"
      shape="round"
      placeholder="请输入搜索关键词"
      class="plr-20 bg-white ptb-12"
      @input="inputChange"
    />

    <div class="mlr-20 mt-12" v-show="isShowTip">
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

    <!-- 分类 -->
    <div class="flex between vcenter plr-20 bg-white">
      <van-tabs sticky swipeable animated :offset-top="104" color="#42B7AE"  @change="getSearchList" class="customs-van-tabs" v-model="typeActive" line-height="0" :ellipsis="false">
        <van-tab v-for="(productItem, tabIndex) in tabs" :title="productItem.name" :key="'scroll-tab-' + tabIndex" title-class="p-0 pr-60" :name="productItem.type">
          <template #title="props" v-if="productItem.type === 0">
            {{ props }}
            <van-dropdown-menu active-color="#42B7AE" class="custom-dropdown-menu">
              <van-dropdown-item v-model="dropdownVal" :options="dropdownOption" />
            </van-dropdown-menu>
          </template>
        </van-tab>
      </van-tabs>

      <!-- 展示一列或者两列 -->
      <van-icon :name="require('@/assets/images/icon/arrange-'+arrangeType+'.svg')" size="0.38rem" @click="changeArrange" />
    </div>

    <div class="plr-12 w-100">
      <!-- 空状态  -->
      <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('common.noRecord')"/>
      <div 
        :class="{'flex between flex-wrap': arrangeType === 2}"
        v-else>
          <div 
            v-for="(searchItem, searchIndex) in list" 
            :key="'search-list-' + searchIndex"
            >
            <!-- 商品展示两列 -->
            <ProductTopBtmSingle
              :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
              :detail="{ desc: 'mlr-12mt-12flexbetweenflex-wrap', price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2 }"
              class="bg-white round-4 hidden mt-12"
              v-if="arrangeType === 2"
            ></ProductTopBtmSingle>
            <!-- 商品展示一列 -->
            <div v-if="arrangeType === 1" :class="{'flex vcenter pt-20 pb-30 hidden bg-white': true, 'border-229': searchIndex !== list.length - 1} ">
              <div>
                <BmImage 
                  :url="require('@/assets/images/product-bgd-90.png')"
                  :width="'1.8rem'" 
                  :height="'1.8rem'"
                ></BmImage>
              </div>
              <div class="ml-14 w-230">
                <p class="fs-14 black hidden-1">A portable coffee  cup, a tiny peo…A portable coffee  cup, a tiny peo…</p>
                <p class="mt-8 fs-14 light-grey">Ships from China </p>
                <div class="mt-16 flex vcenter between">
                  <div>
                    <span class="red fs-18">{{ $store.state.rate.currency }}1192.00</span>
                    <span class="fs-10 line-through bg-grey ml-8">{{ $store.state.rate.currency }}450</span>
                  </div>
                  <div class="fs-14 black">35+Sold</div>
                </div>
              </div>
            </div>
          </div>
      </div>

    </div>
    
  </div>
</template>

<script>
import { Search, Tab, Tabs, DropdownItem, DropdownMenu } from 'vant';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';

export default {
  components: {
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs,
    vanDropdownItem: DropdownItem,
    vanDropdownMenu: DropdownMenu,
    EmptyStatus,
    ProductTopBtmSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let searchVal = route.query.categoryName || '';
    let isShowTip = searchVal.length > 0 ? false : true;

    return {
      searchVal: searchVal,
      isShowTip: isShowTip,
      list: []
    }
  },
  data() {
    return {
      arrangeType: 1,
      tabs: [
        {
          name: '综合排序',
          type: 0
        },
        {
          name: '销量',
          type: 1
        },
        {
          name: '筛选',
          type: 2
        }
      ],
      typeActive: 0,
      dropdownOption: [
        { text: '综合排序', value: 0 },
        { text: '价格升序', value: 1 },
        { text: '价格降序', value: 2 }
      ],
      dropdownVal: 1
    }
  },
  methods: {
    deleteFn() { // 删除历史记录
      this.$dialog.confirm({
        message: '确认删除全部历史记录',
      }).then(() => { // 确认删除历史记录

      })
    },
    inputChange(val) { // 输入框内容变化时触发的事件
      this.isShowTip = val.length === 0;
    },
    changeArrange() { // 切换展示样式 1列 2列
      this.arrangeType = this.arrangeType === 1 ? 2 : 1;
    },
    getSearchList() { // 获取分类列表

    },
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
<style lang="less">
.pr-60{
  padding-right: 60px!important;
}
</style>