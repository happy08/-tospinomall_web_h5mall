<template>
  <!-- 商品详情页面 -->
  <div class="v-percent-100 bg-grey pb-56 product-detail-content">
    <van-sticky
      ref="detailStickyContainer"
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
          />
          <div class="sticky-opacity ml-14" @click="$router.push({ name: 'search' })">
            <van-search v-model="searchVal" disabled class="round-20 hidden" />
          </div>
        </div>

        <div slot="header-right" @click="$router.push({ name: 'cart', query: { isBar: 1 } })">
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
      :offset-top="!isScroll ? 0 : '0.92rem'"
      title-active-color="#FF6666"
      line-height="0"
      title-inactive-color="#383838"
      class="product-tab-content"
      ref="detailTabContainer"
    >
      <van-tab :title="$t('shot')" name="Short">
        <div>
          <!-- 商品轮播图 -->
          <swiper ref="swiperComponentRef" :options="swiperOption" class="swiper-container">
            <swiper-slide v-for="(productItem, productIndex) in carouselMapUrls" :key="productIndex" @click.native="onPreviewPic(productIndex)">
              <BmImage
                :url="productItem.imgUrl"
                :height="'7.5rem'"
                :isLazy="false"
                :isShow="false"
                :fit="'cover'"
                :alt="goodSpuVo.goodTitle"
              />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>

        <!-- 商品介绍 -->
        <div class="mt-12 bg-white plr-20 ptb-14">
          <div>
            <span class="fs-16 red fw">
              <span class="fm-menlo">{{ $store.state.rate.currency }}</span>
              <span class="fm-din">{{ goodSpuVo.minPrice }}</span>
            </span>
            <!-- 促销价 -->
            <!-- <span class="ml-8 grey line-through">{{ $store.state.rate.currency }}260.00</span> -->
          </div>
          <!-- 最小订货量/销售量 -->
          <!-- <div class="fs-12 red">
            <span class="plr-12 ptb-4 round-8 tag-bgd mt-8 iblock fm-helvetica">MOQ: 1PCS</span>
            <span class="plr-12 ptb-4 round-8 tag-bgd mt-8 iblock fm-helvetica">Sold: 20PCS</span>
          </div> -->
          <!-- 商品标题 -->
          <h2 class="fs-14 block mt-12 fm-helvetica">{{ goodSpuVo.goodTitle }}</h2>
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
                <span class="fw fs-12 block">{{ $t("freight") }}</span>
                <span class="ml-12 fs-12 grey fm-helvetica" v-if="deliveryInfo.length > 0">{{ $t("freight") }}: {{ $store.state.rate.currency }}{{ deliveryInfo[0].freightPrice }}</span>
                <span class="ml-12 fs-12 grey fm-helvetica" v-if="deliveryInfo.length == 0">{{ completeAddress ? completeAddress : $t('please_choose_address')}}</span>
              </div>
            </template>
          </van-cell>
          <!-- 货源地到收货地 -->
          <template v-if="deliveryInfo.length > 0">
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
              <van-step v-if="goodSpuVo.deliveryType != 1 && form.countryCode != storeInfo.deliveryCountryCode">
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
            <p class="mt-16 fs-14 light-grey fm-helvetica pb-20" v-if="deliveryInfo">{{ deliveryInfo[0].estimeate }}</p>
            <!-- <p class="mt-8 orange fs-12 pb-10">From January 3rd to January 27th</p> -->
          </template>
        </div>
      </van-tab>
      <van-tab :title="$t('param')" name="Param">
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
                <span class="fw fs-12 block">{{ $t("select") }}</span>
                <span class="ml-12 fs-12 grey fm-helvetica"
                  >{{ goodAttr | goodAttrFormat }}</span
                >
              </div>
            </template>
          </van-cell>
          <!-- 商品图片 -->
          <div class="flex pr-10">
            <BmImage
              :url="selectItem.attrPicture"
              :width="'2rem'"
              :height="'2rem'"
              :isLazy="false"
              :isShow="true"
              :fit="'cover'"
              v-for="(selectItem, selectIndex) in selectCarousel"
              :key="'select-' + selectIndex"
              :class="{'round-4 border': true, 'ml-12': selectIndex != 0}"
              :alt="goodSpuVo.goodTitle + selectItem.attrValue"
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
        <div class="mt-12 bg-white pt-16">
          <h3 class="black flex between vcenter plr-20 fn fm-helvetica pb-16">
            <span class="fs-16"
              >{{ $t("evaluation") }}
              {{ hotEvaluates.total | reviewNumFormat }}</span
            >
            <!-- 更多评论 -->
            <span v-if="hotEvaluates.total == 0" class="fs-14">{{ $t("more") }}</span>
            <nuxt-link v-else class="fs-14" :to="{ name: 'me-order-rate-detail-list', query: { id: goodSpuVo.id } }">{{ $t("more") }}</nuxt-link>
          </h3>
          <!-- 评论展示 -->
          <div
            v-for="(reviewItem, reviewIndex) in hotEvaluates.lists"
            :key="'reviewItem-' + reviewIndex"
            class="pb-20 border-b"
            @click="$router.push({ name: 'me-order-rate-detail-list', query: { id: goodSpuVo.id } })"
          >
            <!-- 评论人信息 -->
            <div class="mt-14 flex between plr-20">
              <div class="flex vcenter">
                <BmImage
                  :url="reviewItem.buyerPortrait"
                  :width="'0.64rem'"
                  :height="'0.64rem'"
                  :isLazy="false"
                  :isShow="true"
                  :fit="'cover'"
                  :round="true"
                  :errorUrl="require('@/assets/images/icon/user-icon.png')"
                  :alt="goodSpuVo.goodTitle + ' evaluates user icon'"
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
            <div>
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
                    :alt="goodSpuVo.goodTitle + ' evaluates picture'"
                  />
                </swiper-slide>
              </swiper>
            </div>
            <!-- 回复 -->
            <div
              class="p-12 round-4 mt-12 fs-14 bgd-f8 mlr-20 fm-helvetica"
              v-for="(replyItem, replyIndex) in reviewItem.replys"
              :key="'reply-' + replyIndex"
            >
              <span class="red">{{ replyItem.replyName }} {{ $t("reply") }}:</span>
              <span class="black">{{ replyItem.replyContent }}</span>
            </div>
            <!-- 规格 -->
            <div class="mt-12 plr-20">
              <span class="grey fs-14 ptb-2 plr-10 bgd-f8 round-4 fm-helvetica">{{ $t("specification") }}{{ reviewItem.saleAttr }}</span>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('similar')" name="Similar">
        <!-- 同店商品 -->
        <div class="mt-12 bg-white ptb-20">
          <h3 class="black flex between vcenter plr-20 fn fm-helvetica">
            <span class="fs-16">{{ $t("just_for_you") }}</span>
            <nuxt-link class="fs-14" :to="{ name: 'cart-store-id', params: { id: storeInfo.storeId }, query: { sellerId: storeInfo.sellerId, hasAdornment: storeInfo.hasAdornment, tabbarActive: 1 } }">{{ $t("more") }}</nuxt-link>
          </h3>
          <!-- 推荐商品 -->
          <div>
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
                  :url="productItem.mainPictureUrl"
                  :width="'2rem'"
                  :height="'2rem'"
                  :isLazy="false"
                  :isShow="false"
                  :fit="'cover'"
                  class="border round-4 hidden"
                  @onClick="onClick(productItem.productId)"
                  :alt="productItem.productTitle"
                />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('details')" name="Details" class="fs-0">
        <!-- 产品说明信息 -->
        <div
          class="mt-12 bg-white ptb-12 plr-20 fs-14 black fm-helvetica word-break mb-12"
          v-if="goodSpuVo.description"
          v-html="goodSpuVo.description"
        ></div>
        <BmImage
          v-for="detailItem in detailsPics"
          :key="'product-detail-id-' + detailItem.id"
          :url="detailItem.imgUrl"
          :isLazy="false"
          :isShow="false"
          :alt="goodSpuVo.goodTitle"
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
        <BmButton :type="'info'" class="fs-16 round-8 w-169 h-48 add-cart-btn" @click="onAddCart">{{ $t('add_to_cart') }}</BmButton>
        <BmButton class="fs-16 round-8 w-169 h-48" @click="onBuyNow">{{ $t('buy_now') }}</BmButton>
      </div>
    </van-popup>

    <!-- 地址选择 -->
    <van-popup v-model="addressShow" position="bottom" closeable class="ptb-20" style="min-height: 80%;" @close="closePopup">
      <h4 class="fs-18 black lh-20 tc plr-20">{{ $t('choose_a_country_or_region') }}</h4>
      <!-- 地址选择步骤条 -->
      <van-steps direction="vertical" :active="stepActive" class="mt-24" @click-step="stepClick">
        <van-step v-for="item, stepIndex in stepArr" :key="'step-' + stepIndex">
          <template #active-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'" />
          </template>
          <template #inactive-icon>
            <BmIcon :name="'dot1'" :color="'#eee'" />
          </template>
          <template #finish-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'" />
          </template>
          <p class="fs-16 black">{{ item.name ? item.name : chooseTitle }}</p>
        </van-step>
        <van-step v-if="isShowChooseTitle">
          <template #active-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'" />
          </template>
          <template #inactive-icon>
            <BmIcon :name="'dot1'" :color="'#eee'" />
          </template>
          <template #finish-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'" />
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
      <div class="flex arround w-100">
        <!-- 客服 -->
        <!-- <van-icon
          :name="require('@/assets/images/icon/chat-icon.png')"
          size="0.6rem"
        /> -->
        <!-- 店铺 -->
        <nuxt-link :to="{ name: 'cart-store-id', params: { id: storeInfo.storeId }, query: { sellerId: storeInfo.sellerId, hasAdornment: storeInfo.hasAdornment, tabbarActive: 0} }">
          <van-icon :name="require('@/assets/images/icon/store-icon.png')" size="0.6rem" />
        </nuxt-link>
        <!-- 收藏 0未关注 1已关注 -->
        <van-icon :name="goodSpuVo.isAttention ? require('@/assets/images/icon/collect-active-icon.png') : require('@/assets/images/icon/collect-icon.png')" size="0.6rem" @click="attentionProduct" />
      </div>
      <div class="flex">
        <!-- 加入购物车 -->
        <BmButton :type="'info'" class="fs-16 round-0 w-130 h-56 add-cart-btn border-no" @click="onAddCart">{{ $t('add_to_cart') }}</BmButton>
        <!-- 立即购买 -->
        <BmButton class="fs-16 round-0 w-130 h-56" @click="onBuySku">{{ $t('buy_now') }}</BmButton>
      </div>
    </div>

    <!-- 产品规格 -->
    <ProductSku :productShow="productShow" :goodSpuVo="goodSpuVo" :initialSku="initialSku" :sku="sku" :type="skuType" @onSkuInfo="onSkuInfo" @onSelectedSkuCombId="selectedSkuCombId = $event" />
  </div>
