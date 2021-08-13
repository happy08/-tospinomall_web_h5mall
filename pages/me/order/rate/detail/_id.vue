<template>
  <!-- 商品-评价-评价详情/ 我的-评价-评价详情 -->
  <div class="vh-100 bg-grey pb-80 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.report.detail')" :fixed="true" />

    <!-- 订单展示 -->
    <van-sticky :offset-top="'0.925rem'">
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
          />
          <p class="fs-14 black ml-12 lh-20 hidden-2">{{ detailData.goodTitle }}</p>
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
            />
          </div>
          <p class="ml-14 fs-14 black fw">{{ detailData.buyerName }}</p>          
        </div>
        <div class="light-grey fs-14">{{ detailData.createTime }}</div>
      </div>
      <!-- 评分 -->
      <div class="mt-14 flex vcenter">
        <van-rate v-model="rate" allow-half size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        <div class="grey ml-12">{{ detailData.saleAttr }}</div>
      </div>
      <!-- 描述 -->
      <p class="black fs-14 mt-10">{{ detailData.content }}</p>
      <!-- 展示图片 -->
      <div v-for="picItem in detailData.pictures" :key="'pic-' + picItem.id" class="mt-10">
        <BmImage
          :url="picItem.imgUrl"
          :width="'6.68rem'" 
          :height="'6.68rem'"
          :isLazy="false"
          :isShow="true"
          :fit="'cover'"
          :class="{'border round-8 hidden': true}"
          v-if="picItem.fileType == 1"
        />
      </div>
      <!-- 追加评论 -->
      <template v-if="detailData.additionalEvaluates && detailData.additionalEvaluates.length > 0">
        <p class="fw black fs-14 mt-20">购买后追评</p>
        <div v-for="addItem in detailData.additionalEvaluates" :key="'add-review-' + addItem.id">
          <!-- 描述 -->
          <p class="black fs-14 mt-10">{{ addItem.content }}</p>
          <!-- 展示图片 -->
          <div class="flex flex-wrap">
            <div v-for="addPicItem in addItem.pictures" :key="'add-pic-' + addPicItem.id">
              <BmImage
                :url="addPicItem.imgUrl"
                :width="'6.68rem'" 
                :height="'6.68rem'"
                :isLazy="false"
                :isShow="true"
                :fit="'cover'"
                :class="{'border round-8 hidden mt-10 block': true}"
                v-if="addPicItem.fileType == 1"
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 全部回复 -->
    <div class="mt-12 bg-white">
      <p class="fw black fs-14 ptb-12 plr-20 border-b">全部回复</p>
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
                />
                <span class="black ml-10">{{ replyItem.replyName }} </span>
              </div>
              <span class="grey hidden-1 flex-1 tr">{{ replyItem.createTime }}</span>
            </div>
          </template>
        </van-cell>
      </template>
    </div>

    <!-- 你的意见、信息、点赞 -->
    <div class="plr-20 ptb-12 flex between vcenter fixed bg-white">
      <van-field v-model.trim="thoughts" class="custom-field" ref="customEvaluate" :border="false" :placeholder="$t('me.report.writeThoughts')">
        <template #right-icon>
          <span class="green" @click="onSend">确认</span>
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
        />
      </div>
      <!-- 点赞 -->
      <div class="flex vcenter">
        <span class="mr-4">{{ detailData.glike }}</span>
        <BmIcon :name="'likes-icon'" :width="'0.48rem'" :height="'0.48rem'" :color="detailData.isGiveLike ? '#42b7ae' : '#262626'" @iconClick="addGive(detailData)"/>
      </div>
    </div>

    <ProductSku :productShow="productShow" :goodSpuVo="goodSpuVo" :initialSku="initialSku" :sku="sku" />
  </div>
</template>

<script>
import { Rate, Field, Cell, Sticky } from 'vant';
import { getRateDetail, addGive, getGoodAttr, replyEvaluate } from '@/api/product';
import ProductSku from '@/components/ProductSku';

export default {
  middleware: 'authenticated',
  components: {
    vanRate: Rate,
    vanField: Field,
    vanCell: Cell,
    vanSticky: Sticky,
    ProductSku
  },
  data() {
    return {
      rate: 2.5,
      thoughts: '',
      detailData: {},
      goodSpuVo: {},
      initialSku: {},
      sku: {},
      productShow: {
        show: false
      },
    }
  },
  activated() {
    this.getRateDetail();
  },
  methods: {
    goCart() { // 加入购物车
      getGoodAttr(this.detailData.goodsId).then(res => {
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
    },
    getRateDetail() { // 获取评价详情
      getRateDetail(this.$route.params.id, this.$route.query.buyerId).then(res => {
        if (res.code != 0) return false;
        this.detailData = res.data;
      })
    },
    addGive(item) { // 点赞
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
        })
        return false;
      }
      if (item.isGiveLike == 1) { // 已点赞，取消点赞
        return false;
      }
      addGive(item.id).then(res => {
        if (res.code != 0) return false;
        this.getRateDetail();
      })
    },
    onFocus() {
      this.$refs.customEvaluate.$el.querySelector('input').focus();
    },
    onSend() { // 新增商品回复
      if (!this.$store.state.user.authToken) {
        this.$router.push({
          name: 'login'
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
      })
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
</style>