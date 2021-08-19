<template>
  <!-- 我的-设置-账户设置页面 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true, url: '/me' }" :title="$t('account_settings')" />

    <div class="bg-white">
      <!-- 账户信息信息 -->
      <van-cell class="ptb-20 plr-20" center is-link title-class="black" :to="{ name: 'me-account-userinfo' }">
        <template #title>
          <div class="flex vcenter">
            <!-- 头像 -->
            <BmImage 
              :url="$store.state.user.userInfo && $store.state.user.userInfo.headPictureUrl.length > 0 ? $store.state.user.userInfo.headPictureUrl : require('@/assets/images/icon/user-icon.png')"
              :width="'1rem'" 
              :height="'1rem'"
              :isLazy="false"
              :isShow="false"
              :round="true"
            />
            <!-- 姓名、id -->
            <dl class="ml-10">
              <dt class="fs-18 black fw" v-if="$store.state.user.userInfo">{{ $store.state.user.userInfo.nickname == '' ? '--': $store.state.user.userInfo.nickname }}</dt>
              <dd class="fs-12 grey mt-8 lh-1">{{ $store.state.user.userInfo.phone }}</dd>
            </dl>
          </div>
        </template>
      </van-cell>
      <!-- 收货地址 -->
      <van-cell class="ptb-20 plr-20" :title="$t('harvest_address')" is-link title-class="black" :to="{ name: 'me-address' }" />
    </div>

    <div class="mt-12">
      <!-- 账户安全 -->
      <van-cell class="p-20" :title="$t('account_and_security')" is-link title-class="black" :to="{ name: 'me-account-security'}" />
      <!-- 支付设置 -->
      <van-cell class="p-20" :title="$t('payment_settings')" is-link title-class="black" :to="{ name: 'me-pay' }" />
      <!-- 语言设置 -->
      <van-cell class="p-20" :title="$t('language_settings')" is-link title-class="black" :to="{ name: 'me-language' }" />
    </div>

    <!-- 退出 -->
    <div class="plr-20 w-100 pb-20">
      <BmButton class="w-100 account-btn fs-16 black" :type="'info'" @click="logout">{{ $t('log_out') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    logout() { // 退出登录
      this.$store.dispatch('user/Logout');
    },
  },
}
</script>

<style lang="less">
.account-btn{
  margin-top: 140px;
  height: 50px!important;
  border-color: #EEEEEE!important;
  background-color: transparent!important;
}
</style>