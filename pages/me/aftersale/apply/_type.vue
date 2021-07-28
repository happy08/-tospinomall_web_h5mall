<template>
  <!-- 我的-售后-售后申请-售后类型 type: 1仅退款 2退货退款 3换货 -->
  <div class="bg-grey vh-100 pb-30">
    <BmHeaderNav :left="{ isShow: true }" :title="$t(title)" />

    <!-- 订单详情 -->
    <div class="bg-white p-20">
      <OrderSingle :product_num="1" :product_desc="'Hassen’s new fall 2019 suede pointe…'" :product_size="'Black / L'" :price="256.23" />
      <!-- 换货的话可以选择换货数量 仅换货时展示 -->
      <van-cell v-if="$route.params.type == 3" class="mt-14 vcenter plr-0 ptb-0" :title="$t('me.afterSale.applicationNumber')" title-class="fs-14 light-grey">
        <template #default>
          <van-stepper v-model="stepNumber" input-width="0.796rem" button-size="0.42rem" :integer="true" class="custom-stepper" />
        </template>
      </van-cell>
    </div>
    
    <van-cell-group class="mt-12">
      <!-- 申请类型 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.applicationType')" title-class="fs-14 black" is-link @click="selectPopup('type')" />
      <!-- 货物状态 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.stateOfTheGoods')" title-class="fs-14 black" is-link @click="selectPopup('status')" />
      <!-- 申请原因 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.applyReason')" title-class="fs-14 black" is-link @click="selectPopup('reason')" />
      <!-- 换货商品 仅换货时展示 -->
      <van-cell class="ptb-20 plr-20" v-if="$route.params.type == 3" :title="$t('me.afterSale.replacementGoods')" title-class="fs-14 black" is-link @click="productShow = true" />
    </van-cell-group>

    <!-- 退款金额 -->
    <van-cell class="ptb-20 plr-20 mt-12" center :title="$t('me.afterSale.refundAmount')" title-class="fs-14 black" :label="$t('me.afterSale.modifyAmount')" value-class="black fw fs-18" >
      <template #default>
        <van-field v-model="amount" type="number" class="tr"/>
      </template>
    </van-cell>

    <!-- 退货退款才展示 -->
    <p class="fs-14 black m-20" v-if="$route.params.type == 2">On successful refund, you will be returned with $ 90.09 cash</p>

    <!-- 申请指令 -->
    <div class="plr-20 pt-20 pb-24 bg-white">
      <h3 class="fs-14 black">{{ $t('me.afterSale.applyIntructions') }}</h3>
      <p class="mt-16 fs-14 light-grey">{{ $t('me.afterSale.applyIntructionsDesc') }}</p>
      <van-uploader class="mt-10" v-model="fileList" multiple :max-count="6" preview-size="1.62rem">
        <div class="custom-proof-upload tc">
          <van-icon name="plus" size="0.32rem" />
          <div class="mt-10 fs-12 lh-1">Up to 6 Pics</div>
        </div>
      </van-uploader>
      <p class="fs-14 orange mt-10">{{ $t('me.afterSale.applyIntructionsUploadTip') }}</p>
    </div>

    <!-- 电话 -->
    <van-field v-model="phone" type="tel" :label="$t('me.afterSale.phone')" class="mt-12 p-20" label-width="1.2rem" />

    <!-- 退货方法 退货退款才展示 -->
    <div class="p-20 bg-white mt-12" v-if="$route.params.type == 2">
      <van-cell class="ptb-20 plr-20" :title="$t('me.afterSale.returnMethod')" title-class="fs-14 black" value="Door to take" is-link />
      <p class="light-grey">The delivery service is provided by the cooperative express company, The expected fee is $20.09. The specific fee shall be subject to the actual charge of the delivery personnel</p>
      <van-checkbox class="flex vcenter mt-20" @click="isGreenment = !isGreenment">
        <template #icon>
          <BmImage
            :url="isGreenment ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
            :width="'0.34rem'" 
            :height="'0.34rem'"
            :isLazy="false"
            :isShow="false"
          ></BmImage>
        </template>
        <span class="ml-14 fs-14 lh-20 grey-666">Read and agree to the Door-to-Door Pick-up Service Agreement</span>
      </van-checkbox>

      <!-- 地址 -->
      <van-cell class="mt-20 plr-0 ptb-0" :title="'Fulfillment by Tospino'" title-class="black ml-12">
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
            <p class="mt-8 lh-20 grey">5th floor, building 7, Tongfu xufa science and Technology Park</p>
          </div>
        </template>
      </van-cell>
    </div>

    <!-- 是否设置为默认的退货地址 退货退款才展示 -->
    <van-cell v-if="$route.params.type == 2" center :title="$t('me.address.shipAddress')" :label="$t('me.afterSale.keepSamePickupAddress')" title-class="grey" label-class="black">
      <template #right-icon>
        <van-switch v-model="addressChecked" size="0.48rem" active-color="#34C759" />
      </template>
    </van-cell>

    <!-- 提交 -->
    <div class="mlr-20 mt-30 tc">
      <BmButton class="round-8 w-100 mb-20">{{ $t('common.submit') }}</BmButton>
      <!-- 返回和交换指令 仅退款展示 -->
      <nuxt-link :to="{}" class="green" v-if="$route.params.type == 1">{{ $t('me.afterSale.returnAndChange') }}</nuxt-link>
    </div>

    <!-- 选择申请类型type 货物状态status 申请原因reason -->
    <van-popup v-model="isSelectType" position="bottom" closeable>
      <van-radio-group v-model="typeRadio" :border="false">
        <van-cell-group>
          <van-cell class="p-20" :title="currentSelect.title" title-class="black fw fs-18" />
          <van-cell class="p-20" :title="reasonItem" clickable v-for="(reasonItem, index) in currentSelect.list" :key="index" @click="typeRadio = index" title-class="fs-14 lh-20">
            <template #right-icon>
              <van-radio :name="index" icon-size="0.48rem">
                <template #icon="props">
                  <BmImage
                    :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                    :width="'0.48rem'" 
                    :height="'0.48rem'"
                    :isLazy="false"
                    :isShow="false"
                  ></BmImage>
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <!-- 提交按钮 -->
      <div class="plr-20 mt-30 pb-60">
        <BmButton class="fs-16 round-8 w-100" @click="onConfirm">Confirm</BmButton>
      </div>
    </van-popup>

    <!-- 换货商品规格 -->
    <van-sku
      v-model="productShow"
      :sku="sku"
      :goods="goods_info"
      :goods-id="goods_id"
      :hide-stock="sku.hide_stock"
      :quota="quota"
      :quota-used="quota_used"
      :initial-sku="initialSku"
      reset-stepper-on-hide
      reset-selected-sku-on-hide
    >
      <!-- 自定义头部价格展示 -->
      <template #sku-header="props">
        <div class="mlr-20 mt-30 flex">
          <BmImage
            :url="goods_info.picture"
            :width="'2.08rem'" 
            :height="'2.08rem'"
            :isLazy="false"
            :isShow="false"
            :fit="'cover'"
            class="border"
          ></BmImage>
          <!-- 商品价格/id -->
          <div class="ml-12 flex column hend">
            <span class="fs-16 red fw">{{ $store.state.rate.currency }} {{ props.price }}</span>
            <span class="mt-14 fs-10 light-grey">ID: {{goods_id}}</span>
          </div>
        </div>
      </template>

      <template #sku-body-top>
        <div class="mlr-20 ptb-20 border-b">
          <h3 class="fs-14 black fw">Distribution area</h3>
          <van-cell class="mt-10 plr-0 ptb-0" center :title="'Fulfillment by Tospino'" title-class="black ml-12" is-link>
            <!-- 左侧图标 -->
            <template #icon>
              <i class="iconfont icon-dingwei fs-24 black trans-rotate"></i>
            </template>
            <!-- 左侧内容 -->
            <template #title>
              <p class="lh-20 black">5th floor, building 7, Tongfu xufa science and Technology Park</p>
            </template>
          </van-cell>
        </div>
      </template>

      <!-- 商品数量选择区域 -->
      <template #sku-stepper="props">
        <div class="tr plr-20 mt-24">
          <van-stepper v-model="props.selectedNum" input-width="0.796rem" button-size="0.42rem" :integer="true" class="custom-stepper" />
          <div class="mt-20" v-if="props.selectedSkuComb">in stock: {{ props.selectedSkuComb.stock_num }}</div>
        </div>
      </template>

      <!-- 操作按钮区域 -->
      <template slot="sku-actions">
        <div class="mlr-20 mb-12 mt-30">
          <BmButton class="fs-16 round-8 w-100" @click="onConfirm">Confirm</BmButton>
        </div>
      </template>
      
    </van-sku>
    
  </div>
