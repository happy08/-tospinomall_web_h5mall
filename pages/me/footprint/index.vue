<template>
  <!-- 我的-浏览足迹 -->
  <div class="pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="'我的足迹'" :fixed="true">
      <!-- 操作 -->
      <div slot="header-right" class="fs-16 color_666" v-show="!edit" @click="edit = true">{{ $t('common.edit') }}</div>
      <!-- 编辑 -->
      <div slot="header-right" class="fs-16 color_666" v-show="edit" @click="edit = false">
        <i class="iconfont icon-shanchu fs-18 mr-12"></i>
        {{ $t('common.done') }}
      </div>
    </BmHeaderNav>

    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" :head-height="80" @refresh="onRefresh" class="vh-100">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 商品/店铺展示 -->
        <div class="bg-white">
          <!-- 无数据时展示 -->
          <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/result.png')" :description="$t('me.likes.notProduct')" :btn="{ btn: $t('me.likes.shopNow'), isEmit: true }" @emptyClick="emptyClick" />
          <!-- 已关注的店铺列表展示 -->
          <van-checkbox-group v-model="checkResult" ref="checkboxStoreGroup">
            <van-cell :border="false" :class="{'ptb-0 plr-0': true }" v-for="(item, index) in list" :key="index">
              <!-- 选择 -->
              <template #icon>
                <van-checkbox v-show="edit" class="pl-16" :name="item.id" ref="checkboxes">
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
                <!-- <van-swipe-cell :disabled="edit"> -->
                  <!-- 商品的样式 -->
                  <div class="pt-26 pr-20">
                    <OrderSingle class="pl-30 pt-20" :isShowRight="false" :product_desc="item.goodTitle" :image="item.img" :price="item.price" @onClick="goProduct(item)" />
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
                        @onClick="goProduct(item)"
                      />
                    </div>

                    <div class="driver-line fr"></div>
                  </div>

                  <!-- <template #right>
                    <div class="flex hend h-100">
                      <BmButton class="round-0 bg-yellow h-100 w-70">Unsub-scribe</BmButton>
                      <BmButton class="round-0 bg-green h-100 w-70">Store Top</BmButton>
                    </div>
                  </template>
                </van-swipe-cell> -->
              </template>
            </van-cell>
          </van-checkbox-group>

          <!-- 全选与否 -->
          <div class="w-100 bg-white flex between pl-16 vcenter checkout-all-content" v-show="edit">
            <van-checkbox class="flex vcenter v-100" @click="checkAll">
              <template #icon>
                <BmImage
                  :url="isAll ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                  :width="'0.32rem'" 
                  :height="'0.32rem'"
                  :isLazy="false"
                  :isShow="false"
                />
              </template>
              <span class="ml-14 fs-14 lh-20 black">{{ $t('common.all') }}</span>
            </van-checkbox>
            <BmButton class="fs-16 round-0 v-100" @click="onDelete">{{ $t('common.delete') }}</BmButton>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    
  </div>
</template>

<script>
import { Tab, Tabs, SwipeCell, Cell, Checkbox, CheckboxGroup, CellGroup, Divider, PullRefresh, List } from 'vant';
import EmptyStatus from '@/components/EmptyStatus';
import OrderSingle from '@/components/OrderSingle';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { deleteFootprintRecord } from '@/api/product';

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
      list: [],
      edit: false,
      checkResult: [],
      isAll: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  async fetch() {
    // 数据初始化
    this.edit = false;
    this.refreshing = false;
    
    // 获取列表数据
    const listData = await this.$api.getFootprintList({ pageSize: this.pageSize, pageNum: this.pageNum });
    if (listData.code != 0) return false;

    this.total = listData.data.total;
    this.list = listData.data.records;
    console.log(listData);
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
    onDelete() { // 删除
      this.$dialog.confirm({
        message: this.$t('me.order.clearBrowingRecords'),
        onfirmButtonText: this.$t('common.confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        deleteFootprintRecord(this.checkResult).then(() => {
          this.checkResult = [];
          this.$fetch();
        })
      }).catch(() => {

      })
    },
    checkAll() { // 是否全选
      this.isAll = !this.isAll;
      this.$refs.checkboxStoreGroup.toggleAll(this.isAll);
    },
    emptyClick() { // 没有数据时点击跳转到首页
      this.$router.push({
        name: 'home'
      })
    },
    goProduct(item) {
      this.$router.push({
        name: 'cart-product-id',
        params:{
          id: item.goodId
        }
      })
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      this.$fetch();
    },
    onLoad() {
      if (this.total == this.list.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageNum += 1;
      this.$api.getFootprintList({ pageSize: this.pageSize, pageNum: this.pageNum }).then(res => { // 搜索商品列表
        
        this.total = res.data.total;
        let list = res.data.records;

        this.list = this.list.concat(list);
        
        // 加载状态结束
        this.loading = false;
      });
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