<template>
  <!-- 我的-关注 -->
  <div class="bg-grey vh-100 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :fixed="true">
      <!-- tab切换 -->
      <van-tabs v-model="tabActive" slot="header-title" class="customs-van-tabs likes-tabs" @click="getList">
        <van-tab :title="$t('common.product')"></van-tab>
        <van-tab :title="$t('common.store')"></van-tab>
      </van-tabs>
      <!-- 操作 -->
      <div slot="header-right" class="fs-16 color_666" v-show="!edit" @click="onEdit">{{ $t('common.edit') }}</div>
      <!-- 编辑 -->
      <div slot="header-right" class="fs-16 color_666" v-show="edit" @click="onEdit">
        <i class="iconfont icon-shanchu fs-18 mr-12"></i>
        {{ $t('common.done') }}
      </div>
    </BmHeaderNav>

    <van-pull-refresh v-model="isLoading" :head-height="80" @refresh="onRefresh" class="vh-100">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 商品/店铺展示 -->
        <div class="bg-white">
          <!-- 无数据时展示 -->
          <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/result.png')" :description="tabActive == 0 ? $t('me.likes.notProduct') : $t('me.likes.noStore')" :btn="{ btn: $t('me.likes.shopNow'), isEmit: true }" @emptyClick="emptyClick" />
          <!-- 已关注的店铺列表展示 -->
          <van-checkbox-group v-model="checkResult" ref="checkboxStoreGroup">
            <van-cell-group>
              <van-cell :border="tabActive === 0 ? false : true" :class="{'ptb-0 plr-0': true, 'bg-f4': isTrue(item.id, checkResult) }" v-for="(item, index) in list" :key="index">
                <!-- 选择 -->
                <template #icon>
                  <van-checkbox v-show="edit" class="pl-16" :name="tabActive ==1 ? item.storeId : item.productId" ref="checkboxes">
                    <template #icon="props">
                      <BmImage
                        :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                        :width="'0.32rem'" 
                        :height="'0.32rem'"
                        :isLazy="false"
                        :isShow="false"
                      />
                    </template>
                  </van-checkbox>
                </template>
                <template #default>
                  <!-- 左滑单元格 -->
                  <van-swipe-cell :disabled="edit">
                    <!-- 店铺的样式 -->
                    <div class="flex pl-30 ptb-20" v-if="tabActive === 1" @click="goStore(item)">
                      <BmImage 
                        :url="item.storeLogoUrl"
                        :width="'1.12rem'" 
                        :height="'1.12rem'"
                        :isLazy="false"
                        :isShow="false"
                        :round="true"
                        :errorUrl="require('@/assets/images/product-bgd-90.png')"
                      />
                      <div class="ml-12 fs-14 fm-helvetica">
                        <p class="black hidden-2">{{ item.storeName }}</p>
                        <p class="color_666 mt-8">{{ item.followers }} followers</p>
                      </div>
                    </div>

                    <!-- 商品的样式 -->
                    <div class="pt-26 pr-20" v-if="tabActive === 0">
                      <OrderSingle class="pl-30 pt-20" :isShowRight="false" :product_desc="item.productName" :image="item.productImg" :price="item.productPrice" @onClick="goProduct(item)" />
                      <div class="flex hend">
                        <!-- 看相似 -->
                        <BmButton type="default" plain class="plr-12 round-8 h-25 mt-0">{{ $t('me.likes.lookSimilar') }}</BmButton>
                        <!-- 购物车 -->
                        <BmImage
                          :url="require('@/assets/images/icon/add-cart-btn.png')"
                          :width="'0.92rem'" 
                          :height="'0.52rem'"
                          :isLazy="false"
                          :isShow="false"
                          class="ml-12"
                        />
                      </div>
                      <div class="driver-line fr"></div>
                    </div>

                    <template #right>
                      <div class="flex hend h-100">
                        <BmButton class="round-0 bg-yellow h-100 w-70" @click="onUnsubscribe(item)">Unsub-scribe</BmButton>
                        <BmButton class="round-0 bg-green h-100 w-70" @click="onTop(item)">Store Top</BmButton>
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
                ></BmImage>
              </template>
              <span class="ml-14 fs-14 lh-20 black">{{ $t('common.all') }}</span>
            </van-checkbox>
            <BmButton class="fs-16 round-0 v-100" @click="onUnsubscribe">Unsubscribe</BmButton>
          </div>
        </div>

        <!-- 可能喜欢的推荐列表展示 -->
        <template v-if="likeList.length">
          <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
            <i class="iconfont icon-xinaixin linear-color mr-8"></i>
            {{ $t('common.mayLike') }}
          </van-divider>
          <div class="mlr-12 flex between flex-wrap">
            <ProductTopBtmSingle
              :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
              :detail="{ desc: 'categoryItem.name', price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2, country: 'Ghana' }"
              v-for="(searchItem, searchIndex) in likeList" 
              :key="'search-list-' + searchIndex"
            ></ProductTopBtmSingle>
          </div>
        </template>
      </van-list>
    </van-pull-refresh>
    
  </div>
