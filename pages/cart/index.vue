<template>
  <div class="vh-100 bg-grey pb-120">
    <van-sticky>
      <BmHeaderNav :title="$t('cart.title')" :border="false">
        <div slot="header-right" class="green fs-16" @click="onEdit">
          {{ isEdit ? $t('common.done') : $t('common.edit') }}
        </div>
      </BmHeaderNav>
    </van-sticky>

    <div class="bg-white">
      <!-- 购物车为空时展示 -->
      <empty-status v-if="!$store.state.user.authToken" :image="require('@/assets/images/empty/cart.png')" :btn="{ btn: '去登录', isEmit: true }" @emptyClick="onLogin" />
      <!-- 分类TAB -->
      <van-sticky v-else :offset-top="'0.92rem'">
        <van-tabs sticky animated color="#42B7AE" class="bg-white customs-van-tabs" :ellipsis="false" @change="getList" v-model="tabActive" line-height="0">
          <van-tab v-for="(categoryItem, tabIndex) in $t('cart.categoryList')" :title="categoryItem + '(' + (tabIndex == 0 ? allTotal : tabIndex == 1 ? priceCutTotal : oftenBuyTotal) + ')'" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex" />
        </van-tabs>
      </van-sticky>
    </div>

    <!-- 空数据 -->
    <empty-status v-if="list.length === 0 && $store.state.user.authToken" :image="require('@/assets/images/empty/cart.png')" :description="$t('cart.emptyTip')" :btn="{ btn: $t('me.likes.shopNow'), isEmit: true }" @emptyClick="goHome" />
    <!-- 数据列表展示 -->
    <template v-else>
      <div class="pt-14 pb-12 bg-white" v-for="item in list" :key="item.id">
        <van-checkbox-group v-model="item.result" :ref="'checkboxGroup-' + item.id" @change="storeChangeCheck($event, item)">
          <div class="flex vcenter pl-12">
            <BmImage
              :url="item.isAll ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
              :width="'0.34rem'" 
              :height="'0.34rem'"
              :isLazy="false"
              :isShow="false"
              @onClick="storeCheckAll(item)"
            />
            <!-- 店铺 -->
            <OrderStoreSingle class="pl-16 pr-30" @goStoreDetail="goStoreDetail(item.storeId)" :logo="item.storeLogo" :name="item.storeName" />
          </div>
          <van-swipe-cell class="pl-12" v-for="singleItem in item.products" :key="'single-' + singleItem.id">
            <div class="flex vcenter">
              <!-- 选中与否 -->
              <van-checkbox :name="singleItem.id" class="custom-checkbox" >
                <template #icon="props">
                  <div>
                    <BmImage
                      :url="!singleItem.stock ? require('@/assets/images/icon/unchoose-icon.png') : props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                      :width="'0.34rem'" 
                      :height="'0.34rem'"
                      :isLazy="false"
                      :isShow="false"
                    />
                  </div>
                </template>
              </van-checkbox>
              <van-card
                :title="singleItem.productName"
                class="bg-white pt-24 ml-12 plr-0 pb-0 lh-20 width-313 fm-helvetica"
              >
                <!-- 自定义图片 -->
                <template #thumb>
                  <SoldOut :isShow="singleItem.stock ? false: true" @click="goProductDetail(singleItem.productId)">
                    <BmImage
                      :url="singleItem.mainPictureUrl"
                      :width="'1.8rem'" 
                      :height="'1.8rem'"
                      :isLazy="false"
                      :isShow="true"
                      :fit="'cover'"
                      :errorUrl="require('@/assets/images/product-bgd-90.png')"
                    />
                  </SoldOut>
                  
                </template>
                <!-- 自定义描述区域，改为展示商品型号 -->
                <template #desc>
                  <div class="bg-f8 pl-10 mt-8 round-4 flex vcenter pr-10 fit-width">
                    <span class="grey pr-24">
                      <span v-for="(attrItem, attrIndex) in singleItem.productAttr" :key="'attr-item-' + attrIndex">{{ attrItem.attrValue }} {{ attrIndex != singleItem.productAttr.length-1 ? '/' : '' }} </span>
                    </span>
                    <van-icon name="arrow-down" color="#B6B6B6" size="0.16rem" />
                  </div>
                </template>
                <!-- 标签 -->
                <template #tags>
                  <div class="flex mt-8 vcenter hidden round-8 product-tag" v-if="singleItem.stock" @click="goProductDetail(singleItem.productId)">
                    <BmImage
                      :url="require('@/assets/images/icon/plane-icon.png')"
                      :width="'0.36rem'" 
                      :height="'0.36rem'"
                      :isLazy="false"
                      :isShow="false"
                      :fit="'cover'"
                    />
                    <span class="fs-10 plr-8">发货来自{{ singleItem.shipAddress }}</span>
                  </div>
                </template>
                <!-- 自定义数量,有库存显示数量，没有去看相似物品 -->
                <template #num>
                  <van-stepper v-if="singleItem.stock" v-model="singleItem.quantity" input-width="0.796rem" button-size="0.42rem" :integer="true" class="mt-6 custom-stepper" />
                  <div v-else class="border fs-12 black round-8 ptb-4 plr-8 mt-6 lh-1">相似物品</div>
                </template>
                <!-- 自定义价格 -->
                <template #price>
                  <div class="mt-8" @click="goProductDetail(singleItem.productId)">
                    <span class="red fs-16 fw">{{ $store.state.rate.currency }}{{ singleItem.addCartPrice }}</span>
                    <!-- <span class="grey fs-12 ml-10 line-through">{{ $store.state.rate.currency }}{{ item.cost }}</span> -->
                  </div>
                </template>
              </van-card>
            </div>
            
            <template #right>
              <div class="v-100 flex">
                <!-- 设置经常购买 -->
                <van-button v-if="singleItem.stock" @click="onOftenBy(singleItem)" square :text="singleItem.isOftenBuy ? '取消经常': 'Often Buy'" class="v-100 w-70 bg-f0 black plr-12 fs-14 border-no" />
                <!-- 收藏 -->
                <van-button v-if="singleItem.stock" @click="moveToFavorite(singleItem.productSku)" square text="Collect" class="v-100 w-70 bg-yellow white plr-12 fs-14 border-no" />
                <!-- 删除订单 -->
                <van-button square text="Delete" @click="onDelete(singleItem.productSku)" class="v-100 w-70 bg-red white plr-12 fs-14 border-no" />
              </div>
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div>
    </template>

    <!-- 可能喜欢的推荐列表展示 -->
    <div>
      <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
        <BmIcon :name="'xinaixin'" :width="'0.26rem'" :height="'0.22rem'" :color="'#FA2022'" class="mr-8"></BmIcon>
        {{ $t('common.mayLike') }}
      </van-divider>
      <div class="mlr-12 flex between flex-wrap">
        <ProductTopBtmSingle
          :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
          :detail="{ desc: 'categoryItem.name', price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2, country: 'Ghana' }"
          v-for="(searchItem, searchIndex) in 6"
          :key="'search-list-' + searchIndex"
          class="mb-12"
        />
      </div>
    </div>

    <!-- 购物车编辑 -->
    <div class="bg-white custom-submit-bar pl-16 pr-12 flex vcenter between">
      <van-checkbox v-model="checked" @click="checkAll">
        全选
        <template #icon="props">
          <div>
            <BmImage
              :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
              :width="'0.34rem'" 
              :height="'0.34rem'"
              :isLazy="false"
              :isShow="false"
            />
          </div>
        </template>
      </van-checkbox>
      <!-- 结算 -->
      <div v-show="!isEdit" class="flex vcenter">
        <div>
          <span class="black fs-14 mr-4">{{ $t('cart.total') }}:</span>
          <span class="red fs-14 fw">{{ $store.state.rate.currency }}{{ totalAmount }}</span>
        </div>
        <BmButton class="round-8 h-40 ml-12" @click="onCheckOut">{{ $t('cart.checkOut') }}</BmButton>
      </div>
      <!-- 编辑 -->
      <div v-show="isEdit">
        <BmButton :type="'info'" class="round-8 h-32 orange bg-white orange-border">{{ $t('cart.moveFavorite') }}</BmButton>
        <BmButton :type="'info'" class="round-8 h-32 orange bg-white orange-border ml-12" @click="onEmitDelete">{{ $t('common.delete') }}</BmButton>
      </div>
    </div>

    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import EmptyStatus from '@/components/EmptyStatus';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import SoldOut from '@/components/SoldOut';
