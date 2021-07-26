<template>
  <!-- 我的-设置-安全认证-绑定方式-修改绑定-结果展示页面  -->
  <div class="result-page">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.authentication.bindPhoneTitle')" />
    
    <div class="plr-20 tc result-page__container">
      <van-icon name="checked" color="#52C41A" size="64" />
      <p class="fs-18 fw black result-page__container--title">{{ $t('me.authentication.success') }}</p>
      <!-- 修改成功提示语 -->
      <p class="light-grey fs-14 mt-12 result-page__container--tip">{{ $t('me.authentication.bindPhoneDesc') }}</p>
      <!-- i know -->
      <van-button
        class="mt-60 btn_h48 round-8 fw fs-16 w-100 result-page__btn"
        color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
        @click="onConfirm"> 
        {{ $t('me.authentication.iknow') }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  methods: {
    loginClick() { // 点击登录 
      this.$router.push({
        name: 'login'
      })
    },
    onConfirm() { // 点击i know的操作
      
    }
  }
}
</script>

<style lang="less" scoped>
.result-page__container{
  padding-top: 34px;
  .result-page__container--title{
    margin-top: 24px;
    line-height: 22px;
  }
  .result-page__container--tip{
    line-height: 18px;
  }
  .result-page__btn{
    margin-top: 44px;
  }
}
</style>