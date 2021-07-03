<template>
  <!-- 支付设置-我的银行卡 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.pay.bankCard')"></BmHeaderNav>

    <!-- 没有绑定银行卡 -->
    <div v-if="isBind === true" class="tc bank-60 mlr-20">
      <i class="iconfont icon-tianjia iconfont-tianjia-icon"></i>
      <p class="fs-16 black mt-30">{{ $t('me.pay.addBankBtn') }}</p>
      <p class="fs-14 bank-tip">{{ $t('me.pay.addBankTip') }}</p>
    </div>
    
    <!-- 已经有绑定的银行卡  -->
    <div v-else class="mt-20 mlr-20">
      <h2>{{ $t('me.pay.myBankCard') }}</h2>
      <!-- 银行卡列表 -->
      <ul>
        <li class="hidden mt-20 round-8 card-list">
          <div class="flex">
            <div class="round-50 bg-white card-list__logo">
              <BmImage 
                :url="require('@/assets/images/logo.png')"
                :width="'0.48rem'" 
                :height="'0.48rem'"
                :isLazy="false"
                :isShow="false"
              ></BmImage>
            </div>
            <dl class="ml-12">
              <dt class="white fs-16">China Merchants bank</dt>
              <dd class="fs-14 light-pink">A cash card</dd>
            </dl>
          </div>
          <div class="white mt-24 fs-12">6225 ···· ···· 3073</div>
          <!-- 右上角背景 -->
          <span class="block round-50 card-list__tright"></span>
          <!-- 左上角背景 -->
          <span class="block round-50 card-list__tleft"></span>
          <!-- 左下角背景 -->
          <span class="block round-50 card-list__bleft"></span>
        </li>
      </ul>
      <!-- 新增银行卡按钮 -->
      <BmButton class="w-100 mt-20 ptb-20 bg-white black border" :type="'info'" @click="addBank">{{ $t('me.pay.addBankBtn') }}</BmButton>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      isBind: true
    }
  },
  methods: {
    addBank() { // 新增银行卡

    }
  },
}
</script>

<style lang="less" scoped>
.card-list{
  padding: 16px;
  min-height: 105px;
  position: relative;
  background-color: #F5654B;
  .card-list__tright{
    position: absolute;
    width: 101px;
    height: 128px;
    background: linear-gradient(164deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
    bottom: 37px;
    right: -20px;
    opacity: .15;
  }
  .card-list__tleft{
    position: absolute;
    width: 135px;
    height: 179px;
    bottom: -2px;
    left: -20px;
    transform: rotate(10deg) translateX(-15px);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  }
  .card-list__bleft{
    position: absolute;
    bottom: -54px;
    left: 43px;
    width: 103px;
    height: 107px;
    background: linear-gradient(142deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.11) 100%);
  }
  .card-list__logo{
    width: 36px;
    height: 36px;
    padding: 6px;
  }
}
.mt-24{
  margin-top: 24px;
}
.bank-60{
  margin-top: 60px;
}
.iconfont-tianjia-icon{
  color: #D14534;
  font-size: 40px;
}
.bank-tip{
  color: #666;
  margin-top: 6px;
}
</style>