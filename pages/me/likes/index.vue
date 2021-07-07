<template>
  <!-- 我的-关注 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }">
      <!-- tab切换 -->
      <van-tabs v-model="tabActive" slot="header-title" class="likes-tabs">
        <van-tab :title="$t('common.product')"></van-tab>
        <van-tab :title="$t('common.store')"></van-tab>
      </van-tabs>
      <!-- 操作 -->
      <div slot="header-right" class="fs-16 color_666" v-show="!edit" @click="edit = true">{{ $t('common.done') }}</div>
      <!-- 编辑 -->
      <div slot="header-right" class="fs-16 color_666" v-show="edit" @click="edit = false">
        <i class="iconfont icon-shanchu fs-18 mr-12"></i>
        {{ $t('common.edit') }}
      </div>
      
      
    </BmHeaderNav>

    <!-- 商品/店铺展示 -->
    <div class="bg-white">
      <!-- 无数据时展示 -->
      <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/result.png')" :description="$t('me.likes.notProduct')" :btn="$t('me.likes.shopNow')"></empty-status>
      <!-- 已关注的店铺列表展示 -->
      <van-checkbox-group v-model="checkResult" ref="checkboxStoreGroup">
        <van-cell-group>
          <van-cell :class="{'ptb-0 plr-0': true, 'bg-f4': isTrue(item.id, checkResult) }" v-for="(item, index) in list" :key="index">
            <!-- 选择 -->
            <template #icon>
              <van-checkbox v-show="edit" class="pl-16" :name="item.id" ref="checkboxes">
                <template #icon="props">
                  <BmImage
                    :url="props.checked ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
                    :width="'0.48rem'" 
                    :height="'0.48rem'"
                    :isLazy="false"
                    :isShow="false"
                  ></BmImage>
                </template>
              </van-checkbox>
            </template>
            <template #default>
              <!-- 左滑单元格 -->
              <van-swipe-cell>

                <!-- 店铺的样式 -->
                <div class="flex pl-30 ptb-20" v-if="tabActive === 1">
                  <BmImage 
                    :url="require('@/assets/images/product-bgd-90.png')"
                    :width="'1.12rem'" 
                    :height="'1.12rem'"
                    :isLazy="false"
                    :isShow="false"
                    :round="true"
                  ></BmImage>
                  <div class="ml-12 fs-14">
                    <p class="black">{{ item.title }}</p>
                    <p class="color_666 mt-8">{{ item.followers }} followers</p>
                  </div>
                </div>

                <!-- 商品的样式 -->
                <div class="pt-26 pr-20">
                  <OrderSingle class="pl-30 mt-20" :isShowRight="false" :product_desc="'Hassen’s new fall 2019 suede pointe…'" :product_size="'Black / L'" v-if="tabActive === 0"/>
                  <div class="flex hend">
                    <!-- 看相似 -->
                    <BmButton type="default" plain class="plr-12 round-8 h-25 mt-0">{{ $t('me.likes.lookSimilar') }}</BmButton>
                    <!-- 购物车 -->
                    <BmButton :type="'info'" class="h-25 ml-12">
                      <BmImage
                        :url="require('@/assets/images/icon/cart-icon.svg')"
                        :width="'0.32rem'" 
                        :height="'0.28rem'"
                        :isLazy="false"
                        :isShow="false"
                      ></BmImage>
                    </BmButton>
                  </div>
                </div>

                <template #right>
                  <div class="flex hend h-100">
                    <BmButton class="round-0 bg-yellow h-100 w-70">Unsub-scribe</BmButton>
                    <BmButton class="round-0 bg-green h-100 w-70">Store Top</BmButton>
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
              :url="isAll ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
              :width="'0.48rem'" 
              :height="'0.48rem'"
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
      ></ProductTopBtmSingle>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs, SwipeCell, Cell, Checkbox, CheckboxGroup, CellGroup, Divider } from 'vant';
import EmptyStatus from '@/components/EmptyStatus';
import OrderSingle from '@/components/OrderSingle';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';

export default {
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSwipeCell: SwipeCell,
    vanCell: Cell,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    vanCellGroup: CellGroup,
    vanDivider: Divider,
    EmptyStatus,
    OrderSingle,
    ProductTopBtmSingle
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      tabActive: 0,
      list: [
        {
          id: 1,
          img: '',
          title: 'Microsoft official flagship store',
          followers: '260'
        },
        {
          id: 2,
          img: '',
          title: 'Microsoft official flagship store',
          followers: '260'
        },
        {
          id: 3,
          img: '',
          title: 'Microsoft official flagship store',
          followers: '260'
        }
      ],
      edit: false,
      checkResult: [],
      isAll: false
    }
  },
  methods: {
    isTrue(val, list) { // 判断是否选中
      return list.length > 0 && list.indexOf(val) > -1;
    },
    onUnsubscribe() { // 取消订阅

    },
    checkAll() {
      this.isAll = !this.isAll;
      this.$refs.checkboxStoreGroup.toggleAll(this.isAll);
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
</style>

<style lang="less">
.likes-tabs{
  width: 180px;
  .van-tabs__nav--line{
    padding-bottom: 0;
  }
  .van-tabs__line{
    bottom: 0;
  }
}
</style>