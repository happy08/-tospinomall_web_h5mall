<template>
  <!-- 我的-售后详情-举证 -->
  <div class="vh-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.afterSale.negotiationHistory')" />
    <van-notice-bar text="超时未举证平台将根据现有证据判定" background="#FACE91" color="#fff" />

    <div class="bg-white plr-16 pt-16 pb-30">
      <!-- 倒计时 -->
      <div class="red fs-14 fw">Countdown 23:59:00</div>

      <!-- 申诉原因 -->
      <div class="fs-14 mt-30">
        <span class="black">申诉原因：</span>
        <span class="light-grey ml-12">Commodity quality problem</span>
      </div>

      <!-- 补充问题描述 -->
      <div class="mt-30">
        <p class="fs-14 black">补充问题描述：</p>
        <van-field
          v-model="question"
          rows="6"
          type="textarea"
          placeholder="请输入..."
          class="mt-10 bg-f8 fs-14"
        />
      </div>

      <!-- 上传图片 -->
      <div class="mt-18">
        <h3 class="black fs-14">上传图片（不多于5张）</h3>
        <p class="mt-12 light-grey">*必须凭证：清晰退货内容物语牵手底单合同物流红章或者空包视频</p>
        <van-uploader class="mt-18" v-model="fileList" multiple :max-count="5" preview-size="1.58rem">
          <div class="custom-proof-upload tc">
            <van-icon name="plus" size="0.32rem" />
            <div class="mt-10 fs-12 lh-1">Up to 5 Pics</div>
          </div>
        </van-uploader>
        <p class="fs-14 orange mt-10">上传凭证：在拖货钱有损坏的商品的相关字迹的聊天截图</p>
      </div>
    </div>

    <div class="mlr-20 mt-16">
      <BmButton class="round-8 w-100">{{ $t('me.order.continueShop') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { NoticeBar, Field, Uploader } from 'vant';

export default {
  components: {
    vanNoticeBar: NoticeBar,
    vanField: Field,
    vanUploader: Uploader
  },
  data() {
    return {
      question: '',
      fileList: [
        { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
        { url: 'https://cloud-image', isImage: true },
      ],
    }
  }
}
</script>

<style lang="less" scoped>
.mt-18{
  margin-top: 18px!important;
}
.bg-f8{
  background-color: #F8F8F8!important;
}
.custom-proof-upload{
  padding: 23px 7px 15px 6px;
  border: 1px dashed #ccc;
  border-radius: 3.5px;
  color: #ccc;
}
</style>