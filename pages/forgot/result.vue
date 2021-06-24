<template>
  <div class="result-page">
    <BmHeaderNav :title="$t('forgot.title')"></BmHeaderNav>

    <div class="plr-20 result-page__container">
      <van-icon name="checked" color="#52C41A" size="54" />
      <p class="fs-18 fw result-page__container--title">{{ $t('common.congratulations') }}</p>
      <p class="light-grey fs-14 result-page__container--tip">{{ $t('forgot.successTip') }}</p>
      <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)">
        {{ $t('login.loginNow') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.result-page{
  background-color: #fff;
  .result-page__container{
    padding-top: 39px;
    text-align: center;
    .result-page__container--title{
      color: #383838;
      margin-top: 29px;
      line-height: 27px;
    }
    .result-page__container--tip{
      line-height: 18px;
      margin-top: 11px;
    }
  }
}
</style>