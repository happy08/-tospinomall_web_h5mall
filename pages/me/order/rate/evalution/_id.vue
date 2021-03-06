<template>
  <!-- 我的-订单-评价-发表评价 -->
  <div class="v-percent-100 bg-grey pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('evaluation')" :fixed="true">
      <div slot="header-right" class="green fs-14" @click="onConfirm">{{ $t('submit') }}</div>
    </BmHeaderNav>

    <van-cell-group>
      <van-cell class="w-100 plr-20 ptb-20">
        <template #title>
          <div class="flex vcenter">
            <div>
              <BmImage
                :url="detail.goodImg"
                :width="'1.2rem'" 
                :height="'1.2rem'"
                :isLazy="false"
                :isShow="true"
                :fit="'cover'"
                class="border"
                :alt="detail.goodName"
              />
            </div>
            <p class="fs-14 black ml-12 hidden-2">{{ detail.goodName }}</p>
          </div>
        </template>
      </van-cell>
      <!-- 评分 -->
      <van-cell class="plr-20 ptb-20" :title="$t('product_evaluation')" title-class="black fs-14">
        <template #label>
          <van-rate class="mt-10" v-model="goodsScores" size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
      <van-field maxlength="255" class="p-20" v-model="content" :placeholder="$t('comment_upload_photo_tip')" :border="false" type="textarea" rows="1" :autosize="{maxHeight: 60}" />
      <!-- 添加图片 -->
      <van-cell class="plr-20 pb-20 pt-0" title="" title-class="black fs-14">
        <template #label>
          <van-uploader v-model="fileList" multiple :max-count="4" preview-size="1.48rem" :after-read="afterRead" @delete="onDeleteFile">
            <div class="custom-proof-upload tc">
              <van-icon name="plus" size="0.32rem" />
              <div class="mt-10 fs-12 lh-1">{{ $t('add_picture') }}</div>
            </div>
          </van-uploader>
        </template>
      </van-cell>
      <!-- 是否匿名 -->
      <van-checkbox class="flex vcenter p-20" @click="isAnonymous = !isAnonymous" v-if="!$route.query.isAddId">
        <template #icon>
          <BmImage
            :url="isAnonymous ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
            :width="'0.32rem'" 
            :height="'0.32rem'"
            :isLazy="false"
            :isShow="false"
            :alt="'TospinoMall choose icon'"
          />
        </template>
        <span class="fs-14 lh-20 grey-666">{{ $t('anonymous_buyer') }}</span>
      </van-checkbox>
    </van-cell-group>

    <!-- 其他评分 -->
    <van-cell-group class="mt-12" v-if="!$route.query.isAddId">
      <!-- 包装 -->
      <van-cell class="plr-20 ptb-20" :title="$t('fedex_packing')" title-class="black fs-14">
        <template #label>
          <van-rate class="mt-10" v-model="expressPackingScores" size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
      <!-- 送货速度 -->
      <van-cell class="plr-20 ptb-20" :title="$t('delivery_speed')" title-class="black fs-14">
        <template #label>
          <van-rate class="mt-10" v-model="logisticsScores" size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
      <!-- 快递人员服务 -->
      <van-cell class="plr-20 ptb-20" :title="$t('delivery_personnel_service')" title-class="black fs-14">
        <template #label>
          <van-rate class="mt-10" v-model="distServiceScores" size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup, Rate, Uploader, Checkbox, Field } from 'vant';
import { getOrderItem } from '@/api/order';
import { addEvaluate } from '@/api/product';
import { getPicUrl } from '@/api/user';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanRate: Rate,
    vanUploader: Uploader,
    vanCheckbox: Checkbox,
    vanField: Field
  },
  data() {
    return {
      goodsScores: 5,
      fileList: [],
      isAnonymous: false,
      expressPackingScores: 5,
      distServiceScores: 5,
      logisticsScores: 5,
      detail: {},
      content: '',
      imgList: []
    }
  },
  activated() {
    this.goodsScores = this.$route.query.isAddId ? 0 : 5; // 追加评价商品评价为0
    getOrderItem(this.$route.params.id).then(res => {
      if (!res.data) return false;

      this.detail = res.data;
    }).catch(error => {
      console.log(error);
    })
  },
  methods: {
    onConfirm() { // 提交评价
      let _data = {
        content: this.content, // 评价内容
        goodsScores: this.goodsScores, // 商品评分
        orderId: this.detail.orderId, // 订单id
        orderItemId: this.detail.id, // 订单项id
        orderSn: this.detail.orderSn, // 订单号
        pictures: this.imgList.map(item => {
          return {
            fileType: 1,
            imgUrl: item
          }
        }), // 评论图片/视频
        saleAttr: this.detail.goodAttr, // 商品属性集合
        shopId: this.detail.order.storeId, // 店铺id
        skuId: this.detail.skuId
      }

      if (this.$route.query.isAddId) { // 追加评价
        _data = {
          ..._data,
          parentEvaluateId: this.$route.query.isAddId
        }
      } else {
        _data = {
          ..._data,
          isAnonymous: this.isAnonymous == true ? 1 : 0, // 是否匿名
          logisticsScores: this.logisticsScores, // 送货服务打分
          distServiceScores: this.distServiceScores, // 配送员打分
          expressPackingScores: this.expressPackingScores, // 快递包装打分
        }
      }
      addEvaluate(_data).then(() => {
        this.fileList = [];
        this.imgList = [];
        this.$router.go(-1);
      }).catch(error => {
        console.log(error);
      })
    },
    async afterRead(file) { // 上传图片
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      if (Array.isArray(file)) { // 多张图片
        for (let i = 0; i < file.length; i++) {
          // 图片压缩
          let compressImg = await this.$utils.compressImg(file[i].file);
          // 图片base格式转为blob格式
          let blob = this.$utils.convertBase64UrlToBlob(compressImg);

          let formData = new FormData();
          formData.append('object', blob);
          const data = await getPicUrl(formData);
          if (data.data) {
            this.imgList.push(data.data);
          }
        }
      } else {
        // 单张图片上传

        // 图片压缩
        let compressImg = await this.$utils.compressImg(file.file);
        // 图片base格式转为blob格式
        let blob = this.$utils.convertBase64UrlToBlob(compressImg);
        let formData = new FormData();
        formData.append('object', blob);
        const data = await getPicUrl(formData);
        if (data.data) {
          this.imgList.push(data.data);
        }
      }
      this.$toast.clear();
      this.fileList = this.imgList.map(item => {
        return {
          url: item,
          isImage: true
        }
      })
    },
    onDeleteFile() {
      this.imgList = this.fileList.map(item => {
        return item.url;
      })
    }
  },
}
</script>

<style lang="less" scoped>
.custom-proof-upload{
  padding: 15px 6px;
  border: 1px dashed #ccc;
  border-radius: 3.5px;
  color: #ccc;
}
</style>