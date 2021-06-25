<template>
  <div class="categories-page">
    <!-- 搜索栏 -->
    <div class="mlr-20 mt-5 mb-5">
      <van-search 
        v-model="searchVal" 
        placeholder="Enter key words"
        shape="round"
      >
        <template #right-icon>
          <div class="search-camera">
            <input class="w-100 h-100 search-camera__ipt" type="file" accept="image/*" capture="camera" />
          </div>
        </template>
      </van-search>
    </div>
    <!-- 侧边栏分类 -->
    <van-tree-select
      :items="items" 
      :main-active-index.sync="treeActive"
      @click-nav="changeNavEvent"
      height="90vh"
    >
      <template #content>
        <div class="product-categories__box">
          <h4 class="fw fs-10 product-categories__box--title">Vacuum cup</h4>
          <div class="flex product-categories__box--caontainer">
            <div @click="clickItemEvent" class="tc product-single" v-for="index in 7" :key="index">
              <img class="w-100 product-single__icon" src="https://img01.yzcdn.cn/vant/apple-1.jpg" />
              <h5 class="fs-12 product-single__name">Vacuum cup</h5>
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
      treeActive: 0
    }
  },
  methods: {
    changeNavEvent(currentIndex) { // 点击左侧切换tab栏
      console.log(currentIndex);
    },
    clickItemEvent(data) { // 点击右侧选项触发
      console.log(data);
    }
  },
}
</script>

<style lang="less" scoped>
.product-single{
  width: 70px;
  margin-top: 15px;
  .product-single__icon{
    height: 64px;
    object-fit: cover;
  }
  .product-single__name{
    margin-top: 8px;
    color: rgba(0, 0, 0, .65);
    line-height: 12px;
  }
}
.product-categories__box{
  padding: 15px 12px;
  margin-top: 10px;
  &:first-child{
    margin-top: 0;
  }
  .product-categories__box--title{
    line-height: 10px;
  }
  .product-categories__box--caontainer{
    flex-wrap: wrap;
    justify-content: space-between;
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
    width: 100px;
    .van-sidebar-item--select::before{
      background: linear-gradient(14deg, #70CEB6 0%, #3EB5AE 100%);
    }
  }
  .van-tree-select__content{
    padding: 10px;
  }
}
</style>