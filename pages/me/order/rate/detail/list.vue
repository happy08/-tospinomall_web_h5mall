<template>
  <!-- 我的-订单-评价-评价列表/商品-商品详情-评价列表 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.rate.review')" />
    <!-- 评价列表分类 -->
    <div class="plr-20 pt-20 bg-white">
      <div class="flex between vcenter">
        <!-- 是否只看当前商品的评价 -->
        <van-checkbox class="flex" @click="isCurrent = !isCurrent">
          <template #icon>
            <BmImage
              :url="isCurrent ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
              :width="'0.34rem'" 
              :height="'0.34rem'"
              :isLazy="false"
              :isShow="false"
            ></BmImage>
          </template>
          <span class="ml-12 fs-14 lh-20 black">Current commodity</span>
        </van-checkbox>
        <div class="fs-14 lh-20 light-grey">Rating of 94%</div>
      </div>

      <!-- 标签 -->
      <div class="mt-20 flex flex-wrap between">
        <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">Soft and comfortable 290</span>
        <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">New fashion</span>
        <span class="ptb-4 plr-12 round-8 border fs-14 lh-20 color-666 mb-10">Size of the appropriate 20</span>
      </div>

      <!-- 评价分类 -->
      <van-tabs sticky swipeable animated :offset-top="44" color="#42B7AE" class="customs-van-tabs" :ellipsis="false" @change="getList" v-model="tabActive">
        <van-tab v-for="(categoryItem, tabIndex) in $t('me.report.categoryList')" :title="categoryItem" :key="'scroll-tab-' + tabIndex" title-class="pb-0" :name="tabIndex">
        </van-tab>
      </van-tabs>
    </div>

    <!-- 评价详情 -->
    <div class="mt-12 plr-20 pt-14 bg-white pb-20">
      <!-- 用户头像、昵称、日期 -->
      <div class="flex between vcenter">
        <div class="flex vcenter">
          <div>
            <BmImage
              :url="require('@/assets/images/product-bgd-90.png')"
              :width="'0.64rem'" 
              :height="'0.64rem'"
              :isLazy="false"
              :isShow="false"
              :fit="'cover'"
              :round="true"
            ></BmImage>
          </div>
          <p class="ml-14 fs-14 black fw">Ave</p>          
        </div>
        <div class="light-grey fs-14">March 6 2020</div>
      </div>
      <!-- 评分 -->
      <div class="mt-14 flex vcenter">
        <van-rate v-model="rate" allow-half size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        <div class="grey ml-12">Black / L</div>
      </div>
      <!-- 描述 -->
      <p class="black fs-14 mt-10">A great one, with coupons; Small and delicate appearance, preheat for 30 seconds before starting up, uniform air output, space saving, suitable for small family</p>
      <!-- 展示图片 -->
      <div class="mt-20 flex between flex-wrap">
        <BmImage
          :url="require('@/assets/images/product-bgd-90.png')"
          :width="'2.12rem'" 
          :height="'2.12rem'"
          :isLazy="false"
          :isShow="false"
          :fit="'cover'"
          v-for="item in 3"
          :key="item"
        ></BmImage>
      </div>
      <!-- report按钮 -->
      <BmButton :type="'info'" class="h-30 round-8 black time-out mt-12 fr" @click="onReport">{{ $t('me.report.report') }}</BmButton>
      <div class="clear"></div>

      <!--  -->
      <van-cell-group class="mt-12" :border="false">
        <!-- 包装 -->
        <van-cell class="plr-0 ptb-20" :title="$t('me.report.reviewAfterPurchase')" title-class="fw black fs-14" label-class="fs-14 color-666" label="The quality is very good. Mom likes it very much" />
        <!-- 发货速度 -->
        <van-cell class="plr-0 ptb-20" title-class="fs-14">
          <template #title>
            <span class="red">Official customer service: </span>
            <span class="color-666">Thank you for your sup-port of our products</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

  </div>
</template>

<script>
import { Checkbox, Cell, Tab, Tabs, Rate, CellGroup } from 'vant';

export default {
  components: {
    vanCheckbox: Checkbox,
    vanCell: Cell,
    vanTab: Tab,
    vanTabs: Tabs,
    vanRate: Rate,
    vanCellGroup: CellGroup
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      isCurrent: false,
      rate: 2.5
    }
  },
  methods: {
    getList() { // 获取数据

    },
    onReport() { // 举报
      this.$router.push({
        name: 'me-order-rate-report-id',
        params: {
          id: 0
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.color-666{
  color: #666;
}
.h-30{
  height: 30px!important;
}
.time-out{
  border-color: #eee!important;
  background-color: transparent!important;
}
</style>