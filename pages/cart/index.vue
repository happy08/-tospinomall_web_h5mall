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
      <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/cart.png')" :description="$t('cart.emptyTip')" :btn="$t('me.likes.shopNow')" />
      <!-- 购物车不为空 -->
      <van-tabs v-else sticky animated :offset-top="46" color="#42B7AE" class="bg-white customs-van-tabs" :ellipsis="false" @change="getList" v-model="tabActive">
        <van-tab v-for="(categoryItem, tabIndex) in $t('cart.categoryList')" :title="categoryItem" :key="'scroll-tab-' + tabIndex" title-class="border-b pb-0" :name="tabIndex" />
      </van-tabs>
    </div>

    <!-- 数据列表展示 -->
    <div class="pt-14 pb-12 bg-white" v-for="item in list" :key="item.id">
      <van-checkbox-group v-model="item.result" :ref="'checkboxGroup-' + item.id" @change="storeChangeCheck($event, item)">
        <div class="flex vcenter pl-12">
          <div @click="storeCheckAll(item)">
            <BmImage
              :url="item.isAll ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
              :width="'0.34rem'" 
              :height="'0.34rem'"
              :isLazy="false"
              :isShow="false"
            ></BmImage>
          </div>
          <OrderStoreSingle class="pl-16 pr-30" />
        </div>
        <van-swipe-cell class="pl-12" v-for="singleItem in item.list" :key="'single-' + singleItem.id">
          <div class="flex vcenter">
            <!-- 选中与否 -->
            <van-checkbox :name="item.id + '-' + singleItem.id" class="custom-checkbox" >
              <template #icon="props">
                <div>
                  <BmImage
                    :url="props.checked ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
                    :width="'0.34rem'" 
                    :height="'0.34rem'"
                    :isLazy="false"
                    :isShow="false"
                  ></BmImage>
                </div>
              </template>
            </van-checkbox>
            <van-card
              title="Women's Handbag High Qua-lity Pure PU Leather For … Women's Handbag High Qua-lity Pure PU Leather For …   "
              class="bg-white pt-24 ml-12 plr-0 pb-0 custom-card lh-20 width-313"
              thumb="https://img01.yzcdn.cn/vant/cat.jpeg"
            >
              <!-- 自定义描述区域，改为展示商品型号 -->
              <template #desc>
                <div class="bg-f8 pl-10 mt-8 round-4 flex vcenter pr-10 fit-width">
                  <span class="grey pr-24">{{ item.color }}/{{ item.size }}</span>
                  <van-icon name="arrow-down" color="#B6B6B6" size="0.16rem" />
                </div>
              </template>
              <!-- 标签 -->
              <template #tags>
                <div class="flex">
                  <span class="mt-8 fs-10 iblock product-tag">Ships from China</span>
                </div>
              </template>
              <!-- 自定义数量 -->
              <template #num>
                <van-stepper v-model="item.step" input-width="0.796rem" button-size="0.42rem" :integer="true" class="mt-6 custom-stepper" />
              </template>
              <!-- 自定义价格 -->
              <template #price>
                <div class="mt-8">
                  <span class="red fs-16 fw">{{ $store.state.rate.currency }}{{ item.price }}</span>
                  <span class="grey fs-12 ml-10 line-through">{{ $store.state.rate.currency }}{{ item.cost }}</span>
                </div>
              </template>
            </van-card>
          </div>
          
          <template #right>
            <div class="v-100 flex">
              <van-button square text="Often Buy" class="v-100 w-70 bg-f0 black plr-12 fs-14 border-no" />
              <van-button square text="Collect" class="v-100 w-70 bg-yellow white plr-12 fs-14 border-no" />
              <van-button square text="Delete" class="v-100 w-70 bg-red white plr-12 fs-14 border-no" />
            </div>
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>

    <!-- 可能喜欢的推荐列表展示 -->
    <div>
      <van-divider class="plr-30 mt-24 fw fs-14 clr-black-85">
        <i class="iconfont icon-xinaixin linear-color mr-8"></i>
        {{ $t('common.mayLike') }}
      </van-divider>
      <div class="mlr-12 flex between flex-wrap">
        <ProductTopBtmSingle
          :img="{ url: '', width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
          :detail="{ desc: 'categoryItem.name', price: 49.92, rate: 2.5, volumn: 50, ellipsis: 2, country: 'Ghana' }"
          v-for="(searchItem, searchIndex) in 6" 
          :key="'search-list-' + searchIndex"
          class="mb-12"
        ></ProductTopBtmSingle>
      </div>
    </div>

    <!-- 购物车编辑 -->
    <div class="bg-white custom-submit-bar pl-16 pr-12 flex vcenter between">
      <van-checkbox v-model="checked" @click="checkAll">
        全选
        <template #icon="props">
          <div>
            <BmImage
              :url="props.checked ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
              :width="'0.34rem'" 
              :height="'0.34rem'"
              :isLazy="false"
              :isShow="false"
            ></BmImage>
          </div>
        </template>
      </van-checkbox>
      <!-- 结算 -->
      <div v-show="!isEdit" class="flex vcenter">
        <div>
          <span class="black fs-14 mr-4">{{ $t('cart.total') }}:</span>
          <span class="red fs-14 fw">{{ $store.state.rate.currency }}{{ total }}</span>
        </div>
        <BmButton class="round-8 h-40 ml-12">{{ $t('cart.checkOut') }}</BmButton>
      </div>
      <!-- 编辑 -->
      <div v-show="isEdit">
        <BmButton :type="'info'" class="round-8 h-32 orange bg-white orange-border">{{ $t('cart.moveFavorite') }}</BmButton>
        <BmButton :type="'info'" class="round-8 h-32 orange bg-white orange-border ml-12" @click="onDelete">{{ $t('common.delete') }}</BmButton>
      </div>
    </div>

    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import EmptyStatus from '@/components/EmptyStatus';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import OrderSingle from '@/components/OrderSingle';