</template>

<script>
import { Tab, Tabs, SwipeCell, Cell, Checkbox, CheckboxGroup, CellGroup, Divider, PullRefresh, List } from 'vant';
import EmptyStatus from '@/components/EmptyStatus';
import OrderSingle from '@/components/OrderSingle';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { storeCancelFollow } from '@/api/store';
import { cancelAttentionGood } from '@/api/product';

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
    vanPullRefresh: PullRefresh,
    vanList: List,
    EmptyStatus,
    OrderSingle,
    ProductTopBtmSingle
  },
  data() {
    return {
      tabActive: 0,
      list: [],
      edit: false,
      checkResult: [],
      isAll: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      likeList: [],
      isLoading: false,
      loading: false,
      finished: false
    }
  },
  async fetch() {
    if (this.$route.query.active) this.tabActive = this.$route.query.active;
    this.edit = false;
    this.checkResult = [];

    // 获取商品列表
    const listData = this.tabActive == 0 ? await this.$api.getLikeProduct({ pageNum: this.pageNum, pageSize: this.pageSize }) : await this.$api.getLikeStoreList({ pageNum: this.pageNum, pageSize: this.pageSize }); // 获取关注商品/店铺列表
    this.isLoading = false;
    if (listData.code != 0) return false;
    
    this.list = listData.data.records; // 关注商品/店铺列表
    this.total = listData.data.total; // 商品/店铺总数
  },
  activated() {
    this.$fetch();
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
      this.$dialog.confirm({
        message: '确定取消订阅?',
        onfirmButtonText: this.$t('common.confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        let _ajax = this.tabActive == 1 ? storeCancelFollow(item ? [item.storeId] : this.checkResult) : cancelAttentionGood(item ? [item.productId] : this.checkResult);
      
        _ajax.then(res => {
          this.$fetch();
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
        name: 'home'
      })
    },
    getList() { // 切换tab时数据要初始化
      this.$fetch();
    },
    onTop(item) { // 置顶

    },
    onEdit() { // 右上角编辑
      this.edit = this.list.length > 0 ? !this.edit : false;
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      this.$fetch();
    },
    goStore(item) {
      this.$router.push({
        name: 'cart-store-id',
        params: {
          id: item.storeId
        },
        query: {
          sellerId: item.sellerId
        }
      })
    },
    goProduct(item) {
      this.$router.push({
        name: 'cart-product-id',
        params:{
          id: item.productId
        }
      })
    },
    async onLoad() {
      if (this.total == this.list.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageNum += 1;
      const listData = this.tabActive == 0 ? await this.$api.getLikeProduct({ pageNum: this.pageNum, pageSize: this.pageSize }) : await this.$api.getLikeStoreList({ pageNum: this.pageNum, pageSize: this.pageSize }); // 获取关注商品/店铺列表
      if (listData.code != 0) return false;

      this.total = res.data.total;
      let list = res.data.records;

      this.list = this.list.concat(list);
      // 加载状态结束
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
</style>

<style lang="less">
.likes-tabs{
  width: 180px;
}
</style>