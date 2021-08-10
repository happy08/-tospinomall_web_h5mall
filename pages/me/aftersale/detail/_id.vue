<template>
  <!-- 我的-售后-售后详情 type: 1仅退款 2退货退款 3换货  -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.afterSale.detailRefund')" />
    
    <!-- 仅退款,退款中 -->
    <!-- 退款类型returnType：0->退款 1退款退货 -->
    <div v-if="detail.returnType == 0 && detail.surplusTime > 0">
      <!-- 退款/退货退款/换货 进度 -->
      <div class="bg-green-linear ptb-12 plr-8">
        <div class="bg-white pb-14 pt-20 plr-8 round-13">
          <h4 class="fs-14">{{ $t('me.afterSale.waitProcess') }}</h4>
          <div class="light-grey fs-14 mt-8 flex flex-wrap vcenter">
            <span>{{ $t('me.afterSale.countdown') }}</span>
            <van-count-down :time="detail.surplusTime" format="DD 天 HH 时 mm 分 ss 秒" class="ml-4" />
          </div>
          <!-- 步骤条 -->
          <van-steps :active="stepActive" active-color="#42B7AE" inactive-color="#BFBFBF" class="mt-24 pt-0">
            <van-step v-for="(stepItem, stepIndex) in $t('me.afterSale.processStep')" :key="stepIndex">
              <!-- 已激活状态图标 -->
              <template #active-icon>
                <BmImage 
                  :url="require('@/assets/images/icon/circle-active-icon.svg')"
                  :width="'0.22rem'" 
                  :height="'0.22rem'"
                  :isLazy="false"
                  :isShow="false"
                  :round="true"
                />
              </template>
              <!-- 已完成状态图标 -->
              <template #finish-icon>
                <BmImage 
                  :url="require('@/assets/images/icon/circle-finished-active.svg')"
                  :width="'0.22rem'" 
                  :height="'0.22rem'"
                  :isLazy="false"
                  :isShow="false"
                  :round="true"
                />
              </template>
              {{ stepItem }}
            </van-step>
          </van-steps>
        </div>
      </div>

      <!-- 您已发起退款/退货退款/换货请求，请等待处理。提示语 --> 
      <div class="bg-white plr-12 pb-30 pt-18">
        <h4 class="fs-14 fw">{{ $t('me.afterSale.refundWaitTitle') }}</h4>
        <p class="pt-18 fs-12 light-grey">{{ $t('me.afterSale.refundMerchantsTip') }}</p>
        <p class="pt-12 fs-12 light-grey">{{ $t('me.afterSale.refundMerchantsRefuseTip') }}</p>
      </div>
    </div>

    <!-- 退款成功 -->
    <div v-if="detail.returnType == 0 && detail.status == 5">
      <!-- 退款成功提示 -->
      <div class="mt-12 bg-green-linear ptb-12 plr-8">
        <div class="bg-white pb-14 pt-20 plr-8 round-13">
          <div class="flex">
            <BmImage 
              :url="require('@/assets/images/icon/fail-icon.svg')"
              :width="'0.36rem'" 
              :height="'0.36rem'"
              :isLazy="false"
              :isShow="false"
              :round="true"
            />
            <div class="ml-10">
              <p class="fw fs-14 black">{{ $t('me.afterSale.refundSuccess') }}</p>
              <p class="fs-12 light-grey mt-14">07-07-2020 13:34:00</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 退款成功提示文案及金额展示 -->
      <div class="pt-18 plr-10 bg-white pb-20">
        <p class="fs-14 black">{{ $t('me.afterSale.refundSuccessTip') }}</p>
        <div class="red fs-14 mt-20 flex between">
          <span>{{ $t('me.afterSale.totalRefund') }}</span>
          <span>{{ $store.state.rate.currency }}259.00</span>
        </div>
      </div>
    </div>

    <!-- 退货退款/换货 成功, 换货暂时不做 -->
    <div v-if="detail.returnType == 1" class="bg-green-linear p-20 white tc">
      <p class="fw fs-18">{{ $t('me.afterSale.refundSuccess2') }}</p>
      <p class="mt-20 fs-14">March -5-2020</p>
    </div>

    <!-- 协商历史 -->
    <van-cell class="mt-12 ptb-20 plr-12" :title="$t('me.afterSale.negotiationHistory')" title-class="fs-14 black" is-link :to="{ name: 'me-aftersale-negotiation-type', params: { type: detail.returnType == 0 } }" />

    <!-- 订单展示 -->
    <div class="mt-12 bg-white pt-24 plr-20 pb-20">
      <OrderStoreSingle :name="detail.storeName" />
      <OrderSingle class="mt-20" :product_num="detail.returnQuantity" :product_desc="detail.productName" :product_size="detail.productAttr" :price="detail.productPrice" :image="detail.productImage" />
    </div>

    <!-- 具体明细 -->
    <van-cell-group class="mt-12">
      <!-- 售后类型 -->
      <van-cell class="ptb-20 plr-20" :title="'售后类型'" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.returnType | returnTypeFormat"/>
      <!-- 货品状态 -->
      <van-cell class="ptb-20 plr-20" :title="'货品状态'" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.goodState | goodStateFormat"/>
      <!-- 申请原因 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.applyReason')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.applyReason"/>
      <!-- 退款金额 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.refundAmount')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="$store.state.rate.currency + detail.returnAmount" />
      <!-- 申请时间 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.applyTime')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.createTime"/>
      <!-- 退款单号 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.refundNumber')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey">
        <template #default>
          <div class="flex vcenter">
            <span class="copy-order">{{ detail.returnSn }}</span>
            <van-icon :name="require('@/assets/images/icon/copy-icon.png')" size="0.48rem" class="ml-10 copy-member" @click="copy" />
          </div>
        </template>
      </van-cell>
      <!-- 返回方式 -->
      <!-- <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.returnWay')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" value="Door to take"/> -->
      <!-- 姓名、电话、地址 -->
      <!-- <van-cell class="ptb-20 plr-20">
        <template #default>
          <div class="flex between">
            <p class="fs-14 black">Wu 139***9875698</p>
            <p class="light-grey fs-14">Shipping address</p>
          </div>
          <p class="black fs-14 mt-12">Address: Room 302, Geya Building, Guangming District, Shenzhen</p>
        </template>
      </van-cell> -->
    </van-cell-group>

    
  </div>
