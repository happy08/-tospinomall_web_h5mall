<template>
  <!-- 我的-订单-查看物流 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.order.logisticsTracking')" />

    <!-- 物流单号及运送者 -->
    <div class="plr-20 pb-20 pt-20 bg-white">
      <p class="fs-14 black flex vcenter">
        <span>{{ $t('me.order.trackingNo') }}: XSD2020071509472000002840</span>
        <i class="iconfont icon-fuzhi fs-20 ml-12 copy-order" @click="copy"></i>
      </p>
      <p class="fs-14 black flex vcenter mt-18">{{ $t('me.order.carrier') }}: Tospino Express</p>
    </div>

    <!-- 步骤条-物流详情 -->
    <van-steps direction="vertical" :active="0" class="mt-12">
      <van-step>
        <h3>Received</h3>
        <p class="mt-10">The parcel is received, please contact with the courier(xiao/1591360999)to make a confirm-ation if you have any questions. Thank for pur-chasing goods on TOSPINO. We hope to pro-vide you better services again. </p>
        <p class="mt-12">March-7-2020  01:49:28</p>
      </van-step>
      <van-step>
        <h3>【城市】物流状态2</h3>
        <p>2016-07-11 10:00</p>
      </van-step>
      <van-step>
        <h3>快件已发货</h3>
        <p>2016-07-10 09:30</p>
      </van-step>
    </van-steps>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { Step, Steps } from 'vant';

export default {
  components: {
    vanStep: Step,
    vanSteps: Steps
  },
  data() {
    return {
      active: 0
    }
  },
  methods: {
    copy() { // 复制
      let clipboard = new ClipboardJS('.copy-order', {
        text: () => {
          return 'XSD2020071509472000002840';
        }
      })
      clipboard.on('success', () => {
        let msg = this.$t('common.copySuccess');
        this.$toast({
          message: msg,
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        let msg = this.$t('common.copyError');
        this.$toast({
          message: msg,
          type: 'fail'
        })
        clipboard.destroy()
      })
    }
  },
}
</script>

<style lang="less" scoped>
.mt-18{
  margin-top: 18px;
}
</style>