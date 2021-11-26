<template>
  <!-- 我的-关注 -->
  <div class="bg-grey v-percent-100 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :fixed="true">
      <!-- tab切换 -->
      <van-tabs v-model="active" slot="header-title" class="customs-van-tabs likes-tabs" @click="getTabList">
        <van-tab :title="$t('product')" />
        <van-tab :title="$t('store')" />
      </van-tabs>
      <!-- 操作 -->
      <div slot="header-right" class="fs-16 color_666" v-show="!edit" @click="onEdit">{{ $t('edit') }}</div>
      <!-- 编辑 -->
      <div slot="header-right" class="fs-16 color_666" v-show="edit" @click="onEdit">
        <i class="iconfont icon-shanchu fs-18 mr-12"></i>
        {{ $t('done') }}
      </div>
    </BmHeaderNav>

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-46 pb-56">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 商品/店铺展示 -->
        <div :class="{'bg-white': true}">
          <!-- 无数据时展示 -->
          <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/result.png')" :btn="{ btn: $t('shop_now'), isEmit: true }" @emptyClick="emptyClick" />
          <!-- 已关注的店铺列表展示 -->
          <van-checkbox-group v-model="checkResult" ref="checkboxStoreGroup" v-else>
            <van-cell-group>
              <van-cell :border="active == 0 ? false : true" :class="{'ptb-0 plr-0': true, 'bg-f4': isTrue(item.id, checkResult) }" v-for="(item, index) in list" :key="index">
                <!-- 选择 -->
                <template #icon>
                  <van-checkbox v-show="edit" class="pl-16" :name="active == 1 ? item.storeId : item.productId" ref="checkboxes">
                    <template #icon="props">
                      <BmImage
                        :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                        :width="'0.32rem'" 
                        :height="'0.32rem'"
                        :isLazy="false"
                        :isShow="false"
                        :alt="'TospinoMall'"
                      />
                    </template>
                  </van-checkbox>
                </template>
                <template #default>
                  <!-- 左滑单元格 -->
                  <van-swipe-cell :disabled="edit">
                    <!-- 店铺的样式 -->
                    <nuxt-link class="flex pl-30 ptb-20" v-if="active == 1" tag="div" :to="{ name: 'cart-store-id', params: { id: item.storeId }, query: { sellerId: item.sellerId, tabbarActive: 0 } }">
                      <BmImage 
                        :url="item.storeLogoUrl"
                        :width="'1.12rem'" 
                        :height="'1.12rem'"
                        :isLazy="false"
                        :isShow="true"
                        :round="true"
                        :alt="item.storeName"
                        :errorUrl="require('@/assets/images/store-bgd.png')"
                      />
                      <div class="ml-12 fs-14 fm-helvetica">
                        <p class="black hidden-2">{{ item.storeName }}</p>
                        <p class="color_666 mt-8">{{ item.collectNum }}{{ $t('shop_follower', { replace_tip: item.followers }) }}</p>
                      </div>
                    </nuxt-link>

                    <!-- 商品的样式 -->
                    <div class="pt-26 pr-20" v-if="active == 0">
                      <nuxt-link :to="'/product/' + item.productId + '.html'">
                        <OrderSingle class="pl-30 pt-20" :isShowRight="false" :product_desc="item.productName" :image="item.productImg" :price="item.productPrice" :stock="item.isValid == 1 ? 100 : 0" />
                      </nuxt-link>
                      
                      <div class="flex hend">
                        <!-- 看相似 -->
                        <nuxt-link :to="{ name: 'search-similar-id', params: { id: item.productId } }" class="fs-0">
                          <BmButton type="default" plain class="plr-12 round-8 h-25 mt-0">{{ $t('look_similar') }}</BmButton>
                        </nuxt-link>
                        
                        <!-- 购物车 -->
                        <BmImage
                          :url="require('@/assets/images/icon/add-cart-btn.png')"
                          :width="'0.9rem'" 
                          :height="'0.5rem'"
                          :isLazy="false"
                          :isShow="false"
                          class="ml-12"
                          v-if="item.isValid == 1"
                          @onClick="onSKu(item)"
                          :alt="'TospinoMall'"
                        />
                      </div>
                      <div class="driver-line fr"></div>
                    </div>

                    <template #right>
                      <div class="flex hend h-100">
                        <BmButton class="round-0 bg-yellow h-100 w-70" @click="onUnsubscribe(item)">{{ $t('goods_remove_follow') }}</BmButton>
                        <BmButton class="round-0 bg-green h-100 w-70" @click="onTop(item)">{{ item.isTop == 1 ? $t('cancel_top') : $t('top') }}</BmButton>
                      </div>
                    </template>
                  </van-swipe-cell>
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>

          <!-- 全选与否 -->
          <div class="w-100 bg-white flex between pl-12 vcenter checkout-all-content" v-show="edit">
            <van-checkbox class="flex vcenter v-100" @click="checkAll">
              <template #icon>
                <BmImage
                  :url="isAll ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                  :width="'0.32rem'" 
                  :height="'0.32rem'"
                  :isLazy="false"
                  :isShow="false"
                  :alt="'TospinoMall'"
                />
              </template>
              <span class="ml-14 fs-14 lh-20 black">{{ $t('all') }}</span>
            </van-checkbox>
            <BmButton class="fs-16 round-0 v-100" @click="onUnsubscribe('all')">{{ $t('unsubscribe') }}</BmButton>
          </div>
        </div>

        <!-- 可能喜欢的推荐列表展示 -->
        <template v-if="recommendList.length > 0 && active == 0 && !edit">
          <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
            <BmIcon :name="'xinaixin'" :width="'0.26rem'" :height="'0.22rem'" :color="'#FA2022'" class="mr-8" />
            {{ $t('you_may_also_like') }}
          </van-divider>
          <div
            class="mx-auto my-2 plr-12"
            v-masonry
            item-selector=".custom-grid-item"
            fit-width="true"
            transition-duration="0s"
            stagger="0.03s"
            gutter="10"
          >
            <nuxt-link
              :to="'/product/' + searchItem.productId + '.html'" 
              v-for="(searchItem, searchIndex) in recommendList"
              :key="'search-list-' + searchIndex"
              class="custom-grid-item"
              v-masonry-tile
            >
              <ProductTopBtmSingle
                :img="{ url: searchItem.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                :detail="{ desc: searchItem.productTitle, price: searchItem.minPrice, rate: parseFloat(searchItem.starLevel), volumn: searchItem.saleCount, ellipsis: 2, country: searchItem.supplyCountryName, country_url: searchItem.supplyCountryIcon, stock: searchItem.stock }"
                class="mb-12"
              />
            </nuxt-link>
            
          </div>
        </template>
      </van-list>
    </PullRefresh>

    <ProductSku :productShow="productShow" :goodSpuVo="goodSpuVo" :initialSku="initialSku" :sku="sku" />
  </div>
