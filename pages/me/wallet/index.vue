<template>
  <!-- 我的-钱包 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.wallet.myPure')">
      <div slot="header-right" class="green fs-16" @click="goBill">
        {{ $t('me.wallet.bill') }}
      </div>
    </BmHeaderNav>

    <div class="mlr-12 mt-4">
      <!-- 总金额展示 -->
      <div class="purse-total w-100 flex hcenter">
        <div class="flex column white fw purse-total__container tc">
          <span class="fs-30" v-show="pwdType === 'text'"><span class="fm-menlo">{{ $store.state.rate.currency }}</span><span class="fm-din">{{ detail.balance }}</span></span>
          <span class="fs-30" v-show="pwdType === 'password'">****</span>
          <span class="fs-18 mt-10">{{ $t('me.wallet.myBlance') }}</span>
        </div>
        <div class="purse-total__show">
          <!-- 睁眼 -->
          <van-icon v-if="pwdType === 'text'" :name="require('@/assets/images/icon/eye-o-white.png')" size="30" color="#fff" @click="pwdType = 'password'" />
          <!-- 闭眼 -->
          <van-icon v-else :name="require('@/assets/images/icon/eye-close-white.png')" size="30" color="#fff" @click="pwdType = 'text'" />
        </div>
      </div>

      <!-- 可选择的充值额度选项 -->
      <ul class="flex between flex-wrap" v-if="detail.fixedRechargeCard && detail.fixedRechargeCard.cardItems">
        <li class="bg-grey round-8 fw tc fs-18 mt-10 black perse-li" v-for="fixedCard in detail.fixedRechargeCard.cardItems" :key="'fixed-card-' + fixedCard.cardId">{{ $store.state.rate.currency }} {{ fixedCard.rechargeAmount }}
          <div class="red fs-10 block lh-1" v-if="fixedCard.giftAmount > 0">Give Ghs {{ fixedCard.giftAmount }}</div>
        </li>
      </ul>
      <!-- 自定义金额 -->
      <van-field class="mt-24 border round-8" v-model="amount" type="number" :placeholder="$t('me.wallet.enterAmount')" />
    </div>
    
    <!-- 充值按钮 -->
    <div class="mt-24 mlr-20">
      <BmButton class="w-100 round-8" @click.stop="onRecharge">{{ $t('me.wallet.rechargeNow') }}</BmButton>
    
      <p class="mt-40 fs-14 black">{{ $t('me.wallet.rechargeInstructions') }}</p>
      <p class="mt-8 fs-14 light-grey" v-if="detail.freeRechargeCard">{{ detail.freeRechargeCard.rechargeExplain }}</p>
    </div>
  </div>
</template>

<script>
import { Field } from 'vant';
import { getRechargeCard, buyerRecharge } from '@/api/pay';

export default {
  middleware: 'authenticated',
  components: {
    vanField: Field
  },
  data() {
    return {
      pwdType: 'password',
      amount: '',
      detail: {

      }
    }
  },
  activated() {
    this.getRechargeCard();
  },
  methods: {
    goBill() {
      this.$router.push({
        name: 'me-wallet-bill'
      })
    },
    async getRechargeCard() { // 充值卡查询
      const rechargeData = await getRechargeCard();
      if (rechargeData.code != 0) return false;
      
      this.detail = {
        ...rechargeData.data,
        balance: this.$utils.numberFormat(rechargeData.data.balance, 2)
      };
    },
    onRecharge() { // 充值
      this.$router.push({
        name: 'me-pay-payment',
        query: {
          amount: this.amount
        }
      })
      // buyerRecharge({ amount: this.amount, type: 2 }).then(res => {
      //   if (res.code != 0) return false;

        
      // })
    }
  },
}
</script>

<style lang="less" scoped>
.purse-total{
  height: 128px;
  background-image: url('../../../assets/images/purse-bgd.svg');
  background-size: 100% 100%;
  background-position: center center;
  position: relative;
  .purse-total__container{
    margin-top: 34px;
    line-height: 34px;
  }
  .purse-total__show{
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.perse-li{
  width: 110px;
  height: 60px;
  padding-top: 19px;
}
.mt-40{
  margin-top: 40px;
}
.mt-8{
  margin-top: 8px;
}
</style>