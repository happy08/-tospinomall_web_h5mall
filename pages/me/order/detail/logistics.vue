<template>
  <!-- 我的-订单-查看物流 -->
  <div class="bg-grey v-percent-100 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('logistics_tracking')" :fixed="true" />

    <!-- 物流单号及运送者 -->
    <div class="plr-20 pb-20 pt-20 bg-white">
      <p class="fs-14 black flex vcenter">
        <span class="word-break">{{ $t('tracking_no_') }}{{ detail.waybillNumber }}</span>
        <van-icon :name="require('@/assets/images/icon/copy-icon.png')" size="0.48rem" class="ml-12 copy-order" @click="copy" />
      </p>
      <p class="fs-14 black flex vcenter mt-18">{{ $t('carrier_') }}{{ detail.senderName }}</p>
    </div>

    <div class="pr-10 pl-10 bg-white">
      <!-- 步骤条-物流详情 -->
      <van-steps direction="vertical" :active="0" class="mt-12 fs-14" active-color="#FFCE05">
        <van-step v-for="(locusItem, locusIndex) in detail.locusList" :key="locusIndex">
          <div class="black fs-18 flex between vcenter" v-if="locusIndex == 0">
            <span class="fw fs-18 black">{{ detail.stateName }}</span>
            <a :href="'tel:' + detail.arrivePhone" class="round-8 plr-12 ptb-4 border black fs-14">{{ $t('dial_phone') }}</a>
          </div>
          <p :class="{'mt-10': locusIndex == 0}" style="color: #666;">{{ locusItem.context }}</p>
          <p class="mt-12 light-grey">{{ locusItem.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
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
        let msg = this.$t('t_copied_to_clipboard');
        this.$toast({
          message: msg,
          type: 'success'
        })
        clipboard.destroy();
      })
      clipboard.on('error', () => {
        let msg = this.$t('fail_copied_to_clipboard');
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