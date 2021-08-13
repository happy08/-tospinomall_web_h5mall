<template>
  <!-- 我的-订单-查看物流 -->
  <div class="bg-grey vh-100 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.order.logisticsTracking')" :fixed="true" />

    <!-- 物流单号及运送者 -->
    <div class="plr-20 pb-20 pt-20 bg-white">
      <p class="fs-14 black flex vcenter">
        <span class="word-break">{{ $t('me.order.trackingNo') }}: {{ detail.sign }}</span>
        <i class="iconfont icon-fuzhi fs-20 ml-12 copy-order" @click="copy"></i>
      </p>
      <p class="fs-14 black flex vcenter mt-18">{{ $t('me.order.carrier') }}: {{ detail.senderName }}</p>
    </div>

    <!-- 步骤条-物流详情 -->
    <van-steps direction="vertical" :active="0" class="mt-12">
      <van-step v-for="(locusItem, locusIndex) in detail.locusList" :key="locusIndex">
        <h3>{{ locusItem.context }}</h3>
        <!-- <p class="mt-10">The parcel is received, please contact with the courier(xiao/1591360999)to make a confirm-ation if you have any questions. Thank for pur-chasing goods on TOSPINO. We hope to pro-vide you better services again. </p> -->
        <p class="mt-12">{{ locusItem.createTime }}</p>
      </van-step>
    </van-steps>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { Step, Steps } from 'vant';
import { getLogisticsInfo } from '@/api/order';

export default {
  middleware: 'authenticated',
  components: {
    vanStep: Step,
    vanSteps: Steps
  },
  data() {
    return {
      active: 0,
      detail: {}
    }
  },
  activated() {
    // 获取物流信息
    getLogisticsInfo(this.$route.query.deliverySn).then(res => {
      this.detail = res.data;
    })
  },
  methods: {
    copy() { // 复制
      let clipboard = new ClipboardJS('.copy-order', {
        text: () => {
          return this.detail.sign;
        }
      })
      clipboard.on('success', () => {
        let msg = this.$t('common.copySuccess');
        this.$toast({
          message: msg,
          type: 'success'
        })
        clipboard.destroy();
      })
      clipboard.on('error', () => {
        let msg = this.$t('common.copyError');
        this.$toast({
          message: msg,
          type: 'fail'
        })
        clipboard.destroy();
      })
    }
  },
}
</script>

<style lang="less" scoped>
.mt-18{
  margin-top: 18px;
}
.word-break{
  word-break: break-all;
}
</style>