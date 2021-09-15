<template>
  <!-- 我的-设置-账户安全 -->
  <div class="bg-grey v-percent-100">
    <BmHeaderNav :left="{ isShow: true, url: '/me/account' }" :title="$t('account_security')" />
    
    <!-- 欢迎用户语 -->
    <div class="bg-green-linear plr-20 ptb-16 flex vcenter">
      <BmImage 
        :url="$store.state.user.userInfo ? $store.state.user.userInfo.headPictureUrl : require('@/assets/images/icon/user-icon.png')"
        :width="'0.8rem'" 
        :height="'0.8rem'"
        :isLazy="false"
        :isShow="true"
        class="mr-12"
        :errorUrl="require('@/assets/images/icon/user-icon.png')"
        :alt="'Tospino user icon'"
        :round="true"
      />
      <p class="white" v-if="$store.state.user.userInfo">{{ $store.state.user.userInfo.nickname }}{{ $t('welcome_back_to_security') }}</p>
    </div>

    <div class="mt-12" v-if="$store.state.user.userInfo">
      <!-- 修改密码 -->
      <van-cell class="ptb-20 plr-20" center :title="$t('change_password')" value-class="light-grey" is-link title-class="black" :to="{ name: 'me-account-verifymethod' }">
        <template #default v-if="$store.state.user.userInfo.pwdLastUpdateTime">
          <span v-html="$t('last_modified')" class="pre-wrap"></span>{{ $store.state.user.userInfo.pwdLastUpdateTime }}
        </template>
      </van-cell>
      <!-- 修改绑定手机 -->
      <van-cell class="ptb-20 plr-20" :title="$t('modify_binding_phone')" :value="$store.state.user.userInfo.phone" value-class="light-grey" is-link title-class="black" :to="{ name: $store.state.user.userInfo.phone == '' ? 'me-account-bind-rebind': 'me-account-bind', query: { changeType: 'phone' } }" />
      <!-- 修改绑定邮箱 -->
      <van-cell class="ptb-20 plr-20" :title="$t('modify_binding_email')" :value="$store.state.user.userInfo.email" value-class="light-grey" is-link title-class="black" :to="{ name: $store.state.user.userInfo.email == '' ? 'me-account-bind-rebind': 'me-account-bind', query: { changeWay: 'email', changeType: 'email' } }" />
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
  }
}
</script>