import OrderStoreSingle from '@/components/OrderStoreSingle';
import { Divider, Tab, Tabs, SwipeCell, Card, Stepper, Checkbox, CheckboxGroup, Sticky, SubmitBar } from 'vant';

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
    EmptyStatus,
    OrderSingle,
    OrderStoreSingle,
    ProductTopBtmSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {

    return {
      list: [
        {
          id: 1,
          step: 1,
          price: 29.65,
          cost: 39.96,
          color: 'Black',
          size: 'L',
          result: [],
          list: [
            {
              id: 1,
              step: 1,
              price: 29.65,
              cost: 39.96,
              color: 'Black',
              size: 'L',
            },
            {
              id: 2,
              step: 1,
              price: 29.65,
              cost: 39.96,
              color: 'Black',
              size: 'L',
            }
          ],
          isAll: false
        },
        {
          id: 2,
          step: 1,
          price: 29.65,
          cost: 39.96,
          color: 'Black',
          size: 'L',
          result: [],
          list: [
            {
              id: 1,
              step: 1,
              price: 29.65,
              cost: 39.96,
              color: 'Black',
              size: 'L',
            },
            {
              id: 2,
              step: 1,
              price: 29.65,
              cost: 39.96,
              color: 'Black',
              size: 'L',
            }
          ],
          isAll: false
        }
      ],
      tabActive: 0,
      checked: false,
      isEdit: false,
      total: 0
    }
  },
  methods: {
    onEdit() { // 编辑购物车
      this.isEdit = !this.isEdit;
    },
    getList() { // 获取列表数据

    },
    storeCheckAll(store, isAll) { // 店铺内部全选与否
      let isCheck = isAll ? !isAll : store.isAll;

      store.result = isCheck ? [] : store.list.map(item => {
        return store.id + '-' + item.id;
      })

      store.isAll = !isCheck;
      
      this.watchCheckAll();
    },
    storeChangeCheck(event, store) { // 店铺内订单勾选的监听事件
      store.isAll = event.length === store.list.length ? true : false;

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

    },
    watchCheckAll() { // 监听购物车中的订单是否全部选中
      let check = this.list.filter(item => {
        if (item.isAll !== true) {
          return item.id;
        }
      })
      this.checkAll(check.length === 0, check.length === 0);
    },
    onDelete() { // 确认删除订单
      this.$dialog.confirm({
        message: 'Delete the 1 Products',
        onfirmButtonText: this.$t('common.confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {

      }).catch(() => {

      })
    }
  },
}
</script>

<style lang="less" scoped>
.product-tag{
  padding: 3px 8px 3px 22px;
  position: relative;
  background-image: url('../../assets/images/icon/cart-tag-1.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
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
.h-32{
  height: 32px!important;
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