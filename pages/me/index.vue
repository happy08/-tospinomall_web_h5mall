<template>
  <!-- 我的页面 -->
  <div class="bg-grey user-page">
    <!-- 账户信息展示 -->
    <div class="bg-white plr-12 account-top">
      <div class="flex between vcenter">
        <!-- 头像信息 -->
        <div class="flex between vcenter">
          <!-- 头像 -->
          <div @click="goAccount">
            <BmImage 
              :url="$store.state.user.userInfo.headPictureUrl ? $store.state.user.userInfo.headPictureUrl : require('@/assets/images/icon/user-icon.png')"
              :width="'1.04rem'" 
              :height="'1.04rem'"
              :isLazy="false"
              :isShow="false"
              :round="true"
            ></BmImage>
          </div>
          <!-- 姓名、id -->
          <dl class="ml-10" v-if="$store.state.user.token" @click="goAccount">
            <dt class="fs-18 green fw">{{ $store.state.user.userInfo.nickname ? $store.state.user.userInfo.nickname: '--' }}</dt>
            <dd class="fs-12 grey mt-8">{{ $store.state.user.userInfo.id }}</dd>
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
        <nuxt-link :to="$store.state.user.token ? { name: 'me-likes' } : { name: 'login' }" tag="dl" class="tc">
          <dt class="fs-24 black fw">0</dt>
          <dd class="fs-12 grey mt-4">Collection</dd>
        </nuxt-link>
        <nuxt-link :to="$store.state.user.token ? { name: 'me-wallet' }: { name: 'login' }" tag="dl" class="tc">
          <dt class="fs-24 black fw">0</dt>
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
      <van-cell class="ptb-14 plr-12" :title="otherItem.text" title-class="pl-12" v-for="(otherItem, otherIndex) in otherList" :key="'other-list-' + otherIndex" :to="($store.state.user.token || otherItem.name === 'me-about') ? { name: otherItem.name, query: otherItem.query } : { name: 'login' }">
        <template #icon>
          <BmIcon :name="otherItem.icon" :width="'0.48rem'" :height="'0.48rem'"></BmIcon>
        </template>
      </van-cell>
    </div>
    
    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import { Badge, Cell, CellGroup } from 'vant';
import { getUserInfo } from '@/api/user';

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
          name: 'me-likes',
          icon: 'my-likes'
        },
        {
          text: 'Recently Viewed', // 最近浏览
          name: 'me-footprint',
          icon: 'recently-viewed'
        },
        {
          text: 'My wallet', // 钱包
          name: 'me-wallet',
          icon: 'my-wallet'
        },
        {
          text: 'Address Management', // 地址管理
          name: 'me-setting-address',
          icon: 'address-management'
        },
        {
          text: 'My Shop', // 我的店铺
          name: 'me-likes',
          query: {
            active: 1
          },
          icon: 'my-shop'
        },
        {
          text: 'Settings', // 设置
          name: 'me-setting-account',
          icon: 'settings'
        },
        {
          text: 'Feedback', // 反馈
          name: 'me-feedback',
          icon: 'feedback'
        },
        {
          text: 'About Tospino', // 关于
          name: 'me-about',
          icon: 'about-tospino'
        }
      ],
      userinfo: {
        username: '',
        headPictureUrl: require('@/assets/images/icon/user-icon.png')
      }
    }
  },
  created() {
    // this.getUserInfo()
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