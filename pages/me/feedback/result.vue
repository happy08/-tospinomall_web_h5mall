<template>
  <!-- 反馈结果页 -->
  <div class="result-page">
    <BmHeaderNav :left="{ isShow: true }" :title="''" />
    <div class="plr-20 tc result-page__container">
      <van-icon name="checked" color="#52C41A" size="64" />
      <p class="fs-18 fw black mt-24 result-page__container--title">反馈成功</p>
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
  methods: {
    onConfirm() {
      this.$router.push({
        name: 'me'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.result-page__container{
  padding-top: 34px;
  .result-page__container--title{
    line-height: 22px;
  }
  .result-page__btn{
    margin-top: 44px;
  }
}
</style>