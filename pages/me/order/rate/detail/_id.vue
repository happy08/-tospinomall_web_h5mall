<template>
  <!-- 商品-评价-评价详情/ 我的-评价-评价详情 -->
  <div class="v-percent-100 bg-grey pb-80 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('review_details')" :fixed="true" />

    <!-- 订单展示 -->
    <van-sticky :offset-top="'0.92rem'">
      <div class="p-20 bg-white flex between">
        <div class="flex">
          <BmImage
            :url="detailData.goodPicture"
            :width="'1.2rem'" 
            :height="'1.2rem'"
            :isLazy="false"
            :isShow="true"
            :fit="'cover'"
            class="border round-2 flex-shrink"
            :alt="detailData.goodTitle"
          />
          <p class="fs-14 black mlr-12 lh-20 hidden-2">{{ detailData.goodTitle }}</p>
        </div>
        <!-- 加入购物车 -->
        <BmImage
          :url="require('@/assets/images/icon/add-cart-btn.png')"
          :width="'0.94rem'" 
          :height="'0.54rem'"
          :isLazy="false"
          :isShow="false"
          class="mt-8 flex-shrink"
          @onClick="goCart"
          :alt="'TospinoMall add cart icon'"
        />
      </div>
    </van-sticky>
    
    <!-- 评价详情 -->
    <div class="mt-12 plr-20 pt-14 bg-white pb-20">
      <!-- 用户头像、昵称、日期 -->
      <div class="flex between vcenter">
        <div class="flex vcenter">
          <div>
            <BmImage
              :url="detailData.buyerPortrait"
              :width="'0.64rem'" 
              :height="'0.64rem'"
              :isLazy="false"
              :isShow="true"
              :fit="'cover'"
              :round="true"
              :errorUrl="require('@/assets/images/icon/user-icon.png')"
              :alt="'TospinoMall user icon'"
            />
          </div>
          <p class="ml-14 fs-14 black fw">{{ detailData.buyerName }}</p>          
        </div>
        <div class="light-grey fs-14">{{ detailData.createTime }}</div>
      </div>
      <!-- 评分 -->
      <div class="mt-14 flex vcenter">
        <van-rate v-model="detailData.goodsScores" readonly size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        <div class="grey ml-12">{{ detailData.saleAttr }}</div>
      </div>
      <!-- 描述 -->
      <p class="black fs-14 mt-10">{{ detailData.content }}</p>
      <!-- 展示图片 -->
      <div v-for="(picItem, picIndex) in detailData.pictures" :key="'pic-' + picIndex" class="mt-10">
        <!-- <BmImage
          :url="picItem.imgUrl"
          :width="'6.68rem'" 
          :height="'6.68rem'"
          :isLazy="false"
          :isShow="true"
          :fit="'cover'"
          :class="{'border round-8 hidden': true}"
          v-if="picItem.fileType == 1"
          @onClick="onPreview(detailData.pictures, picIndex)"
          :alt="detailData.goodTitle"
        /> -->
        <div class="video-container">
          <BmImage
            :url="require('@/assets/images/icon/video.png')"
            :height="'0.88rem'"
            :width="'0.88rem'"
            :isLazy="false"
            :isShow="false"
            :fit="'cover'"
            :alt="detailData.goodTitle"
            class="video-container__icon"
            v-if="picItem.fileType == 2"
            @onClick="onPreview(detailData.pictures, picIndex)"
          />
          <BmImage
            :url="picItem.imgUrl"
            :width="'6.68rem'" 
            :height="'6.68rem'"
            :isLazy="false"
            :isShow="true"
            :fit="'cover'"
            :class="{'border round-8 hidden': true}"
            @onClick="onPreview(detailData.pictures, picIndex)"
            :alt="detailData.goodTitle"
          />
        </div>
      </div>
      <!-- 追加评论 -->
      <template v-if="detailData.additionalEvaluates && detailData.additionalEvaluates.length > 0">
        <p class="fw black fs-14 mt-20">{{ $t('review_after_purchase') }}</p>
        <div v-for="addItem in detailData.additionalEvaluates" :key="'add-review-' + addItem.id">
          <!-- 描述 -->
          <p class="black fs-14 mt-10">{{ addItem.content }}</p>
          <!-- 展示图片 -->
          <div class="flex flex-wrap">
            <div v-for="(addPicItem, addPicIndex) in addItem.pictures" :key="'add-pic-' + addPicIndex">
              <!-- <BmImage
                :url="addPicItem.imgUrl"
                :width="'6.68rem'" 
                :height="'6.68rem'"
                :isLazy="false"
                :isShow="true"
                :fit="'cover'"
                :class="{'border round-8 hidden mt-10 block': true}"
                @onClick="onPreview(addItem.pictures, addPicIndex)"
                :alt="detailData.goodTitle"
              /> -->
              <div class="video-container" @click="onPreview(addItem.pictures, addPicIndex)">
                <BmImage
                  :url="require('@/assets/images/icon/video.png')"
                  :height="'0.88rem'"
                  :width="'0.88rem'"
                  :isLazy="false"
                  :isShow="false"
                  :fit="'cover'"
                  :alt="detailData.goodTitle"
                  class="video-container__icon"
                  v-if="addPicItem.fileType == 2"
                  @onClick="onPreview(addItem.pictures, addPicIndex)"
                />
                <BmImage
                  :url="addPicItem.imgUrl"
                  :width="'6.68rem'" 
                  :height="'6.68rem'"
                  :isLazy="false"
                  :isShow="true"
                  :fit="'cover'"
                  :class="{'border round-8 hidden mt-10 block': true}"
                  :alt="detailData.goodTitle"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 全部回复 -->
    <div class="mt-12 bg-white">
      <p class="fw black fs-14 ptb-12 plr-20 border-b">{{ $t('all_reply') }}</p>
      <template v-if="detailData.replyList && detailData.replyList.length > 0">
        <van-cell class="plr-20 ptb-10 w-100 hidden" title-class="fs-14" v-for="(replyItem, replyIndex) in detailData.replyList" :key="'reply-' + replyIndex" :label="replyItem.replyContent" label-class="mt-10 black">
          <template #title>
            <div class="flex vcenter between">
              <div class="flex vcenter">
                <BmImage
                  :url="replyItem.replyPicture"
                  :width="'0.64rem'" 
                  :height="'0.64rem'"
                  :isLazy="false"
                  :isShow="true"
                  :fit="'cover'"
                  :round="true"
                  :errorUrl="require('@/assets/images/icon/user-icon.png')"
                  :alt="'TospinoMall user icon'"
                />
                <span class="black ml-10">{{ replyItem.replyName }} </span>
              </div>
              <span class="grey hidden-1 flex-1 tr">{{ replyItem.createTime }}</span>
            </div>
          </template>
        </van-cell>
      </template>
      <empty-status v-else :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
    </div>

    <!-- 你的意见、信息、点赞 -->
    <div class="plr-20 ptb-12 flex between vcenter fixed bg-white">
      <van-field v-model.trim="thoughts" class="custom-field" ref="customEvaluate" :border="false" :placeholder="$t('write_down_your_thoughts')">
        <template #right-icon>
          <span class="green" @click="onSend">{{ $t('confirm') }}</span>
        </template>
      </van-field>
      <!-- 评价人数 -->
      <div class="flex vcenter" @click="onFocus">
        <span class="mr-4">{{ detailData.replyCount }}</span>
        <BmImage
          :url="require('@/assets/images/icon/message-icon.png')"
          :width="'0.48rem'" 
          :height="'0.48rem'"
          :isLazy="false"
          :isShow="false"
          :fit="'cover'"
          :alt="'TospinoMall message icon'"
        />
      </div>
      <!-- 点赞 -->
      <div class="flex vcenter">
        <span class="mr-4">{{ detailData.glike }}</span>
        <BmIcon :name="'likes-icon'" :width="'0.48rem'" :height="'0.48rem'" :color="detailData.isGiveLike ? '#42b7ae' : '#262626'" @iconClick="addGive(detailData)"/>
      </div>
    </div>

    <ProductSku :productShow="productShow" :goodSpuVo="goodSpuVo" :initialSku="initialSku" :sku="sku" />

    <!-- 预览 -->
    <bm-preview v-if="isPreviewIndex != 'false'" :isPreviewIndex="isPreviewIndex" :carouselMapUrls="carouselMapUrls" :initialSlide="isPreviewIndex" @onClose="isPreviewIndex = 'false'"></bm-preview>
  </div>