</template>

<script>
import { ImagePreview, Cell, Step, Steps, Rate, Sticky, Search, Tab, Tabs, Popup, Stepper } from 'vant';
import { getDeliveryInfo, attentionProduct, cancelAttentionProduct } from '@/api/cart';
import { getCurrentDefaultAddress, getNextArea } from '@/api/address';
import ProductSku from '@/components/ProductSku';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

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
    vanStepper: Stepper,
    swiper: Swiper,
    swiperSlide: SwiperSlide,
    ProductSku
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
      storeInfo: {}, // 店铺信息
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
      productShow: {
        show: false
      }, // 是否展示商品规格
      sku: {
        tree: [],
        list: []
      },
      initialSku: { // 初始化商品格式/已选择的商品格式
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
      skuType: '', // cart 操作区按钮为确认，''操作区按钮为加入购物车/立即购买
      goodAttr: [], // 商品选中的属性规格展示
      selectedSkuCombId: null,
      deliveryInfo: []
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
    let _selectCarousel = [];
    let _initSku = [];
    detailData.data.saleAttr.forEach((item, itemInxdex) => { // 规格种类
      this.sku.tree.push({
        k: item.attrName, // 规格类目名称
        k_id: item.attrId,
        k_s: 's' + item.attrId, // sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
        v: [],
        largeImageMode: false
      })
      item.attrValues.forEach((attrItem, attrIndex) => { // 种类属性
        // if (attrIndex == 0) {
        //   _initSku.push(attrItem);
        // }
        if (_selectCarousel.length < 3 && _selectCarousel.length < item.attrValues.length) { // 商品选择的图片集展示
          _selectCarousel.push(attrItem);
        }
        this.sku.tree[itemInxdex].v.push({
          id: attrItem.attrValueId,
          name: attrItem.attrValue
        })

        attrItem.skuList.forEach((skuItem, skuIndex) => { // 商品组合列表
          if (attrIndex == 0 && skuIndex == 0) {
            if (_initSku.findIndex(initItem => initItem.attrValueId != attrItem.attrValueId) < item.attrValues.length) {
              _initSku.push({
                id: skuItem.skuId,
                [this.sku.tree[itemInxdex].k_s]: attrItem.attrValueId,
                price: skuItem.skuPrice * 100, // list中的价格单位是分，所以需要乘以100
                stock_num: skuItem.stockNum,
                picture: skuItem.skuPicture,
                name: attrItem.attrValue
              });
            }
          }
          _skuList.push({ // sku 组合列表
            id: skuItem.skuId,
            [this.sku.tree[itemInxdex].k_s]: attrItem.attrValueId,
            price: skuItem.skuPrice * 100, // list中的价格单位是分，所以需要乘以100
            stock_num: skuItem.stockNum,
            picture: skuItem.skuPicture,
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

    this.selectCarousel = _selectCarousel;
    this.sku.list = arr;

    // 初始化默认选中的商品sku, 不从上面数组中拿是因为没办法保证数组中的第一个是所选属性的第一个选项
    let initArr = [];
    _initSku.forEach(item => {
      let flag = true;
      let obj = item;
      initArr.forEach((newItem, index) => {
        newItem.stock_num = newItem.stock_num < item.stock_num ? newItem.stock_num : item.stock_num; // 库存选择相比较小的那一个
        obj = {
          ...newItem,
          ...item
        }
        initArr[index] = obj;
        flag = false;
      })
      if (flag) {
        initArr.push(obj);
      }
    })
    
    this.initialSku = this.selectSku = {
      ...initArr[0],
      selectedNum: 1,
      selectedSkuComb: {
        stock_num: initArr[0].stock_num
      }
    }
    this.selectedSkuCombId = this.initialSku.id;
    // 获取运费模板
    this.getDeliveryInfo();

    this.likeList = [];
    // 获取商品推荐列表
    if (this.storeInfo.storeId) {
      const recommendData = await this.$api.getRecommendList({ shopId: this.storeInfo.storeId, categoryId: 7 });
      if (!recommendData.data) return false;
      this.likeList = recommendData.data;
    }
  },
  activated() {
    if (this.$store.state.user.authToken) {
      getCurrentDefaultAddress().then(res => { // 查看是否有默认地址
        if (res.code != 0) return false;
        
        if (!res.data || res.data.length === 0) { // 没有默认地址的情况下获取国家列表
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
      })
    } else {
      this.getNextArea({ id: 0 });
    }
    this.$fetch();
    // this.$refs.productSku.resetSelectedSku();
  },
  head() {
    return {
      title: this.goodSpuVo.goodTitle + 'Tospino Ghana online shopping',
      meta: [
        { hid: 'description', name: 'description', content: this.goodSpuVo.goodTitle || 'Tospino Ghana online shopping' },
        { hid: 'keywords', name: 'keywords', content: this.goodSpuVo.goodTitle || 'Tospino Ghana online shopping' },
        { hid: 'og:title', property: 'og:title', content: this.goodSpuVo.goodTitle || 'Tospino Ghana online shopping' },
        { hid: 'og:description', property: 'og:description', content: this.goodSpuVo.goodTitle || 'Tospino Ghana online shopping' }
      ]
    }
  },
  filters: {
    reviewNumFormat(val) { // 评论数字格式化
      return val > 100 ? val + '+' : val;
    },
    goodAttrFormat(arr) {
      return arr.map(item => {
        return item.k + ':' + item.name;
      }).join(',');
    }
  },
  computed: {
    chooseTitle() {
      if (this.stepActive == -1) {
        return this.$t('please_select_a_country');
      }
      if (this.stepActive == 0) {
        return this.$t('please_select_a_state_province_region');
      }
      if (this.stepActive == 1) {
        return this.$t('Please_select_city');
      }
      return this.$t('please_select_district_county');
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
        if (scrollObj.scrollTop < 46) {
          this.$refs.detailStickyContainer.$el.classList.remove('detail-sticky-scroll');
          this.$refs.detailTabContainer.$el.classList.remove('sticky-nav');
          this.isScroll = false;
        }
      }
    },
    async onBuyNow() { // 立即购买 num大于0才可以进行下一步操作
      // const num = await this.getSkuStock();
      // this.skuType = 3;
      // console.log(num);
    },
    async onAddCart() { // 加入购物车 num大于0才可以进行下一步操作
      this.productShow.show = true;
      this.skuType = 'product';
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
      if (this.$route.query.isShare) { // 如果是分享出去的页面，点击回退按钮时跳转到首页
        this.$router.replace('/home');
        return false;
      }
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
    },
    onPreviewPic(index) { // 轮播图预览
      let _this = this;
      ImagePreview({
        images: this.previewImages,
        startPosition: index,
        onChange(previewIndex) {
          _this.$refs.swiperComponentRef.$swiper.slideTo(previewIndex);
        }
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
        if (this.selectedSkuCombId) {
          this.getDeliveryInfo();
        }
      }
    },
    getDeliveryInfo() { // 获取配送运费模板信息
      let _form = {
        ...this.form,
        skuId: this.selectedSkuCombId
      }
      getDeliveryInfo(_form).then(res => {
        this.deliveryInfo = res.data;
        if (res.data.length == 0) { // 无模板
          this.completeAddress = '';
        } else {
          // 拼接展示完整的地址
          let _address = '';
          this.assgnStepList.map(item => {
            _address += item.name;
          })
          this.completeAddress = this.assgnStepList.length > 0 ? _address : this.completeAddress;
        }
      })
    },
    onSkuInfo(selectValue) { // 获取选中的商品的规格
      // 页面展示已选择的商品属性
      this.selectSku = selectValue;
      this.goodAttr = selectValue.map(item => {
        return {
          skuId: item,
          name: '',
          k: ''
        }
      })
      
      this.sku.tree.forEach(treeItem => {
        treeItem.v.forEach(vItem => {
          this.goodAttr.forEach(attrItem => {
            if (vItem.id == attrItem.skuId) {
              attrItem.k = treeItem.k;
              attrItem.name = vItem.name;
            }
          })
        })
      })
    },
    onSelect() { // 选择产品规格
      if (this.$store.state.user.authToken) {
        this.skuType = '';
        this.productShow.show = true;
        return false;
      }
      // 未登录情况下跳转到登录页面
      this.$router.push({
        name: 'login'
      })
    },
    attentionProduct() { // 关注商品
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login',
        })
        return false;
      }
      if (this.goodSpuVo.isAttention == 1) { // 取消关注
        cancelAttentionProduct([this.goodSpuVo.id]).then(() => {
          this.goodSpuVo.isAttention = 0;
        })
        return false;
      }
      
      attentionProduct(this.goodSpuVo.id).then(() => {
        this.goodSpuVo.isAttention = 1;
      })
    },
    onBuySku() {
      this.skuType = 'buy';
      this.productShow.show = true;
    },
    onClick(id) { // 推荐商品点击跳转到商品详情
      this.$router.push({
        name: 'cart-product-id',
        params: {
          id: id
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.swiper-pagination {
  bottom: 38px;
  left: auto;
  right: 16px;
  width: auto;
  white-space: nowrap;
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
.w-130 {
  width: 130px !important;
}
.ptb-2{
  padding-top: 2px;
  padding-bottom: 2px;
}
.word-break{
  word-break: break-all;
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
.product-detail-content{
  .van-nav-bar__title{
    display: none;
  }
  .van-nav-bar__left{
    width: 88%;
    &>div, .sticky-opacity{
      width: 100%;
    }
  }
}
</style>