<template>
  <!-- 我的-订单-评价-发表评价 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.rate.evalution')">
      <div slot="header-right" class="green fs-14" @click="onConfirm">{{ $t('common.confirm') }}</div>
    </BmHeaderNav>

    <van-cell-group>
      <van-cell class="w-100 plr-20 ptb-20">
        <template #title>
          <div class="flex">
            <div>
              <BmImage
                :url="require('@/assets/images/product-bgd-90.png')"
                :width="'1.2rem'" 
                :height="'1.2rem'"
                :isLazy="false"
                :isShow="false"
                :fit="'cover'"
                class="border"
              />
            </div>
            <p class="fs-14 black ml-12">Hassen’s new fall single shoes fashion wedding…</p>
          </div>
        </template>
      </van-cell>
      <!-- 评分 -->
      <van-cell class="plr-20 ptb-20" :title="$t('me.rate.productEvaluation')" title-class="black fs-14">
        <template #label>
          <van-rate class="mt-10" v-if="rate" v-model="rate" allow-half size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
      <!-- 添加图片 -->
      <van-cell class="plr-20 ptb-20" :title="$t('me.rate.addPictureTip')" title-class="black fs-14">
        <template #label>
          <div class="border round-8 pb-12 pt-18 mt-16 tc">
            <van-uploader class="mt-10">
              <div class="custom-proof-upload tc">
                <BmImage
                  :url="require('@/assets/images/icon/camera-icon.png')"
                  :width="'0.78rem'" 
                  :height="'0.66rem'"
                  :isLazy="false"
                  :isShow="false"
                  :fit="'cover'"
                />
                <div class="mt-6 fs-12 lh-1">{{ $t('me.rate.addPicture') }}</div>
              </div>
            </van-uploader>
          </div>
        </template>
      </van-cell>
      <!-- 是否匿名 -->
      <van-checkbox class="flex vcenter p-20" @click="isAnonymous = !isAnonymous">
        <template #icon>
          <BmImage
            :url="isAnonymous ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
            :width="'0.32rem'" 
            :height="'0.32rem'"
            :isLazy="false"
            :isShow="false"
          />
        </template>
        <span class="ml-14 fs-14 lh-20 grey-666">Read and agree to the Door-to-Door Pick-up Service Agreement</span>
      </van-checkbox>
    </van-cell-group>

    <!-- 其他评分 -->
    <van-cell-group class="mt-12">
      <!-- 包装 -->
      <van-cell class="plr-20 ptb-20" :title="$t('me.rate.fedexPacking')" title-class="black fs-14">
        <template #label>
          <van-rate class="mt-10" v-if="rate" v-model="fedexPacking" allow-half size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
      <!-- 发货速度 -->
      <van-cell class="plr-20 ptb-20" :title="$t('me.rate.deliverySpeed')" title-class="black fs-14">
        <template #label>
          <van-rate class="mt-10" v-if="rate" v-model="rate" allow-half size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
      <!-- 快递人员服务 -->
      <van-cell class="plr-20 ptb-20" :title="$t('me.rate.deliveryPersonnelService')" title-class="black fs-14">
        <template #label>
          <van-rate class="mt-10" v-if="rate" v-model="rate" allow-half size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup, Rate, Uploader, Checkbox } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanRate: Rate,
    vanUploader: Uploader,
    vanCheckbox: Checkbox
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      rate: 2,
      fileList: [
        { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }
      ],
      isAnonymous: false,
      fedexPacking: 3,
      deliverySpeed: 2.5
    }
  },
  methods: {
    onConfirm() { // 提交

    }
  },
}
</script>