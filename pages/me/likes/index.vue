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
      <!-- product -->
      <div v-show="tabActive === 0">
        <empty-status v-if="productList.length === 0" :image="require('@/assets/images/empty/result.png')" :description="$t('me.likes.notProduct')" :btn="$t('me.likes.shopNow')"></empty-status>
      </div>

      <!-- store -->
      <div v-show="tabActive === 1">
        <!-- 没有关注的店铺时 -->
        <empty-status v-if="storeList.length === 0" :image="require('@/assets/images/empty/result.png')" :description="$t('me.likes.noStore')" :btn="$t('me.likes.shopNow')"></empty-status>
        <!-- 已关注的店铺列表展示 -->
        <van-checkbox-group v-model="storeCheck" ref="checkboxStoreGroup">
          <van-cell-group>
            <van-cell :class="{'ptb-0 plr-0': true, 'bg-f4': isTrue(storeItem.id, storeCheck) }" v-for="(storeItem, storeIndex) in storeList" :key="storeIndex">
              <!-- 选择 -->
              <template #icon>
                <van-checkbox v-show="edit" class="pl-16" :name="storeItem.id" ref="checkboxes">
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
                  <div class="flex pl-30 ptb-20">
                    <BmImage 
                      :url="require('@/assets/images/product-bgd-90.png')"
                      :width="'1.12rem'" 
                      :height="'1.12rem'"
                      :isLazy="false"
                      :isShow="false"
                      :round="true"
                    ></BmImage>
                    <div class="ml-12 fs-14">
                      <p class="black">{{ storeItem.title }}</p>
                      <p class="color_666 mt-8">{{ storeItem.followers }} followers</p>
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
      </div>

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
  </div>
</template>

<script>
import { Tab, Tabs, SwipeCell, Cell, Checkbox, CheckboxGroup, CellGroup } from 'vant';
import EmptyStatus from '@/components/EmptyStatus';

export default {
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    vanSwipeCell: SwipeCell,
    vanCell: Cell,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    vanCellGroup: CellGroup,
    EmptyStatus
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      tabActive: 1,
      list: [],
      productList: [],
      storeList: [
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
      storeCheck: [],
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