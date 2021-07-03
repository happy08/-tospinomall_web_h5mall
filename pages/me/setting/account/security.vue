<template>
  <!-- 账户安全 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.accountSetting.securityTitle')"></BmHeaderNav>
    <!-- 欢迎用户语 -->
    <div class="bg-green-linear plr-20 ptb-16 flex vcenter">
      <BmImage 
        :url="require('@/assets/images/icon/user-icon.png')"
        :width="'0.8rem'" 
        :height="'0.8rem'"
        :isLazy="false"
        :isShow="false"
        class="mr-12"
      ></BmImage>
      <p class="white">{{ $store.state.user.name }}{{ $t('me.accountSetting.securityWelcome') }}</p>
    </div>

    <div class="mt-12">
      <!-- 修改密码 -->
      <van-cell class="ptb-10 plr-20" center :title="$t('me.accountSetting.changePwd')" value-class="light-grey" is-link title-class="black" :to="{ name: 'me-setting-account-verifymethod' }">
        <template #default>
          {{ $t('common.lastEmit') }} <br/> {{ userInfo.pwd }}
        </template>
      </van-cell>
      <!-- 修改绑定手机 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.bindPhone')" :value="userInfo.phone" value-class="light-grey" is-link title-class="black" :to="{ name: 'me-setting-bind' }" />
      <!-- 修改绑定邮箱 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.accountSetting.chnageEmail')" :value="userInfo.email" value-class="light-grey" is-link title-class="black" :to="{ name: 'me-setting-bind', query: { changeWay: 'email' } }" />
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
  },
  data() {
    return {
      userInfo: {
        pwd: 'march-09-2020',
        phone: '139****0647',
        email: '7766****71@163.com'
      }
    }
  }
}
</script>