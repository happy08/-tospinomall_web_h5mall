<template>
  <!-- 我的-浏览足迹 -->
  <div class="pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('recently_viewed')" :fixed="true">
      <!-- 操作 -->
      <div slot="header-right" class="fs-16 color_666" v-show="!edit" @click="edit = true">{{ $t('edit') }}</div>
      <!-- 编辑 -->
      <div slot="header-right" class="fs-16 color_666" v-show="edit" @click="edit = false">
        <i class="iconfont icon-shanchu fs-18 mr-12"></i>
        {{ $t('done') }}
      </div>
    </BmHeaderNav>

    <!-- 下拉刷新 -->
    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-46">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
      >
        <!-- 商品/店铺展示 -->
        <div class="bg-white">
          <!-- 无数据时展示 -->
          <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/result.png')" :description="$t('empty')" />
          <!-- 已关注的店铺列表展示 -->
          <van-checkbox-group v-model="checkResult" ref="checkboxStoreGroup">
            <van-cell :border="false" :class="{'ptb-0 plr-0': true }" v-for="(item, index) in list" :key="index">
              <!-- 选择 -->
              <template #icon>
                <van-checkbox v-show="edit" class="pl-16" :name="item.goodId" ref="checkboxes">
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
                </van-checkbox>
              </template>
              <template #default>
                <!-- 左滑单元格 -->
                <!-- <van-swipe-cell :disabled="edit"> -->
                  <!-- 商品的样式 -->
                  <div class="pt-26 pr-20">
                    <OrderSingle class="pl-30 pt-20" :isShowRight="false" :product_desc="item.goodTitle" :image="item.img" :price="item.price" @onClick="goProduct(item)" :stock="item.isValid" />
                    <div class="flex hend">
                      <!-- 看相似 -->
                      <BmButton type="default" plain class="plr-12 round-8 h-25 mt-0" @btnClick="goSimilar(item.goodId)">{{ $t('look_similar') }}</BmButton>
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
                        :alt="'Tospino add cart icon'"
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
                  :alt="'Tospino choose icon'"
                />
              </template>
              <span class="ml-14 fs-14 lh-20 black">{{ $t('all') }}</span>
            </van-checkbox>
            <BmButton class="fs-16 round-0 v-100 plr-30" @click="onDelete">{{ $t('delete') }}</BmButton>
          </div>
        </div>
      </van-list>
    </PullRefresh>
    <!-- 产品规格 -->
    <ProductSku :productShow="productShow" :goodSpuVo="goodSpuVo" :initialSku="initialSku" :sku="sku" />
  </div>
</template>

<script>
import { Tab, Tabs, SwipeCell, Cell, Checkbox, CheckboxGroup, CellGroup, Divider, List } from 'vant';
import EmptyStatus from '@/components/EmptyStatus';
import OrderSingle from '@/components/OrderSingle';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import { deleteFootprintRecord, getGoodAttr } from '@/api/product';
import PullRefresh from '@/components/PullRefresh';
import ProductSku from '@/components/ProductSku';

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
      list: [],
      edit: false,
      checkResult: [],
      isAll: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      },
      goodSpuVo: {},
      initialSku: {},
      sku: {},
      productShow: {
        show: false
      }
    }
  },
  async fetch() {
    // 数据初始化
    this.edit = false;
    this.refreshing.isFresh = false;
    
    // 获取列表数据
    const listData = await this.$api.getFootprintList({ pageSize: this.pageSize, pageNum: this.pageNum });
    if (listData.code != 0) return false;

    this.total = listData.data.total;
    this.list = listData.data.records;
    this.finished = false;
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'me') {
        vm.pageNum = 1;
        vm.$fetch();
      }
    });
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
        message: this.$t('clear_all_browing_records'),
        onfirmButtonText: this.$t('confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {
        // 格式化参数
        let _params = [];
        this.checkResult.forEach(item => {
          if (this.list.find(productItem => productItem.goodId == item)) {
            let currentItem = this.list.find(productItem => productItem.goodId == item);
            _params.push({
              goodId: currentItem.goodId,
              second: currentItem.second
            })
          }
        })

        deleteFootprintRecord(_params).then(res => {
          if (res.code != 0) return false;
          // 删除成功之后将数组中的数组要删除，不调用接口是考虑多页的情况
          this.checkResult.forEach(item => {
            if (this.list.find(productItem => productItem.goodId == item)) {
              let index = this.list.findIndex(productItem => productItem.goodId == item);
              this.list.splice(index, 1)
            }
          })
          this.checkResult = [];
          this.edit = false;
          this.isAll = !this.isAll;
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
      console.log(item)
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
      this.finished = false;
      if (parseFloat(this.total) == this.list.length) { // 没有下一页了
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
    },
    goSimilar(productId) { // 跳转到相似列表
      this.$router.push({
        name: 'search-similar-id',
        params: {
          id: productId
        }
      })
    },
    onSKu(productItem) { // 获取产品规格
      getGoodAttr(productItem.goodId).then(res => {
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
        setTimeout(() => {
          this.productShow.show = true;
        }, 100);
      })
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