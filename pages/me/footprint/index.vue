<template>
  <!-- 我的-浏览足迹 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('common.product')">
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
      <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/result.png')" :description="$t('me.likes.notProduct')" :btn="{ btn: $t('me.likes.shopNow') }" />
      <!-- 已关注的店铺列表展示 -->
      <van-checkbox-group v-model="checkResult" ref="checkboxStoreGroup">
        <van-cell :border="false" :class="{'ptb-0 plr-0': true, 'bg-f4': isTrue(item.id, checkResult) }" v-for="(item, index) in list" :key="index">
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

              <!-- 商品的样式 -->
              <div class="pt-26 pr-20">
                <OrderSingle class="pl-30 mt-20" :isShowRight="false" :product_desc="'Hassen’s new fall 2019 suede pointe…'" :product_size="'Black / L'"/>
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

                <div class="driver-line fr"></div>
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
        <BmButton class="fs-16 round-0 v-100" @click="onDelete">{{ $t('common.delete') }}</BmButton>
      </div>
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
    onDelete() { // 删除
      this.$dialog.confirm({
        message: this.$t('me.order.clearBrowingRecords'),
        onfirmButtonText: this.$t('common.confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonColor: '#383838'
      }).then(() => {

      }).catch(() => {

      })
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
.driver-line{
  width: 209px;
  height: 1px;
  background-color: #eee;
  margin-top: 25px;
}
</style>