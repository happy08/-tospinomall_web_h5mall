<template>
  <!-- 我的账户设置 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.accountSetting.title')"></BmHeaderNav>

    <div class="bg-white">
      <!-- 账户信息信息 -->
      <van-cell class="ptb-20 plr-20" center is-link title-class="black" :to="{ name: 'me-setting-account-userinfo' }">
        <template #title>
          <div class="flex vcenter">
            <!-- 头像 -->
            <BmImage 
              :url="require('@/assets/images/icon/user-icon.png')"
              :width="'1rem'" 
              :height="'1rem'"
              :isLazy="false"
              :isShow="false"
            ></BmImage>
            <!-- 姓名、id -->
            <dl class="ml-10">
              <dt class="fs-18 black fw">{{ userInfo.name }}</dt>
              <dd class="fs-12 grey mt-8 lh-1">{{ userInfo.id }}</dd>
            </dl>
          </div>
        </template>
      </van-cell>
      <!-- 收货地址 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.harvestAddress')" is-link title-class="black" :to="{ name: 'services-privacy' }" />
    </div>

    <div class="mt-12">
      <!-- 账户安全 -->
      <van-cell class="p-20" :title="$t('me.accountSetting.accountSecurity')" is-link title-class="black" :to="{ name: 'me-setting-account-security', query: { name: userInfo.name } }" />
      <!-- 支付设置 -->
      <van-cell class="p-20" :title="$t('me.accountSetting.paySetting')" is-link title-class="black" :to="{ name: 'services-privacy' }" />
      <!-- 语言设置 -->
      <van-cell class="p-20" :title="$t('me.accountSetting.langSetting')" is-link title-class="black" :to="{ name: 'services-privacy' }" />
    </div>

    <!-- 清除缓存 -->
    <!-- <van-cell class="mt-20 p-20" :title="$t('me.accountSetting.clearCache')" title-class="black"/> -->

    <!-- 退出 -->
    <div class="plr-20 w-100 pb-20">
      <BmButton class="w-100 account-btn" :type="'info'" @click="logout">退出</BmButton>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';
import { logout } from '@/api/login';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
  data() {
    return {
      userInfo: {
        name: 'Nadia Spinka',
        id: '78****59'
      }
    }
  },
  created() {
    console.log(this.$store.state.user.token)
  },
  methods: {
    logout() { // 退出登录
      logout().then(res => {
        this.$store.commit('user/SET_TOKEN', null);
      })
    },
  },
}
</script>

<style lang="less">
.account-btn{
  margin-top: 140px;
  height: 50px!important;
}
</style>