</template>

<script>
import { Rate, Field, Cell, Sticky, ImagePreview } from 'vant';
import { getRateDetail, addGive, getGoodAttr, replyEvaluate } from '@/api/product';
import ProductSku from '@/components/ProductSku';
import EmptyStatus from '@/components/EmptyStatus';
import BmPreview from '@/components/_global/BmPreview';
import errorImage from '@/assets/images/product-bgd-90.png';

export default {
  components: {
    vanRate: Rate,
    vanField: Field,
    vanCell: Cell,
    vanSticky: Sticky,
    ProductSku,
    EmptyStatus,
    BmPreview
  },
  data() {
    return {
      thoughts: '',
      detailData: {},
      goodSpuVo: {},
      initialSku: {},
      sku: {},
      productShow: {
        show: false
      },
      isPreviewIndex: 'false',
      carouselMapUrls: []
    }
  },
  activated() {
    this.getRateDetail();
  },
  methods: {
    goCart() { // 加入购物车
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          path: '/login.html'
        })
        return false;
      }
      getGoodAttr(this.detailData.goodsId).then(res => {
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
    getRateDetail() { // 获取评价详情
      getRateDetail(this.$route.params.id, this.$store.state.user.userInfo ? this.$store.state.user.userInfo.id : '').then(res => {
        if (!res.data) return false;
        this.detailData = {
          ...res.data,
          // pictures: res.data.pictures.filter(item => {
          //   return item.fileType == 1; // 1.0版本只展示图片
          // })
        };
      }).catch(error => {
        console.log(error);
      })
    },
    addGive(item) { // 点赞取消点赞
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          path: '/login.html'
        })
        return false;
      }
      addGive(item.id).then(res => {
        if (res.code != 0) return false;
        this.getRateDetail();
      }).catch(error => {
        console.log(error);
      })
    },
    onFocus() {
      this.$refs.customEvaluate.$el.querySelector('input').focus();
    },
    onSend() { // 新增商品回复
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          path: '/login.html'
        })
        return false;
      }
      if (!this.thoughts) {
        return false;
      }
      replyEvaluate({
        replyContent: this.thoughts,
        evaluateId: this.detailData.id,
        utype: 0 // 买家回复
      }).then(() => {
        this.thoughts = '';
        this.getRateDetail();
      }).catch(error => {
        console.log(error);
      })
    },
    onPreview(item, index) { // 图片预览
      this.isPreviewIndex = index;
      this.carouselMapUrls = item;
      // const imgs = item.map(picItem => {
      //   return picItem.imgUrl;
      // });
      // ImagePreview({
      //   images: imgs,
      //   startPosition: index,
      //   loop: false
      // })
    }
  },
}
</script>

<style lang="less" scoped>
.mt-43{
  margin-top: 43px;
}
.custom-field{
  width: 238px;
  background-color: #F8F8F8;
  line-height: 20px;
  border-radius: 20px;
  padding: 8px 10px;
}
.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.pb-80{
  padding-bottom: 80px;
}
.flex-1{
  flex: 1;
  width: 0;
}
.video-container{
  position: relative;
  .video-container__icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
}
</style>