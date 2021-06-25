<template>
  <div>
    <BmHeaderNav :left="{ isShow: true }"></BmHeaderNav>
    <div class="mlr-20 pb-30 flex between column login-page">
      <div>
        <h1 class="tc lagin-page__title">{{ $t('login.loginTitle') }}</h1>
        <NuxtChild />
      </div>

      <!-- 其他登录方式及协议 -->
      <div class="login-page__btm">
        <van-divider>{{ $t('common.or') }}</van-divider>
        <div class="flex login-page__btm--concat">
          <img src="@/assets/images/concat-facebook.png" alt="">
          <img src="@/assets/images/concat-facebook.png" alt="">
          <img src="@/assets/images/concat-facebook.png" alt="">
          <img src="@/assets/images/concat-facebook.png" alt="">
        </div>
        <p class="fs-14 tc login-page__btm--service">By loging in,you agree to <nuxt-link to="">Tospino's Terms of Service</nuxt-link> and <nuxt-link to="">Privacy Policy</nuxt-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { Divider } from 'vant';

export default {
  components: {
    vanDivider: Divider
  }
}
</script>

<style lang="less" scoped>
.login-page{
  padding-top: 50px;
  height: calc(100vh - 46px);
  .lagin-page__title{
    color: #383838;
    font-size: 28px;
    line-height: 34px;
  }
  .login-page__btm{
    .login-page__btm--concat{
      margin: 0 auto;
      width: fit-content;
      img{
        width: 32px;
        height: 32px;
        object-fit: cover;
        margin-left: 18px;
        &:first-child{
          margin-left: 0;
        }
      }
    }
    .login-page__btm--service{
      margin-top: 20px;
      line-height: 20px;
      color: #BFBFBF;
      a{
        color: #0F66DE;
      }
    }
  }
}
</style>