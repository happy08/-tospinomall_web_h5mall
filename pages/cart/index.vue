<template>
  <div class="v-percent-100 bg-grey pb-120 pt-46">
    <BmHeaderNav :left="{ isShow: $route.query.isBar ? true: false }" :title="$t('cart')" :border="false" :fixed="true">
      <div slot="header-right" class="green fs-16" @click="onEdit">
        {{ isEdit ? $t('done') : $t('edit') }}
      </div>
    </BmHeaderNav>

    <div class="bg-white">
      <!-- 未登录,购物车为空时展示 -->
      <empty-status v-if="!$store.state.user.authToken" :image="require('@/assets/images/empty/cart.png')" :btn="{ btn: '去登录', isEmit: true }" @emptyClick="onLogin" />
      <!-- 分类TAB -->
      <van-sticky v-else :offset-top="'0.92rem'">
        <van-tabs sticky animated color="#42B7AE" class="bg-white customs-van-tabs" :ellipsis="false" @change="getList" v-model="tabActive" line-height="0">
          <van-tab v-for="(categoryItem, tabIndex) in $t('category_list')" :title="categoryItem + '(' + (tabIndex == 0 ? allTotal : tabIndex == 1 ? priceCutTotal : oftenBuyTotal) + ')'" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex" />
        </van-tabs>
      </van-sticky>
    </div>

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-94">
      <!-- 空数据 -->
      <empty-status v-if="list.length === 0 && $store.state.user.authToken" :image="require('@/assets/images/empty/cart.png')" :description="$t('cart_empty_tip')" :btn="{ btn: $t('shop_now'), isEmit: true }" @emptyClick="goHome" />
      <!-- 数据列表展示 -->
      <template v-else>
        <div class="pt-14 pb-12 bg-white" v-for="item in list" :key="item.id">
          <van-checkbox-group v-model="item.result" :ref="'checkboxGroup-' + item.id" @change="storeChangeCheck($event, item)">
            <div class="flex vcenter pl-12">
              <BmImage
                :url="item.isEmpty.length == item.products.length ? require('@/assets/images/icon/unchoose-icon.png') : item.isAll ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                :width="'0.32rem'" 
                :height="'0.32rem'"
                :isLazy="false"
                :isShow="false"
                @onClick="storeCheckAll(item)"
                class="flex-shrink"
                :alt="'choose icon'"
              />
              <!-- 店铺 -->
              <OrderStoreSingle class="pl-16 pr-30" :logo="item.storeLogo" :name="item.storeName" @goStoreDetail="goStoreDetail(item)" />
            </div>
            <van-swipe-cell class="pl-12" v-for="singleItem in item.products" :key="'single-' + singleItem.id">
              <div class="flex vcenter">
                <!-- 选中与否 -->
                <van-checkbox :name="singleItem.id" class="custom-checkbox" >
                  <template #icon="props">
                    <div>
                      <BmImage
                        :url="singleItem.status != 1 ? require('@/assets/images/icon/unchoose-icon.png') : props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                        :width="'0.32rem'" 
                        :height="'0.32rem'"
                        :isLazy="false"
                        :isShow="false"
                        :alt="'choose icon'"
                      />
                    </div>
                  </template>
                </van-checkbox>
                <van-card class="bg-white pt-24 ml-12 plr-0 pb-0 lh-20 width-313 fm-helvetica">
                  <!-- 自定义图片 -->
                  <template #thumb>
                    <nuxt-link :to="{ name: 'cart-product-id', params: { id: singleItem.productId } }">
                      <SoldOut :isShow="singleItem.status == 1 ? false: true">
                        <BmImage
                          :url="singleItem.mainPictureUrl"
                          :width="'1.8rem'" 
                          :height="'1.8rem'"
                          :isLazy="false"
                          :isShow="true"
                          :fit="'cover'"
                          :alt="singleItem.productName"
                        />
                      </SoldOut>
                    </nuxt-link>
                  </template>
                  <!-- 自定义标题 -->
                  <template #title>
                    <nuxt-link :to="{ name: 'cart-product-id', params: { id: singleItem.productId } }" class="hidden-2">{{ singleItem.productName }}</nuxt-link>
                  </template>
                  <!-- 自定义描述区域，改为展示商品型号 -->
                  <template #desc>
                    <span class="bg-f8 pl-10 mt-8 round-4 flex vcenter pr-10 fit-width" @click="onSku(singleItem)">
                      <span class="grey pr-24 hidden-1">
                        <span v-for="(attrItem, attrIndex) in singleItem.productAttr" :key="'attr-item-' + attrIndex">{{ attrItem.attrValue }} {{ attrIndex != singleItem.productAttr.length-1 ? '/' : '' }} </span>
                      </span>
                      <van-icon name="arrow-down" color="#B6B6B6" size="0.16rem" />
                    </span>
                  </template>
                  <!-- 标签 -->
                  <template #tags>
                    <nuxt-link :to="{ name: 'cart-product-id', params: { id: singleItem.productId } }" class="flex mt-8 vcenter hidden round-8 product-tag" v-if="singleItem.status == 1">
                      <BmImage
                        :url="require('@/assets/images/icon/plane-icon.png')"
                        :width="'0.36rem'" 
                        :height="'0.36rem'"
                        :isLazy="false"
                        :isShow="false"
                        :fit="'cover'"
                        :alt="'Tospino ship from tag'"
                      />
                      <span class="fs-10 plr-8 lh-12">{{ $t('ship_from') }}{{ singleItem.shipAddress }}</span>
                    </nuxt-link>
                  </template>
                  <!-- 自定义数量,有库存显示数量，没有去看相似物品 -->
                  <template #num>
                    <van-stepper v-if="singleItem.status == 1" v-model="singleItem.quantity" input-width="0.796rem" button-size="0.42rem" :integer="true" class="mt-6 custom-stepper" @change="onChangeNum(singleItem)" :max="singleItem.stock" />
                    <div v-else class="border fs-12 black round-8 ptb-4 plr-8 mt-6 lh-1" @click="goSimilar(singleItem.productId)">{{ $t('similar_goods') }}</div>
                  </template>
                  <!-- 自定义价格 -->
                  <template #price>
                    <nuxt-link :to="{ name: 'cart-product-id', params: { id: singleItem.productId } }" class="mt-8 block">
                      <span class="red fs-16 fw" v-if="$store.state.rate">{{ $store.state.rate.currency }}{{ singleItem.isPriceReduction == 1 ? singleItem.productPrice : singleItem.addCartPrice }}</span>
                      <span class="grey fs-12 ml-4 line-through" v-if="singleItem.isPriceReduction == 1">{{ $store.state.rate.currency }}{{ singleItem.addCartPrice }}</span>
                    </nuxt-link>
                  </template>
                </van-card>
              </div>
              
              <template #right>
                <div class="v-100 flex">
                  <!-- 设置经常购买 -->
                  <van-button v-if="singleItem.status == 1" @click="onOftenBy(singleItem)" square :text="singleItem.isOftenBuy ? $t('cancel_often_buy'): $t('often_buy2')" class="v-100 w-70 bg-f0 black plr-12 fs-14 border-no pre-wrap" />
                  <!-- 移入收藏夹 -->
                  <van-button v-if="singleItem.status == 1" @click="moveToFavorite(singleItem.productSku)" square :text="$t('goods_add_follow')" class="v-100 w-70 bg-yellow white plr-12 fs-14 border-no" />
                  <!-- 删除订单 -->
                  <van-button square :text="$t('delete')" @click="onDelete(singleItem.productSku)" class="v-100 w-70 bg-red white plr-12 fs-14 border-no" />
                </div>
              </template>
            </van-swipe-cell>
          </van-checkbox-group>
        </div>
      </template>

      <!-- 可能喜欢的推荐列表展示 -->
      <div v-if="recommendList.length > 0" class="plr-12">
        <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
          <BmIcon :name="'xinaixin'" :width="'0.26rem'" :height="'0.22rem'" :color="'#FA2022'" class="mr-8" />
          {{ $t('you_may_also_like') }}
        </van-divider>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
        >
          <div 
            class="mx-auto my-2"
            v-masonry
            item-selector=".custom-grid-item"
            fit-width="true"
            transition-duration="0s"
            stagger="0.03s"
            gutter="10"
          >
            <nuxt-link :to="{ name: 'cart-product-id', params: { id: searchItem.productId } }" v-for="(searchItem, searchIndex) in recommendList" :key="'search-list-' + searchIndex" class="mb-12 custom-grid-item" v-masonry-tile>
              <ProductTopBtmSingle
                :img="{ url: searchItem.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                :detail="{ desc: searchItem.productTitle, price: searchItem.productPrice, rate: parseFloat(searchItem.starLevel), volumn: searchItem.saleCount, ellipsis: 2, country: searchItem.supplyCountryName, country_url: searchItem.supplyCountryIcon }"
              />
            </nuxt-link>
            
          </div>
        </van-list>
      </div>
    </PullRefresh>

    <!-- 购物车编辑 -->
    <div :class="{'bg-white pl-16 pr-12 flex vcenter between custom-submit-bar': true, 'isBar': $route.query.isBar}" v-if="$store.state.user.authToken">
      <van-checkbox v-model="checked" @click="checkAll">
        {{ $t('select_all') }}
        <template #icon="props">
          <div>
            <BmImage
              :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
              :width="'0.32rem'" 
              :height="'0.32rem'"
              :isLazy="false"
              :isShow="false"
              :alt="'choose icon'"
            />
          </div>
        </template>
      </van-checkbox>
      <!-- 结算 -->
      <div v-show="!isEdit" class="flex vcenter">
        <div>
          <span class="black fs-14 mr-4">{{ $t('total2') }}</span>
          <span class="red fs-14 fw">{{ $store.state.rate.currency }}{{ totalAmount }}</span>
        </div>
        <BmButton class="round-8 h-40 ml-12" @click="onCheckOut">{{ $t('check_out') }}</BmButton>
      </div>
      <!-- 编辑 -->
      <div v-show="isEdit">
        <BmButton :type="'info'" class="round-8 h-32 orange bg-white orange-border" @click="onMove">{{ $t('goods_add_follow') }}</BmButton>
        <BmButton :type="'info'" class="round-8 h-32 orange bg-white orange-border ml-12" @click="onEmitDelete">{{ $t('delete') }}</BmButton>
      </div>
    </div>

    <!-- 产品规格 -->
    <ProductSku :productShow="productShow" :goodSpuVo="goodSpuVo" :initialSku="initialSku" :sku="sku" :type="'cart'" @onRefresh="$fetch()" />

    <!-- 底部 -->
    <BmTabbar v-if="!$route.query.isBar" />
  </div>