</template>

<script>
import { Step, Steps, Cell, CellGroup, CountDown } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import ClipboardJS from 'clipboard';
import { getReturnDetail } from '@/api/order';

export default {
  middleware: 'authenticated',
  components: {
    vanStep: Step,
    vanSteps: Steps,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanCountDown: CountDown,
    OrderSingle,
    OrderStoreSingle
  },
  data() {
    return {
      stepActive: 1,
      detail: {}
    }
  },
  activated() {
    getReturnDetail(this.$route.params.id).then(res => {
      if (res.code != 0) return false;

      this.detail = { // 订单详情
        ...res.data,
        surplusTime: res.data.surplusTime * 1000
      };
      // 状态: 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品
      if (res.data.status == 5) {
        this.stepActive = 2;
      } else {
        this.stepActive = 1;
      }
    })
  },
  filters: {
    returnTypeFormat(val) {
      return val == 0 ? '退款' : val == 1 ? '退货退款' : '';
    },
    goodStateFormat(val) {
      return val == 0 ? '未收到货' : val == 1 ? '已收到货' : '';
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
    },
  },
}
</script>

<style lang="less" scoped>
.round-13{
  border-radius: 13px;
}
.pt-18{
  padding-top: 18px;
}
.flex-3{
  flex: 3;
}
.flex-2{
  flex: 2;
}
</style>