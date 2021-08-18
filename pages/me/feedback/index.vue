<template>
  <!-- 我的-意见反馈 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('feedback')" />

    <div class="mt-20 mlr-20">
      <!-- 反馈类型 -->
      <h2 class="fs-14 black">{{ $t('type_of_problem_feedback') }}</h2>
      <div class="mt-20">
        <span :class="{'plr-12 round-8 border mr-12 iblock mb-10 tag-name': true, 'is-active': activeTag == tag.id }" @click="activeTag = tag.id" v-for="(tag, index) in feedbackType" :key="index">{{ tag.title }}</span>
      </div>

      <!-- 反馈联系方式 -->
      <van-field
        class="mt-10 bg-grey round-8"
        v-model="phone"
        type="text"
        :placeholder="$t('feedback_contact_tip')"
      />

      <!-- 反馈意见 -->
      <div class="mt-12 bg-grey round-8">
        <van-field
          class="bg-grey feedback-pic-field"
          v-model="message"
          rows="2"
          type="textarea"
          :placeholder="$t('feedback_input_hint')"
        />
        <!-- 上传图片 -->
        <van-uploader class="plr-12 pb-20" :after-read="afterRead" v-model="fileList" preview-size="1.2rem" multiple>
          <BmImage 
            :url="require('@/assets/images/camera-upload-icon.png')"
            :width="'1.2rem'" 
            :height="'1.2rem'"
            :isLazy="false"
            :isShow="false"
            class="ml-12"
          />
        </van-uploader>
      </div>
      <!-- 提交 -->
      <BmButton @click.stop="submit" :disabled="this.activeTag == '' || this.message == '' || this.phone == ''" class="w-100 feedback-btn round-8">{{ $t('submit') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { Field, Uploader } from 'vant';
import { getFeedbackTypeList, operateFeedback, getPicUrl } from '@/api/user'

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
      fileList: [],
      feedbackType: [],
      activeTag: '',
      imgList: []
    }
  },
  beforeRouteEnter(to, from, next) { // 从初始页面进入重置值为空
    next(vm => {
      if (from.name === 'me') {
        vm.message = '';
        vm.phone = '';
        vm.imgList = [];
      }
    });
  },
  activated() {
    this.getFeedbackTypeList();
  },
  methods: {
    async afterRead(file) { // 获取到对应的file对象
      if (Array.isArray(file)) { // 多张图片
        for (let i = 0; i < file.length; i++) {
          let formData = new FormData();
          formData.append('object', file[i].file);
          const data = await getPicUrl(formData);
          if (data.code != 0) return false;
          this.imgList.push(data.data);
        }
        return false;
      }
      // 单张图片上传
      let formData = new FormData();
      formData.append('object', file.file);
      getPicUrl(formData).then(res => {
        if (res.code != 0) return false;
        
        this.imgList.push(res.data);
      })
    },
    submit() { // 提交反馈意见
      operateFeedback({ content: this.message, feedbackCategoryId: this.activeTag, phone: this.phone, imgUrls: this.imgList.join(',') }).then(res => {
        if (res.code != 0) return false;

        this.$router.push({
          name: 'me-feedback-result'
        })
      })
    },
    async getFeedbackTypeList() {
      const typeListData = await getFeedbackTypeList();
      if (typeListData.code != 0) return false;

      this.feedbackType = typeListData.data;
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
.is-active{
  border-color: #42b7ae!important;
  color: #42b7ae;
}
</style>

<style lang="less">
.feedback-pic-field.van-cell::after{
  border-bottom: none;
}
</style>