</template>

<script>
import { Tab, Tabs, SwipeCell, Cell, Checkbox, CheckboxGroup, CellGroup, Divider, List } from 'vant';
import EmptyStatus from '@/components/EmptyStatus';
import OrderSingle from '@/components/OrderSingle';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { storeCancelFollow, attentionStoreTop } from '@/api/store';
import { cancelAttentionGood, attentionGoodTop, getGoodAttr } from '@/api/product';
import PullRefresh from '@/components/PullRefresh';
import ProductSku from '@/components/ProductSku';
import errorImage from '@/assets/images/product-bgd-90.png';

export default {
  middleware: 'authenticated',
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSwipeCell: SwipeCell,
    vanCell: Cell,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    vanCellGroup: CellGroup,
    vanDivider: Divider,
    vanList: List,
    EmptyStatus,
    OrderSingle,
    ProductTopBtmSingle,
    PullRefresh,
    ProductSku
  },
  data() {
    return {
      active: 0,
      list: [],
      edit: false,
      checkResult: [],
      isAll: false,
      pageNum: 0,
      pageSize: 20,
      total: 0,
      refreshing: {
        isFresh: false
      },
      loading: false,
      finished: false,
      isFirst: true,
      goodSpuVo: {},
      initialSku: {},
      sku: {},
      productShow: {
        show: false
      },
      recommendList: [],
      recommendTotal: -1,
      isLoadRecommend: false,
      recommendPageNum: -1
    }
  },
  async fetch() {
    try {
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      this.active = 0;
      this.pageNum = 1;
      this.recommendPageNum = -1;
      if (parseFloat(this.$route.query.active) == 1 && this.isFirst == true) this.active = parseFloat(this.$route.query.active);

      this.edit = false;
      this.checkResult = [];
      // 获取商品列表
      const listData = this.active == 0 ? await this.$api.getLikeProduct({ pageNum: this.pageNum, pageSize: this.pageSize }) : await this.$api.getLikeStoreList({ pageNum: this.pageNum, pageSize: this.pageSize }); // 获取关注商品/店铺列表
      this.refreshing.isFresh = false;
      if (listData.data) {
        this.list = listData.data.records; // 关注商品/店铺列表
        this.total = listData.data.total; // 商品/店铺总数
      };
      this.finished = parseFloat(this.total) == this.list.length ? true: false;

      if (parseFloat(this.total) == this.list.length && this.active == 0) { // 第一页关注商品数据就不满一页时，调商品推荐接口
        this.recommendPageNum = 1;
        const recommendData = await this.$api.getRecommend({ type: 1, pageNum: this.recommendPageNum, pageSize: this.pageSize});
        if (recommendData.data) {
          this.recommendList = recommendData.data.items;
          setTimeout(() => {
            if (typeof this.$redrawVueMasonry === 'function') {
              this.$redrawVueMasonry();
            }
          }, 50)
          this.recommendTotal = recommendData.data.total;
          this.finished = this.recommendTotal == this.recommendList.length ? true : false;
          // // 加载状态结束
          this.loading = false;
          this.isLoadRecommend = false;
        }
      }
      this.$toast.clear();
      this.isFirst = false;
      // 加载状态结束
      this.loading = false;
    } catch (error) {
      console.log(error);
    }
  },
  activated() {
    this.isFirst = true;
    this.recommendList = [];
    this.recommendTotal = -1;
    this.list = [];
    this.total = 0;
    this.$fetch();
    setTimeout(() => {
      if (typeof this.$redrawVueMasonry === 'function') {
        this.$redrawVueMasonry();
      }
    }, 50)
  },
  methods: {
    isTrue(val, list) { // 判断是否选中
      if (this.checkResult.length === this.list.length && this.checkResult.length > 0) {
        this.isAll = true;
      } else {
        this.isAll = false;
      }
      return list.length > 0 && list.indexOf(val) > -1;
    },
    onUnsubscribe(item) { // 取消订阅
      if (item == 'all' && this.checkResult.length == 0) {
        return false;
      }
      this.$dialog.confirm({
        message: this.$t('are_you_unsubscribe'),
        onfirmButtonText: this.$t('confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        let _ajax = this.active == 1 ? storeCancelFollow(item == 'all' ? this.checkResult : [item.storeId] ) : cancelAttentionGood(item == 'all' ? this.checkResult : [item.productId]);
      
        _ajax.then(() => {
          this.getList();
        }).catch(error => {
          console.log(error);
        })
      }).catch(() => {

      })
    },
    checkAll() {
      this.isAll = !this.isAll;
      this.$refs.checkboxStoreGroup.toggleAll(this.isAll);
    },
    emptyClick() { // 关注列表没数据时，点击按钮跳转到首页
      this.$router.push({
        path: '/home.html'
      })
    },
    getTabList() { // 切换tab时数据要初始化
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      this.pageNum = 1;
      this.recommendPageNum = -1;
      this.finished = false;
      this.list = [];
      this.recommendList = [];
      this.recommendTotal = 0;
      // 加载中，表示正在发送异步请求，防止触发load事件
      this.loading = true;
      this.getList();
    },
    onTop(item) { // 置顶 取消置顶
      let _ajax = this.active == 1 ? attentionStoreTop({id: item.storeId , status: item.isTop == 1 ? 0 : 1}) : attentionGoodTop({id: item.productId, status: item.isTop == 1 ? 0 : 1});
      _ajax.then(res => {
        if (res.code != 0) return false;
        this.pageNum = 1;
        this.getList();
      }).catch(error => {
        console.log(error);
      })
    },
    onEdit() { // 右上角编辑
      this.edit = this.list.length > 0 ? !this.edit : false;
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      this.getList();
    },
    async onLoad() { // 收藏商品加载下一页，加载最后一页时开始加载推荐商品列表，店铺没有推荐
      if (parseFloat(this.total) == this.list.length) { // 没有下一页了
        if (this.active == 0 && !this.edit) {
          this.onRecommendLoad();
        } else {
          this.finished = true;
          this.loading = false;
        }
        return false;
      }

      this.pageNum += 1;
      const listData = this.active == 0 ? await this.$api.getLikeProduct({ pageNum: this.pageNum, pageSize: this.pageSize }) : await this.$api.getLikeStoreList({ pageNum: this.pageNum, pageSize: this.pageSize }); // 获取关注商品/店铺列表
      if (!listData.data) return false;

      this.total = listData.data.total;
      this.list = this.list.concat(listData.data.records);
      // this.finished = parseFloat(this.total) == this.list.length ? true: false;
      // 加载状态结束
      this.loading = false;
    },
    onRecommendLoad() { // 加载推荐商品列表
      if (this.recommendTotal == this.recommendList.length && this.recommendPageNum != -1) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      if (this.isLoadRecommend == true) { // 加载完一页再加载下一页
        return false;
      }
      this.isLoadRecommend = true;

      this.recommendPageNum += 1;
      this.$api.getRecommend({ type: 1, pageNum: this.recommendPageNum, pageSize: this.pageSize}).then(recommendData => {
        if (recommendData.code != 0) return false;
        this.recommendList = this.recommendPageNum == 0 ? recommendData.data.items : this.recommendList.concat(recommendData.data.items);
        setTimeout(() => {
          if (typeof this.$redrawVueMasonry === 'function') {
            this.$redrawVueMasonry();
          }
        }, 50)
        this.recommendTotal = recommendData.data.total;
        this.finished = this.recommendTotal == this.recommendList.length ? true : false;
        // // 加载状态结束
        this.loading = false;
        this.isLoadRecommend = false;
      })
    },
    onSKu(productItem) { // 获取产品规格
      getGoodAttr(productItem.productId).then(res => {
        if (res.code != 0) return false;

        // 商品规格初始化
        this.goodSpuVo = { // 商品基本信息
          ...res.data.goodSpuVo,
          picture: res.data.goodSpuVo.mainPictureUrl || errorImage
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
                picture: skuItem.skuPicture || errorImage,
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
        setTimeout(() => {
          this.productShow.show = true;
        }, 100);
      }).catch(error => {
        console.log(error);
      })
    },
    async getList() {
      this.edit = false;
      this.checkResult = [];
      // 获取商品列表
      const listData = this.active == 0 ? await this.$api.getLikeProduct({ pageNum: this.pageNum, pageSize: this.pageSize }) : await this.$api.getLikeStoreList({ pageNum: this.pageNum, pageSize: this.pageSize }); // 获取关注商品/店铺列表
      
      if (listData.data) {
        this.list = this.pageNum == 1 ? listData.data.records : this.list.concat(listData.data.records); // 关注商品/店铺列表
        this.total = listData.data.total; // 商品/店铺总数
        this.finished = parseFloat(this.total) == this.list.length ? true: false;
      }
      
      // 如果关注商品的列表获取完之后要开始获得推荐商品的列表
      if (this.active == 0 && this.total == this.list.length) {
        this.recommendPageNum = 1;
        const recommendData = await this.$api.getRecommend({ type: 1, pageNum: this.recommendPageNum, pageSize: this.pageSize});
        if (recommendData.data) {
          this.recommendList = recommendData.data.items;
          setTimeout(() => {
            if (typeof this.$redrawVueMasonry === 'function') {
              this.$redrawVueMasonry();
            }
          }, 50)
          this.recommendTotal = recommendData.data.total;
          this.finished = this.recommendTotal == this.recommendList.length ? true : false;
          this.isLoadRecommend = false;
        }
      }
      this.$toast.clear();
      this.refreshing.isFresh = false;
      this.isFirst = false;
      this.loading = false;
    }
  },
}
</script>

<style lang="less" scoped>
.color_666{
  color: #666;
}
.pl-16{
  padding-left: 16px;
}
.bg-yellow{
  background: #FFCE05!important;
}
.w-70{
  width: 70px;
}
.bg-f4{
  background-color: #F4F4F4!important;
}
.v-100{
  height: 100%!important;
}
.checkout-all-content{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 56px;
  z-index: 100;
}
.h-25{
  height: 25px!important;
}
.pt-26{
  padding-bottom: 26px;
}
.driver-line{
  width: 209px;
  height: 1px;
  background-color: #eee;
  margin-top: 25px;
}
.pb-56{
  padding-bottom: 56px;
}
</style>

<style lang="less">
.likes-tabs{
  width: 180px;
  .van-tabs__wrap{
    height: 46px!important;
    line-height: 46px!important;
  }
}
</style>