</template>

<script>
import OrderSingle from '@/components/OrderSingle';
import { Cell, CellGroup, Uploader, Field, Checkbox, Switch, Stepper, Popup, RadioGroup, Radio, Sku } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanUploader: Uploader,
    vanField: Field,
    vanCheckbox: Checkbox,
    vanSwitch: Switch,
    vanStepper: Stepper,
    vanPopup: Popup,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanSku: Sku,
    OrderSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let title = '';
    if (route.params.type == 1) title = 'me.afterSale.afterSaleService'; // 仅退款
    if (route.params.type == 2) title = 'me.afterSale.returnRefund'; // 退货退款
    if (route.params.type == 3) title = 'me.afterSale.exchange'; // 换货

    return {
      fileList: [
        { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }
      ],
      phone: '15088736541',
      title: title,
      amount: store.state.rate.currency + '255.00',
      isGreenment: false,
      addressChecked: true,
      stepNumber: 1,
      isSelectType: false,
      typeRadio: 0,
      currentSelect: {
        type: 'type', // type 售后类型 status 获取状态
        title: '', // 标题
        list: '' // 选项
      },
      productShow: false,
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [
          {
            k: 'Color',
            k_id: '1',
            v: [
              {
                id: '30349',
                name: '天蓝色'
              },
              {
                id: '1215',
                name: '白色'
              }
            ],
            k_s: 's1',
            count: 2
          },
          {
            k: 'Size',
            k_id: '2',
            v: [
              {
                id: '1193',
                name: 'S'
              },
              {
                id: '1194',
                name: 'M'
              },
              {
                id: '1195',
                name: 'L'
              },
              {
                id: '1196',
                name: 'XL'
              }
            ],
            k_s: 's2',
            count: 2
          }
        ],
        // 所有 sku 的组合列表，如下是：白色1、白色2、天蓝色1、天蓝色2
        list: [
          {
            id: 2259,
            price: 120, //价格
            s1: '1215',
            s2: '1193',
            s3: '0',
            s4: '0',
            s5: '0',  
            stock_num: 20, //库存 
            goods_id: 946755
          },
          {
            id: 2260,
            price: 110,
            s1: '1215',
            s2: '1194',
            s3: '0',
            s4: '0',
            s5: '0',  
            stock_num: 2, //库存 
            goods_id: 946755
          },
          {
            id: 2257,
            price: 130,
            s1: '30349',
            s2: '1193',
            s3: '0',
            s4: '0',
            s5: '0',  
            stock_num: 40, //库存 
            goods_id: 946755
          },
          {
            id: 2258,
            price: 100,
            s1: '30349',
            s2: '1194',
            s3: '0',
            s4: '0',
            s5: '0',  
            stock_num: 50, //库存 
            goods_id: 946755
          }
        ],
        price: '5.00',
        stock_num: 227, // 商品总库存
        none_sku: false,  // 是否隐藏无规格商品 
        hide_stock: false,  // 是否隐藏剩余库存
        messages: []
      },
      goods_id: '946755', 
      quota: 0, //限购数量 
      quota_used: 0,  //已经购买过的数量
      goods_info: {
        picture:
          'https://img.yzcdn.cn/upload_files/2017/03/16/Fs_OMbSFPa183sBwvG_94llUYiLa.jpeg?imageView2/2/w/100/h/100/q/75/format/jpg' 
      },
      initialSku:{
        s1: "0001",
        s2: "1001",
        selectedNum: 2,
        selectedSkuComb: {
          stock_num: 12
        }
        
      }
    }
  },
  methods: {
    onConfirm() { // 提交 售后选项 根据currentSelect.type判断提交类别

    },
    selectPopup(type) { // 打开售后选项
      this.isSelectType = true;
      this.currentSelect = {
        type: type,
        title: type === 'type' ? this.$t('me.afterSale.selecApplicationType') : type === 'status' ? this.$t('me.afterSale.stateOfTheGoods') : type === 'reason' ? this.$t('me.afterSale.applyReason') : '',
        list: type === 'type' ? this.$t('me.afterSale.selectReason') : type === 'status' ? this.$t('me.afterSale.stateGoodsList') : type === 'reason' ? this.$t('me.afterSale.reasonList') : ''
      }
    }
  },
}
</script>

<style lang="less" scoped>
.custom-proof-upload{
  padding: 23px 7px 15px 6px;
  border: 1px dashed #ccc;
  border-radius: 3.5px;
  color: #ccc;
}
.grey-666{
  color: #666;
}
.mt-18{
  margin-top: 18px;
}
</style>