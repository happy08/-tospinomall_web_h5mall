<template>
  <!-- 商品详情页面 -->
  <div class="v-percent-100 bg-grey pb-56 product-detail-content" v-if="isDetail">
    <van-sticky
      ref="detailStickyContainer"
      @scroll="stickyScroll"
    >
      <BmHeaderNav
        :left="{ isShow: isScroll ? true : false }"
        :bg_color="!isScroll ? 'col-transparent' : 'white'"
        :border="false"
        :color="!isScroll ? 'white' : 'black'"
        :class="{ 'fixed': !isScroll }"
      >
        <div slot="header-left" class="flex between">
          <van-icon
            :name="require('@/assets/images/icon/back-icon.png')"
            size="0.64rem"
            v-show="!isScroll"
            @click="leftBack"
          />
          <div class="sticky-opacity ml-14" v-show="isScroll" @click="$router.replace({ name: 'search', query: { back: 'product-id', backId: goodId } })">
            <van-search v-model="searchVal" disabled class="round-20 hidden" />
          </div>
        </div>

        <div slot="header-right">
          <van-icon
            :name="!isScroll ? require('@/assets/images/icon/share-icon.png') : require('@/assets/images/icon/share-icon-white.png')"
            size="0.64rem"
            class="mt-6"
            @click="showShare = true"
          />
          <van-icon
            :name="!isScroll ? require('@/assets/images/icon/cart-icon.png') : require('@/assets/images/icon/cart-icon-white.png')"
            size="0.64rem"
            class="mt-6 ml-12"
            @click="$router.push({ name: 'cart', query: { isBar: 1 } })"
          />
        </div>
      </BmHeaderNav>
    </van-sticky>

    <!-- 导航栏, 滚动导航 -->
    <van-tabs
      v-model="tabActive"
      scrollspy
      sticky
      :offset-top="!isScroll ? '0rem' : '0.92rem'"
      title-active-color="#FF6666"
      line-height="0"
      title-inactive-color="#383838"
      class="product-tab-content"
      ref="detailTabContainer"
      :ellipsis="false"
    >
      <van-tab :title="$t('shot')" name="Short">
        <div>
          <!-- 商品轮播图 -->
          <swiper ref="swiperComponentRef" :options="swiperOption" class="swiper-container fs-0">
            <swiper-slide v-for="(productItem, productIndex) in carouselMapUrls" :key="productIndex" @click.native="isPreviewIndex = productIndex" class="video-container">
              <BmImage
                :url="require('@/assets/images/icon/video.png')"
                :height="'0.88rem'"
                :width="'0.88rem'"
                :isLazy="false"
                :isShow="false"
                :fit="'cover'"
                :alt="goodSpuVo.goodTitle"
                class="video-container__icon"
                v-if="productItem.fileType == 2"
              />
              <BmImage
                :url="productItem.fileType == 2 ? goodSpuVo.mainPictureUrl : productItem.imgUrl"
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
        <div class="pt-20 mt-12 bg-white pl-20 flex between vcenter" v-if="couponList.length > 0">
          <!-- 满减 -->
          <div class="border-red pl-4 pr-8 ptb-2 red fs-12 round-2" v-if="couponList[0].satisfyAmount != ''">
            {{ $t('coupon_full_reduction', { replace_tip: $store.state.rate.currency + couponList[0].satisfyAmount , replace_tip1: this.$store.state.rate.currency + couponList[0].subtractAmount }) }}</div>
          <!-- 无门槛 -->
          <div class="border-red pl-4 pr-8 ptb-2 red fs-12 round-2" v-else>{{ $t('coupon_no_threshold') }}{{ $store.state.rate.currency }}{{ couponList[0].subtractAmount }}</div>
          <div class="bg-dark-red-linear pl-16 pr-6 ptb-2 fs-14 white round-tbl-12 flex vcenter" @click="isCouponShow = true">
            <span class="pr-4">{{ $t('get_coupon') }}</span>
            <BmImage
              :url="require('@/assets/images/icon/arrow-right.png')"
              :width="'0.1rem'" 
              :height="'0.12rem'"
              :isLazy="false"
              :isShow="true"
              :alt="'TospinoMall'"
              class="flex-shrink"
            />
          </div>
        </div>
        <div class="bg-white plr-20 ptb-14">
          <div>
            <span class="fs-16 red fw">
              <span class="fm-menlo">{{ $store.state.rate.currency }}</span><span class="fm-din">{{ goodSpuVo.minPrice }}</span>
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
            @click="onChooseFreight"
          >
            <template #title>
              <div class="flex vcenter">
                <span class="fw fs-12 block">{{ $t("freight") }}</span>
                <span class="ml-12 fs-12 grey fm-helvetica" v-if="deliveryInfo.length > 0 && completeAddress">
                  <!-- 包邮 -->
                  <span v-if="deliveryInfo[0].type == 1">{{ $t('free_freight') }}</span>
                  <!-- 不配送 -->
                  <span v-else-if="deliveryInfo[0].type == 3">{{ $t('not_sale') }}</span>
                  <!-- 不包邮 -->
                  <span v-else>{{ $t("freight") }}: {{ $store.state.rate.currency }}{{ deliveryInfo[0].freightPrice }}</span>
                </span>
                <span class="ml-12 fs-12 grey fm-helvetica" v-else>{{ completeAddress ? completeAddress : $t('please_choose_address')}}</span>
              </div>
            </template>
          </van-cell>
          <!-- 货源地到收货地 -->
          <template v-if="deliveryInfo.length > 0 && completeAddress">
            <!-- 步骤条 -->
            <van-steps :active="freightActive" class="plr-20 mt-6 custom-step-product">
              <!-- 发货地址 -->
              <van-step>
                <!-- 自定义未激活状态图标 -->
                <template #inactive-icon>
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 1"
                    :name="require('@/assets/images/icon/plane-default.png')"
                    size="0.48rem"
                  />
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 2"
                    :name="require('@/assets/images/icon/steamer-default.png')"
                    size="0.48rem"
                  />
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 3"
                    :name="require('@/assets/images/icon/truck-default.png')"
                    size="0.48rem"
                  />
                </template>
                <!-- 自定义激活状态图标 -->
                <template #active-icon>
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 1"
                    :name="require('@/assets/images/icon/plane-active.png')"
                    size="0.48rem"
                  />
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 2"
                    :name="require('@/assets/images/icon/steamer-active.png')"
                    size="0.48rem"
                  />
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 3"
                    :name="require('@/assets/images/icon/truck-active.png')"
                    size="0.48rem"
                  />
                </template>
                <!-- 自定义激活状态图标 -->
                <template #finish-icon>
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 1"
                    :name="require('@/assets/images/icon/plane-active.png')"
                    size="0.48rem"
                  />
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 2"
                    :name="require('@/assets/images/icon/steamer-active.png')"
                    size="0.48rem"
                  />
                  <van-icon
                    v-if="deliveryInfo[0].sendType == 3"
                    :name="require('@/assets/images/icon/truck-active.png')"
                    size="0.48rem"
                  />
                </template>
                <span>{{ storeInfo.deliveryCountryName }}</span>
              </van-step>
              <!-- 配送类型( 1 FBM 2 FBT ) FBT不展示中转站 -->
              <van-step v-if="goodSpuVo.deliveryType == 1 && form.countryCode != storeInfo.deliveryCountryCode">
                <span class="tc w-100 iblock ml-8">Accra</span>
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
                <span>{{ completeAddress }}</span>
              </van-step>
            </van-steps>
            <p class="fs-14 light-grey fm-helvetica pb-20" v-if="deliveryInfo.length > 0">{{ deliveryInfo[0].estimeate }}</p>
            <!-- <p class="mt-8 orange fs-12 pb-10">From January 3rd to January 27th</p> -->
          </template>
        </div>
      </van-tab>
      <van-tab :title="$t('param')" name="Param">
        <!-- 选择产品规格 -->
        <div :class="{'mt-12 bg-white plr-20': true, 'pb-24': (selectCarousel.length > 0 && selectCarousel[0].attrPicture != '') || servicePromises.length > 0}">
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
          <div class="pr-10">
            <swiper
              ref="swiperRecommendRef"
              :options="selectOption"
              class="review-swiper"
              v-if="selectCarousel.length > 0 && selectCarousel[0].attrPicture != ''"
            >
              <swiper-slide
                v-for="(selectItem, selectIndex) in selectCarousel"
                :key="'like-index-' + selectIndex"
              >
                <BmImage
                  :url="selectItem.attrPicture"
                  :width="'0.6rem'"
                  :height="'0.6rem'"
                  :isLazy="false"
                  :isShow="true"
                  :fit="'cover'"
                  :class="{'round-4 border': true}"
                  :alt="goodSpuVo.goodTitle + selectItem.attrValue"
                />
              </swiper-slide>
            </swiper>
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
            <nuxt-link class="fs-14" :to="{ name: 'me-order-rate-detail-list', query: { id: goodSpuVo.id } }">{{ $t("more") }}</nuxt-link>
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
            <p class="mt-12 fs-14 black plr-20 fm-helvetica word-break">
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
                  class="video-container"
                >
                  <BmImage
                    :url="require('@/assets/images/icon/video.png')"
                    :height="'0.64rem'"
                    :width="'0.64rem'"
                    :isLazy="false"
                    :isShow="false"
                    :fit="'cover'"
                    :alt="goodSpuVo.goodTitle"
                    class="video-container__icon"
                    v-if="reviewPicItem.fileType == 2"
                  />
                  <BmImage
                    :url="reviewPicItem.imgUrl"
                    :width="'2rem'"
                    :height="'2rem'"
                    :isLazy="false"
                    :fit="'cover'"
                    class="border round-4"
                    :isShow="true"
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
              <div class="grey fs-14 ptb-2 plr-10 bgd-f8 round-4 fm-helvetica word-break">{{ $t("specification") }}{{ reviewItem.saleAttr }}</div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('similar')" name="Similar">
        <!-- 同店商品 -->
        <div class="mt-12 bg-white ptb-20">
          <h3 class="black flex between vcenter plr-20 fn fm-helvetica">
            <span class="fs-16">{{ $t("just_for_you") }}</span>
            <nuxt-link class="fs-14" :to="{ name: 'cart-store-id', params: { id: storeInfo.storeId }, query: { sellerId: storeInfo.sellerId, tabbarActive: 1 } }">{{ $t("more") }}</nuxt-link>
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
                  @onClick="$router.push('/product/' + productItem.productId + '.html')"
                  :alt="productItem.productTitle"
                />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('details')" name="Details" class="fs-0 w-100 product-container">
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

    <!-- 运费模板 -->
    <van-popup v-model="deliveryShow" position="bottom" closeable class="pb-30">
      <div class="plr-20 pt-20 pb-30">
        <h3 class="black fs-18 border-b pb-20">{{ $t('delivery_freight_method') }}</h3>
        <!-- 运送费 -->
        <van-cell
          :title="$t('delivery_freight_free')"
          :border="false"
          class="plr-0 pt-12 pb-0"
          title-class="fs-16 black"
          label-class="fs-14 black"
        >
          <template #label>
            <div class="flex vcenter">
              <span class="fs-12 grey fm-helvetica" v-if="deliveryInfo.length > 0 && completeAddress">
                <!-- 包邮 -->
                <span v-if="deliveryInfo[0].type == 1">{{ $t('free_freight') }}</span>
                <!-- 不配送 -->
                <span v-else-if="deliveryInfo[0].type == 3">{{ $t('not_sale') }}</span>
                <!-- 不包邮 -->
                <span v-else>{{ $t("freight") }}: {{ $store.state.rate.currency }}{{ deliveryInfo[0].freightPrice }}</span>
              </span>
              <span class="fs-12 grey fm-helvetica" v-else>{{ completeAddress ? completeAddress : $t('please_choose_address')}}</span>
            </div>
          </template>
        </van-cell>
        <!-- 发货地 -->
        <van-cell
          :title="$t('delivery_freight_place')"
          :border="false"
          class="plr-0 pt-12 pb-0"
          title-class="fs-16 black"
          :label="storeInfo.deliveryCountryName"
          label-class="fs-14 black"
        />
        <!-- 收货地址 -->
        <van-cell
          :title="$t('harvest_address')"
          :border="false"
          class="plr-0 pt-12 pb-0"
          title-class="fs-16 black"
          :label="completeAddress"
          label-class="fs-14 black"
        >
          <template #right-icon>
            <div class="green fs-16" @click="addressShow = true">{{ $t('delivery_address_choose') }}</div>
          </template>
        </van-cell>
        <!-- 预计到达时间 -->
        <van-cell
          title=""
          :border="false"
          class="plr-0 mt-20 pb-0 pt-0"
          v-for="(deliveryItem, deliveryIndex) in deliveryInfo"
          :key="deliveryIndex"
          label-class="ml-10 black mt-0 fm-helvetica"
        >
          <template #icon>
            <van-icon
              v-if="deliveryItem.sendType == 1"
              :name="require('@/assets/images/icon/plane-active.png')"
              size="0.36rem"
            />
            <van-icon
              v-if="deliveryItem.sendType == 2"
              :name="require('@/assets/images/icon/steamer-active.png')"
              size="0.36rem"
            />
            <van-icon
              v-if="deliveryItem.sendType == 3"
              :name="require('@/assets/images/icon/truck-active.png')"
              size="0.36rem"
            />
          </template>
          <template #label>
            <div class="fs-16">{{ deliveryItem.sendType == 1 ? $t('air_freight') : deliveryItem.sendType == 2 ? $t('sea_transportation') : deliveryItem.sendType == 3 ? $t('land_transportation') : ''}} · {{ $t('delivery_freight_arrive_time') }}</div>
            <div class="fs-14 mt-12">
              {{ deliveryItem.estimeate }}
            </div>
          </template>
        </van-cell>
      </div>
    </van-popup>

    <!-- 地址选择 -->
    <BmAddress :stepArr="stepArr" :addressShow.sync="addressShow" @close="closePopup" :haveAddress="haveAddress"></BmAddress>

    <!-- 加入购入车/收藏/店铺/立即购买 -->
    <div class="bg-white flex vcenter between pl-10 product-detail__operate">
      <div class="flex arround w-100">
        <!-- 客服 -->
        <van-icon
          :name="require('@/assets/images/icon/chat-icon.png')"
          size="0.6rem"
          @click="qimoChatClick()"
        />
        <!-- 店铺 -->
        <nuxt-link :to="{ name: 'cart-store-id', params: { id: storeInfo.storeId }, query: { sellerId: storeInfo.sellerId, tabbarActive: 0} }">
          <van-icon :name="require('@/assets/images/icon/store-icon.png')" size="0.6rem" />
        </nuxt-link>
        <!-- 收藏 0未关注 1已关注 -->
        <van-icon :name="goodSpuVo.isAttention ? require('@/assets/images/icon/collect-active-icon.png') : require('@/assets/images/icon/collect-icon.png')" size="0.6rem" @click="attentionProduct" />
      </div>
      <div class="flex">
        <!-- 加入购物车 -->
        <BmButton :type="'info'" class="fs-16 round-0 w-130 h-56 add-cart-btn border-no" :disabled="goodSpuVo.inSale == 0" @click="onAddCart">{{ $t('add_to_cart') }}</BmButton>
        <!-- 立即购买 -->
        <BmButton class="fs-16 round-0 w-130 h-56" :disabled="goodSpuVo.inSale == 0" @click="onBuySku">{{ $t('buy_now') }}</BmButton>
      </div>
    </div>

    <!-- 产品规格 -->
    <ProductSku :productShow="productShow" :goodSpuVo="goodSpuVo" :initialSku="initialSku" :sku="sku" :type="skuType" @onSkuInfo="onSkuInfo" @onSelectedSkuCombId="selectedSkuCombId = $event" />

    <!-- 分享 -->
    <van-share-sheet v-model="showShare" :options="shareOptions" :title="$t('share_title')" :cancel-text="$t('cancel')" @select="onShare" />

    <!-- 预览 -->
    <bm-preview v-if="isPreviewIndex != 'false'" :isPreviewIndex="isPreviewIndex" :carouselMapUrls="carouselMapUrls" :initialSlide="isPreviewIndex" @onClose="isPreviewIndex = 'false'" @onPreviewChange="onPreviewPic($event)"></bm-preview>

    <!-- 商品优惠券 -->
    <CouponScroll :isShow="isCouponShow" :goodId="goodId" :type="'goodsDetails'" @onGoodsCoupons="couponList = $event" v-if="isCouponInit" @onBeforeClose="isCouponShow = $event"></CouponScroll>
    <!-- <van-popup v-model="isCouponShow" style="height: 80%" position="bottom" class="round-tlr-12 coupon-popup pt-20">
      <h3 class="black fs-18 pb-10 tc lh-20">{{ '优惠券' }}</h3>
      <div class="container-absolute-height">
        <coupon-order-single class="mb-10 mlr-10" v-for="(item, index) in couponList" :key="'good-coupon-' + index" :item="item" @onSelect="isCouponShow = $event"></coupon-order-single>
      </div>
    </van-popup> -->
  </div>
  <empty-status v-else-if="isDetail == false" :image="require('@/assets/images/empty/order.png')" class="mh-60" :btn="{ btn: $t('return_to_previous_page'), isEmit: true }" @emptyClick="$router.go(-1)" />
