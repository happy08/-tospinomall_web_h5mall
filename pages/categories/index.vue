<template>
  <!-- 分类页面 -->
  <div class="categories-page">
    <!-- 搜索栏 -->
    <div class="plr-20 ptb-4 border-b">
      <van-search 
        v-model="searchVal" 
        :placeholder="$t('enter_key_words')"
        shape="round"
        disabled
        class="search-container"
        @click="$router.push({ name: 'search' })"
      >
        <!-- <template #right-icon>
          <div class="search-camera">
            <input class="w-100 h-100 search-camera__ipt" type="file" accept="image/*" capture="camera" />
          </div>
        </template> -->
        <template #left-icon>
          <BmImage 
            :url="require('@/assets/images/icon/search-icon.png')"
            :width="'0.4rem'" 
            :height="'0.4rem'"
            :isShow="false"
            :alt="'Tospino search logo'"
          />
        </template>
      </van-search>
    </div>
    <!-- 侧边栏分类 -->
    <van-tree-select
      :items="catrgoriesList" 
      :main-active-index.sync="treeActive"
      @click-nav="changeNavEvent"
      class="custom-select-tree-container"
    >
      <template #content>
        <div class="product-categories__box" v-for="(item, index) in leftLists" :key="index">
          <h4 class="fw fs-14 black">{{ item.name }}</h4>
          <div class="flex flex-wrap">
            <nuxt-link class="block tc mr-12 mt-20 product-single" v-for="(childrenItem, childrenIndex) in item.children" :key="childrenIndex" :to="{ name: 'search', query: { navCategoryIds: [childrenItem.id] } }">
              <BmImage 
                :url="childrenItem.icon"
                :width="'1.4rem'"
                :height="'1.28rem'"
                :isShow="true"
                :alt="childrenItem.name"
                :fit="'fill'"
              />
              <h5 class="fs-12 mt-8 lh-1 clr-grey" v-html="childrenItem.name"></h5>
            </nuxt-link>
          </div>
        </div>
      </template>
    </van-tree-select>

    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import { TreeSelect, Search } from 'vant';

export default {
  components: {
    vanTreeSelect: TreeSelect,
    vanSearch: Search
  },
  data() {
    return {
      searchVal: '',
      items: [],
      treeActive: 0,
      catrgoriesList: [],
      list: [],
      leftLists: [],
      meta: {}
    }
  },
  head() { // 头部设置，方便seo
    return {
      title: this.meta.title || 'Tospino Ghana online shopping',
      meta: [
        { hid: 'description', name: 'description', content: this.meta.description || 'Tospino Ghana online shopping' },
        { hid: 'keywords', name: 'keywords', content: this.meta.keyword || 'Tospino Ghana online shopping' },
        { hid: 'og:title', property: 'og:title', content: this.meta.title || 'Tospino Ghana online shopping' },
        { hid: 'og:description', property: 'og:description', content: this.meta.description || 'Tospino Ghana online shopping' }
      ]
    }
  },
  async fetch() {
    const [listData, metaData] = await Promise.all([
      this.$api.getCategoryList(), // 分类列表
      this.$api.getCategorySeo() // 获取SEO信息
    ])
    let _all_categories = [];
    listData.data.forEach(item => {
      _all_categories.push(item.name);
      if (item.children) {
        item.children.forEach(childrenItem => {
          _all_categories.push(childrenItem.name);
          if (childrenItem.children) {
            childrenItem.children.forEach(threeChildrenItem => {
              _all_categories.push(threeChildrenItem.name);
            })
          }
        })
      }
    }); // 所有分类名为了seo优化
    this.catrgoriesList = listData.data.map(item => {
      return {
        text: item.name,
        id: item.id,
        children: item.children
      }
    })
    this.list = listData.data;
    this.leftLists = this.catrgoriesList[0].children;

    this.meta = {
      title: metaData.data.title.replace('{categoryName}', _all_categories.join(',')),
      description: metaData.data.description.replace('{categoryName}', _all_categories.join(',')),
      keyword: metaData.data.keyword.replace('{categoryName}', _all_categories.join(','))
    };
  },
  methods: {
    changeNavEvent(currentIndex) { // 点击左侧切换tab栏
      this.leftLists = this.catrgoriesList[currentIndex].children
    }
  },
}
</script>

<style lang="less" scoped>
.product-single{
  width: 70px;
  font-size: 0;
  word-break: break-all;
  &:nth-child(3n+3){
    margin-right: 0!important;
  }
}
.product-categories__box{
  // padding: 15px 12px;
  margin-top: 40px;
  &:first-child{
    margin-top: 0;
  }
  &:last-child{
    padding-bottom: 60px;
  }
}
.clr-grey{
  color: #666;
}
</style>

<style lang="less">
.categories-page{
  // padding-bottom: 50px;
  .search-camera{
    width: 16px;
    height: 14px;
    background-image: url('../../assets/images/scan-icon.png');
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    margin-right: 12px;
    .search-camera__ipt{
      opacity: 0;
    }
  }
  .van-tree-select__nav{
    flex: inherit;
    width: 100px;
    background-color: #F8F8F8;
    &::-webkit-scrollbar{
      display: none;
    }
    .van-sidebar-item--select::before{
      background: linear-gradient(14deg, #70CEB6 0%, #3EB5AE 100%);
    }
    .van-tree-select__nav-item{
      // margin-top: 1px;
      color: #383838;
      text-align: center;
      border-top: 1px solid #fff;
      &:first-child{
        // margin-top: 0;
        border-top: none;
      }
    }
  }
  .van-tree-select__content{
    padding-top: 20px;
    padding-left: 22px;
  }
  .search-container{
    height: 34px!important;
    .van-search__content{
      height: 34px!important;
      padding-left: 10px!important;
    }
    .van-field__left-icon{
      height: 20px!important;
    }
    .van-cell {
      // padding: 0 !important;
      align-items: center;
      height: 100%!important;
    }
  }
  .custom-select-tree-container{
    height: calc(100vh - 34px - 58px)!important;
  }
}
</style>