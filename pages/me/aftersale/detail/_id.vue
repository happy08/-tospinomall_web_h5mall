<template>
  <!-- 我的-售后-售后详情 type: 1仅退款 2退货退款 3换货  -->
  <div class="v-percent-100 bg-grey pt-46 pb-56">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="detail.returnType === 0 ? $t('detail_of_the_refund') : $t('detail_of_the_return')" :fixed="true" @leftClick="leftClick" />
    
    <!-- 仅退款,退款中 -->
    <!-- 退款类型returnType：0->退款 1退款退货 -->
    <!-- 订单类型orderType：1->FBM订单 2->FBT订单 -->
    <!-- status：1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品 -->
    <!-- 工单状态involvedStatus：1->待举证 2->等平台处理中 3->工单关闭 4->工单已完毕 -->
    <!-- deliveryType: 1->自行寄出 2->上门取件 -->
    <!-- 退款判定refundJudage: 0表示无需退款 1退款给买家 -->
    <!-- 责任判定responsJudage: 0->均无责任 1->商家责任 2->买家责任 3->工单违规-->
    <!-- 关闭类型closeType ：1>买家超时未填写退货单号，自动关闭售后单 2>卖家驳回后, 买家超时未客服介入，自动关闭售后单 3>卖家拒收后, 买家超时未客服介入，自动关闭售后单\n4>FBT订单，审核不通过关闭订单 5 >FBT订单，拒收关闭订单 6>撤销已关闭 7>运营关闭 -->

    <!-- 退款/退货退款/换货 进度，处理中 -->
    <div class="bg-green-linear ptb-12 plr-8" v-if="detail.status == 1 || detail.status == 2 || detail.status == 3 || detail.status == 4 || (detail.status == 7 && (detail.involvedStatus == 1 || detail.involvedStatus == 2))">
      <!-- 退款处理中 -->
      <div class="bg-white pb-14 pt-20 plr-8 round-13">
        <!-- 等待处理 -->
        <h4 class="fs-14" v-if="detail.status == 1">{{ $t('refund_return_state_tip_1', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>

        <!-- 同意退货，请及时退货 -->
        <h4 class="fs-14" v-if="detail.status == 2">{{ $t('refund_return_state_tip_5', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>

        <!-- 您已发货，带处理 -->
        <h4 class="fs-14" v-if="detail.status == 3">{{ $t('refund_return_state_tip_8', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>

        <!-- 退款处理中 -->
        <h4 class="fs-14" v-else-if="detail.status == 4">{{ $t('refund_return_state_tip_9') }}</h4>

        <!-- 举证处理 -->
        <h4 class="fs-14" v-else-if="detail.status == 7 && detail.involvedStatus == 1">{{ $t('refund_return_state_tip_45') }}</h4>

        <!-- 驳回申请，等待平台处理 -->
        <h4 class="fs-14" v-else-if="detail.status == 7 && detail.involvedStatus == 2">{{ $t('refund_return_state_tip_48') }}</h4>

        <p class="fs-12 light-grey mt-10" v-if="(detail.status == 7 && (detail.involvedStatus == 2 || detail.involvedStatus == 1) && detail.surplusTime <= 0)">{{ detail.updateTime }}</p>
        <!-- 倒计时 -->
        <div class="light-grey fs-14 mt-8 flex flex-wrap vcenter" v-if="detail.surplusTime > 0">
          <span>{{ $t('refund_countdown') }}</span>
          <van-count-down :time="detail.surplusTime" :format="$t('count_down_format_label')" class="ml-4" @finish="getReturnDetail" />
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
                :alt="'Tospino circle active icon'"
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
                :alt="'Tospino circle finished icon'"
              />
            </template>
            <div v-html="stepItem"></div>
          </van-step>
        </van-steps>
      </div>
    </div>

    <!-- 退款成功/关闭售后单 样式有绿边框-->
    <div class="mt-12 bg-green-linear ptb-12 plr-8" v-if="detail.status == 5 || detail.status == 6 || detail.status == 8">
      <div class="bg-white ptb-20 plr-8 round-13">
        <p class="fw fs-14 black ml-10" v-if="detail.status == 5">{{ $t('refund_successfully') }}</p>

        <div v-if="detail.status == 6" class="ml-10">
          <!-- 超时未填写退货单号，退货单关闭 -->
          <h4 class="fs-14" v-if="detail.closeType == 1">{{ $t('refund_return_state_tip_14') }}</h4>

          <!-- 仅退款驳回申请 -->
          <h4 class="fs-14" v-if="detail.closeType == 4">{{ $t('refund_return_state_tip_24') }}</h4>

          <!-- 买家拒收商品，退货退款单关闭 -->
          <h4 class="fs-14" v-if="detail.closeType == 5">{{ $t('refund_return_state_tip_42') }}</h4>

          <!-- 买家撤销申请 -->
          <h4 v-if="detail.closeType == 6" class="fs-14">{{ $t('refund_return_state_tip_35') }}</h4>

          <template v-if="detail.closeType == 8">
            <!-- 均无责任，无需退款 -->
            <h4 class="fs-14" v-if="detail.responsJudage === 0 && detail.refundJudage === 0">{{ $t('refund_return_state_tip_38') }}</h4>

            <!-- 均无责任，退款给买家 -->
            <h4 class="fs-14" v-if="detail.responsJudage === 0 && detail.refundJudage == 1">{{ $t('refund_return_state_tip_40') }}</h4>

            <!-- 买家胜诉，退款给买家 -->
            <h4 class="fs-14" v-if="detail.responsJudage == 1 && detail.refundJudage == 1">{{ $t('refund_return_state_tip_34') }}</h4>

            <!-- 买家胜诉，无需退款 -->
            <h4 class="fs-14" v-if="detail.responsJudage == 1 && detail.refundJudage === 0">{{ $t('refund_return_state_tip_33') }}</h4>

            <!-- 卖家胜诉，无需退款 -->
            <h4 class="fs-14" v-if="detail.responsJudage == 2 && detail.refundJudage === 0">{{ $t('refund_return_state_tip_32') }}</h4>

            <!-- 卖家胜诉，退款给买家 -->
            <h4 class="fs-14" v-if="detail.responsJudage == 2 && detail.refundJudage == 1">{{ $t('refund_return_state_tip_31') }}</h4>
          </template>
          
          <h4 v-if="detail.closeType == 9" class="fs-14">{{ $t('refund_return_state_tip_35') }}</h4>
        </div>

        <!-- 已拒收 -->
        <h4 class="fs-14 ml-10" v-if="detail.status == 8">{{ $t('refund_return_state_tip_22', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>
        <!-- 时间 -->
        <p class="fs-12 light-grey mt-10 ml-10">{{ detail.updateTime }}</p>
      </div>
    </div>

    <!-- 7->商家/运营驳回申请 -->
    <div class="mt-12 bg-green-linear ptb-12 plr-8" v-if="detail.status == 7 && detail.involvedStatus === 0">
      <div class="bg-white ptb-20 plr-8 round-13">
        <p class="fw fs-14 black ml-10" v-if="detail.involvedStatus == 0">{{ $t('refund_return_state_tip_16', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</p>
        <div class="light-grey fs-14 mt-8 ml-10 flex flex-wrap vcenter" v-if="detail.surplusTime > 0">
          <span>{{ $t('refund_countdown') }}</span>
          <van-count-down :time="detail.surplusTime" :format="$t('count_down_format_label')" class="ml-4" @finish="getReturnDetail" />
        </div>
      </div>
    </div>

    <!-- 已发起退款/退货退款申请，请耐心等待商家处理 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 1 && (detail.orderType == 1 || detail.orderType == 2)">
      <!-- 仅退款 -->
      <h4 class="fs-14 fw" v-if="detail.returnType == 0">{{ $t('refund_return_state_tip_2', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>
      <!-- 退货退款 -->
      <h4 class="fs-14 fw" v-if="detail.returnType == 1">{{ $t('refund_return_state_tip_52', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>
      <!-- 退款 -->
      <p class="mt-12 fs-12 light-grey pre-wrap" v-if="detail.returnType == 0 && detail.orderType == 1" v-html="$t('refund_return_state_tip_4', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') })"></p>
      <p class="mt-12 fs-12 light-grey pre-wrap" v-if="detail.returnType == 0 && detail.orderType == 2" v-html="$t('refund_return_state_tip_3', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') })"></p>
      <!-- 退货退款 -->
      <!-- FBT -->
      <p class="mt-12 fs-12 light-grey" v-if="detail.returnType == 1 && detail.orderType == 1">
        <span class="pre-wrap" v-html="$t('refund_return_state_tip_4', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') })"></span>
        <span class="pre-wrap" v-html="$t('refund_return_state_tip_6', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') })"></span>
      </p>
      <!-- FBM -->
      <p class="mt-12 fs-12 light-grey" v-if="detail.returnType == 1 && detail.orderType == 2">{{ $t('refund_return_state_tip_53') }}</p>
    </div>

    <!-- 商家同意退货申请, 自行邮寄 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 2 && detail.deliveryType == 1">
      <h4 class="fs-12 black">{{ $t('refund_return_state_tip_7', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>
    </div>

    <!-- 已关闭工单 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 6">
      <!-- 超时未填写退货单号，退货单关闭 -->
      <h4 class="fs-14" v-if="detail.closeType == 1">{{ $t('refund_return_state_tip_15') }}</h4>
      <!-- <div class="flex red between mt-12" v-if="detail.closeType == 1">
        <span class="fs-12">{{ $t('total_refund') }}</span>
        <span class="fs-14 fw">{{ $store.state.rate.currency }}{{ detail.realAmount }}</span>
      </div> -->

      <!-- 仅退款驳回申请 -->
      <template v-if="detail.closeType == 4">
        <h4 class="fs-14" >{{ $t('refund_return_state_tip_43', { replace_tip: detail.reason }) }}</h4>
        <p class="mt-12 fs-12 light-grey pre-wrap" v-html="$t('refund_return_state_tip_18', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') })"></p>
      </template>
      
      <!-- 买家拒收商品，退货退款单关闭 -->
      <template v-if="detail.closeType == 5">
        <h4 class="fs-14 fw">{{ $t('refund_return_state_tip_42') }}</h4>
        <p class="mt-12 fs-12 light-grey">{{ $t('refund_return_state_tip_44') }}</p>
      </template>

      <!-- 买家撤销申请 -->
      <h4 v-if="detail.closeType == 6" class="fs-14">{{ $t('refund_return_state_tip_36') }}</h4>
      
      <template v-if="detail.closeType == 8">
        <!-- 均无责任，无需退款 -->
        <div class="fs-14" v-if="detail.responsJudage === 0 && detail.refundJudage === 0">
          <h4 class="black fs-14">{{ $t('refund_return_state_tip_39') }}</h4>
          <p class="light-grey mt-12 fs-12">{{ $t('refund_return_state_tip_29') }}</p>
        </div>
        
        <!-- 均无责任，退款给买家 -->
        <div class="fs-14" v-if="detail.responsJudage === 0 && detail.refundJudage == 1">
          <h4 class="black fs-14">{{ $t('refund_return_state_tip_41') }}</h4>
          <p class="light-grey mt-12 fs-12">{{ $t('refund_return_state_tip_28') }}</p>
        </div>

        <!-- 买家胜诉，无需退款 -->
        <p class="fs-14 light-grey" v-if="detail.responsJudage == 1 && detail.refundJudage === 0">{{ $t('refund_return_state_tip_29') }}</p>

        <!-- 买家胜诉，退款给买家 -->
        <p class="fs-12 light-grey" v-if="detail.responsJudage == 1 && detail.refundJudage == 1">{{ $t('refund_return_state_tip_28') }}</p>

        <!-- 卖家胜诉，无需退款 -->
        <p class="fs-12 light-grey" v-if="detail.responsJudage == 2 && detail.refundJudage === 0">{{ $t('refund_return_state_tip_28') }}</p>

        <!-- 买家胜诉，退款给买家 -->
        <p class="fs-12 light-grey" v-if="detail.responsJudage == 2 && detail.refundJudage == 1">{{ $t('refund_return_state_tip_28') }}</p>

        <!-- 工单违规，无需退款 -->
        <p class="fs-12 light-grey" v-if="detail.responsJudage == 3 && detail.refundJudage === 0">{{ $t('refund_return_state_tip_51') }}</p>

        <!-- 工单违规，退款给买家 -->
        <p class="fs-12 light-grey" v-if="detail.responsJudage == 3 && detail.refundJudage == 1">{{ $t('refund_return_state_tip_30') }}</p>
      </template>

      <!-- 退货退款关闭-买家取消 -->
      <h4 v-if="detail.closeType == 9" class="fs-14">{{ $t('refund_return_state_tip_36') }}</h4>
    </div>

    <!-- 已拒收 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 8">
      <h4 class="fs-14">{{ $t('refund_return_state_tip_17') }}{{ detail.reason }}</h4>
      <p class="fs-12 light-grey pre-wrap mt-12">{{ $t('refund_return_state_tip_19', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</p>
    </div>
    
    <!-- 商家同意退款/退款成功[超时/未超时] -->
    <div class="bg-white plr-12 ptb-20" v-if="((detail.status == 4 || detail.status == 5) && detail.orderType == 1)">
      <!-- 等待系统退款 -->
      <h4 class="fs-14 fw" v-if="detail.status == 4 || detail.status == 3">{{ $t('refund_return_state_tip_10', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>

      <!-- 系统已退款 -->
      <h4 class="fs-14 fw" v-if="detail.status == 5 && detail.isAutoAudit === 0">{{ $t('refund_return_state_tip_13', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>

      <!-- 商家超时未处理 -->
      <h4 class="fs-14 fw" v-if="detail.status == 5 && (detail.isAutoAudit == 1 || detail.isAutoReceiving == 1)">{{ $t('refund_return_state_tip_12', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') }) }}</h4>

      <!-- 退款成功 -->
      <div class="flex red between mt-12" v-if="detail.status == 5">
        <span class="fs-12">{{ $t('total_refund') }}</span>
        <span class="fs-14 fw">{{ $store.state.rate.currency }}{{ detail.realAmount }}</span>
      </div>
    </div>

    <!-- 7->商家/运营驳回申请 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 7 && detail.involvedStatus === 0">
      <h4 class="fs-14 fw">{{ $t('refund_return_state_tip_17') }}{{ detail.reason }}</h4>
      <p class="mt-12 fs-12 light-grey pre-wrap" v-html="$t('refund_return_state_tip_19', { replace_tip: detail.orderType == 1 ? $t('merchant'): $t('platform') })"></p>
    </div>

    <!-- 申请客服介入 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 7 && detail.involvedStatus == 1">
      <h4 class="fs-14 fw">{{ $t('refund_return_state_tip_46') }}</h4>
      <p class="mt-12 fs-12 light-grey pre-wrap" v-html="$t('refund_return_state_tip_47')"></p>
    </div>

    <!-- 平台处理中，请耐心等待 -->
    <div class="bg-white plr-12 ptb-20" v-if="detail.status == 7 && detail.involvedStatus == 2">
      <h4 class="fs-14 fw">{{ $t('refund_return_state_tip_49') }}</h4>
      <p class="mt-12 fs-12 light-grey pre-wrap" v-html="$t('refund_return_state_tip_50')"></p>
    </div>

    <!-- 退货退款/换货 成功, 换货暂时不做 -->
    <!-- <div v-if="detail.returnType == 1" class="bg-green-linear p-20 white tc">
      <p class="fw fs-18">{{ $t('me.afterSale.refundSuccess2') }}</p>
      <p class="mt-20 fs-14">March -5-2020</p>
    </div> -->

    <!-- 查看举证详情 -->
    <van-cell v-if="detail.involvedStatus" class="mt-12 ptb-20 plr-12" :title="$t('view_proof_details')" title-class="fs-14 black" is-link :to="{ name: 'me-aftersale-proof-detail-id', params: { id: detail.workId } }" />

    <!-- 协商历史 -->
    <van-cell :class="{'ptb-20 plr-12': true, 'mt-12': !detail.involvedStatus}" :title="$t('negotiation_history')" title-class="fs-14 black" is-link :to="{ name: 'me-aftersale-negotiation-id', params: { id: detail.id } }" />

    <!-- 订单展示 -->
    <div class="mt-12 bg-white pt-24 plr-20 pb-20">
      <OrderStoreSingle :name="detail.storeName" :showArrow="false" />
      <OrderSingle class="mt-20" :product_num="orderItem.returnQuantity" :product_desc="orderItem.productName" :product_size="orderItem.productAttr" :price="orderItem.productPrice" :image="orderItem.productImage" v-for="orderItem, orderIndex in orderList" :key="'store-product-' + orderIndex" />
    </div>

    <!-- 具体明细 -->
    <van-cell-group class="mt-12">
      <!-- 售后类型 -->
      <van-cell class="ptb-20 plr-20" :title="$t('after_type')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.returnType === 0 ? $t('refund_no_return') : $t('return_refund')"/>
      <!-- 货品状态 -->
      <van-cell class="ptb-20 plr-20" :title="$t('goods_status')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.goodState === 0 ? $t('not_yet_received_the_goods') : $t('have_received_the_goods')"/>
      <!-- 申请原因 -->
      <van-cell class="ptb-20 plr-20" :title="$t('apply_reason')" title-class="fs-14 black flex-2" value-class="tl flex-3 light-grey" :value="detail.applyReason"/>
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
      <!-- 上门取件 -->
      <van-cell class="ptb-20 plr-20" v-if="detail.returnType == 1 && detail.deliveryType == 2">
        <template #default>
          <div class="flex between">
            <p class="fs-14 black">{{ detail.sendName }}  {{ detail.sendPhone }}</p>
            <p class="light-grey fs-14">{{ $t('take_address') }}</p>
          </div>
          <p class="black fs-14 mt-12">{{ $t('address') }}: {{ detail.sendCompleteAddress }}</p>
        </template>
      </van-cell>
      <!-- 退货地址 -->
      <van-cell class="ptb-20 plr-20" v-if="detail.returnType == 1 && (detail.deliveryType == 1 || detail.deliveryType == 2) && detail.receiverName != ''">
        <template #default>
          <div class="flex between">
            <p class="fs-14 black">{{ detail.receiverName }}  {{ detail.receiverPhone }}</p>
            <p class="light-grey fs-14">{{ $t('return_address') }}</p>
          </div>
          <p class="black fs-14 mt-12">{{ $t('address') }}: {{ detail.receiverCompleteAddress }}</p>
        </template>
      </van-cell>
    </van-cell-group>

    <div class="w-100 bg-white btn-content flex hend vcenter">
      <!-- 工单状态involvedStatus： 0未开始 1->待举证 2->平台处理中 3->工单关闭 4->工单已完结 -->
      <!-- status: 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品 -->
      <!-- 订单类型orderType：1->FBM订单 2->FBT订单 -->
      <!-- <div class="mt-8 flex hend"> -->
        <!-- 客服介入 -->
        <BmButton :type="'info'" class="h-32 mr-10 time-out" v-if="(detail.status == 7 || detail.status == 8) && detail.involvedStatus === 0 && detail.orderType == 1 && detail.surplusTime > 0" @btnClick="$router.push({ name: 'me-aftersale-proof-id', params: { id: detail.id } })">{{ $t('customer_service_intervention') }}</BmButton>

        <!-- 修改申请 -->
        <BmButton :type="'info'" class="h-32 mr-10 time-out" v-if="(detail.status == 1 || detail.status == 7) && detail.involvedStatus === 0" @btnClick="onEditApply">{{ $t('modify_the_application') }}</BmButton>

        <!-- 填写运单号 -->
        <BmButton :type="'info'" class="h-32 time-out mr-10" v-if="detail.status == 2 && detail.deliveryType == 1" @btnClick="$router.push({ name: 'me-aftersale-tracking-id', params: { id: detail.id } })">{{ $t('fill_express_number2') }}</BmButton>
        
        <!-- 追加举证 -->
        <BmButton :type="'info'" class="h-32 time-out mr-10" v-if="(detail.status == 7 || detail.status == 8) && detail.involvedStatus == 1 && detail.orderType == 1 && detail.surplusTime > 0" @btnClick="$router.push({ name: 'me-aftersale-proof-id', params: { id: detail.id }, query: { add: detail.workId } })">{{ $t('adduce_evidence') }}</BmButton>

        <!-- 修改快递单号 -->
        <BmButton class="round-0 v-100" v-if="detail.status == 3 && detail.deliveryType == 1" @btnClick="$router.push({ name: 'me-aftersale-tracking-id', params: { id: detail.id }, query: { edit: 1 } })">{{ $t('modify_express_number') }}</BmButton>

        <!-- 撤销申请 -->
        <BmButton class="round-0 v-100" v-if="detail.status == 1 || detail.status == 2 || (detail.status == 7 && detail.involvedStatus === 0) || (detail.status == 8 && detail.involvedStatus === 0)" @btnClick="onRevokeApply">{{ $t('cancel_the_application') }}</BmButton>

        <!-- 撤销工单 -->
        <BmButton class="round-0 v-100" v-if="(detail.status == 7 || detail.status == 8) && (detail.involvedStatus == 1 || detail.involvedStatus == 2)" @btnClick="onCancelApply(detail.workId)">{{ $t('cancel_the_application') }}</BmButton>
        
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
      stepList: [],
      orderList: []
    }
  },
  activated() {
    this.getReturnDetail();
  },
  methods: {
    copy() { // 复制
      let clipboard = new ClipboardJS('.copy-order', {
        text: () => {
          return this.detail.returnSn;
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
    },
    onRevokeApply() { // 撤销申请
      this.$dialog.confirm({
        message: this.$t('cancel_the_after_sales_order'),
        onfirmButtonText: this.$t('confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        revokeApply(this.$route.params.id).then(res => {
          if (res.code != 0) return false;

          this.getReturnDetail();
        }).catch(error => {
          console.log(error);
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
        this.orderList = res.data.orderReturnItems;
        // 状态: 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品
        if (res.data.involvedStatus == 0) {
          if (res.data.returnType == 0) { // 退款
            this.stepActive = res.data.status == 5 ? 2 : 1;
            this.stepList = this.$t('process_step');
          } else if (res.data.returnType == 1) { // 退货退款
            this.stepActive = res.data.status == 1 ? 1 : res.data.status == 2 ? 2 : (res.data.status == 4 || res.data.status == 3) ? 3 : res.data.status == 5 ? 4 : 0;
            this.stepList = res.data.orderType == 1 ? this.$t('process_return_shop_step') : this.$t('process_plantform_return_shop_step');
          }
        } else { // 申请平台介入
          this.stepList = this.$t('process_platform_step');
          this.stepActive = res.data.involvedStatus == 1 ? 1 : res.data.involvedStatus == 2 ? 2: 2;
        }
      }).catch(error => {
        console.log(error);
      })
    },
    onEditApply() { // 修改申请
      this.$router.replace({
        name: 'me-aftersale-apply-type',
        params: {
          type: this.detail.returnType + 1
        },
        query: {
          itemId: this.detail.id,
          edit: 1,
          back: this.$route.fullPath,
          backOrderId: this.$route.query.back && this.$route.query.back.indexOf('orderId') ? this.$route.query.back.split('orderId=')[1] : null
        }
      })
    },
    leftClick() { // 回退，解决由申请页面提交跳转到详情页面，回退时需要回退到列表页面
      // if (this.$route.query.back && this.$route.query.back == 'me-aftersale') {
      if (this.$route.query.back) {
        // this.$router.go(-3);
        this.$router.replace(this.$route.query.back);
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
      }).catch(error => {
        console.log(error);
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
  padding-left: 20px;
  padding-right: 20px;
  .van-step__circle{
    width: 11px;
    height: 11px;
  }
  .van-steps__items{
    margin-bottom: 0;
    padding-bottom: 0;
    .van-step{
      .van-step__title{
        word-break: break-word;
        // width: 80%;
        // text-align: center;
        margin-top: 25px;
        // transform: none;
      }
      .van-step__circle-container, .van-step__line{
        margin-top: 8px;
        top: 0;
      }
      &:first-child{
        .van-step__title{
          // width: 80%;
          text-align: left;
          transform: translateX(-30%);
        }
      }
      &:last-child{
        .van-step__title{
          // width: 80%;
          text-align: right;
          transform: translateX(30%);
        }
      }
    }
  }
}
</style>