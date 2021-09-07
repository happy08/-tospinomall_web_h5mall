<template>
  <!-- 
    我的-售后-售后申请-售后类型 type: 1仅退款 2退货退款 3换货 
    换货功能暂时不做，故暂时先把选择商品规格的弹窗删除了，之后可以从购物车页面copy一份 
  -->
  <div class="bg-grey v-percent-100 pb-30 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t(title)" :fixed="true" />

    <!-- 订单详情 -->
    <div class="bg-white p-20">
      <template v-if="orderList.length == 1">
        <OrderSingle :image="detailItem.productImage" :product_num="detailItem.returnQuantity" :product_desc="detailItem.productName" :product_size="detailItem.productAttr" :price="detailItem.productPrice"  v-for="(detailItem, orderIndex) in orderList" :key="'order-item-' + orderIndex" />
      </template>
      <template v-else>
        <swiper
          ref="swiperComponentRef"
          :class="{ 'swiper order-page__global-swiper': true, 'swiper-no-swiping' : orderList.length <= 4 }"
          :options="{
            ...swiperComponentOption
          }"
        >
          <swiper-slide v-for="(productItem,productIndex) in orderList" :key="'swiper-' + productIndex" class="round-4 hidden">
            <BmImage 
              :url="productItem.productImage"
              :width="'1.68rem'" 
              :height="'1.68rem'"
              :isLazy="false"
              :isShow="true"
              class="flex-shrink border"
              :alt="productItem.productName"
            />
            <div class="product-price">{{ $store.state.rate.currency }}{{ productItem.productRealAmount }}</div>
          </swiper-slide>
        </swiper>
      </template>

      <!-- 换货的话可以选择换货数量 仅换货时展示 -->
      <van-cell v-if="$route.params.type == 3" class="mt-14 vcenter plr-0 ptb-0" :title="$t('number_of_applications')" title-class="fs-14 light-grey">
        <template #default>
          <van-stepper v-model="stepNumber" input-width="0.796rem" button-size="0.42rem" :integer="true" class="custom-stepper" />
        </template>
      </van-cell>
    </div>
    
    <van-cell-group class="mt-12">
      <!-- 申请类型 -->
      <van-cell class="ptb-20 plr-20" :title="$t('application_type')" title-class="fs-14 black" :is-link="parseFloat(this.$route.params.type) == 1 && detail.status == 1 ? false: true" @click="selectPopup('type')" :value="applyTypeLabel" />
      <!-- 货物状态 -->
      <van-cell class="ptb-20 plr-20" :title="$t('state_of_the_goods')" title-class="fs-14 black" :is-link="parseFloat(this.$route.params.type) == 1 && detail.status == 1 ? false: true" @click="selectPopup('status')" :value="goodsStatusLabel" />
      <!-- 申请原因 -->
      <van-cell class="ptb-20 plr-20" :title="$t('applyReason')" title-class="fs-14 black" is-link @click="selectPopup('reason')" :value="applyReasonLabel" />
      <!-- 换货商品 仅换货时展示 -->
      <!-- <van-cell class="ptb-20 plr-20" v-if="$route.params.type == 3" :title="$t('me.afterSale.replacementGoods')" title-class="fs-14 black" is-link @click="productShow = true" /> -->
    </van-cell-group>

    <!-- 退款金额 -->
    <!-- <van-cell class="ptb-20 plr-20 mt-12" center :title="$t('refund_amount')" title-class="fs-14 black" :label="$t('modify_the_amount')" value-class="black fw fs-18" >
      <template #default>
        <van-field v-model="detail.returnAmount" type="number" input-align="right" :formatter="onFormatter" />
      </template>
    </van-cell> -->
    <div class="p-20 fs-14 mt-12 black">{{ $t('refund_price_tip', { replace_tip: $store.state.rate.currency + detail.payAmount }) }}</div>

    <!-- 申请指令 -->
    <div class="plr-20 pt-20 pb-24 bg-white">
      <h3 class="fs-14 black">{{ $t('apply_for_instructions') }}</h3>
      <van-field
        class="mt-16 fs-14 plr-0"
        v-model="applyMessage"
        rows="2"
        type="textarea"
        :placeholder="$t('apply_for_instructions_tips')"
        :border="false"
      />
      <van-uploader v-model="fileList" multiple :max-count="6" preview-size="1.62rem" :after-read="afterRead" @delete="onDeleteFile">
        <div class="custom-proof-upload tc">
          <van-icon name="plus" size="0.32rem" />
          <div class="mt-10 fs-12 lh-1">{{ $t('add_picture_6') }}</div>
        </div>
      </van-uploader>
      <p class="fs-14 orange mt-10">{{ $t('apply_after_sale_upload_tips') }}</p>
    </div>

    <!-- 电话 -->
    <!-- <van-field v-model="phone" type="tel" :label="$t('me.afterSale.phone')" class="mt-12 p-20" label-width="1.2rem" /> -->

    <!-- 退货方法 退货退款才展示 -->
    <div class="p-20 bg-white mt-12" v-if="$route.params.type == 2">
      <van-cell class="pb-20 pt-0 plr-0" :title="$t('return_method')" title-class="fs-14 black" :value="returnMethodTitle" is-link :border="false" @click="returnMethod = true" />
      <!-- 上门取件,服务协议 -->
      <van-checkbox class="flex vcenter" @click="isGreenment = !isGreenment" v-if="returnMethodRadio == 0">
        <template #icon>
          <BmImage
            :url="isGreenment ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
            :width="'0.32rem'" 
            :height="'0.32rem'"
            :isLazy="false"
            :isShow="false"
            :alt="'Tospino choose icon'"
          />
        </template>
        <span class="fs-14 lh-20 grey-666">{{ $t('pick_up_service_agreement') }}</span>
      </van-checkbox>

      <!-- 上门取件-选择地址 -->
      <van-cell class="mt-20 plr-0 ptb-0" title-class="black ml-12" is-link replace :to="{ name: 'me-address', query: { back: JSON.stringify($route.query), applyType: $route.params.type } }" v-if="returnMethodRadio == 0">
        <!-- 左侧图标 -->
        <template #icon>
          <van-icon :name="require('@/assets/images/icon/address-icon.png')" size="0.48rem" />
        </template>
        <!-- 左侧内容 -->
        <template #title>
          <p class="fs-14 fw lh-20" v-if="address">
            <span>{{ address.name }}</span>
            <span class="ml-10">{{ address.phone }}</span>
          </p>
          <p class="mt-8 lh-20 grey" v-if="address">{{ address.completeAddress }}</p>
        </template>
      </van-cell>

      <!-- 自行寄回 -->
      <p class="fs-14 light-grey pb-10" v-if="returnMethodRadio == 1">{{ $t('self_return_freight_tips') }}</p>
      <van-field
        v-model="concatName"
        :label="$t('contacts')"
        :placeholder="$t('please_enter_contact')"
        v-if="returnMethodRadio == 1"
        class="plr-0 ptb-10"
        :border="false"
      />
      <van-field
        v-model="concatCell"
        :label="$t('contact_phone')"
        :placeholder="$t('please_enter_phone_number')"
        v-if="returnMethodRadio == 1"
        class="plr-0 ptb-10"
        :border="false"
      />
    </div>

    <!-- 是否设置为默认的退货地址 退货退款才展示 -->
    <!-- <van-cell v-if="$route.params.type == 2" center :title="$t('me.address.shipAddress')" :label="$t('me.afterSale.keepSamePickupAddress')" title-class="grey" label-class="black">
      <template #right-icon>
        <van-switch v-model="addressChecked" size="0.48rem" active-color="#34C759" />
      </template>
    </van-cell> -->

    <!-- 提交 -->
    <div class="mlr-20 mt-30 tc">
      <BmButton class="round-8 w-100 mb-20" @btnClick="applyAfterSale">{{ $t('submit') }}</BmButton>
      <!-- 退货退款说明 -->
      <nuxt-link :to="{ name: 'service-type', params: { type: 'aftersale' }, query: { isH5: 1 } }" class="green">{{ $t('return_and_exchange_instructions') }}</nuxt-link>
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
                    :width="'0.32rem'" 
                    :height="'0.32rem'"
                    :isLazy="false"
                    :isShow="false"
                    :alt="'Tospino choose icon'"
                  />
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <!-- 提交按钮 -->
      <div class="plr-20 mt-30 pb-60">
        <BmButton class="fs-16 round-8 w-100" @click="onConfirm">{{ $t('confirm') }}</BmButton>
      </div>
    </van-popup>

    <!-- 退货方式 -->
    <van-popup v-model="returnMethod" position="bottom" closeable>
      <van-radio-group v-model="returnMethodRadio" :border="false">
        <van-cell-group>
          <van-cell class="p-20" :title="$t('returnMethodTitle')" title-class="black fw fs-18" />
          <van-cell class="p-20" :title="returnItem.title" clickable v-for="(returnItem, returnIndex) in $t('returnMethodList')" :key="returnIndex" @click="returnMethodRadio = returnIndex" title-class="fs-14 lh-20" :label="returnItem.desc" label-class="mt-20 w-90">
            <template #right-icon>
              <van-radio :name="returnIndex" icon-size="0.48rem">
                <template #icon="props">
                  <BmImage
                    :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                    :width="'0.32rem'" 
                    :height="'0.32rem'"
                    :isLazy="false"
                    :isShow="false"
                    :alt="'Tospino choose icon'"
                  />
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <!-- 提交按钮 -->
      <div class="plr-20 mt-30 pb-20">
        <BmButton class="fs-16 round-8 w-100" @click="onReturnConfirm">{{ $t('confirm') }}</BmButton>
      </div>
    </van-popup>
  </div>