</template>

<script>
import { Cell, Step, Steps, Rate, Sticky, Search, Tab, Tabs, Popup, Stepper, ShareSheet } from 'vant';
import { getDeliveryInfo, attentionProduct, cancelAttentionProduct } from '@/api/cart';
import { getCurrentDefaultAddress } from '@/api/address';
import ProductSku from '@/components/ProductSku';
import 'swiper/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import ClipboardJS from 'clipboard';
import { getShareDetail } from '@/api/user';
import shareFacebook from '@/assets/images/icon/share-facebook.png';
import shareInfo from '@/assets/images/icon/share-info.png';
import shareLink from '@/assets/images/icon/share-link.png';
import EmptyStatus from '@/components/EmptyStatus';
import BmPreview from '@/components/_global/BmPreview';
import { getCouponCenterList } from '@/api/coupon';
import CouponScroll from '@/components/CouponScroll';

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
    vanShareSheet: ShareSheet,
    ProductSku,
    EmptyStatus,
    BmPreview,
    CouponScroll
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
      selectOption: {
        slidesPerView: 'auto',
        spaceBetween: 6
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
      stepArr: [],
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
      deliveryInfo: [],
      showShare: false,
      shareOptions: [
        {
          name: this.$t('share_facebook'),
          icon: shareFacebook
        },
        {
          name: this.$t('share_copy_link'),
          icon: shareLink
        },
        {
          name: this.$t('share_content'),
          icon: shareInfo
        }
      ],
      shareDetail: {},
      meta: {},
      isNext: false,
      isDetail: null,
      isPreviewIndex: 'false',
      previewIndex: 0,
      goodId: '',
      haveAddress: {},
      couponList: [],
      isCouponInit: false,
      isCouponShow: false
    }
  },
  async fetch() {
    try {
      // 判断登录之后，获取详情时要带userid
      this.goodId = this.$route.params.id;
      // 处理伪静态
      if (this.goodId.indexOf('.html')) {
        this.goodId = this.goodId.replace('.html', '');
      }
      if (this.goodSpuVo.id != this.goodId) {
        this.$toast.loading({
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
      }

      this.isCouponInit = true;
      
      let _detailParams = {};
      if (this.$store.state.user.userInfo) {
        _detailParams.userId = this.$store.state.user.userInfo.id
      }
      const detailData = await this.$api.getProductDetail(this.goodId, _detailParams); // 获取商品详情;
      this.$toast.clear();
      this.isDetail = detailData.data ? true : false; // 判断当前商品是否有数据
      if (!detailData.data) return false;

      this.carouselMapUrls = detailData.data.carouselMapUrls; // 商品轮播图
      this.previewImages = detailData.data.carouselMapUrls.map(item => { // 轮播图预览图片
        return item.imgUrl;
      })
      
      this.hotEvaluates = {  // 商品热评
        total: detailData.data.totalEvaluateNum,
        lists: detailData.data.hotEvaluates.map(item => {
          return {
            ...item,
            // pictures: item.pictures.filter(picItem => {
            //   return picItem.fileType == 1;
            // })
          }
        })
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
          // if (_selectCarousel.length < 3 && _selectCarousel.length < item.attrValues.length) { // 商品选择的图片集展示
          if (_selectCarousel.length < item.attrValues.length) { // 商品选择的图片集展示
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
      
      this.initialSku = {
        ...initArr[0],
        selectedNum: 1,
        selectedSkuComb: {
          stock_num: initArr[0].stock_num
        }
      }
      this.selectedSkuCombId = this.initialSku.id;
      // 获取运费模板
      if (this.$store.state.user.authToken) {
        this.getDeliveryInfo();
      }

      this.likeList = [];
      // 获取同店商品推荐列表
      if (this.storeInfo.storeId) {
        // if (this.$store.state.searchType == 2) { // algolia 搜索
        //   const algoliasearch = require('algoliasearch');
        //   let client = algoliasearch('62MLEBY33X','7a8da9a5fd3f8137ea8cb70b60806e8d');
        //   let searchClient = client.initIndex('tospinoMall');
        //   searchClient.search('', {
        //     // page: 0, // 从0开始算起
        //     // hitsPerPage: this.pageSize,
        //     filters: `shopId:${this.storeInfo.storeId} AND categoryId:${this.goodSpuVo.categoryId} AND (NOT productId:${this.goodSpuVo.id})`,
        //   }).then(({ hits }) => {
        //     this.likeList = hits;
        //   })
        // } else { // 阿里搜索
          const recommendData = await this.$api.getRecommendList({ shopId: this.storeInfo.storeId, categoryId: this.goodSpuVo.categoryId, productId: this.goodSpuVo.id });
          if (recommendData.data) {
            this.likeList = recommendData.data;
          }
          
        // }
      }

      // 获取SEO信息
      const metaData = await this.$api.getProductDetailSEO();
      this.meta = {
        title: metaData.data.title.replace('{spuTitle}', this.goodSpuVo.goodTitle).replace('{sellerGoodsKeywords}', this.goodSpuVo.goodTitle),
        description: metaData.data.description.replace('{spuTitle}', this.goodSpuVo.goodTitle).replace('{sellerGoodsKeywords}', this.goodSpuVo.goodTitle),
        keyword: metaData.data.keyword.replace('{spuTitle}', this.goodSpuVo.goodTitle).replace('{sellerGoodsKeywords}', this.goodSpuVo.goodTitle)
      }
    } catch (error) {
      console.log(error);
    }
  },
  activated() {
    this.stepArr = []; // 每次进来时要先清空地址栏
    this.form = {
      countryCode: '', //国家编码
      provinceCode: '', // 省份编码
      cityCode: '', // 市编码
      districtCode: '' //区编码
    }
    this.haveAddress = {};
    this.completeAddress = '';
    this.assgnStepList = [];

    // 已登录
    if (this.$store.state.user.authToken) {
      getCurrentDefaultAddress().then(res => { // 查看是否有默认地址
        if (!res.data || res.data.length === 0) { // 没有默认地址的情况下获取国家列表
          return false;
        };
        this.assgnStepList = this.stepArr = res.data.areaList;
        this.form = {
          countryCode: res.data.countryCode, //国家编码
          provinceCode: res.data.provinceCode, // 省份编码
          cityCode: res.data.cityCode, // 市编码
          districtCode: res.data.districtCode //区编码
        }
        console.log(res.data.completeAddress)
        this.completeAddress = res.data.completeAddress; // 完整地址
        // 获取地址的时候默认是最后一级
        this.haveAddress = res.data.areaList[res.data.areaList.length - 2];
      }).catch(error => {
        console.log(error);
      })
    }
    this.$fetch();
    if (this.goodSpuVo.goodTitle) {
      this.shareDetail = {
        textContent: `${this.$t('share_content')}, ${this.$t('share_product_title')}: ${this.goodSpuVo.goodTitle}`,
        url: `${location.href}?isShare=1`,
        urlContent: `${location.href}?isShare=1${this.$t('share_product_link')}, ${this.$t('share_product_title')}: ${this.goodSpuVo.goodTitle}, ${this.$t('share_product_min_price')}: ${this.goodSpuVo.minPrice}`
      }
    }
    // 获取优惠券列表
    // this.getGoodsCouponList();
    // 获取分享内容
    getShareDetail(this.goodId).then(res => {
      if (!res.data) return false;
      this.shareDetail = res.data;
    }).catch(error => {
      console.log(error);
    })
  },
  deactivated() {
    this.isCouponInit = false;
  },
  head() {
    return {
      title: this.meta.title + 'TospinoMall Ghana online shopping',
      meta: [
        { hid: 'description', name: 'description', content: this.meta.description || 'TospinoMall Ghana online shopping' },
        { hid: 'keywords', name: 'keywords', content: this.meta.keyword || 'TospinoMall Ghana online shopping' },
        { hid: 'og:title', property: 'og:title', content: this.meta.title || 'TospinoMall Ghana online shopping' },
        { hid: 'og:description', property: 'og:description', content: this.meta.description || 'TospinoMall Ghana online shopping' }
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
  methods: {
    stickyScroll(scrollObj) { // 吸顶滚动事件
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
    leftBack() {
      if (this.$route.query.isShare) { // 如果是分享出去的页面，点击回退按钮时跳转到首页
        this.$router.replace('/home.html');
        return false;
      }
      if(window.history.length < 2){ //解决部分机型拿不到history
        this.$router.replace('/');
      }else{
        history.back();
      }
    },
    onPreviewPic(index) { // 轮播图预览
      this.$refs.swiperComponentRef.$swiper.slideTo(index);
    },
    closePopup(form) { // 关闭修改地址弹窗时触发, 数据处理
      if (form) {
        this.form = {
          ...this.form,
          ...form
        };
        this.assgnStepList = this.stepArr;
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
      }).catch(error => {
        console.log(error);
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
      // if (this.$store.state.user.authToken) {
        this.skuType = '';
        this.productShow.show = true;
      //   return false;
      // }
      // // 未登录情况下跳转到登录页面
      // this.$router.push({
      //   name: 'login'
      // })
    },
    attentionProduct() { // 关注商品
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          path: '/login.html'
        })
        return false;
      }
      if (this.goodSpuVo.isAttention == 1) { // 取消关注
        cancelAttentionProduct([this.goodSpuVo.id]).then(() => {
          this.goodSpuVo.isAttention = 0;
        }).catch(error => {
          console.log(error);
        })
        return false;
      }
      
      attentionProduct(this.goodSpuVo.id).then(() => {
        this.goodSpuVo.isAttention = 1;
      }).catch(error => {
        console.log(error);
      })
    },
    onBuySku() {
      this.skuType = 'buy';
      this.productShow.show = true;
    },
    onShare(option, index) { // 分享操作
      if (index == 0) { // facebook
        window.open("https://www.facebook.com/share.php?u=".concat(encodeURIComponent(this.shareDetail.url)));
        return false;
      }
      if (index == 1) { // 复制链接
        this.onCopy(this.shareDetail.url);
        return false;
      }
      if (index == 2) { // 分享内容
        this.onCopy(this.shareDetail.textContent);
        return false;
      }
    },
    onCopy(value) {
      let clipboard = new ClipboardJS('.van-share-sheet__option', {
        text: () => {
          return value;
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
    onChooseFreight() {
      if (this.deliveryInfo.length > 0 && this.completeAddress) { // 已选择收货地址
        this.deliveryShow = true;
        return false;
      }
      this.addressShow = true;
    },
    qimoChatClick() { // 唤起客服
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          path: '/login.html'
        })
        return false;
      }
      qimoChatClick();
    },
    onPreviewChange(index) { // 预览切换时
      this.previewIndex = index;
    },
    // getGoodsCouponList() { // 获取优惠券列表
    //   getCouponCenterList({
    //     pageNum: this.couponPageNum,
    //     pageSize: this.couponPageSize,
    //     listType: 'goodsDetails',
    //     goodId: this.goodId,
    //     buyerId: this.$store.state.user.userInfo.id || ''
    //   }).then(res => {
    //     this.couponList = res.data.records;
    //     this.couponTotal = parseFloat(res.data.total);
    //   }).catch(error => {
    //     console.log(error);
    //   })
    // }
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
::v-deep .product-container{
  overflow: hidden;
  a{
    color: #007aff;
  }
  img{
    max-width: 100%;
  }
}
.address-container-height{
  height: calc(100% - 30px);
  overflow: scroll;
}
.bg-black{
  background-color: #000;
}
.video-container{
  position: relative;
  .video-container__icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
}
.bg-F90{
  background-color: #F9083B;
}
.round-tbl-12{
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
}
.pl-18{
  padding-left: 18px;
}
.pr-6{
  padding-right: 6px;
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
    width: 76%;
    &>div, .sticky-opacity{
      width: 100%;
    }
  }
}
.custom-step-product{
  .van-steps__items{
    margin-bottom: 0;
    padding-bottom: 14px;
    .van-step{
      .van-step__title{
        margin-top: 25px;
        width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .van-step__circle-container, .van-step__line{
        margin-top: 8px;
        top: 0;
      }
      &:last-child{
        .van-step__title{
          margin-right: -10px;
        }
      }
    }
  }
}
</style>