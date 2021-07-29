<template>
  <!-- 购物车-确认订单 -->
  <div class="vh-100 bg-grey pb-68 pb-46">
    <BmHeaderNav :left="{ isShow: true }" :fixed="true" title="Confirm the Order" />

    <!-- 个人信息 -->
    <div class="bg-white">
      <van-cell title="Lucy  86-13165265218" label="Gongming street, Guangming District, Shenzhen City, Guangdong Province, China" is-link :to="{ name: 'me-address' }" title-class="fs-14 black" label-class="fs-14 light-grey" class="pt-20 pl-20 pr-14 pb-30" :border="false" />
      <BmImage
        :url="require('@/assets/images/line-icon.svg')"
        :height="'0.1rem'"
        :isLazy="false"
        :isShow="false"
        class="block"
      />
    </div>

    <!-- 订单商品列表 -->
    <div class="mt-12 bg-white plr-20 pb">
      <div v-for="item,index in list" :key="'store-' + index">
        <OrderStoreSingle class="pt-20" />
        <van-card
          title="Women's Handbag High Qua-lity Pure PU Leather For … Women's Handbag High Qua-lity Pure PU Leather For …   "
          class="bg-white pt-24 plr-0 pb-0 custom-card lh-20 width-313"
          thumb="https://img01.yzcdn.cn/vant/cat.jpeg"
          @click="goProductDetail(singleItem.id)"
          v-for="productItem in item.list"
          :key="'product-item-' + productItem.id"
        >
          <!-- 自定义描述区域，改为展示商品型号 -->
          <template #desc>
            <div class="bg-f8 pl-10 mt-8 round-4 flex vcenter pr-10 fit-width">
              <span class="grey pr-24">{{ productItem.color }}/{{ productItem.size }}</span>
              <van-icon name="arrow-down" color="#B6B6B6" size="0.16rem" />
            </div>
          </template>
          <!-- 标签 -->
          <template #tags>
            <div class="flex">
              <span class="mt-8 fs-10 iblock product-tag">Ships from China</span>
            </div>
          </template>
          <!-- 自定义数量 -->
          <template #num>
            <van-stepper v-model="productItem.step" input-width="0.796rem" button-size="0.42rem" :integer="true" class="mt-6 custom-stepper" />
          </template>
          <!-- 自定义价格 -->
          <template #price>
            <div class="mt-8">
              <span class="red fs-16 fw">{{ $store.state.rate.currency }}{{ productItem.price }}</span>
              <span class="grey fs-12 ml-10 line-through">{{ $store.state.rate.currency }}{{ productItem.cost }}</span>
            </div>
          </template>
        </van-card>
      </div>
    </div>

    <!-- 配送 -->
    <van-cell-group>
      <van-cell title="Distribution" is-link center @click="distributionShow = true">
        <template #default>
          <div class="fs-14 light-grey">
            Normal distribution 09:00-21:00 <span class="red">[Monday]</span> 21st
          </div>
        </template>
      </van-cell>
      <!-- 留言 -->
      <van-cell title="Leave message" value="Red/L" />
    </van-cell-group>

    <!-- 合计 -->
    <van-cell-group>
      <!-- 小计 -->
      <van-cell title="Subtotal" :value="$store.state.rate.currency + '1260.00'" title-class="color-black-85" value-class="color-black-85" />
      <!-- 运费 -->
      <van-cell title="Total Freight" :value="$store.state.rate.currency + '19.00'" title-class="color-black-85" value-class="color-black-85" />
      <!-- 总计 -->
      <van-cell >
        <template #default>
          <div class="color-black-85">
            Total: <span class="red">{{ $store.state.rate.currency }} 1260.00</span>
          </div>
        </template>
      </van-cell>
      <!-- 支付方式 -->
      <van-cell title="Pay(by)" value="Online" title-class="color-black-85" value-class="color-black-85" is-link />
    </van-cell-group>

    <!-- 提交 -->
    <div class="flex between vcenter pl-20 w-100 bg-white submit-container">
      <span class="fs-18 red fw">{{ $store.state.rate.currency }} 1260.00</span>
      <BmButton class="round-0 w-120 h-56" @click="onPay">{{ $t('common.submit') }}</BmButton>
    </div>

    <!-- 配送方式 -->
    <van-popup v-model="distributionShow" position="bottom" closeable class="pb-20">
      <h4 class="fs-18 black fw p-20 border-b">Method of distribution</h4>
      <!-- 选择方式 -->
      <van-radio-group v-model="distributionRadio">
        <van-radio name="1" shape="square" class="iblock lh-12 plr-24 mt-30">
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">Normal distribution</BmButton>
          </template>
          <p class="light-grey fs-14 mt-10">Estimated time of delivery: <br/>9:00-21:00 on The 21st[Monday]</p>
        </van-radio>
        <van-radio name="2" shape="square" class="iblock lh-12 plr-24 mt-30">
          <template #icon="props">
            <BmButton :type="'info'" :class="{ 'round-8 h-30': true, 'unchecked-radio': !props.checked ? true: false }">international direct mail</BmButton>
          </template>
          <p class="light-grey fs-14 mt-10">Estimated time of delivery: <br/>9:00-21:00 on The 21st[Monday]</p>
        </van-radio>
      </van-radio-group>

      <div class="mt-150 plr-20">
        <BmButton class="round-8 w-100 h-48" @click="onChangeDistribution">{{ $t('common.confirm') }}</BmButton>
      </div>
    </van-popup>

      <!-- 合并付款 -->
      <van-popup v-model="consolidatedShow" position="bottom" closeable class="pb-20">
        <h4 class="fs-18 black fw p-20 border-b">Consolidated payment</h4>
        <!-- 合计商品 -->
        <van-cell title="COMELY SHOP" center :border="false" :value="$store.state.rate.currency + '49.00'" label="（ 1 item ）" title-class="color-black-85 fs-14" value-class="red fw fs-16" />
        <van-cell title="COMELY SHOP" center :border="false" :value="$store.state.rate.currency + '49.00'" label="（ 1 item ）" title-class="color-black-85 fs-14" value-class="red fw fs-16" />

        <div class="plr-12 flex between mt-40">
          <BmButton :type="'info'" class="fs-16 round-8 w-169 h-48 add-cart-btn" @click="onCancel">Cancel</BmButton>
          <BmButton class="fs-16 round-8 w-169 h-48" @click="goPay">Pay Now</BmButton>
        </div>
    </van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Card, Stepper, Popup, RadioGroup, Radio } from 'vant';