import { Divider, Tab, Tabs, SwipeCell, Card, Stepper, Checkbox, CheckboxGroup, Sticky, SubmitBar } from 'vant';
import { removeCart, setOftenBuy, getCartCount, moveToFavorite, getCalculatePrice } from '@/api/cart';

export default {
  components: {
    vanDivider: Divider,
    vanTab: Tab,
    vanTabs: Tabs,
    vanSwipeCell: SwipeCell,
    vanCard: Card,
    vanStepper: Stepper,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    vanSticky: Sticky,
    vanSubmitBar: SubmitBar,
    SoldOut,
    EmptyStatus,
    OrderStoreSingle,
    ProductTopBtmSingle
  },
  data() {
    return {
      list: [],
      tabActive: 0,
      checked: false,
      isEdit: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      queryType: 1, // 查询类型（ 1 查询全部 2降价查询 3经常购买 4 关注商品列表）
      likeList: [],
      totalAmount: 0, // 总金额
      discountAmount: 0, // 优惠金额
      oftenBuyTotal: 0, // 经常购买总条数
      priceCutTotal: 0, // 降价总条数
      allTotal: 0, // 全部总条数
    }
  },
  async fetch() {
    // 未登录情况下不获取数据
    if (!this.$store.state.user.authToken) return false;
    const listData = await this.$api.getCartList({ pageNum: this.pageNum, pageSize: this.pageSize, queryType: this.queryType });
    this.list = listData.data.storeList.map(storeItem => {
      return {
        ...storeItem,
        result: [],
        isAll: false, // 是否全选
      }
    }); // 购物车列表
    this.total = listData.data.totalQuantity; // 总数量
    this.totalAmount = listData.data.totalAmount; // 总金额
    this.discountAmount = listData.data.discountAmount; // 优惠金额
  },
  activated() {
    this.getCartCount(); // 总数查询
    // 如果上次请求超过一分钟了，就再次发起请求
    if (this.$fetchState.timestamp <= Date.now() - 60000) {
      this.$fetch();
    }
  },
  methods: {
    onEdit() { // 编辑购物车, 登录情况下才可以编辑购物车
      if (this.$store.state.user.authToken) {
        this.isEdit = !this.isEdit;
      }
    },
    getList() { // 获取列表数据
      this.queryType = this.tabActive + 1;
      this.pageNum = 1;
      this.$fetch();
    },
    storeCheckAll(store, isAll) { // 店铺内部全选与否
      let isCheck = isAll ? !isAll : store.isAll;

      store.result = isCheck ? [] : store.products.map(item => {
        return item.id;
      })

      store.isAll = !isCheck;
      this.watchCheckAll();
    },
    storeChangeCheck(event, store) { // 店铺内订单勾选的监听事件
      store.isAll = event.length === store.products.length ? true : false;
      console.log(store)
      this.watchCheckAll();
    },
    checkAll(event, isHandle) { // 所有店铺内的订单全部选中
      console.log(isHandle)
      if (isHandle !== undefined) {
        this.checked = isHandle;
        return false;
      }
      // this.checked = !this.checked;
      
      this.list.forEach(item =>{
        this.storeCheckAll(item, this.checked);
      })
    },
    onCheckOut() { // 结算
      this.$router.push({
        name: 'cart-order-id',
        params: {
          id: 1
        }
      })
    },
    watchCheckAll() { // 监听购物车中的订单是否全部选中
      let check = [];
      this.list.map(item => {
        if (item.isAll !== true) {
          check.push(item.id);
        }
      })
      
      this.checkAll(check.length === 0, check.length === 0);
    },
    onEmitDelete() { // 确认删除订单
      this.$dialog.confirm({
        message: 'Delete the 1 Products',
        onfirmButtonText: this.$t('common.confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {

      }).catch(() => {

      })
    },
    goProductDetail(productId) { // 跳转到商品详情页面
      this.$router.push({
        name: 'cart-product-id',
        params: {
          id: productId
        }
      })
    },
    onLogin() { // 去登录
      this.$router.push({
        name: 'login'
      })
    },
    goStoreDetail(storeId) {
      this.$router.push({
        name: 'cart-store-id',
        params: {
          id: storeId
        }
      })
    },
    onDelete(skuId) { // 删除商品
      removeCart({skuIds: skuId}).then(() => {
        this.$fetch();
        this.getCartCount();
      })
    },
    goHome() { // 点击跳转到首页
      this.$router.push({
        name: 'home'
      })
    },
    onOftenBy(product) { // 设置经常购买
      setOftenBuy({ isOftenBuy: product.isOftenBuy == 1 ? 0 : 1, skuId: product.productSku }).then(() => {
        this.$fetch();
        this.getCartCount();
      })
    },
    getCartCount() { // 总数查询
      getCartCount().then(res => {
        this.priceCutTotal = res.data.priceCutTotal;
        this.oftenBuyTotal = res.data.oftenBuyTotal;
        this.allTotal = res.data.allTotal;
      })
    },
    moveToFavorite(skuIds) { // 添加到收藏夹
      moveToFavorite({ skuIds: skuIds }).then(res => {
        this.$fetch();
        this.getCartCount();
      })
    },
    getCalculatePrice(selectedData) { // 计算商品价格
      getCalculatePrice({ selectedData }).then(res => {

      })
    }
  },
}
</script>

<style lang="less" scoped>
.product-tag{
  height: 18px;
  position: relative;
  border: 1px solid #42b7ae;
  width: fit-content;
}
.mt-6{
  margin-top: 6px;
}
.v-100{
  height: 100%;
}
.bg-yellow{
  background-color: #F7B500!important;
}
.bg-f0{
  background-color: #F0F1F2!important;
}
.w-70{
  width: 70px;
}
.border-no{
  border: none!important;
}
.bg-f8{
  background-color: #F8F8F8;
}
.fit-width{
  width: fit-content;
}
.width-313{
  width: 313px;
}
.h-40{
  height: 40px!important;
}
.pb-120{
  padding-bottom: 120px;
}
.orange-border{
  border-color: #FF8248!important;
}
.custom-submit-bar{
  bottom: 50px;
  left: 0;
  right: 0;
  height: 56px;
  position: fixed;
}
</style>

<style lang="less">
.custom-checkbox{
  .van-checkbox__label{
    margin-left: 0!important;
  }
}
</style>