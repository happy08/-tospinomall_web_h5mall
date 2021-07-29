<template>
  <!-- 我的-意见反馈 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.feedback.title')" />

    <div class="mt-20 mlr-20">
      <!-- 反馈类型 -->
      <h2 class="fs-14 black">{{ $t('me.feedback.typeTitle') }}</h2>
      <div class="mt-20">
        <span class="plr-12 round-8 border mr-12 iblock mb-10 tag-name" v-for="(tag, index) in $t('me.feedback.typeLists')" :key="index">{{ tag }}</span>
      </div>

      <!-- 反馈意见 -->
      <van-field
        class="mt-20 bg-grey round-8"
        v-model="message"
        rows="4"
        type="textarea"
        :placeholder="$t('me.feedback.feedbackPlaceholder')"
      />

      <!-- 反馈图片 -->
      <div class="mt-12 bg-grey round-8">
        <van-field
          class="bg-grey feedback-pic-field"
          v-model="phone"
          rows="1"
          type="textarea"
          :placeholder="$t('me.feedback.picPlaceholder')"
        />
        <!-- 上传图片 -->
        <van-uploader class="plr-12 pb-20" :after-read="afterRead" v-model="fileList" preview-size="1.2rem">
          <BmImage 
            :url="require('@/assets/images/icon/camera-icon.png')"
            :width="'1.2rem'" 
            :height="'1.2rem'"
            :isLazy="false"
            :isShow="false"
            class="ml-12"
          />
        </van-uploader>
      </div>
      <!-- 提交 -->
      <BmButton @click="submit" class="w-100 feedback-btn round-8">{{ $t('common.submit') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { Field, Uploader } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanField: Field,
    vanUploader: Uploader
  },
  data() {
    return {
      message: '',
      phone: '',
      fileList: []
    }
  },
  methods: {
    afterRead(filed) { // 获取到对应的file对象

    },
    submit() { // 提交反馈意见

    }
  },
}
</script>

<style lang="less" scoped>
.tag-name{
  line-height: 17px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.feedback-btn{
  margin-top: 35px;
}
</style>

<style lang="less">
.feedback-pic-field.van-cell::after{
  border-bottom: none;
}
</style>