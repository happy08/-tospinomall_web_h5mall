<template>
  <!-- 我的-订单-订单详情  -->
  <div class="vh-100 bg-grey pb-56">
    <!-- 头部 -->
    <div class="bg-green-linear">
      <BmHeaderNav :left="{ isShow: true }" :border="false" :title="$t(title)" :color="'white'" :bg_color="'bg-green-linear'" />
      <!-- 待付款倒计时 -->
      <div class="mt-10 tc white fs-14 pb-40" v-if="$route.params.type == 1">
        <p>{{ $t('me.order.remaining') }}: 29m 59s</p>
        <p>{{ $t('me.order.orderClosed') }}</p>
      </div>
      <!-- 待收货 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="$route.params.type == 2">
        {{ $t('me.order.sending') }}
      </div>
      <!-- 已收货 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="$route.params.type == 3">
        {{ $t('me.order.doneTip') }}
      </div>
      <!-- 已取消 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="$route.params.type == 4">
        {{ $t('me.order.cancelTip') }}
      </div>
      <!-- 超时取消 -->
      <div class="fs-14 white mt-10 pb-40 plr-30 tc lh-20" v-else-if="$route.params.type == 5">
        {{ $t('me.order.timeoutClosure') }}
      </div>
    </div>

    <!-- 运输方式 -->
    <van-cell class="ptb-20 plr-20" :title="'Fulfillment by Tospino'" is-link title-class="fw black ml-12" :to="{ name: 'me-order-detail-logistics' }">
      <!-- 左侧图标 -->
      <template #icon>
        <BmIcon :name="'huochewuliu'" :width="'0.48rem'" :height="'0.48rem'" :color="'#000'" />
      </template>
    </van-cell>
    
    <!-- 定位地址 -->
    <van-cell class="ptb-20 plr-20" :title="'Fulfillment by Tospino'" title-class="black ml-12">
      <!-- 左侧图标 -->
      <template #icon>
        <i class="iconfont icon-dingwei fs-24 black trans-rotate"></i>
      </template>
      <!-- 左侧内容 -->
      <template #title>
        <div>
          <p class="fs-14 fw lh-20">
            <span>Lucy</span>
            <span class="ml-10">13165340019</span>
          </p>
          <p class="mt-8 lh-20">5th floor, building 7, Tongfu xufa science and Technology Park</p>
        </div>
      </template>
    </van-cell>

    <!-- 订单详情 -->
    <div class="bg-white p-20 tr mt-12">
      <OrderStoreSingle />
      <OrderSingle class="mt-20" :product_num="1" :product_desc="'Hassen’s new fall 2019 suede pointe…'" :product_size="'Black / L'" :price="256.23" />

      <!-- 待付款状态时-添加购物车 -->
      <BmButton v-if="$route.params.type == 1" type="default" plain class="plr-12 round-8 h-30 mt-24" @click="addCart">{{ $t('me.order.addShopCart') }}</BmButton>

      <!-- 待收货状态 / 已收货状态 -->
      <div v-else-if="$route.params.type == 2 || $route.params.type == 3">
        <BmButton type="default" plain class="plr-12 round-8 h-30 mt-24" @click="addCart">{{ $t('me.order.afterSales') }}</BmButton>
        <BmButton :type="'info'" class="h-30 ml-10" @click="addCart">{{ $t('me.order.addShopCart') }}</BmButton>
      </div>

      <!-- 已取消 / 超时取消 -->
      <BmButton v-else-if="$route.params.type == 4 || $route.params.type == 5" :type="'info'" class="h-30 mt-24" @click="addCart">{{ $t('me.order.addShopCart') }}</BmButton>
    </div>

    <!-- 订单信息 -->
    <div class="plr-20 pb-20 pt-10 bg-white mt-12 lh-36">
      <p class="fs-14 black flex vcenter">
        <span>{{ $t('me.order.orderNo') }}: XSD2020071509472000002840</span>
        <i class="iconfont icon-fuzhi fs-20 ml-24 copy-order" @click="copy"></i>
      </p>
      <p class="fs-14 black flex vcenter">{{ $t('me.order.startFrom') }}: 2019-10-21 19:20:30</p>
      <p class="fs-14 black flex vcenter">{{ $t('me.orer.payBy') }}: Online</p>
      <p class="fs-14 black flex vcenter">{{ $t('me.order.time') }}: 2020-07-15 01:47:27</p>
      <p class="fs-14 black flex vcenter">{{ $t('me.order.delivery') }}: Express</p>
    </div>

    <!-- 订单价格 -->
    <div class="plr-20 mt-12 bg-white order-price">
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('me.order.subtotal') }}:</span>
        <span class="fw">{{ $store.state.rate.currency }}259.00</span>
      </p>
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('me.order.freight') }}:</span>
        <span class="fw">{{ $store.state.rate.currency }}21.00</span>
      </p>
      <p class="flex between black fs-14 lh-36">
        <span>{{ $t('me.order.sum') }}:</span>
        <span class="red fw">{{ $store.state.rate.currency }}280.00</span>
      </p>
    </div>

    <!-- 可能喜欢的推荐列表展示 -->
    <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
      <i class="iconfont icon-xinaixin linear-color mr-8"></i>
      {{ $t('common.mayLike') }}
    </van-divider>
    <div class="mlr-12 flex between flex-wrap">
      <ProductTopBtmSingle
        :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
        :detail="{ desc: 'categoryItem.name', price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2, country: 'Ghana' }"
        v-for="(searchItem, searchIndex) in 6" 
        :key="'search-list-' + searchIndex"
      ></ProductTopBtmSingle>
    </div>

    <!-- 待付款 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-if="$route.params.type == 1">
      <!-- 取消订单，点击出现弹窗 -->
      <BmButton :type="'info'" class="black btn-content__evaluation" @click="isCancelShow = true">{{ $t('me.order.cancelOrder') }}</BmButton>
      <!-- 去付款，跳转到付款页面 -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyNow') }}</BmButton>
    </div>

    <!-- 待收货 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-else-if="$route.params.type == 2">
      <!-- 确认收货，点击出现确认弹窗 -->
      <BmButton :type="'info'" class="black btn-content__evaluation" @click="onReceipt">{{ $t('me.order.confirmReceipt') }}</BmButton>
      <!-- Buy Now -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyAgain') }}</BmButton>
    </div>

    <!-- 已收货 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-else-if="$route.params.type == 3">
      <!-- 评价 -->
      <BmButton :type="'info'" class="black btn-content__evaluation" @click="onReceipt">{{ $t('me.order.evaluation') }}</BmButton>
      <!-- Buy Again -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyAgain') }}</BmButton>
    </div>

    <!-- 已取消 / 超时取消 -->
    <div class="w-100 bg-white btn-content flex hend vcenter" v-else-if="$route.params.type == 4 || $route.params.type == 5">
      <!-- Buy Again -->
      <BmButton class="fs-16 ml-10 rount-0 plr-30 btn-content__buy" @click="goPay">{{ $t('me.order.buyAgain') }}</BmButton>
    </div>


    <!-- 待付款-取消订单弹窗 -->
    <van-popup v-model="isCancelShow" position="bottom" closeable>
      <van-cell-group>
        <!-- 取消原因 -->
        <van-cell class="plr-20" title="Reason for Cancel Order">
          <template #label>
            <ul class="fs-14 light-grey">
              <li>1. Order offer may be cancelled altogether</li>
              <li>2. Once the order is cancelled, it cannot be reco-vered</li>
            </ul>
          </template>
        </van-cell>
      </van-cell-group>
      <!-- 取消原因单选 -->
      <van-radio-group v-model="cancelRadio">
        <van-cell-group>
          <van-cell class="p-20" :title="reasonItem" clickable v-for="(reasonItem, index) in $t('me.order.cancelReasons')" :key="index" @click="cancelRadio = index">
            <template #right-icon>
              <van-radio :name="index" icon-size="0.48rem">
                <template #icon="props">
                  <BmImage
                    :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                    :width="'0.32rem'" 
                    :height="'0.32rem'"
                    :isLazy="false"
                    :isShow="false"
                  />
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <!-- 取消之后将订单放入购物车 -->
      <van-cell class="p-20" title-class="light-grey" title="After submission, put this item back into the shopping cart" />
      
      <div class="w-100 plr-12 flex between mt-12 pb-10">
        <BmButton :type="'info'" class="black round-8 w-168 h-48 cancel-btn" @click="isCancelShow = false">Cancel</BmButton>
        <BmButton class="fs-16 round-8 w-168 h-48" @click="cancelConfirm">Confirm</BmButton>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Divider, Popup, RadioGroup, Radio } from 'vant';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import ClipboardJS from 'clipboard';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanDivider: Divider,
    vanPopup: Popup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    OrderSingle,
    OrderStoreSingle,
    ProductTopBtmSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let title = '';
    if (route.params.type == 1) title = 'me.order.pendingDelivery'; // 1  待付款
    if (route.params.type == 2) title = 'me.order.undelivered'; // 2  待收货
    if (route.params.type == 3) title = 'me.order.done'; // 3  已收货
    if (route.params.type == 4) title = 'me.order.cancelTitle'; // 4  已取消
    if (route.params.type == 5) title = 'me.order.tradingClosed'; // 5  交易关闭,超时取消

    return {
      title: title,
      isCancelShow: false,
      cancelRadio: 0
    }
  },
  methods: {
    addCart() { // 添加购物车

    },
    cancelConfirm() { // 提交取消订单
      this.isCancelShow = false;
    },
    goPay() { // 跳转去待付款-支付页面
      this.$router.push({
        name: 'me-pay-payment'
      })
    },
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
    onReceipt() { // 确认收货弹窗
      this.$dialog.confirm({
        message: this.$t('me.order.receiptConfirmTip'),
        onfirmButtonText: this.$t('common.confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {

      }).catch(() => {

      })
    }
  },
}
</script>

<style lang="less" scoped>
.pb-56{
  padding-bottom: 56px;
}
.pb-40{
  padding-bottom: 40px;
}
.grey-97{
  color: #979797;
}
.trans-rotate{
  transform: rotate(360deg);
}
.h-30{
  height: 30px!important;
}
.ml-24{
  margin-left: 24px;
}
.lh-36{
  line-height: 36px;
}
.order-price{
  padding-top: 15px;
  padding-bottom: 19px;
}
.btn-content{
  position: fixed;
  bottom: 0;
  height: 56px;
  .btn-content__buy{
    height: 100%;
  }
  .btn-content__evaluation{
    height: 36px!important;
    border-color: #eee!important;
    background-color: transparent!important;
  }
}
.cancel-btn{
  border-color: #eee!important;
  background-color: transparent!important;
}
.h-48{
  height: 48px!important;
}
.w-168{
  width: 168px;
}
</style>