</template>

<script>
import EmptyStatus from '@/components/EmptyStatus';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import SoldOut from '@/components/SoldOut';
import { Divider, Tab, Tabs, SwipeCell, Card, Stepper, Checkbox, CheckboxGroup, Sticky, SubmitBar, List } from 'vant';
import { removeCart, setOftenBuy, getCartCount, moveToFavorite, getCalculatePrice, updateCartNum } from '@/api/cart';
import { getGoodAttr } from '@/api/product';
import PullRefresh from '@/components/PullRefresh';
import ProductSku from '@/components/ProductSku';

export default {
  middleware: 'authenticated',
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
    vanList: List,
    SoldOut,
    EmptyStatus,
    OrderStoreSingle,
    ProductTopBtmSingle,
    PullRefresh,
    ProductSku
  },
  data() {
    return {
      list: [], // 店铺列表
      tabActive: 0,
      checked: false,
      isEdit: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      queryType: 1, // 查询类型（ 1 查询全部 2降价查询 3经常购买 4 关注商品列表）
      totalAmount: 0, // 总金额
      discountAmount: 0, // 优惠金额
      oftenBuyTotal: 0, // 经常购买总条数
      priceCutTotal: 0, // 降价总条数
      allTotal: 0, // 全部总条数
      // listTotal: 0, // 商品总数
      productResult: [], // 选中的商品id
      refreshing: {
        isFresh: false
      },
      result: [], // 已提交的已选择的商品skuid
      productShow: {
        show: false
      },
      goodSpuVo: {},
      initialSku: {},
      sku: {},
      selectSku: {},
      recommendList: [],
      loading: false,
      finished: false
    }
  },
  async fetch() {
    // 未登录情况下不获取数据
    if (!this.$store.state.user.authToken) return false;
    this.listTotal = 0;
    this.result = [];
    this.productResult = [];
    const listData = await this.$api.getCartList({ queryType: this.queryType });
    this.list = listData.data.storeList.map(storeItem => { // 购物车列表

      this.result = this.result.concat(storeItem.products.filter(selectItem => { // 是否选中
        return selectItem.isSelect == 1 && selectItem.status == 1;
      }).map(resultItem => {
        return resultItem.productSku;
      }));

      this.productResult = this.productResult.concat(storeItem.products.filter(selectItem => { // 已选择商品
        return selectItem.isSelect == 1 && selectItem.status == 1;
      }).map(resultItem => {
        return {
          skuId: resultItem.productSku,
          quantity: resultItem.quantity
        };
      }));

      let result = storeItem.products.filter(selectItem => { // 是否选中
        return selectItem.isSelect == 1;
      }).map(resultItem => {
        return resultItem.id;
      })
      return {
        ...storeItem,
        result: result,
        isAll: result.length == storeItem.products.length ? true : false, // 是否全选
        isEmpty: storeItem.products.filter(selectItem => { // 是否选中
          return selectItem.status != 1;
        })
      }
    });

    this.checked = this.list.filter(item => {
      return item.isAll == false;
    }).length == 0 ? true : false;

    this.totalAmount = listData.data.totalAmount;
    // this.onCountPrice();
    this.refreshing.isFresh = false;

    // 获取商品推荐列表
    const recommendData = await this.$api.getRecommend({type: 0, pageNum: this.pageNum, pageSize: this.pageSize});
    if (recommendData.code != 0) return false;
    this.recommendList = recommendData.data.items;
    this.total = recommendData.data.total;
    if (typeof this.$redrawVueMasonry === 'function') {
      this.$redrawVueMasonry();
    }
    this.finished = false;
    if (process.client) {
      window.scrollTo({
        top: 0
      });
    }
  },
  activated() {
    if (this.$store.state.user.authToken) { // 登录的情况下才请求数据
      this.getCartCount(); // 总数查询
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
      if (store.isEmpty.length == store.products.length) { // 该店铺下商品全部为空时，不可点
        return false;
      }
      let isCheck = isAll ? !isAll : store.isAll;

      store.result = isCheck ? [] : store.products.map(item => {
        return item.id;
      })
      
      store.isAll = !isCheck;
      this.watchCheckAll();
    },
    storeChangeCheck(event, store) { // 店铺内订单勾选的监听事件
      store.isAll = event.length === store.products.length ? true : false;
      this.watchCheckAll();
    },
    checkAll(event, isHandle) { // 所有店铺内的订单全部选中
      if (isHandle !== undefined) {
        this.checked = isHandle;
        return false;
      }
      this.list.forEach(item =>{
        this.storeCheckAll(item, this.checked);
      })
    },
    onCheckOut() { // 结算
      if (this.productResult.length == 0) {
        this.$toast({
          message: this.$t('no_item_selected')
        })
        return false;
      }
      this.$router.push({
        name: 'cart-order-id',
        params: {
          id: JSON.stringify({skuItems: this.productResult})
        },
        query: {
          isCart: 1
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
      this.onCountPrice(); // 所选商品的价格计算
      this.checkAll(check.length === 0, check.length === 0); // 判断是否全部选中
    },
    onEmitDelete() { // 确认删除订单
      if (this.productResult.length === 0) {
        return false;
      }
      this.$dialog.confirm({
        message: this.$t('delete_cart_tips', { replace_tip: this.productResult.length }),
        onfirmButtonText: this.$t('confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        let skuIds = this.productResult.map(item => {
          return item.skuId;
        })
        this.onDelete(skuIds.join('_'));
        this.isEdit = false;
      }).catch(() => {

      })
    },
    onLogin() { // 去登录
      this.$router.push({
        name: 'login'
      })
    },
    goStoreDetail(storeInfo) { // 跳转到店铺详情
      if (!storeInfo.sellerId || !storeInfo.storeId) {
        return false;
      }
      this.$router.push({
        name: 'cart-store-id',
        params: {
          id: storeInfo.storeId
        },
        query: {
          sellerId: storeInfo.sellerId
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
      setOftenBuy({ isOftenBuy: product.isOftenBuy == 1 ? 0 : 1, skuId: product.productSku }).then(res => {
        if (res.code != 0) return false;

        this.$toast(this.$t('set_often_buy_success'));
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
        if (res.code != 0) return false;

        this.$toast(this.$t('t_operation_successful'))
        this.$fetch();
        this.getCartCount();
      })
    },
    getCalculatePrice(selectedData) { // 计算商品价格
      getCalculatePrice(selectedData).then(res => {
        this.totalAmount = res.data.totalAmount;
        this.result = selectedData.selectedData.map(item => {
          return item.skuId;
        });
      });
    },
    async onRefresh() { // 下拉刷新
      this.pageNum = 1;
      this.getCartCount(); // 总数查询
      this.$fetch();
    },
    onCountPrice() { // 计算购物车总价格
      let productResult = []; // 选中的数据集合
      let cancelResult = []; // 取消选中的数据集合
      this.list.forEach(item => {
        item.result.forEach(resultItem => {
          let _filterResult = item.products.filter(productItem => {
            return productItem.id === resultItem && productItem.status == 1;
          });
          if (_filterResult.length > 0) {
            productResult.push({
              skuId: _filterResult[0].productSku,
              quantity: _filterResult[0].quantity
            })
          }
        });
      })
      this.productResult = productResult; // 选中的商品
      // 判断是否有取消计算的商品
      this.result.forEach(item => {
        if (productResult.find(productItem => productItem.skuId == item) == undefined) {
          cancelResult.push(item);
        }
      })

      if (this.productResult.length > 0 || cancelResult.length > 0) {
        this.getCalculatePrice({cancelData: cancelResult, selectedData: this.productResult});
      }
    },
    onChangeNum(item) { // 修改商品数量
      if (item.quantity == '' || parseFloat(item.quantity) < 1) {
        return false;
      }
      updateCartNum({ quantity: item.quantity, skuId: item.productSku }).then(res => {
        if (res.code != 0) return false;
        
        this.onCountPrice(); // 修改数量之后如果选中的话要重新计算价格
      })
    },
    onMove() { // 移入收藏夹
      if (this.productResult.length == 0) {
        return false;
      }
      let skuIds = this.productResult.map(item => {
        return item.skuId;
      })
      this.moveToFavorite(skuIds.join('_'));
    },
    onSku(productItem) { // 获取商品规格
      getGoodAttr(productItem.productId).then(res => {
        if (res.code != 0) return false;

        // 商品规格初始化
        this.goodSpuVo = { // 商品基本信息
          ...res.data.goodSpuVo,
          picture: res.data.goodSpuVo.mainPictureUrl
        };
        this.sku = {
          tree: [],
          list: [],
          price: res.data.goodSpuVo.minPrice,
          hide_stock: true, //是否隐藏商品剩余库存
        };
        let _skuList = [];
        res.data.saleAttr.forEach((item, itemInxdex) => { // 规格种类
          this.sku.tree.push({
            k: item.attrName, // 规格类目名称
            k_id: item.attrId,
            k_s: 's' + item.attrId, // sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            v: [],
            largeImageMode: false
          })
          item.attrValues.forEach(attrItem => { // 种类属性
            this.sku.tree[itemInxdex].v.push({
              id: attrItem.attrValueId,
              name: attrItem.attrValue
            })

            attrItem.skuList.forEach(skuItem => { // 商品组合列表
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
      
        this.sku.list = arr;
        // 初始化已获取的商品规格
        let initSku = arr.filter(item => {
          return item.id == productItem.productSku
        })
        this.initialSku = this.selectSku = {
          ...initSku[0],
          selectedNum: productItem.quantity,
          selectedSkuComb: {
            stock_num: productItem.stock
          }
        }
        setTimeout(() => {
          this.productShow.show = true;
        }, 300);
      })
    },
    goSimilar(productId) { // 跳转到相似列表
      this.$router.push({
        name: 'search-similar-id',
        params: {
          id: productId
        }
      })
    },
    onLoad() { // 加载更多推荐商品
      if (this.total == this.recommendList.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageNum += 1;
      this.$api.getRecommend({ type: 0, pageNum: this.pageNum, pageSize: this.pageSize}).then(res => { // 搜索商品列表
        
        this.recommendList = this.recommendList.concat(res.data.items);
        setTimeout(() => {
          if (typeof this.$redrawVueMasonry === 'function') {
            this.$redrawVueMasonry();
          }
        }, 50)
        this.total = res.data.total;
        
        // 加载状态结束
        this.loading = false;
      });
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
  max-width: 217px;
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
  bottom: 49px;
  left: 0;
  right: 0;
  height: 56px;
  position: fixed;
  &.isBar {
    bottom: 0;
  }
}
</style>

<style lang="less">
.custom-checkbox{
  .van-checkbox__label{
    margin-left: 0!important;
  }
}
</style>