<template>
  <!-- 商品详情页面 -->
  <div class="vh-100 bg-grey pb-56">
    <van-sticky
      ref="detailStickyContainer"
      :offset-top="0"
      @scroll="stickyScroll"
    >
      <BmHeaderNav
        :left="{ isShow: isScroll ? true : false }"
        :bg_color="!isScroll ? 'col-transparent' : 'white'"
        :border="false"
        :color="!isScroll ? 'white' : 'black'"
        :class="{ fixed: !isScroll }"
      >
        <div slot="header-left" class="flex between">
          <van-icon
            :name="require('@/assets/images/icon/back-icon.png')"
            size="0.64rem"
            v-show="!isScroll"
            @click="leftBack"
          ></van-icon>
          <nuxt-link
            :to="{ name: 'search' }"
            class="sticky-opacity ml-14"
            v-slot="{ navigate }"
          >
            <div @click="navigate" role="link">
              <van-search v-model="searchVal" disabled class="round-20 hidden" />
            </div>
          </nuxt-link>
        </div>

        <div slot="header-right">
          <van-icon
            :name="require('@/assets/images/icon/cart-bgd.svg')"
            size="0.64rem"
            class="mt-6"
          />
        </div>
      </BmHeaderNav>
    </van-sticky>

    <!-- 导航栏, 滚动导航 -->
    <van-tabs
      v-model="tabActive"
      scrollspy
      sticky
      offset-top="0.92rem"
      title-active-color="#FF6666"
      line-height="0"
      title-inactive-color="#383838"
      class="product-tab-content"
      ref="detailTabContainer"
    >
      <van-tab title="Short" name="Short">
        <!-- 商品轮播图 -->
        <swiper
          ref="swiperComponentRef"
          :options="swiperOption"
          class="swiper-container"
        >
          <swiper-slide
            v-for="(productItem, productIndex) in carouselMapUrls"
            :key="productIndex"
            @click.native="onPreviewPic(productIndex)"
          >
            <BmImage
              :url="productItem.imgUrl"
              :width="'7.5rem'"
              :height="'7.5rem'"
              :isLazy="false"
              :isShow="false"
              :fit="'cover'"
            />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>

        <!-- 商品介绍 -->
        <div class="mt-12 bg-white plr-20 ptb-14">
          <div>
            <span class="fs-16 red fw"
              ><span class="fm-menlo">{{ $store.state.rate.currency }}</span
              ><span class="fm-din">{{ goodSpuVo.minPrice }}</span></span
            >
            <!-- 促销价 -->
            <!-- <span class="ml-8 grey line-through">{{ $store.state.rate.currency }}260.00</span> -->
          </div>
          <!-- 最小订货量/销售量 -->
          <!-- <div class="fs-12 red">
            <span class="plr-12 ptb-4 round-8 tag-bgd mt-8 iblock fm-helvetica">MOQ: 1PCS</span>
            <span class="plr-12 ptb-4 round-8 tag-bgd mt-8 iblock fm-helvetica">Sold: 20PCS</span>
          </div> -->
          <!-- 商品标题 -->
          <p class="fs-14 block mt-12 fm-helvetica">
            {{ goodSpuVo.goodTitle }}
          </p>
        </div>

        <!-- 运费 -->
        <div class="mt-12 bg-white plr-20">
          <van-cell
            class="ptb-14 plr-0"
            is-link
            :border="false"
            @click="addressShow = true"
          >
            <template #title>
              <div class="flex vcenter">
                <span class="fw fs-12 block">{{ $t("cart.freight") }}</span>
                <!-- <span
                  class="ml-12 fs-12 grey fm-helvetica"
                  @click="deliveryShow = true"
                  >{{ $t("cart.delivery") }}: CHY0.00</span
                > -->
                <span class="ml-12 fs-12 grey fm-helvetica">{{ completeAddress ? completeAddress : '请选择收货地址'}}</span>
              </div>
            </template>
          </van-cell>
          <!-- 货源地到收货地 -->
          <template v-if="completeAddress">
            <!-- 步骤条 -->
            <van-steps :active="freightActive" class="mt-20 plr-0">
              <!-- 发货地址 -->
              <van-step>
                {{ storeInfo.deliveryCountryName }}
                <!-- 自定义未激活状态图标 -->
                <template #inactive-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/plane-default.png')"
                    size="0.48rem"
                  />
                </template>
                <!-- 自定义激活状态图标 -->
                <template #active-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/plane-active.png')"
                    size="0.48rem"
                  />
                </template>
                <!-- 自定义激活状态图标 -->
                <template #finish-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/plane-active.png')"
                    size="0.48rem"
                  />
                </template>
              </van-step>
              <!-- 配送类型( 1 FBM 2 FBT ) FBM不展示中转站 -->
              <van-step v-if="goodSpuVo.deliveryType != 1">
                Accra
                <!-- 自定义未激活状态图标 -->
                <template #inactive-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/transfer-default.png')"
                    size="0.48rem"
                  />
                </template>
                <!-- 自定义激活状态图标 -->
                <template #active-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/transfer-active.png')"
                    size="0.48rem"
                  />
                </template>
                <!-- 自定义激活状态图标 -->
                <template #finish-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/transfer-active.png')"
                    size="0.48rem"
                  />
                </template>
              </van-step>
              <!-- 收货地址 -->
              <van-step>
                {{ completeAddress }}
                <!-- 自定义未激活状态图标 -->
                <template #inactive-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/arrive-default.png')"
                    size="0.48rem"
                  />
                </template>
                <!-- 自定义激活状态图标 -->
                <template #active-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/arrive-active.png')"
                    size="0.48rem"
                  />
                </template>
                <!-- 自定义激活状态图标 -->
                <template #finish-icon>
                  <van-icon
                    :name="require('@/assets/images/icon/arrive-active.png')"
                    size="0.48rem"
                  />
                </template>
              </van-step>
            </van-steps>
            <p class="mt-16 fs-14 light-grey fm-helvetica">
              Finish the order before 23:59 today, and the goods are expected to
              be delivered before 23:30 on janu-ary 2nd.
            </p>
            <p class="mt-8 orange fs-12 pb-10">From January 3rd to January 27th</p>
          </template>
        </div>
      </van-tab>
      <van-tab title="Param" name="Param">
        <!-- 选择产品规格 -->
        <div class="mt-12 bg-white plr-20 pb-24">
          <van-cell
            class="ptb-14 plr-0"
            is-link
            :border="false"
            @click="onSelect"
          >
            <template #title>
              <div class="flex vcenter">
                <span class="fw fs-12 block">{{ $t("cart.select") }}</span>
                <span class="ml-12 fs-12 grey fm-helvetica"
                  >Color:Red,Blue</span
                >
              </div>
            </template>
          </van-cell>
          <!-- 商品图片 -->
          <div class="flex between pr-10">
            <BmImage
              :url="selectItem.skuPicture"
              :width="'2rem'"
              :height="'2rem'"
              :isLazy="false"
              :isShow="true"
              :fit="'cover'"
              v-for="(selectItem, selectIndex) in selectCarousel"
              :key="'select-' + selectIndex"
              class="round-4 border"
            />
          </div>
          <!-- 商品服务与承诺 -->
          <van-cell
            :title="serviceItem"
            v-for="(serviceItem, serviceIndex) in servicePromises"
            :key="'service-' + serviceIndex"
            :border="false"
            class="p-0 pt-10"
            title-class="fs-14 black ml-8 fm-helvetica"
            :icon="require('@/assets/images/icon/tip-icon.svg')"
          />
        </div>

        <!-- 商品评论 -->
        <div class="mt-12 bg-white pt-16 pb-20">
          <h3 class="black flex between vcenter plr-20 fn fm-helvetica">
            <span class="fs-16"
              >{{ $t("cart.topReviewer") }}
              {{ hotEvaluates.total | reviewNumFormat }}</span
            >
            <!-- 更多评论 -->
            <nuxt-link class="fs-14" :to="{ name: 'me-order-rate-detail-list', query: { id: goodSpuVo.id } }">{{ $t("cart.more") }}</nuxt-link>
          </h3>
          <!-- 评论展示 -->
          <div
            v-for="(reviewItem, reviewIndex) in hotEvaluates.lists"
            :key="'reviewItem-' + reviewIndex"
          >
            <!-- 评论人信息 -->
            <div class="mt-14 flex between plr-20">
              <div class="flex vcenter">
                <van-icon
                  :name="
                    reviewItem.buyerPortrait
                      ? reviewItem.buyerPortrait
                      : require('@/assets/images/icon/user-icon.png')
                  "
                  size="0.72rem"
                  color="#EC500D"
                />
                <div class="ml-8">
                  <p class="fs-14 black fm-helvetica">
                    {{ reviewItem.buyerName }}
                  </p>
                  <van-rate
                    class="mt-4"
                    v-model="reviewItem.goodsScores"
                    allow-half
                    size="0.24rem"
                    color="#F7B500"
                    readonly
                    void-color="#DDDDDD"
                    void-icon="star"
                  />
                </div>
              </div>
              <div class="grey fs-14 fm-helvetica">
                {{ reviewItem.createTime }}
              </div>
            </div>
            <!-- 描述 -->
            <p class="mt-12 fs-14 black plr-20 fm-helvetica">
              {{ reviewItem.content }}
            </p>
            <!-- 图片 -->
            <swiper
              ref="swiperReviewRef"
              :options="reviewOption"
              class="mt-12 pl-20 review-swiper"
              v-if="reviewItem.pictures.length"
            >
              <swiper-slide
                v-for="(reviewPicItem, reviewPicIndex) in reviewItem.pictures"
                :key="'review-picture-' + reviewPicIndex"
              >
                <BmImage
                  :url="reviewPicItem.imgUrl"
                  :width="'2rem'"
                  :height="'2rem'"
                  :isLazy="false"
                  :isShow="false"
                  :fit="'cover'"
                  class="border round-4"
                />
              </swiper-slide>
            </swiper>
            <!-- 回复 -->
            <div
              class="p-12 round-4 mt-12 fs-14 bgd-f8 mlr-20 fm-helvetica"
              v-for="(replyItem, replyIndex) in reviewItem.replys"
              :key="'reply-' + replyIndex"
            >
              <span class="red"
                >{{ replyItem.replyName }} {{ $t("cart.reply") }}:</span
              >
              <span class="black">{{ replyItem.replyContent }}</span>
            </div>
            <!-- 规格 -->
            <div class="mt-12 plr-20">
              <span class="grey fs-14 ptb-2 plr-10 bgd-f8 round-4 fm-helvetica"
                >{{ $t("cart.specification") }}:{{ reviewItem.saleAttr }}</span
              >
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="Similar" name="Similar">
        <!-- 可能感兴趣的 -->
        <div class="mt-12 bg-white ptb-20">
          <h3 class="black flex between vcenter plr-20 fn fm-helvetica">
            <span class="fs-16">{{ $t("cart.justForYou") }}</span>
            <nuxt-link class="fs-14" :to="{ }">{{ $t("cart.more") }}</nuxt-link>
          </h3>
          <!-- 推荐商品 -->
          <swiper
            ref="swiperRecommendRef"
            :options="recommendOption"
            class="mt-12 pl-20 review-swiper"
            v-if="likeList.length"
          >
            <swiper-slide
              v-for="(productItem, productIndex) in likeList"
              :key="'like-index-' + productIndex"
            >
              <BmImage
                :url="productItem.imgUrl"
                :width="'2rem'"
                :height="'2rem'"
                :isLazy="false"
                :isShow="false"
                :fit="'cover'"
                class="border round-4"
              />
            </swiper-slide>
          </swiper>
        </div>
      </van-tab>
      <van-tab title="Details" name="Details" class="fs-0">
        <!-- 产品说明信息 -->
        <div
          class="mt-12 bg-white ptb-12 plr-20 fs-14 black fm-helvetica"
          v-if="goodSpuVo.description"
          v-html="goodSpuVo.description"
        ></div>
        <BmImage
          v-for="detailItem in detailsPics"
          :key="'product-detail-id-' + detailItem.id"
          :url="detailItem.imgUrl"
          :isLazy="false"
          :isShow="false"
        />
      </van-tab>
    </van-tabs>

    <!-- 支付方式 -->
    <van-popup v-model="deliveryShow" position="bottom" closeable class="pb-30">
      <div class="plr-20 pt-20 pb-30">
        <h3 class="black fs-18">Delivery Method</h3>
        <!-- 运送费 -->
        <van-cell
          title="Delivery fee"
          :border="false"
          class="plr-0 pt-12 pb-0"
          title-class="fs-16 black fw"
          label="Ф0.00"
          label-class="fs-14 black"
        />
        <!-- 交货地点 -->
        <van-cell
          title="Delivery place"
          :border="false"
          class="plr-0 pt-12 pb-0"
          title-class="fs-16 black fw"
          label="china"
          label-class="fs-14 black"
        />
        <!-- 配送地址 -->
        <van-cell
          title="Shipping address"
          :border="false"
          class="plr-0 pt-12 pb-0"
          title-class="fs-16 black fw"
          label="No.007, Matian Street, Baoan District, Shenzhen,Guangdong"
          label-class="fs-14 black"
        />
        <!-- 预计到达时间 -->
        <van-cell
          title="Estimated arrival time"
          :border="false"
          class="plr-0 pt-28 pb-0"
          title-class="fs-16 black fw"
          label="The order is completed before 23:59 today, and it is  expected to be shipped before 23:30 on January 2. Delivery from January 3rd to January 27th"
          label-class="fs-14 black"
        />
      </div>
      <!-- 按钮 -->
      <div class="plr-12 flex between">
        <BmButton :type="'info'" class="fs-16 round-8 w-169 h-48 add-cart-btn" @click="onAddCart" >Add to cart</BmButton>
        <BmButton class="fs-16 round-8 w-169 h-48" @click="onBuyNow">Buy Now</BmButton>
      </div>
    </van-popup>

    <!-- 选择产品规格 -->
    <van-sku
      v-model="productShow"
      :sku="sku"
      :goods="goodSpuVo"
      :goods-id="goodSpuVo.id"
      :hide_stock="false"
      @sku-selected="getSkuInfo"
      :initial-sku="initialSku"
      hide-selected-text
      hide-stock
      ref="productSku"
      class="custom-sku-container"
    >
      <!-- 自定义头部价格/展示商品id -->
      <template #sku-header-price="props">
        <div class="fs-16 red fw flex vcenter">
          <span class="fm-menlo">{{ $store.state.rate.currency }}</span>
          <span class="fm-din">{{ props.price }}</span>
        </div>
        <div class="mt-14 fs-12 light-grey fm-pf-r" v-if="props.selectedSkuComb">ID: {{ props.selectedSkuComb.id }}</div>
      </template>

      <!-- 商品数量选择区域 -->
      <template #sku-stepper="props">
        <div class="tr plr-20 mt-24">
          <van-stepper
            v-model="props.selectedNum"
            input-width="0.796rem"
            button-size="0.42rem"
            :integer="true"
            class="custom-stepper"
            :max="props.selectedSkuComb ? props.selectedSkuComb.stock_num : 100000"
            @change="getSkuInfo(props, 'stepper')"
          />
          <div class="mt-20" v-if="props.selectedSkuComb">
            in stock: {{ props.selectedSkuComb.stock_num }}
          </div>
        </div>
      </template>

      <!-- 操作按钮区域 -->
      <template #sku-actions="props">
        <!-- 产品规格的选择 -->
        <template v-if="skuType === 1">
          <!-- 缺货 -->
          <div class="mlr-12 mb-30 mt-10" v-if="props.selectedSkuComb && props.selectedSkuComb.stock_num == 0">
            <BmButton class="fs-16 round-8 w-100 h-48 bg-ddd" @click="onOutStock">out of stock</BmButton>
          </div>
          <div class="mlr-12 mb-12 mt-10 flex between" v-else>
            <!-- 加入购物车 -->
            <BmButton :type="'info'" class="fs-16 round-8 w-169 h-48 add-cart-btn" @click="onConfirm">Add to cart</BmButton>
            <!-- 立即购买 -->
            <BmButton class="fs-16 round-8 w-169 h-48" @click="onBuyNow">Buy Now</BmButton>
          </div>
        </template>
        <!-- 加入购物车 -->
        <template v-else>
          <div class="mlr-12 mb-12 mt-10">
            <BmButton class="fs-16 round-8 w-100 h-48" @click="onConfirm">确认</BmButton>
          </div>
        </template>
        
      </template>
    </van-sku>

    <!-- 地址选择 -->
    <van-popup v-model="addressShow" position="bottom" closeable class="ptb-20" style="min-height: 80%;" @close="closePopup">
      <h4 class="fs-18 black lh-20 tc plr-20">Choose a country or region</h4>
      <!-- 地址选择步骤条 -->
      <van-steps direction="vertical" :active="stepActive" class="mt-24" @click-step="stepClick">
        <van-step v-for="item, stepIndex in stepArr" :key="'step-' + stepIndex">
          <template #active-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <template #inactive-icon>
            <BmIcon :name="'dot1'" :color="'#eee'"></BmIcon>
          </template>
          <template #finish-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <p class="fs-16 black">{{ item.name ? item.name : chooseTitle }}</p>
        </van-step>
        <van-step v-if="isShowChooseTitle">
          <template #active-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <template #inactive-icon>
            <BmIcon :name="'dot1'" :color="'#eee'"></BmIcon>
          </template>
          <template #finish-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <p class="fs-16 black">{{ chooseTitle }}</p>
        </van-step>
      </van-steps>
      <div class="border-b mt-10 w-100"></div>
      <!-- 进行选择 -->
      <div class="mt-20 plr-24">
        <p class="fs-14 grey-1">{{ chooseTitle }}</p>
        <ul class="plr-24 fs-16 black">
          <li class="mt-20" v-for="city, cityIndex in chooseList" :key="'city-' + cityIndex" @click="changeCity(city)">{{ city.name }}</li>
        </ul>
      </div>
    </van-popup>

    <!-- 加入购入车/收藏/店铺/立即购买 -->
    <div class="bg-white flex vcenter between pl-10 product-detail__operate">
      <div>
        <!-- 客服 -->
        <!-- <van-icon
          :name="require('@/assets/images/icon/chat-icon.png')"
          size="0.6rem"
        /> -->
        <!-- 店铺 -->
        <nuxt-link :to="{ name: 'cart-store-id', params: { id: storeInfo.storeId }, query: { sellerId: storeInfo.sellerId} }">
          <van-icon :name="require('@/assets/images/icon/store-icon.png')" size="0.6rem" />
        </nuxt-link>
        <!-- 收藏 0未关注 1已关注 -->
        <van-icon :name="goodSpuVo.isAttention ? require('@/assets/images/icon/collect-active-icon.png') : require('@/assets/images/icon/collect-icon.png')" size="0.6rem" @click="attentionProduct" />
      </div>
      <div class="flex">
        <!-- 加入购物车 -->
        <BmButton
          :type="'info'"
          class="fs-16 round-0 w-120 h-56 add-cart-btn border-no"
          @click="onAddCart"
          >Add to cart</BmButton
        >
        <!-- 立即购买 -->
        <BmButton class="fs-16 round-0 w-120 h-56" @click="onBuySku"
          >Buy Now</BmButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Cell, Step, Steps, Rate, Sticky, Search, Tab, Tabs, Popup, Sku, Stepper } from 'vant';
