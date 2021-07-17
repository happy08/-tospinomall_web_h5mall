<template>
  <!-- 商品详情页面 -->
  <div class="vh-100 bg-grey pb-56">
    <van-sticky ref="detailStickyContainer" :offset-top="0" @scroll="stickyScroll">
      <BmHeaderNav :left="{ isShow: true }" :bg_color="!isScroll ? 'col-transparent': 'white'" :border="false" :color="!isScroll ? 'white': 'black'" :class="{'fixed': !isScroll}">
        <nuxt-link :to="{ name: 'search' }" tag="div" slot="header-left" class="flex between sticky-opacity ml-14">
          <van-search v-model="searchVal" disabled class="round-20 hidden" />
        </nuxt-link>
        <div slot="header-right">
          <van-icon :name="require('@/assets/images/icon/cart-bgd.svg')" size="0.64rem" class="mt-6" />
        </div>
      </BmHeaderNav>
    </van-sticky>

    <!-- 导航栏, 滚动导航 -->
    <van-tabs v-model="tabActive" scrollspy sticky offset-top="0.92rem" title-active-color="#FF6666" line-height="0" title-inactive-color="#383838" class="product-tab-content" ref="detailTabContainer">
      <van-tab title="Short" name="Short">
        <!-- 商品轮播图 -->
        <swiper
          ref="swiperComponentRef"
          :options="swiperOption"
          class="swiper-container"
        >
          <swiper-slide v-for="(productItem, productIndex) in carouselMapUrls" :key="productIndex">
            <BmImage
              :url="productItem.imgUrl"
              :width="'7.5rem'" 
              :height="'7.5rem'"
              :isLazy="false"
              :isShow="false"
              :fit="'cover'"
            ></BmImage>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>

        <!-- 商品介绍 -->
        <div class="mt-12 bg-white plr-20 ptb-14">
          <div>
            <span class="fs-16 red fw"><span class="fm-menlo">{{ $store.state.rate.currency }}</span><span class="fm-din">{{ goodSpuVo.minPrice }}</span></span>
            <!-- 促销价 -->
            <!-- <span class="ml-8 grey line-through">{{ $store.state.rate.currency }}260.00</span> -->
          </div>
          <!-- 最小订货量/销售量 -->
          <!-- <div class="fs-12 red">
            <span class="plr-12 ptb-4 round-8 tag-bgd mt-8 iblock fm-helvetica">MOQ: 1PCS</span>
            <span class="plr-12 ptb-4 round-8 tag-bgd mt-8 iblock fm-helvetica">Sold: 20PCS</span>
          </div> -->
          <p class="fs-14 block mt-12 fm-helvetica">{{ goodSpuVo.goodTitle }}</p>
        </div>

        <!-- 运费 -->
        <div class="mt-12 bg-white plr-20 pb-10">
          <van-cell class="ptb-14 plr-0" is-link :border="false" @click="addressShow = true">
            <template #title>
              <div class="flex vcenter">
                <span class="fw fs-12 block">{{ $t('cart.freight') }}</span>
                <span class="ml-12 fs-12 grey fm-helvetica" @click="deliveryShow = true">{{ $t('cart.delivery') }}: CHY0.00</span>
              </div>
            </template>
          </van-cell>
          <!-- 步骤条 -->
          <van-steps :active="freightActive" class="mt-20 plr-0">
            <van-step>
              China
              <!-- 自定义未激活状态图标 -->
              <template #inactive-icon>
                <van-icon :name="require('@/assets/images/icon/plane-default.png')" size="0.48rem" />
              </template>
              <!-- 自定义激活状态图标 -->
              <template #active-icon>
                <van-icon :name="require('@/assets/images/icon/plane-active.png')" size="0.48rem" />
              </template>
              <!-- 自定义激活状态图标 -->
              <template #finish-icon>
                <van-icon :name="require('@/assets/images/icon/plane-active.png')" size="0.48rem" />
              </template>
            </van-step>
            <van-step>
              Accra
              <!-- 自定义未激活状态图标 -->
              <template #inactive-icon>
                <van-icon :name="require('@/assets/images/icon/transfer-default.png')" size="0.48rem" />
              </template>
              <!-- 自定义激活状态图标 -->
              <template #active-icon>
                <van-icon :name="require('@/assets/images/icon/transfer-active.png')" size="0.48rem" />
              </template>
              <!-- 自定义激活状态图标 -->
              <template #finish-icon>
                <van-icon :name="require('@/assets/images/icon/transfer-active.png')" size="0.48rem" />
              </template>
            </van-step>
            <van-step>
              Ghana
              <!-- 自定义未激活状态图标 -->
              <template #inactive-icon>
                <van-icon :name="require('@/assets/images/icon/arrive-default.png')" size="0.48rem" />
              </template>
              <!-- 自定义激活状态图标 -->
              <template #active-icon>
                <van-icon :name="require('@/assets/images/icon/arrive-active.png')" size="0.48rem" />
              </template>
              <!-- 自定义激活状态图标 -->
              <template #finish-icon>
                <van-icon :name="require('@/assets/images/icon/arrive-active.png')" size="0.48rem" />
              </template>
            </van-step>
          </van-steps>
          <p class="mt-16 fs-14 light-grey fm-helvetica">Finish the order before 23:59 today, and the goods are expected to be delivered before 23:30 on janu-ary 2nd.</p>
          <p class="mt-8 orange fs-12">From January 3rd to January 27th</p>
        </div>
      </van-tab>
      <van-tab title="Param" name="Param">
        <!-- 选择产品规格 -->
        <div class="mt-12 bg-white plr-20 pb-24">
          <van-cell class="ptb-14 plr-0" is-link :to="{}" :border="false" @click="productShow = true">
            <template #title>
              <div class="flex vcenter">
                <span class="fw fs-12 block">{{ $t('cart.select') }}</span>
                <span class="ml-12 fs-12 grey fm-helvetica">Color:Red,Blue</span>
              </div>
            </template>
          </van-cell>
          <!-- 商品图片 -->
          <div class="flex between mt-20">
            <BmImage
              :url="require('@/assets/images/product-bgd-90.png')"
              :width="'2rem'" 
              :height="'2rem'"
              :isLazy="false"
              :isShow="false"
              :fit="'cover'"
              v-for="item in 3"
              :key="item"
              class="round-4 border"
            ></BmImage>
          </div>
          <!-- 商品服务与承诺 -->
          <van-cell :title="serviceItem" v-for="(serviceItem, serviceIndex) in servicePromises" :key="'service-' + serviceIndex" :border="false" class="p-0 pt-10" title-class="fs-14 black ml-8 fm-helvetica" :icon="require('@/assets/images/icon/tip-icon.svg')" />
        </div>

        <!-- 商品评论 -->
        <div class="mt-12 bg-white pt-16 pb-20">
          <h3 class="black flex between vcenter plr-20 fn fm-helvetica">
            <span class="fs-16">{{ $t('cart.topReviewer') }} {{ hotEvaluates.total | reviewNumFormat }}</span>
            <span class="fs-14">{{ $t('cart.more') }}</span>
          </h3>
          <!-- 评论展示 -->
          <div v-for="reviewItem, reviewIndex in hotEvaluates.lists" :key="'reviewItem-' + reviewIndex">
            <!-- 评论人信息 -->
            <div class="mt-14 flex between plr-20">
              <div class="flex vcenter">
                <van-icon :name="reviewItem.buyerPortrait ? reviewItem.buyerPortrait: require('@/assets/images/icon/user-icon.png')" size="0.72rem" color="#EC500D" />
                <div class="ml-8">
                  <p class="fs-14 black fm-helvetica">{{ reviewItem.buyerName }}</p>
                  <van-rate class="mt-4" v-model="reviewItem.goodsScores" allow-half size="0.24rem" color="#F7B500" readonly void-color="#DDDDDD" void-icon="star" />
                </div>
              </div>
              <div class="grey fs-14 fm-helvetica">{{ reviewItem.createTime }}</div>
            </div>
            <!-- 描述 -->
            <p class="mt-12 fs-14 black plr-20 fm-helvetica">{{ reviewItem.content }}</p>
            <!-- 图片 -->
            <swiper
              ref="swiperReviewRef"
              :options="reviewOption"
              class="mt-12  pl-20 review-swiper"
            >
              <swiper-slide v-for="(reviewPicItem, reviewPicIndex) in reviewItem.pictures" :key="'review-picture-' + reviewPicIndex">
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
            <div class="p-12 round-4 mt-12 fs-14 bgd-f8 mlr-20 fm-helvetica" v-for="replyItem, replyIndex in reviewItem.replys" :key="'reply-' + replyIndex">
              <span class="red">{{ replyItem.replyName }} {{ $t('cart.reply') }}:</span>
              <span class="black">{{ replyItem.replyContent }}</span>
            </div>
            <!-- 规格 -->
            <div class="mt-12 plr-20">
              <span class="grey fs-14 ptb-2 plr-10 bgd-f8 round-4 fm-helvetica">{{ $t('cart.specification') }}:{{ reviewItem.saleAttr }}</span>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="Similar" name="Similar">
        <!-- 可能感兴趣的 -->
        <div class="mt-12 bg-white pb-20 pt-16">
          <h3 class="black flex between vcenter plr-20 fn fm-helvetica">
            <span class="fs-16">{{ $t('cart.justForYou') }}</span>
            <span class="fs-14">{{ $t('cart.more') }}</span>
          </h3>
          <!-- 推荐商品 -->
          <swiper
            ref="swiperRecommendRef"
            :options="recommendOption"
            class="mt-12  pl-20 review-swiper"
          >
            <swiper-slide v-for="(productItem, productIndex) in carouselMapUrls" :key="productIndex">
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
        <div class="mt-12 bg-white ptb-12 plr-20 fs-14 black fm-helvetica" v-html="goodSpuVo.description"></div>
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
        <van-cell title="Delivery fee" :border="false" class="plr-0 pt-12 pb-0" title-class="fs-16 black fw" label="Ф0.00" label-class="fs-14 black" />
        <!-- 交货地点 -->
        <van-cell title="Delivery place" :border="false" class="plr-0 pt-12 pb-0" title-class="fs-16 black fw" label="china" label-class="fs-14 black" />
        <!-- 配送地址 -->
        <van-cell title="Shipping address" :border="false" class="plr-0 pt-12 pb-0" title-class="fs-16 black fw" label="No.007, Matian Street, Baoan District, Shenzhen,Guangdong" label-class="fs-14 black" />
        <!-- 预计到达时间 -->
        <van-cell title="Estimated arrival time" :border="false" class="plr-0 pt-28 pb-0" title-class="fs-16 black fw" label="The order is completed before 23:59 today, and it is  expected to be shipped before 23:30 on January 2. Delivery from January 3rd to January 27th" label-class="fs-14 black" />
      </div>
      <!-- 按钮 -->
      <div class="plr-12 flex between">
        <BmButton :type="'info'" class="fs-16 round-8 w-169 h-48 add-cart-btn" @click="onAddCart">Add to cart</BmButton>
        <BmButton class="fs-16 round-8 w-169 h-48" @click="onBuyNow">Buy Now</BmButton>
      </div>
    </van-popup>

    <!-- 选择产品规格 -->
    <van-sku
      v-model="productShow"
      :sku="sku"
      :goods="goodSpuVo"
      :goods-id="goodSpuVo.id"
      :initial-sku="initialSku"
      reset-stepper-on-hide
      reset-selected-sku-on-hide
    >
      <!-- 自定义头部价格展示 -->
      <template #sku-header="props">
        <div class="mlr-20 mt-30 flex">
          <BmImage
            :url="goodSpuVo.picture"
            :width="'2.08rem'" 
            :height="'2.08rem'"
            :isLazy="false"
            :isShow="false"
            :fit="'cover'"
            class="border round-4 hidden"
          ></BmImage>
          <!-- 商品价格/id -->
          <div class="ml-12 flex column hend">
            <div class="fs-16 red fw">
              <span class="fm-menlo">{{ $store.state.rate.currency }}</span>
              <span class="fm-din">{{ props.price }}</span>
            </div>
            <div class="mt-14 fs-12 light-grey fm-pf-r">ID: {{ goodSpuVo.id }}</div>
          </div>
        </div>
      </template>
      <!-- 自定义 sku-header-price -->
      <template #sku-header-price="props">
        <div class="fs-16 red fw">
          <span class="fm-menlo">{{ $store.state.rate.currency }}</span>
          <span class="fm-din">{{ props.price }}</span>
        </div>
      </template>

      <!-- 商品数量选择区域 -->
      <template #sku-stepper="props">
        <div class="tr plr-20 mt-24">
          <van-stepper v-model="props.selectedNum"  input-width="0.796rem" button-size="0.42rem" :integer="true" class="custom-stepper" />
          <div class="mt-20" v-if="props.selectedSkuComb">in stock: {{ props.selectedSkuComb.stock_num }}</div>
        </div>
      </template>

      <!-- 操作按钮区域 -->
      <template slot="sku-actions">
        <div class="mlr-12 mb-12 mt-10 flex between">
          <!-- 加入购物车 -->
          <BmButton :type="'info'" class="fs-16 round-8 w-169 h-48 add-cart-btn" @click="onAddCart">Add to cart</BmButton>
          <!-- 立即购买 -->
          <BmButton class="fs-16 round-8 w-169 h-48" @click="onBuyNow">Buy Now</BmButton>
        </div>
        <!-- 缺货 -->
        <div class="mlr-12 mb-30 mt-10">
          <BmButton class="fs-16 round-8 w-100 h-48 bg-ddd" @click="onOutStock">out of stock</BmButton>
        </div>
      </template>
      
    </van-sku>

    <!-- 地址选择 -->
    <van-popup v-model="addressShow" position="bottom" closeable class="ptb-20">
      <h4 class="fs-18 black lh-20 tc plr-20">Choose a country or region</h4>
      <!-- 地址选择步骤条 -->
      <van-steps direction="vertical" :active="stepActive" class="mt-24" @click-step="stepClick">
        <van-step v-for="item, stepIndex in stepArr" :key="stepIndex">
          <template #active-icon>
            <i class="iconfont icon-dot1 green"></i>
          </template>
          <p class="fs-16 black">{{ item.title ? item.title : item.desc }}</p>
        </van-step>
      </van-steps>
      <!-- 进行选择 -->
      <div class="mt-42 plr-24">
        <p class="fs-14 grey-1">Choose Street or Town</p>
        <ul class="plr-24 fs-16 black" v-if="stepArr[stepActive].city">
          <li class="mt-20" v-for="city, cityIndex in stepArr[stepActive].city" :key="cityIndex" @click="changeCity(city)">{{ city }}</li>
        </ul>
      </div>
    </van-popup>
    

    <!-- 加入购入车/收藏/店铺/立即购买 -->
    <div class="bg-white flex vcenter between pl-10 product-detail__operate">
      <!-- 客服 -->
      <van-icon :name="require('@/assets/images/icon/chat-icon.png')" size="0.6rem" />
      <!-- 店铺 -->
      <nuxt-link :to="{ name: 'cart-store-id', params: { id: storeInfo.storeId } }">
        <van-icon :name="require('@/assets/images/icon/store-icon.png')" size="0.6rem" />
      </nuxt-link>
      <!-- 收藏 0未关注 1已关注 -->
      <van-icon :name="goodSpuVo.isAttention ? require('@/assets/images/icon/collect-active-icon.png') : require('@/assets/images/icon/collect-icon.png')" size="0.6rem" />
      <div class="flex">
        <!-- 加入购物车 -->
        <BmButton :type="'info'" class="fs-16 round-0 w-120 h-56 add-cart-btn border-no" @click="onAddCart">Add to cart</BmButton>
        <!-- 立即购买 -->
        <BmButton class="fs-16 round-0 w-120 h-56" @click="onBuyNow">Buy Now</BmButton>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Cell, Step, Steps, Rate, Sticky, Search, Tab, Tabs, Popup, Sku, Stepper } from 'vant';

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
  async asyncData({app, route}) {
    const [ detailData ] = await Promise.all([
      app.$api.getProductDetail(route.params.id), // 获取商品详情
    ]);

    const carouselMapUrls = detailData.data.carouselMapUrls; // 商品轮播图
    const previewImages = detailData.data.carouselMapUrls.map(item => { // 轮播图预览图片
      return item.imgUrl;
    })
    const hotEvaluates = {  // 商品热评
      total: detailData.data.totalEvaluateNum,
      lists: detailData.data.hotEvaluates
    };
    const servicePromises = detailData.data.servicePromises; // 商品的服务与承诺
    const detailsPics = detailData.data.detailsPics; // 商品详情中的图片集合
    const goodSpuVo = { // 商品基本信息
      ...detailData.data.goodSpuVo,
      picture: detailData.data.goodSpuVo.mainPictureUrl
    };
    
    const storeInfo = detailData.data.storeInfo; // 店铺信息
    // 商品规格格式化
    let sku = {
      tree: [],
      list: [],
      price: detailData.data.goodSpuVo.minPrice,
      // stock_num: 0, // 总库存
      // hide_stock: false, //是否显示商品剩余库存
    };
    let _skuList = [];
    detailData.data.saleAttr.forEach((item, itemInxdex) => { // 规格种类
      sku.tree.push({
        k: item.attrName, // 规格类目名称
        k_id: item.attrId,
        k_s: 's' + item.attrId, // sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
        v: []
      })
      item.attrValues.forEach(attrItem => { // 种类属性
        sku.tree[itemInxdex].v.push({
          id: attrItem.attrValueId,
          name: attrItem.attrValue
        })
        attrItem.skuList.forEach(skuItem => { // 商品组合列表
          _skuList.push({ // sku 组合列表
            id: skuItem.skuId,
            [sku.tree[itemInxdex].k_s]: attrItem.attrValueId,
            price: skuItem.skuPrice,
            stock_num: skuItem.stockNum
          })
        })
      })
    })
    // console.log(detailData.data)
    sku.list = _skuList;
    
    return {
      carouselMapUrls: carouselMapUrls,
      isImgPreview: false,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        on: {
          click: function () { // 轮播点击事件
            ImagePreview({
              images: previewImages,
              startPosition: this.activeIndex
            })
          }
        }
      },
      goodSpuVo: goodSpuVo, // 商品基本信息
      detailsPics: detailsPics, // 商品详情图集合
      hotEvaluates: hotEvaluates, // 商品热评
      storeInfo: storeInfo, // 店铺信息
      servicePromises: servicePromises, // 商品的服务与承诺
      freightActive: 1,
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
      sku: sku,
      // sku: {
      //   // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
      //   // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
      //   tree: [
      //     {
      //       k: 'Color',
      //       k_id: '1',
      //       v: [
      //         {
      //           id: '30349',
      //           name: '天蓝色'
      //         },
      //         {
      //           id: '1215',
      //           name: '白色'
      //         }
      //       ],
      //       k_s: 's1'
      //     },
      //     {
      //       k: 'Size',
      //       k_id: '2',
      //       v: [
      //         {
      //           id: '1193',
      //           name: 'S'
      //         },
      //         {
      //           id: '1194',
      //           name: 'M'
      //         },
      //         {
      //           id: '1195',
      //           name: 'L'
      //         },
      //         {
      //           id: '1196',
      //           name: 'XL'
      //         }
      //       ],
      //       k_s: 's2'
      //     }
      //   ],
      //   // 所有 sku 的组合列表，如下是：白色1、白色2、天蓝色1、天蓝色2
      //   list: [
      //     {
      //       id: 2259,
      //       price: 120, //价格
      //       s1: '1215',
      //       s2: '1193',
      //       s3: '0',
      //       s4: '0',
      //       s5: '0',  
      //       stock_num: 20, //库存 
      //       goods_id: 946755
      //     },
      //     {
      //       id: 2260,
      //       price: 110,
      //       s1: '1215',
      //       s2: '1194',
      //       s3: '0',
      //       s4: '0',
      //       s5: '0',  
      //       stock_num: 2, //库存 
      //       goods_id: 946755
      //     },
      //     {
      //       id: 2257,
      //       price: 130,
      //       s1: '30349',
      //       s2: '1193',
      //       s3: '0',
      //       s4: '0',
      //       s5: '0',  
      //       stock_num: 40, //库存 
      //       goods_id: 946755
      //     },
      //     {
      //       id: 2258,
      //       price: 100,
      //       s1: '30349',
      //       s2: '0',
      //       s3: '0',
      //       s4: '0',
      //       s5: '0',  
      //       stock_num: 50, //库存 
      //       goods_id: 946755
      //     }
      //   ],
      //   price: '5.00',
      //   stock_num: 227, // 商品总库存
      //   none_sku: false,  // 是否隐藏无规格商品 
      //   hide_stock: false,  // 是否隐藏剩余库存
      //   messages: []
      // },
      // quota: 10, //限购数量 
      // quota_used: 0,  //已经购买过的数量
      initialSku:{
        // s1: '1011',
        // s2: '1193',
        // selectedNum: 1,
        // selectedProp: {
        //   2: [1193]
        // }
      },
      isScroll: false,
      addressShow: false,
      stepActive: 0,
      stepArr: [
        {
          title: '',
          desc: '选择国家',
          city: ['中国', '美国', '加拿大']
        }
      ]
    }
  },
  filters: {
    reviewNumFormat(val) { // 评论数字格式化
      return val > 100 ? val + '+' : val;
    },
    stockNUmFormat(val) {
      console.log(val)
      return Object.keys(val) ? val.stock_num : 0
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
    onBuyNow() { // 立即购买

    },
    onAddCart() { // 加入购物车

    },
    onOutStock() { // 缺货

    },
    stepClick(step) { // step点击事件
      console.log(step)
      this.stepActive = step;
      if (this.stepArr[step].title) { // 如果已经选择地区后的逻辑处理
        let arr = [];
        this.stepArr.map((item, index) => {
          if (index < step) {
            arr.push(item);
          } else if (index == step) {
            arr.push({
              title: '',
              desc: '选择国家',
              city: ['中国', '美国', '加拿大']
            })
          }
        });
        console.log('---------')
        console.log(this.stepActive)
        this.stepArr = arr;
        console.log(this.stepArr)
      }
    },
    changeCity(city) { // 选择城市
      this.stepArr[this.stepActive].title = city; // 选择城市
      this.stepActive += 1;
      this.stepArr[this.stepActive] = {
        title: '',
        desc: '选择省份',
        city: ['广东省', '陕西省', '山西省']
      }
    }
  },
}
</script>

