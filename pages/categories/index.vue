<template>
  <!-- 分类页面 -->
  <div class="categories-page">
    <!-- 搜索栏 -->
    <div class="mlr-12 mt-4 mb-4" @click="$router.push({ name: 'search' })">
      <van-search 
        v-model="searchVal" 
        :placeholder="$t('enter_key_words')"
        shape="round"
        disabled
      >
        <!-- <template #right-icon>
          <div class="search-camera">
            <input class="w-100 h-100 search-camera__ipt" type="file" accept="image/*" capture="camera" />
          </div>
        </template> -->
      </van-search>
    </div>
    <!-- 侧边栏分类 -->
    <van-tree-select
      :items="catrgorieList" 
      :main-active-index.sync="treeActive"
      @click-nav="changeNavEvent"
      height="90vh"
    >
      <template #content>
        <div class="product-categories__box" v-for="(item, index) in leftLists" :key="index">
          <h4 class="fw fs-10 product-categories__box--title">{{ item.name }}</h4>
          <div class="flex flex-wrap product-categories__box--caontainer">
            <div @click="clickItemEvent(childrenItem)" class="tc mr-12 product-single" v-for="(childrenItem, childrenIndex) in item.children" :key="childrenIndex">
              <BmImage 
                :url="childrenItem.icon"
                :width="'1.4rem'"
                :height="'1.28rem'"
                :isShow="true"
              />
              <h5 class="fs-12 mt-8 product-single__name" v-html="childrenItem.name"></h5>
            </div>
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
      items: [
        {
          // 导航名称
          text: 'Furniture Mall',
          // 导航名称右上角徽标，2.5.6 版本开始支持
          badge: 3,
          // 是否在导航名称右上角显示小红点
          dot: true,
          // 导航节点额外类名
          className: 'my-class',
          // 该导航下所有的可选项
          children: [
            {
              // 名称
              text: '温州',
              // id，作为匹配选中状态的标识符
              id: 1,
              // 禁用选项
              disabled: true,
            },
            {
              text: '杭州',
              id: 2,
            },
          ],
        },
        {
          // 导航名称
          text: '所有城市',
          // 导航名称右上角徽标，2.5.6 版本开始支持
          badge: 3,
          // 是否在导航名称右上角显示小红点
          dot: true,
          // 导航节点额外类名
          className: 'my-class',
          // 该导航下所有的可选项
          children: [
            {
              // 名称
              text: '温州',
              // id，作为匹配选中状态的标识符
              id: 1,
              // 禁用选项
              disabled: true,
            },
            {
              text: '杭州',
              id: 2,
            },
          ],
        },
        {
          // 导航名称
          text: '所有城市',
          // 导航名称右上角徽标，2.5.6 版本开始支持
          badge: 3,
          // 是否在导航名称右上角显示小红点
          dot: true,
          // 导航节点额外类名
          className: 'my-class',
          // 该导航下所有的可选项
          children: [
            {
              // 名称
              text: '温州',
              // id，作为匹配选中状态的标识符
              id: 1,
              // 禁用选项
              disabled: true,
            },
            {
              text: '杭州',
              id: 2,
            },
          ],
        },
      ],
      treeActive: 0,
      catrgorieList: [],
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
        { hid: 'keywords', name: 'keywords', content: this.meta.keyword || 'Tospino Ghana online shopping' }
      ]
    }
  },
  async fetch() {
    const [listData, meta] = await Promise.all([
      this.$api.getCategoryList(), // 分类列表
      this.$api.getCategorySeo() // 获取SEO信息
    ])
    this.catrgorieList = listData.data.map(item => {
      return {
        text: item.name,
        id: item.id,
        children: item.children
      }
    })
    this.list = listData.data;
    this.leftLists = this.catrgorieList[0].children;
    this.meta = meta.data;
  },
  methods: {
    changeNavEvent(currentIndex) { // 点击左侧切换tab栏
      this.leftLists = this.catrgorieList[currentIndex].children
    },
    clickItemEvent(data) { // 点击分类跳转到搜索列表页面
      this.$router.push({
        name: 'search',
        query: {
          categoryIds: [data.id],
          val: data.name
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.product-single{
  width: 70px;
  &:nth-child(3n+3){
    margin-right: 0!important;
  }
  .product-single__name{
    color: rgba(0, 0, 0, .65);
    line-height: 12px;
  }
}
.product-categories__box{
  // padding: 15px 12px;
  margin-top: 40px;
  &:first-child{
    margin-top: 0;
  }
  .product-categories__box--title{
    line-height: 10px;
  }
  .product-categories__box--caontainer{
    margin-top: 18px;
  }
}
</style>

<style lang="less">
.categories-page{
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
    width: 94px;
    .van-sidebar-item--select::before{
      background: linear-gradient(14deg, #70CEB6 0%, #3EB5AE 100%);
    }
  }
  .van-tree-select__content{
    padding-top: 24px;
    padding-left: 24px;
  }
}
</style>