</template>

<script>
import OrderSingle from '@/components/OrderSingle';
import { Cell, CellGroup, Uploader, Field, Checkbox, Switch, Stepper, Popup, RadioGroup, Radio } from 'vant';
import { aftersaleOrderItem, getOrderReasonList, applyAfterSale, getUpdateReturnDetail, updateApply } from '@/api/order';
import { getPicUrl } from '@/api/user';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

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
    OrderSingle,
    swiper: Swiper,
    swiperSlide: SwiperSlide
  },
  data() {
    return {
      fileList: [],
      phone: '',
      isGreenment: false,
      addressChecked: true,
      stepNumber: 1,
      isSelectType: false,
      typeRadio: 100,
      currentSelect: {
        type: 'type', // type 售后类型 status 获取状态
        title: '', // 标题
        list: '' // 选项
      },
      productShow: false,
      title: '',
      detail: {},
      applyReason: -1, // 售后原因
      applyReasonLabel: '',
      applyType: -1, // 申请类型状态
      applyTypeLabel: '',
      goodsStatus: -1, // 货物状态
      goodsStatusLabel: '',
      cancelReasonList: [],
      imgList: [],
      returnMethod: false,
      returnMethodRadio: 0,
      returnMethodTitle: '',
      applyMessage: '',
      concatName: '',
      concatCell: '',
      address: {},
      orderList: [],
      swiperComponentOption: { // 一排四列 滚动
        slidesPerView: 'auto',
        // slidesPerGroup: 4,
        spaceBetween: 0,
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-group-pagination',
          clickable: true,
        },
      },
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name == 'me-aftersale-apply') {
        vm.applyReason = -1; // 售后原因
        vm.applyReasonLabel = '';
        vm.applyType = -1; // 申请类型状态
        vm.applyTypeLabel = '';
        vm.goodsStatus = -1; // 货物状态
        vm.goodsStatusLabel = '';
        vm.cancelReasonList = [];
        vm.applyMessage = '';
        vm.imgList = [];
        vm.fileList = [];
      }
    });
  },
  activated() {
    if (this.$route.params.type == 1) this.title = 'applyReturn'; // 仅退款
    if (this.$route.params.type == 2) this.title = 'return_refund'; // 退货退款
    // if (this.$route.params.type == 3) this.title = 'me.afterSale.exchange'; // 换货
    this.returnMethodTitle = this.$t('returnMethodList')[this.returnMethodRadio].title;

    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });

    let _ajax = this.$route.query.edit ? getUpdateReturnDetail(this.$route.query.itemId) : aftersaleOrderItem(this.$route.query.itemId);
    
    _ajax.then(res => {
      if (!res.data) return false;
      this.$toast.clear();
      if (this.$route.query.edit) {
        this.detail = {
          ...res.data,
          goodImg: res.data.productImage,
          goodQuantity: res.data.returnQuantity,
          goodName: res.data.productName,
          goodAttr: res.data.productAttr,
          goodPrice: res.data.productPrice
        };
        this.orderList = res.data.orderReturnItems;
        // 申请原因
        this.applyReasonLabel = res.data.applyReason;
        // 申请类型
        this.applyType = res.data.returnType;
        this.applyTypeLabel = this.$t('selectReason')[res.data.returnType];
        // 货品状态
        this.goodsStatus = res.data.goodState;
        this.goodsStatusLabel = this.$t('stateGoodsList')[res.data.goodState];
        // 申请信息
        this.applyMessage = res.data.applyDesc;
        if (res.data.returnType == 1) { // 退货退款
          this.returnMethodRadio = res.data.deliveryType == 1 ? 1 : 0;
          this.returnMethodTitle = this.$t('returnMethodList')[this.returnMethodRadio].title;
          this.concatName = res.data.contactPerson;
          this.concatCell = res.data.contactPhone;
          this.isGreenment = res.data.deliveryType == 1 ? false: true;
          if (this.$route.query.address) {
            this.address = JSON.parse(this.$route.query.address);
          } else {
            this.address = {
              name: res.data.sendName,
              phone: res.data.sendPhone,
              completeAddress: res.data.sendCompleteAddress,
              id: res.data.sendAddressId
            }
          }
        }
        // 凭证图片
        let pics = res.data.proofPics != '' ? res.data.proofPics.split(',') : [];
        this.fileList = pics.map(item => {
          return {
            url: item,
            isImage: true
          }
        })
        this.imgList = pics;
        return false;
      }
      this.detail = res.data.order;
      this.orderList = res.data.orderItemList.map(item => {
        return {
          ...item,
          productImage: item.goodImg,
          returnQuantity: item.goodQuantity,
          productName: item.goodName,
          productAttr: item.goodAttr,
          productPrice: item.goodPrice,
          productRealAmount: item.realAmount
        }
      });
      if (parseFloat(this.$route.params.type) == 1 && res.data.order.status == 1) { // 代发货仅退款
        // 申请类型
        this.applyType = parseFloat(this.$route.params.type) - 1;
        this.applyTypeLabel = this.$t('selectReason')[parseFloat(this.$route.params.type) - 1];
        // 货品状态
        this.goodsStatus = parseFloat(this.$route.params.type) - 1;
        this.goodsStatusLabel = this.$t('stateGoodsList')[parseFloat(this.$route.params.type) - 1];
      }

      if (this.$route.query.address) {
        this.address = JSON.parse(this.$route.query.address);
      } else{
        this.address = {
          name: res.data.order.receiverName,
          phone: res.data.order.receiverPhone,
          completeAddress: res.data.order.receiverCompleteAddress,
          id: res.data.order.receiverAddressId
        }
      }
    })
  },
  methods: {
    onConfirm() { // 提交 售后选项 根据currentSelect.type判断提交类别
      if (this.typeRadio == 100) { // 100表示未选择状态，不可提交
        return false;
      }
      if (this.currentSelect.type == 'type') { // 申请类型
        this.applyType = this.typeRadio;
        this.applyTypeLabel = this.$t('selectReason')[this.typeRadio]
      }
      if (this.currentSelect.type == 'status') { // 货物状态
        this.goodsStatus = this.typeRadio;
        this.goodsStatusLabel = this.$t('stateGoodsList')[this.typeRadio]
      }
      if (this.currentSelect.type == 'reason') { // 申请原因
        this.applyReason = this.typeRadio;
        this.applyReasonLabel = this.cancelReasonList[this.typeRadio].applyReason; 
      }
      this.isSelectType = false;
    },
    selectPopup(type) { // 打开售后选项
      if (type == 'reason') { // 申请类型和货物状态选择之后才可以选择申请原因
        if (this.applyType == -1 || this.goodsStatus == -1) return false;
      }
      
      this.typeRadio = type === 'type' ? this.applyType != -1 ? this.applyType : 100 : type == 'status' ? this.goodsStatus != -1 ? this.goodsStatus : 100 : 100;
      if (type == 'reason') { // 申请原因需要从接口中获取数据
        // 取消订单原因，因为整个列表都是同一种类型，所以就只在全局引入一次就好了
        getOrderReasonList({ orderType: 1, applyType: this.applyType, goodsStatus: this.goodsStatus }).then(res => {
          if (res.code != 0) return false;
          // 修改申请的时候判断当前的选中的原因
          res.data.forEach((item, index) => {
            if (item.applyReason == this.applyReasonLabel) {
              this.applyReason = index;
              this.typeRadio = index;
            }
          })
          this.cancelReasonList = res.data;
          this.currentSelect = {
            type: type,
            title: this.$t('applyReason'),
            list: res.data.map((item, index) => {
              return item.applyReason;
            })
          }
          this.isSelectType = true;
        })
        return false;
      }

      this.currentSelect = {
        type: type,
        title: type === 'type' ? this.$t('returnMethodTitle') : type === 'status' ? this.$t('state_of_the_goods') : type === 'reason' ? this.$t('applyReason') : '',
        // list: type === 'type' ? this.detail.status == 1 ? [this.$t('selectReason')[0]] : this.$t('returnMethodList') : type === 'status' ? this.$t('stateGoodsList') : this.$t('selectReason')
        list: type === 'type' ? parseFloat(this.$route.params.type) == 1 ? [this.$t('selectReason')[0]] : this.$t('selectReason') : type === 'status' ? this.$t('stateGoodsList') : this.$t('selectReason')
      }
      if (parseFloat(this.$route.params.type) == 1 && (type == 'type' || type == 'status') && this.detail.status == 1) { // 待发货仅退款,申请原因和状态不可选
        return false;
      }
      this.isSelectType = true;
    },
    onFormatter(value) { // 输入金额格式化
      return this.$store.state.rate.currency + '' + value;
    },
    async afterRead(file) { // 上传图片
      if (Array.isArray(file)) { // 多张图片
        for (let i = 0; i < file.length; i++) {
          let formData = new FormData();
          formData.append('object', file[i].file);
          const data = await getPicUrl(formData);
          if (data.code != 0) return false;

          this.imgList.push(data.data);
        }
      } else {
        // 单张图片上传
        let formData = new FormData();
        formData.append('object', file.file);
        const data = await getPicUrl(formData);
        if (data.code != 0) return false;

        this.imgList.push(data.data);
      }
      
      this.fileList = this.imgList.map(item => {
        return {
          url: item,
          isImage: true
        }
      })
    },
    applyAfterSale() { // 申请售后/修改售后申请
      // 选择申请原因
      if (this.applyReasonLabel == '') {
        this.$toast(this.$t('apply_reason'));
        return false;
      }
      // 输入申请信息
      if (this.applyMessage == '') {
        this.$toast(this.$t('apply_for_instructions_tips'));
        return false;
      }
      if (this.$route.params.type == 2) { // 退货退款
        // 上门取件-未勾选服务协议
        if (this.returnMethodRadio == 0 && this.isGreenment == false) {
          this.$toast(this.$t('t_agree_pick_up_service_agreement'));
          return false;
        }
        // 自行寄回
        if (this.returnMethodRadio == 1) {
          if (this.concatName == '') {
            this.$toast(this.$t('please_enter_contact'));
            return false;
          }
          if (this.concatCell == '') {
            this.$toast(this.$t('please_enter_phone_number'));
            return false;
          }
        }
      }

      // 参数处理
      let _data = {
        applyReason: this.applyReasonLabel,
        goodState: this.goodsStatus,
        returnType: this.applyType,
        proofPics: this.imgList.join(','),
        productQuantity: this.detail.goodQuantity,
        applyDesc: this.applyMessage,
        deliveryType: this.returnMethodRadio == 0 ? 2 : 1,
        returnAmount: this.detail.payAmount
      };
      
      if (this.$route.params.type == 2) { // 退货退款
        if (this.returnMethodRadio == 0) { // 上门取件
          _data.sendAddressId = this.address.id;
        }
        if (this.returnMethodRadio == 1) { // 自行寄件
          _data.contactPerson = this.concatName;
          _data.contactPhone = this.concatCell;
        }
      }

      if (this.$route.query.edit) {
        _data.id = this.detail.id;
      } else {
        _data.orderId = this.detail.id;
        _data.orderItemId = this.$route.query.itemId;
      }

      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      
      // edit 存在表示修改申请 isBatchReturn:是否整批退 0否1是
      let _ajax = this.$route.query.edit ? updateApply(_data) : applyAfterSale({ ..._data, isBatchReturn: this.detail.status == 1 ? 1 : 0});

      _ajax.then(res => {
        this.$toast.clear();

        // 提交之后数据清空
        this.applyReason = -1; // 售后原因
        this.applyReasonLabel = '';
        this.applyType = -1; // 申请类型状态
        this.applyTypeLabel = '';
        this.goodsStatus = -1; // 货物状态
        this.goodsStatusLabel = '';
        this.cancelReasonList = [];
        this.imgList = [];
        this.fileList = [];
        this.applyMessage = '';
        this.returnMethodRadio = 0;
        this.returnMethodTitle = '';
        this.applyMessage = '';
        this.concatName = '';
        this.concatCell = '';

        // this.$router.go(-1);
        this.$router.push({
          name: 'me-aftersale-detail-id',
          params: {
            id: res.data.orderReturnId
          },
          query: {
            // back: this.$route.query.edit ? 'me-aftersale': ''
            back: 'me-aftersale'
          }
        })
      })
    },
    onDeleteFile() { // 删除选择的图片
      this.imgList = this.fileList.map(item => {
        return item.url;
      })
    },
    onReturnConfirm() { // 选择退货方式
      this.returnMethodTitle = this.$t('returnMethodList')[this.returnMethodRadio].title;
      this.returnMethod = false;
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
.w-90{
  width: 90%;
}
.order-page__global-swiper{
  height: 84px;
  .swiper-slide{
    width: 84px!important;
    position: relative;
    margin-left: 6px;
    &:first-child{
      margin-left: 0;
    }
    .product-price{
      position: absolute;
      bottom: 0;
      width: 82px;
      left: 1px;
      color: #fff;
      background-color: rgba(0, 0, 0, .65);
      text-align: center;
      padding-top: 2px;
      padding-bottom: 2px;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }
  }
}
</style>