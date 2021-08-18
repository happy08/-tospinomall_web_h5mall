<template>
  <!-- 我的-售后-售后详情 type: 1仅退款 2退货退款 3换货  -->
  <div class="vh-100 bg-grey pt-46 pb-56">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="$t('detail_of_the_return')" :fixed="true" @leftClick="leftClick" />
    
    <!-- 仅退款,退款中 -->
    <!-- 退款类型returnType：0->退款 1退款退货 -->
    <!-- 订单类型orderType：1->FBM订单 2->FBT订单 -->
    <!-- status：1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品 -->
    <!-- 工单状态involvedStatus：1->待举证 2->等平台处理中 3->工单关闭 4->工单已完毕 -->
    <!-- deliveryType: 1->自行寄出 2->上门取件 -->
    <!-- 退款/退货退款/换货 进度，处理中 -->
    <div class="bg-green-linear ptb-12 plr-8" v-if="detail.status == 1 || detail.status == 2 || detail.status == 3 || detail.status == 4 || (detail.status == 7 && (detail.involvedStatus == 1 || detail.involvedStatus == 2))">
      <!-- 退款处理中 -->
      <div class="bg-white pb-14 pt-20 plr-8 round-13">
        <h4 class="fs-14" v-if="detail.status == 1">{{ detail.orderType == 1 ? '请等待商家处理' : '请等待平台处理'}}</h4>
        <h4 class="fs-14" v-if="detail.status == 2">{{ detail.orderType == 1 ? '商家同意退货，请及时退货' : '平台同意退货，请及时退货'}}</h4>
        <h4 class="fs-14" v-if="detail.status == 3">{{ detail.orderType == 1 ? '您已发货商家处理中' : '您已发货平台处理中'}}</h4>
        <h4 class="fs-14" v-else-if="detail.status == 4">退款处理中</h4>
        <h4 class="fs-14" v-else-if="detail.status == 7 && detail.involvedStatus == 1">请举证处理</h4>
        <h4 class="fs-14" v-else-if="detail.status == 7 && detail.involvedStatus == 2">请等待平台处理</h4>

        <p class="fs-12 light-grey mt-10" v-if="detail.status == 7 && (detail.involvedStatus == 2 || detail.involvedStatus == 1) && detail.surplusTime <= 0">{{ detail.updateTime }}</p>
        <!-- 倒计时 -->
        <div class="light-grey fs-14 mt-8 flex flex-wrap vcenter" v-if="detail.surplusTime > 0">
          <span>{{ $t('refund_countdown') }}</span>
          <van-count-down :time="detail.surplusTime" format="DD 天 HH 时 mm 分 ss 秒" class="ml-4" @finish="getReturnDetail" />
        </div>

        <!-- 步骤条 -->
        <van-steps :active="stepActive" active-color="#42B7AE" inactive-color="#BFBFBF" class="mt-24 pt-0 custom-step-aftersale">
          <van-step v-for="(stepItem, stepIndex) in stepList" :key="stepIndex">
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

    <!-- 退款成功/关闭售后单 -->
    <div class="mt-12 bg-green-linear ptb-12 plr-8" v-if="detail.status == 5 || detail.status == 6">
      <div class="bg-white ptb-20 plr-8 round-13">
        <p class="fw fs-14 black ml-10" v-if="detail.status == 5">{{ $t('refund_successfully') }}</p>
        <p class="fw fs-14 black ml-10" v-if="detail.status == 6">已关闭</p>
        <p class="fs-12 light-grey mt-10 ml-10">{{ detail.updateTime }}</p>
      </div>
    </div>

    <!-- 7->商家/运营驳回申请 -->
    <div class="mt-12 bg-green-linear ptb-12 plr-8" v-if="detail.status == 7 && detail.involvedStatus == 0">
      <div class="bg-white ptb-20 plr-8 round-13">
        <p class="fw fs-14 black ml-10" v-if="detail.involvedStatus == 0">商家已拒绝</p>
        <div class="light-grey fs-14 mt-8 ml-10 flex flex-wrap vcenter" v-if="detail.surplusTime > 0">
          <span>{{ $t('me.afterSale.countdown') }}</span>
          <van-count-down :time="detail.surplusTime" format="DD 天 HH 时 mm 分 ss 秒" class="ml-4" @finish="getReturnDetail" />
        </div>
      </div>
    </div>

    <!-- 已发起退款申请，请耐心等待商家处理 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 1 && detail.orderType == 1">
      <h4 class="fs-14 fw">您已成功发起退款申请，请耐心等待商家处理</h4>
      <!-- 退款 -->
      <p class="mt-12 fs-12 light-grey" v-if="detail.returnType == 0">商家同意退款或者超时未处理，系统将退款给您。<br/>如果商家拒绝，您可以修改退款申请后再次发起，商家会重新处理</p>
      <!-- 退货退款 -->
      <p class="mt-12 fs-12 light-grey" v-if="detail.returnType == 1">商家同意退款或者超时未处理，系统将退款给您<br/>如果商家拒绝，您可以修改退款申请后再次发起，商家会重新处理如商家超时未处理，退货申请将达成，请按系统给出的退货地址退货</p>
    </div>

    <!-- 商家同意退货申请 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 2 && detail.orderType == 1">
      <!-- 退款 -->
      <p class="mt-12 fs-12 black">商家已同意您的退货申请，请填写退货快递单号</p>
    </div>
    
    <!-- 商家同意退款/退款成功[超时/未超时] -->
    <div class="bg-white plr-12 ptb-20" v-if="(detail.status == 4 || detail.status == 5) && detail.orderType == 1">
      <h4 class="fs-14 fw" v-if="detail.status == 4 || detail.status == 3">商家已同意您的退款申请，请等待系统退款</h4>
      <h4 class="fs-14 fw" v-if="detail.status == 5 && detail.isAutoAudit == 0">商家已同意您的退款申请，系统已退款给您</h4>
      <h4 class="fs-14 fw" v-if="detail.status == 5 && detail.isAutoAudit == 1">因商家超时未处理，交易支付退款</h4>
      <div class="flex red between mt-12" v-if="detail.status == 5">
        <span class="fs-12">退款总金额</span>
        <span class="fs-14 fw">{{ $store.state.rate.currency }}{{ detail.returnAmount }}</span>
      </div>
    </div>

    <!-- 已关闭 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 6">
      <h4 class="fs-14 fw">关闭原因：卖家撤销申请</h4>
    </div>

    <!-- 7->商家/运营驳回申请 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 7 && detail.involvedStatus == 0">
      <h4 class="fs-14 fw">拒绝原因:</h4>
      <p class="mt-12 fs-12 light-grey">您可以修改申请后再次发起，商家会重新处理</p>
      <p class="fs-12 light-grey">如果您逾期未处理，本次申请将自动关闭</p>
    </div>

    <!-- 申请客服介入 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 7 && detail.involvedStatus == 1">
      <h4 class="fs-14 fw">您已成功申请客服介入，请在规定时间内举证</h4>
      <p class="mt-12 fs-12 light-grey">平台仲裁是否胜诉与是否退款的标准为不同的判定标准，具体规定请查看平台相关资料或联系平台客服了解。<br/>平台判定同意退款，系统将退款给您<br/>请务必按照规定，上传证据； 若上传的证据不足，平台将会按照现有资料进行判定</p>
    </div>

    <!-- 平台处理中，请耐心等待 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 7 && detail.involvedStatus == 2">
      <h4 class="fs-14 fw">平台处理中，请耐心等待</h4>
      <p class="mt-12 fs-12 light-grey">平台仲裁是否胜诉与是否退款的标准为不同的判定标准，具体规定请查看平台相关资料或联系平台客服了解。<br/>平台判定同意退款，系统将退款给您<br/>平台预计将在举证结束后的15个工作日内作出判定，期间请多关注仲裁进度</p>
    </div>

    <!-- 退货退款/换货 成功, 换货暂时不做 -->
    <!-- <div v-if="detail.returnType == 1" class="bg-green-linear p-20 white tc">
      <p class="fw fs-18">{{ $t('me.afterSale.refundSuccess2') }}</p>
      <p class="mt-20 fs-14">March -5-2020</p>
    </div> -->

    <!-- 查看举证详情 -->
    <van-cell v-if="detail.involvedStatus == 1 || detail.involvedStatus == 2" class="mt-12 ptb-20 plr-12" title="查看举证详情" title-class="fs-14 black" is-link :to="{ name: 'me-aftersale-proof-detail-id', params: { id: detail.workId } }" />

    <!-- 协商历史 -->
    <van-cell :class="{'ptb-20 plr-12': true, 'mt-12': detail.involvedStatus != 1 && detail.involvedStatus != 2}" :title="$t('negotiation_history')" title-class="fs-14 black" is-link :to="{ name: 'me-aftersale-negotiation-id', params: { id: detail.id } }" />

    <!-- 订单展示 -->
    <div class="mt-12 bg-white pt-24 plr-20 pb-20">
      <OrderStoreSingle :name="detail.storeName" :showArrow="false" />
      <OrderSingle class="mt-20" :product_num="detail.returnQuantity" :product_desc="detail.productName" :product_size="detail.productAttr" :price="detail.productPrice" :image="detail.productImage" />
    </div>

    <!-- 具体明细 -->
    <van-cell-group class="mt-12">
      <!-- 售后类型 -->
      <van-cell class="ptb-20 plr-20" :title="$t('after_type')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.returnType | returnTypeFormat"/>
      <!-- 货品状态 -->
      <van-cell class="ptb-20 plr-20" :title="$t('goods_status')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.goodState | goodStateFormat"/>
      <!-- 申请原因 -->
      <van-cell class="ptb-20 plr-20" :title="$t('applyReason')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.applyReason"/>
      <!-- 退款金额 -->
      <van-cell class="ptb-20 plr-20" :title="$t('refund_amount')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="$store.state.rate.currency + detail.returnAmount" />
      <!-- 申请时间 -->
      <van-cell class="ptb-20 plr-20" :title="$t('apply_for_time')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.createTime"/>
      <!-- 退款单号 -->
      <van-cell class="ptb-20 plr-20" :title="$t('refund_number')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey">
        <template #default>
          <div class="flex vcenter">
            <span>{{ detail.returnSn }}</span>
            <van-icon :name="require('@/assets/images/icon/copy-icon.png')" size="0.48rem" class="ml-10 copy-order" @click="copy" />
          </div>
        </template>
      </van-cell>
      <!-- 退货方式 -->
      <van-cell class="ptb-20 plr-20" :title="$t('return_method')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.deliveryType == 1 ? $t('self_return') : $t('pick_up')" v-if="detail.returnType == 1" />
      <!-- 姓名、电话、地址 -->
      <!-- <van-cell class="ptb-20 plr-20" v-if="detail.returnType == 1 && detail.status == 2">
        <template #default>
          <div class="flex between">
            <p class="fs-14 black">{{ detail.sendName }}  {{ detail.sendPhone }}</p>
            <p class="light-grey fs-14">Shipping address</p>
          </div>
          <p class="black fs-14 mt-12">地址: {{ detail.sendCompleteAddress }}</p>
        </template>
      </van-cell> -->
    </van-cell-group>

    <div class="w-100 bg-white btn-content flex hend vcenter">
      <!-- 工单状态involvedStatus： 0未开始 1->待举证 2->平台处理中 3->工单关闭 4->工单已完结 -->
      <!-- status: 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品 -->
      <!-- 订单类型orderType：1->FBM订单 2->FBT订单 -->
      <!-- <div class="mt-8 flex hend"> -->
        <!-- 客服介入 -->
        <BmButton :type="'info'" class="h-32 mr-10 time-out" v-if="(detail.status == 7 || detail.status == 8) && detail.involvedStatus == 0 && detail.orderType == 1 && detail.surplusTime > 0" @btnClick="$router.push({ name: 'me-aftersale-proof-id', params: { id: detail.id } })">客服介入</BmButton>
        <!-- 修改申请 -->
        <BmButton :type="'info'" class="h-32 mr-10 time-out" v-if="(detail.status == 1 || detail.status == 7) && detail.involvedStatus == 0" @btnClick="onEditApply">修改申请</BmButton>
        <!-- 填写运单号 -->
        <BmButton :type="'info'" class="h-32 time-out mr-10" v-if="detail.status == 2 && detail.deliveryType == 1" @btnClick="$router.push({ name: 'me-aftersale-tracking-id', params: { id: detail.id } })">填写运单号</BmButton>
        
        <!-- 追加举证 -->
        <BmButton :type="'info'" class="h-32 time-out mr-10" v-if="(detail.status == 7 || detail.status == 8) && detail.involvedStatus == 1 && detail.orderType == 1 && detail.surplusTime > 0" @btnClick="$router.push({ name: 'me-aftersale-proof-id', params: { id: detail.id }, query: { add: detail.workId } })">追加举证</BmButton>

        <!-- 修改物流单号 -->
        <BmButton class="round-0 v-100" v-if="detail.status == 3 && detail.deliveryType == 1" @btnClick="$router.push({ name: 'me-aftersale-tracking-id', params: { id: detail.id }, query: { edit: 1 } })">修改快递单号</BmButton>

        <!-- 撤销申请 -->
        <BmButton class="round-0 v-100" v-if="detail.status == 1 || detail.status == 2 || (detail.status == 7 && detail.involvedStatus == 0) || (detail == 8 && detail.involvedStatus == 0)" @btnClick="onRevokeApply">撤销申请</BmButton>
        <!-- 撤销工单 -->
        <BmButton class="round-0 v-100" v-if="(detail.status == 7 || detail.status == 8) && (detail.involvedStatus == 1 || detail.involvedStatus == 2)" @btnClick="onCancelApply(detail.workId)">撤销申请</BmButton>
        
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { Step, Steps, Cell, CellGroup, CountDown } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import ClipboardJS from 'clipboard';
import { getReturnDetail, revokeApply, cancelApply } from '@/api/order';

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
      detail: {},
      stepList: []
    }
  },
  activated() {
    this.getReturnDetail();
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
          return this.detail.returnSn;
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
    },
    onRevokeApply() { // 撤销申请
      this.$dialog.confirm({
        message: `您将撤销本次申请，如果问题未解决，您还可以再次发起，确定继续吗`,
        onfirmButtonText: this.$t('common.confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        revokeApply(this.$route.params.id).then(res => {
          if (res.code != 0) return false;

          this.getReturnDetail();
        })
      }).catch(() => {

      })
    },
    getReturnDetail() { // 获取订单详情
      getReturnDetail(this.$route.params.id).then(res => {
        if (res.code != 0) return false;

        this.detail = { // 订单详情
          ...res.data,
          surplusTime: res.data.surplusTime * 1000
        };
        // 状态: 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品
        if (res.data.returnType == 0) { // 退款
          if (res.data.involvedStatus == 0) {
            if (res.data.status == 5) {
              this.stepActive = 2;
            } else {
              this.stepActive = 1;
            }
            this.stepList = this.$t('processStep');
          } else { // 申请平台介入
            this.stepList = this.$t('processPlatformStep');
            this.stepActive = res.data.involvedStatus == 1 ? 1 : res.data.involvedStatus == 2 ? 2: 2;
          }
        } else if (res.data.returnType == 1) { // 退货退款
          this.stepActive = res.data.status == 1 ? 1 : res.data.status == 2 ? 2 : (res.data.status == 4 || res.data.status == 3) ? 3 : res.data.status == 5 ? 4 : 0;
          this.stepList = this.$t('processReturnShopStep');
        }
        
      })
    },
    onEditApply() { // 修改申请
      this.$router.push({
        name: 'me-aftersale-apply-type',
        params: {
          type: this.detail.returnType + 1
        },
        query: {
          itemId: this.detail.id,
          edit: 1
        }
      })
    },
    leftClick() { // 回退，解决由申请页面提交跳转到详情页面，回退时需要回退到列表页面
      if (this.$route.query.back && this.$route.query.back == 'me-aftersale') {
        this.$router.go(-3);
        return false;
      }

      if(window.history.length < 2){ //解决部分机型拿不到history
        console.log('go home');
        this.$router.replace('/');
      }else{
        console.log('back');
        history.back();
      }
    },
    onCancelApply(id) { // 撤销工单的申请
      cancelApply(id).then(() => {
        this.getReturnDetail();
      })
    }
  },
}
</script>

<style lang="less" scoped>
.round-13{
  border-radius: 13px;
}
.flex-3{
  flex: 3;
}
.flex-2{
  flex: 2;
}
.btn-content{
  position: fixed;
  bottom: 0;
  height: 56px;
  .v-100{
    height: 100%;
  }
  .btn-content__evaluation{
    height: 36px!important;
    border-color: #eee!important;
    background-color: transparent!important;
  }
}
.time-out{
  border-color: #eee!important;
  color: #383838!important;
  background-color: transparent!important;
}
.pb-56{
  padding-bottom: 56px;
}
</style>

<style lang="less">
.custom-step-aftersale{
  .van-step__circle{
    width: 11px;
    height: 11px;
  }
}
</style>