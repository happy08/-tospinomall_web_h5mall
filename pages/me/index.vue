<template>
  <!-- 我的页面 -->
  <div class="bg-grey user-page">
    <!-- 账户信息展示 -->
    <div class="bg-white plr-12 account-top">
      <div class="flex between vcenter">
        <!-- 头像信息 -->
        <div class="flex between vcenter">
          <!-- 头像 -->
          <BmImage 
            :url="require('@/assets/images/icon/user-icon.png')"
            :width="'1.04rem'" 
            :height="'1.04rem'"
            :isLazy="false"
            :isShow="false"
            @click="goAccount"
          ></BmImage>
          <!-- 姓名、id -->
          <dl class="ml-10" v-if="$store.state.user.token" @click="goAccount">
            <dt class="fs-18 green fw">Nadia Spinka</dt>
            <dd class="fs-12 grey mt-8">78****59</dd>
          </dl>
          <div v-else class="ml-10 fs-16" @click="goLogin">请先登录</div>
        </div>
        <BmImage
          :url="require('@/assets/images/message-icon.png')"
          :width="'.64rem'" 
          :height="'.64rem'"
          :isLazy="false"
          :isShow="false"
        ></BmImage>
      </div>

      <!-- 收藏信息 -->
      <div class="p-30 flex between">
        <nuxt-link :to="{ name: 'me-likes' }" tag="dl" class="tc">
          <dt class="fs-24 black fw">12</dt>
          <dd class="fs-12 grey mt-4">Collection</dd>
        </nuxt-link>
        <nuxt-link :to="{ name: 'me-wallet' }" tag="dl" class="tc">
          <dt class="fs-24 black fw">35</dt>
          <dd class="fs-12 grey mt-4">Wallet</dd>
        </nuxt-link>
        <!-- <dl class="tc">
          <van-badge dot color="linear-gradient(339deg, #FF4943 0%, #FA5E69 100%)">
            <dt class="fs-24 black fw">35</dt>
          </van-badge>
          <dd class="fs-12 grey mt-4">Coupon</dd>
        </dl> -->
      </div>
    </div>

    <!-- 我的订单 -->
    <div class="bg-white mlr-12 round-8 plr-12 pb-20 user-page__order">
      <van-cell class="ptb-12 plr-0" :border="false" title="My Order" is-link value="View All" value-class="green" title-class="black" :to="$store.state.user.token ? { name: 'me-order' } : { name: 'login' }" />
      <div class="flex between tc">
        <nuxt-link v-for="(orderItem, orderIndex) in orderList" :key="'oder-' + orderIndex" :to="$store.state.user.token ? { name: orderItem.name, query: { type: orderItem.type } } : { name: 'login' }" >
          <BmImage 
            :url="require('@/assets/images/icon/' + orderItem.icon + '.png')"
            :width="'0.8rem'" 
            :height="'0.8rem'"
            :isLazy="false"
            :isShow="false"
          ></BmImage>
          <p>{{ orderItem.text }}</p>
        </nuxt-link>
      </div>
    </div>
    <div class="clearfix"></div>
    <!-- 其他设置项 -->
    <div class="round-8 bg-white mlr-12 mt-12 hidden user-page__other">
      <van-cell class="ptb-14 plr-12" :title="otherItem.text" v-for="(otherItem, otherIndex) in otherList" :key="'other-list-' + otherIndex" :to="($store.state.user.token || otherItem.name === 'me-about') ? { name: otherItem.name, query: otherItem.query } : { name: 'login' }">
        <template #icon>
          <BmImage 
            :url="require('@/assets/images/icon/user-other-' + otherIndex + '.png')"
            :width="'0.48rem'" 
            :height="'0.48rem'"
            :isLazy="false"
            :isShow="false"
            class="mr-12"
          ></BmImage>
        </template>
      </van-cell>
    </div>
    
    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import { Badge, Cell, CellGroup } from 'vant';

export default {
  components: {
    vanBadge: Badge,
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
  data() {
    return {
      orderList: [ // 订单展示项
        {
          icon: 'to-pay-icon',
          text: 'To Pay', // 待付款
          name: 'me-order',
          type: 1
        },
        {
          icon: 'to-ship-icon',
          text: 'To Ship', // 待发货
          name: 'me-order',
          type: 2
        },
        {
          icon: 'to-receive-icon',
          text: 'To Receive', // 待收货
          name: 'me-order',
          type: 2
        },
        {
          icon: 'to-rate-icon',
          text: 'To Rate', // 待评价
          name: 'me-order-rate'
        },
        {
          icon: 'to-refund-icon',
          text: 'To Refund', // 退款
          name: 'me-aftersale'
        }
      ],
      otherList: [ // 其他设置列表
        {
          text: 'My Likes', // 我关注的
          name: 'me-likes'
        },
        {
          text: 'Recently Viewed', // 最近浏览
          name: 'me-footprint'
        },
        {
          text: 'My wallet', // 钱包
          name: 'me-wallet'
        },
        {
          text: 'Address Management',
          name: 'me-setting-address'
        },
        {
          text: 'My Shop',
          name: 'me-likes',
          query: {
            active: 1
          }
        },
        {
          text: 'Settings',
          name: 'me-setting-account'
        },
        {
          text: 'Feedback',
          name: 'me-feedback'
        },
        {
          text: 'About Tospino',
          name: 'me-about'
        }
      ]
    }
  },
  methods: {
    goLogin() { // 跳转到登录页面
      this.$router.push({
        name: 'login'
      })
    },
    goAccount() { // 去账户设置页面, 登录之后才可以跳转
      if (this.$store.state.user.token) {
        this.$router.push({
          name: 'me-setting-account'
        })
      }
    }
  },
}
</script>

<style lang="less" scoped>
.user-page{
  min-height: 100vh;
  padding-bottom: 70px;
  font-family: 'Helvetica';
}
.account-top{
  padding-bottom: 46px;
}
.user-page__order{
  margin-top: -24px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.09);
}
.user-page__other{
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.09);
}
</style>