import { getDeliveryInfo, getSkuStock, attentionProduct, addCart } from '@/api/cart';
import { getCurrentDefaultAddress, getNextArea } from '@/api/address';

export default {
  components: {
    vanCell: Cell,
    vanStep: Step,
    vanSteps: Steps,
    vanRate: Rate,
    vanSticky: Sticky,
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs,
    vanPopup: Popup,
    vanSku: Sku,
    vanStepper: Stepper
  },
  data() {
    return {
      carouselMapUrls: [],
      isImgPreview: false,
      previewImages: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        }
      },
      goodSpuVo: {
        minPrice: 0
      }, // 商品基本信息
      detailsPics: [], // 商品详情图集合
      hotEvaluates: {
        total: 0
      }, // 商品热评
      storeInfo: {
        storeId: ''
      }, // 店铺信息
      servicePromises: [], // 商品的服务与承诺
      freightActive: 0,
      rate: 3,
      reviewOption: {
        slidesPerView: 'auto',
        spaceBetween: 12
      },
      recommendOption: {
        slidesPerView: 'auto',
        spaceBetween: 12
      },
      searchVal: '',
      tabActive: 'Short',
      deliveryShow: false,
      productShow: false, // 是否展示商品规格
      sku: {
        tree: [],
        list: []
      },
      initialSku: { // 初始化商品格式/已选择的商品格式
        selectedNum: 3
      },
      isScroll: false,
      addressShow: false,
      stepActive: 0,
      stepArr: [],
      isShowChooseTitle: true,
      chooseList: [],
      form: {
        address: '', // 详细地址
        countryCode: '', //国家编码
        provinceCode: '', // 省份编码
        cityCode: '', // 市编码
        districtCode: '', //区编码
      },
      assgnStepList: [],
      completeAddress: '',
      selectSku: null,
      likeList: [], // 推荐商品列表
      selectCarousel: [], // 产品选择的图片展示列表
      skuType: 1, // 1 从select处进入产品规格选择 2 加入购物车 3 立即购买
    }
  },
  async fetch() {
    // 判断登录之后，获取详情时要带userid
    let _detailParams = {};
    if (this.$store.state.user.userInfo) {
      _detailParams.userId = this.$store.state.user.userInfo.id
    }
    const detailData = await this.$api.getProductDetail(this.$route.params.id, _detailParams); // 获取商品详情;

    if (!detailData.data) return false;

    this.carouselMapUrls = detailData.data.carouselMapUrls; // 商品轮播图
    this.previewImages = detailData.data.carouselMapUrls.map(item => { // 轮播图预览图片
      return item.imgUrl;
    })
    
    this.hotEvaluates = {  // 商品热评
      total: detailData.data.totalEvaluateNum,
      lists: detailData.data.hotEvaluates
    };
    this.servicePromises = detailData.data.servicePromises; // 商品的服务与承诺
    this.detailsPics = detailData.data.detailsPics; // 商品详情中的图片集合
    this.goodSpuVo = { // 商品基本信息
      ...detailData.data.goodSpuVo,
      picture: detailData.data.goodSpuVo.mainPictureUrl
    };
    
    this.storeInfo = detailData.data.storeInfo; // 店铺信息
    // 商品规格格式化
    this.sku = {
      tree: [],
      list: [],
      price: detailData.data.goodSpuVo.minPrice,
      // stock_num: 0, // 总库存
      hide_stock: true, //是否隐藏商品剩余库存
    };
    let _skuList = [];
    detailData.data.saleAttr.forEach((item, itemInxdex) => { // 规格种类
      this.sku.tree.push({
        k: item.attrName, // 规格类目名称
        k_id: item.attrId,
        k_s: 's' + item.attrId, // sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
        v: [],
        largeImageMode: false
      })
      item.attrValues.forEach((attrItem, attrIndex) => { // 种类属性
        this.sku.tree[itemInxdex].v.push({
          id: attrItem.attrValueId,
          name: attrItem.attrValue,
          // previewImgUrl: attrItem.attrPicture
        })

        attrItem.skuList.forEach(skuItem => { // 商品组合列表
          _skuList.push({ // sku 组合列表
            id: skuItem.skuId,
            [this.sku.tree[itemInxdex].k_s]: attrItem.attrValueId,
            price: skuItem.skuPrice * 100, // list中的价格单位是分，所以需要乘以100
            stock_num: skuItem.stockNum,
            skuPicture: skuItem.skuPicture,
            name: attrItem.name
          })
        })
      })
    })

    // 数组合并去重
    let arr = [];
    _skuList.forEach((item) => {
      let flag = true;
      let obj = item;
      arr.forEach((newItem, index) => {
        if (item.id === newItem.id) { // id一直合并对象属性
          newItem.stock_num = newItem.stock_num < item.stock_num ? newItem.stock_num : item.stock_num; // 库存选择相比较小的那一个
          obj = {
            ...item,
            ...newItem
          }
          arr[index] = obj;
          flag = false;
        }
      })
      if (flag) {
        arr.push(obj);
      }
    })
  
    this.sku.list = arr;
    this.selectCarousel = arr.filter((item,index) => {
      return index < 3;
    }); // 商品选择的图片集合
    this.initialSku = this.selectSku = {
      ...arr[0],
      selectedNum: 1
    }
  },
  activated() {
    getCurrentDefaultAddress().then(res => { // 查看是否有默认地址
      if (res.code != 0) return false;
      if (res.data.length === 0) { // 没有默认地址的情况下获取国家列表
        this.getNextArea({ id: 0 });
        return false;
      };
      this.stepArr = res.data.areaList;
      this.stepActive = res.data.areaList.length - 1;
      this.isShowChooseTitle = false;
      this.form = {
        // address: res.data.address, // 详细地址
        countryCode: res.data.countryCode, //国家编码
        provinceCode: res.data.provinceCode, // 省份编码
        cityCode: res.data.cityCode, // 市编码
        districtCode: res.data.districtCode //区编码
      }
      this.completeAddress = res.data.completeAddress; // 完整地址
      // 获取地址的时候默认是最后一级
      this.getNextArea(res.data.areaList[res.data.areaList.length - 2], false, true);
      // 获取运费模板
      this.getDeliveryInfo();
    })
    // 如果上次请求超过一分钟了，就再次发起请求
    if (this.$fetchState.timestamp <= Date.now() - 60000) {
      this.$fetch();
    }
  },
  head() {
    return {
      title: this.goodSpuVo.goodTitle + 'Tospino Ghana online shopping',
      meta: [
        { hid: 'description', name: 'description', content: this.goodSpuVo.goodTitle || 'Tospino Ghana online shopping' },
        { hid: 'keywords', name: 'keywords', content: this.goodSpuVo.goodTitle || 'Tospino Ghana online shopping' }
      ]
    }
  },
  filters: {
    reviewNumFormat(val) { // 评论数字格式化
      return val > 100 ? val + '+' : val;
    }
  },
  computed: {
    chooseTitle() {
      if (this.form.countryCode === '') {
        return '选择国家';
      }
      if (this.form.provinceCode === '') {
        return '选择州/省/地区';
      }
      if (this.form.cityCode === '') {
        return '选择城市';
      }
      return '选择街道或城镇';
    }
  },
  methods: {
    stickyScroll(scrollObj) { // 吸顶滚动事件
      if (scrollObj.isFixed) {
        // 滚动时格式化样式 sticky-scroll
        if (scrollObj.scrollTop > 2) {
          this.$refs.detailStickyContainer.$el.classList.add('detail-sticky-scroll');
          this.$refs.detailTabContainer.$el.classList.add('sticky-nav');
          this.isScroll = true;
        }
        if (scrollObj.scrollTop < 50) {
          this.$refs.detailStickyContainer.$el.classList.remove('detail-sticky-scroll');
          this.$refs.detailTabContainer.$el.classList.remove('sticky-nav');
          this.isScroll = false;
        }
      }
    },
    async onBuyNow() { // 立即购买 num大于0才可以进行下一步操作
      const num = await this.getSkuStock();
      console.log(num);
    },
    async onAddCart() { // 加入购物车 num大于0才可以进行下一步操作
      this.productShow = true;
      this.skuType = 2;
      // const num = await this.getSkuStock();
      // if (num > 0) {
      //   addCart({ quantity: this.selectSku.selectedNum, skuId: this.selectSku.selectedSkuComb.id }).then(res => {
      //     console.log(res)
      //   })
      // }
    },
    onOutStock() { // 缺货

    },
    stepClick(step) { // step点击事件
      if (step == this.stepArr.length && this.isShowChooseTitle) return false;
      this.getNextArea(step == 0 ? {id: 0} : this.stepArr[step-1], 'step' + step); // 获取下一步选择
    },
    changeCity(city) { // 选择城市
      if (this.isNext == true) { // true 有下一级
        this.getNextArea(city, true);
      } else {
        this.addressShow = false;
        this.isShowChooseTitle = false;
        this.stepArr.splice(this.stepActive, 1, city);
      }
    },
    leftBack() {
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
    },
    onPreviewPic(index) { // 轮播图预览
      ImagePreview({
        images: this.previewImages,
        startPosition: index
      })
    },
    getNextArea(city, flag, isNext) {
      getNextArea({ parentId: city.id }).then(res => {
        if (res.data.length === 0) { // 没有下一级的数据处理
          if (!this.isNext) { // 已经是最后一级的话
            this.stepArr.splice(this.stepActive, 1, city);
          } else { // 如果还是true就要增加数据
            if (flag) { // 下一级处理
              this.stepActive += 1;
              this.stepArr.push(city);
            }
          }
          this.isNext = false;
          this.addressShow = false;
          this.isShowChooseTitle = false;
          return false;
        }
        this.isNext = isNext ? false : true;
        this.chooseList = res.data;

        if (flag == true) { // 下一级处理
          this.stepActive += 1;
          this.stepArr.push(city);
          return false;
        }

        if (flag && flag.indexOf('step') > -1) { // 点击跳转到选择的步骤
          this.stepArr.splice(flag.split('step')[1], this.stepActive + 1);
          this.stepActive = flag.split('step')[1] - 1;
          this.isShowChooseTitle = true;
          return false;
        }
      })
    },
    closePopup() { // 关闭修改地址弹窗时触发, 数据处理
      if (!this.isNext) {
        this.assgnStepList = this.stepArr;
        this.form = {
          countryCode: this.assgnStepList[0] ? this.assgnStepList[0].code : '',
          provinceCode: this.assgnStepList[1] ? this.assgnStepList[1].code : '',
          cityCode: this.assgnStepList[2] ? this.assgnStepList[2].code : '',
          districtCode: this.assgnStepList[3] ? this.assgnStepList[3].code : ''
        }
        // 拼接展示完整的地址
        let _address = '';
        this.assgnStepList.map(item => {
          _address += item.name;
        })
        this.completeAddress = _address;
        this.getDeliveryInfo();
      }
    },
    getDeliveryInfo() { // 获取配送运费模板信息
      let _form = {
        ...this.form,
        skuId: this.selectSku.selectedSkuComb.id
      }
      getDeliveryInfo(_form).then(res => {
        if (res.data.length == 0) { // 无模板
          this.completeAddress = '';
        }
      })
    },
    getSkuInfo(value, type) { // 获取选中的商品的规格
      console.log(value)
      // console.log(type)
      if (this.$refs.productSku) {
        this.selectSku = this.$refs.productSku.getSkuData();
        if (type === 'stepper') {
          this.selectSku = {
            ...this.selectSku,
            selectedNum: value.selectedNum
          };
        }
      }
    },
    onSelect() { // 选择产品规格
      if (this.$store.state.user.authToken) {
        this.skuType = 1;
        this.productShow = true;
        return false;
      }
      // 未登录情况下跳转到登录页面
      this.$router.push({
        name: 'login'
      })
    },
    getSkuStock() { // 判断库存是否充足
      this.selectSku = this.$refs.productSku.getSkuData();
      return new Promise(resolve => {
        getSkuStock(this.selectSku.selectedSkuComb.id).then(res => {
          resolve(res.data);
        })
      })
    },
    attentionProduct() { // 关注商品
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login',
        })
        return false;
      }
      attentionProduct({ goodId: this.goodSpuVo.id}).then(res => {
        this.goodSpuVo.isAttention = 1;
      })
    },
    async onConfirm() { // 确认加入
      const num = await this.getSkuStock();
      if (num > this.selectSku.selectedNum) {
        if (this.skuType === 2 || this.skuType === 1) { // 加入购物车
          addCart({ quantity: this.selectSku.selectedNum, skuId: this.selectSku.selectedSkuComb.id }).then(res => {
            this.$toast.success('添加成功');
            this.productShow = false;
          })
          return false;
        }
        if (this.skuType === 3) { // 立即购买
          return false;
        }
        
      }
    },
    onBuySku() {
      this.skuType = 3;
      this.productShow = true;
    }
  },
}
</script>

