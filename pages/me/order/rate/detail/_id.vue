<template>
  <!-- 商品-评价-评价详情/ 我的-评价-评价详情 -->
  <div class="vh-100 bg-grey pb-20">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.report.detail')" />

    <!-- 订单展示 -->
    <div class="p-20 bg-white flex between">
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
      <p class="fs-14 black ml-12 mr-30 lh-20">Hassen’s new fall single shoes fashion wedding…</p>
      <!-- 加入购物车 -->
      <BmButton :type="'info'" class="h-25 ml-12 mt-8" @click="goCart">
        <BmImage
          :url="require('@/assets/images/icon/cart-icon.svg')"
          :width="'0.32rem'" 
          :height="'0.28rem'"
          :isLazy="false"
          :isShow="false"
        />
      </BmButton>
    </div>
    
    <!-- 评价详情 -->
    <div class="mt-12 plr-20 pt-14 bg-white pb-20">
      <!-- 用户头像、昵称、日期 -->
      <div class="flex between vcenter">
        <div class="flex vcenter">
          <div>
            <BmImage
              :url="require('@/assets/images/product-bgd-90.png')"
              :width="'0.64rem'" 
              :height="'0.64rem'"
              :isLazy="false"
              :isShow="false"
              :fit="'cover'"
              :round="true"
            />
          </div>
          <p class="ml-14 fs-14 black fw">Ave</p>          
        </div>
        <div class="light-grey fs-14">March 6 2020</div>
      </div>
      <!-- 评分 -->
      <div class="mt-14 flex vcenter">
        <van-rate v-model="rate" allow-half size="14" color="#F7B500" void-color="#DDDDDD" void-icon="star" />
        <div class="grey ml-12">Black / L</div>
      </div>
      <!-- 描述 -->
      <p class="black fs-14 mt-10">A great one, with coupons; Small and delicate appearance, preheat for 30 seconds before starting up, uniform air output, space saving, suitable for small family</p>
      <!-- 展示图片 -->
      <BmImage
        :url="require('@/assets/images/product-bgd-90.png')"
        :width="'6.68rem'" 
        :height="'6.68rem'"
        :isLazy="false"
        :isShow="false"
        :fit="'cover'"
        class="mt-20"
      />
      <!-- 你的意见、信息、点赞 -->
      <div class="mt-43 flex between vcenter">
        <van-field v-model="thoughts" class="custom-field" :border="false" :placeholder="$t('me.report.writeThoughts')" />
        <!-- 评价人数 -->
        <div class="flex vcenter">
          <span class="mr-4">1</span>
          <BmImage
            :url="require('@/assets/images/icon/message-icon.svg')"
            :width="'0.48rem'" 
            :height="'0.48rem'"
            :isLazy="false"
            :isShow="false"
            :fit="'cover'"
          />
        </div>
        <!-- 点赞 -->
        <div class="flex vcenter">
          <span class="mr-4">1</span>
          <BmImage
            :url="require('@/assets/images/icon/likes-icon.svg')"
            :width="'0.48rem'" 
            :height="'0.48rem'"
            :isLazy="false"
            :isShow="false"
            :fit="'cover'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Rate, Field } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanRate: Rate,
    vanField: Field
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      rate: 2.5,
      thoughts: ''
    }
  },
  methods: {
    goCart() { // 加入购物车

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
</style>