import OrderStoreSingle from '@/components/OrderStoreSingle';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanCard: Card,
    vanStepper: Stepper,
    vanPopup: Popup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    OrderStoreSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      list: [
        {
          id: 1,
          step: 1,
          price: 29.65,
          cost: 39.96,
          color: 'Black',
          size: 'L',
          result: [],
          list: [
            {
              id: 1,
              step: 1,
              price: 29.65,
              cost: 39.96,
              color: 'Black',
              size: 'L',
            },
            {
              id: 2,
              step: 1,
              price: 29.65,
              cost: 39.96,
              color: 'Black',
              size: 'L',
            }
          ],
          isAll: false
        },
        {
          id: 2,
          step: 1,
          price: 29.65,
          cost: 39.96,
          color: 'Black',
          size: 'L',
          result: [],
          list: [
            {
              id: 1,
              step: 1,
              price: 29.65,
              cost: 39.96,
              color: 'Black',
              size: 'L',
            },
            {
              id: 2,
              step: 1,
              price: 29.65,
              cost: 39.96,
              color: 'Black',
              size: 'L',
            }
          ],
          isAll: false
        }
      ],
      distributionShow: false,
      distributionRadio: '1',
      consolidatedShow: false,
      consolidatedRadio: '1'
    }
  },
  methods: {
    onPay() { // 去支付前要先进行二次确认
      this.consolidatedShow = true;
    },
    goPay() { // 去支付
      this.$router.push({
        name: 'me-pay-payment'
      })
    },
    onChangeDistribution() { // 修改配送方式
      this.distributionShow = false;
    },
    onCancel() { // 取消支付

    }
  },
}
</script>

<style lang="less" scoped>
.color-black-85{
  color: rgba(0, 0, 0, .85);
}
.pb-68{
  padding-bottom: 68px;
}
.submit-container{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 56px;
}
.h-56{
  height: 56px!important;
}
.w-120{
  width: 120px;
}
.pb-46{
  padding-top: 46px;
}
.h-30{
  height: 30px!important;
}
.mt-150{
  margin-top: 150px;
}
.plr-24{
  padding-left: 24px;
}
.unchecked-radio{
  border-color: #BFBFBF!important;
  background: #fff!important;
  color: #383838!important;
}
.add-cart-btn{
  border-color: #E5E5E5!important;
  background-color: rgba(255, 118, 18, 0.05)!important;
  color: #EC500D!important;
}
.h-48{
  height: 48px!important;
}
.w-169{
  width: 169px!important;
}
.mt-40{
  margin-top: 40px;
}
</style>