<style lang="less" scoped>
.swiper-pagination {
  bottom: 38px;
  left: auto;
  right: 16px;
  width: fit-content;
  background-color: rgba(0, 0, 0, 0.45);
  border-radius: 12px;
  color: #fff;
  padding: 6px 10px;
  font-size: 12px;
}
.tag-bgd {
  background-color: rgba(255, 102, 102, 0.05);
}
.bgd-f8 {
  background-color: #f8f8f8;
}
.review-swiper .swiper-slide {
  width: auto;
}
.sticky-opacity {
  opacity: 0;
}
.pt-28 {
  padding-top: 28px;
}
.w-169 {
  width: 169px;
}
.h-48 {
  height: 48px !important;
}
.add-cart-btn {
  border-color: #e5e5e5 !important;
  background-color: rgba(255, 118, 18, 0.05) !important;
  color: #ec500d !important;
}
.border-no {
  border: none !important;
}
.bg-ddd {
  background: #dddddd !important;
}
.col-transparent {
  background-color: transparent !important;
}
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.mt-6 {
  margin-top: 6px;
}
.fs-0 {
  font-size: 0;
}
.product-detail__operate {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  z-index: 100;
}
.h-56 {
  height: 56px !important;
}
.pb-56 {
  padding-bottom: 56px;
}
.w-120 {
  width: 120px !important;
}
.ptb-2{
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>

<style lang="less">
.product-tab-content {
  .van-tabs__wrap {
    height: 0;
  }
  .van-tabs__nav {
    display: none;
  }
  .van-tabs__nav--line {
    padding-bottom: 0;
  }
  &.sticky-nav {
    .van-tabs__nav {
      display: flex;
    }
    .van-tabs__wrap {
      height: 40px;
    }
  }
}
.detail-sticky-scroll {
  .van-nav-bar {
    animation: all 1s;
    padding-bottom: 6px;
    .sticky-opacity {
      opacity: 1;
      animation: all 1s;
    }
  }
}
</style>