<style lang="less" scoped>
.swiper-pagination{
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
.tag-bgd{
  background-color: rgba(255, 102, 102, 0.05);
}
.bgd-f8{
  background-color: #F8F8F8;
}
.review-swiper .swiper-slide{
  width: auto;
}
.sticky-opacity{
  opacity: 0;
}
.pt-28{
  padding-top: 28px;
}
.w-169{
  width: 169px;
}
.h-48{
  height: 48px!important;
}
.add-cart-btn{
  border-color: #E5E5E5!important;
  background-color: rgba(255, 118, 18, 0.05)!important;
  color: #EC500D!important;
}
.border-no{
  border: none!important;
}
.bg-ddd{
  background: #DDDDDD!important;
}
.col-transparent{
  background-color: transparent!important;
}
.fixed{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.mt-6{
  margin-top: 6px;
}
.fs-0{
  font-size: 0;
}
.product-detail__operate{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  z-index: 100;
}
.h-56{
  height: 56px!important;
}
.pb-56{
  padding-bottom: 56px;
}
.w-120{
  width: 120px!important;
}
</style>

<style lang="less">
.product-tab-content{
  .van-tabs__wrap{
    height: 0;
  }
  .van-tabs__nav{
    display: none;
  }
  .van-tabs__nav--line{
    padding-bottom: 0;
  }
  &.sticky-nav{
    .van-tabs__nav{
      display: flex;
    }
    .van-tabs__wrap{
      height: 40px;
    }
  }
}
.detail-sticky-scroll{
  .van-nav-bar{
    animation: all 1s;
    padding-bottom: 6px;
    .sticky-opacity{
      opacity: 1;
      animation: all 1s;
    }
  }
}
</style>