<template>
  <!-- 快递单号 -->
  <div class="pt-46 bg-grey pb-20">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('fill_express_number')" :fixed="true" />

    <div class="plr-20 pt-20 bg-white">
      <div class="fs-14 black">{{ $t('express_number') }}</div>
      <van-field v-model="trackingNumber" :placeholder="$t('please_enter_the_express_number')" class="ptb-10 plr-0" :border="false" />
      <van-cell :title="$t('tospino_express')" is-link class="pt-10 pb-20 plr-0" :border="false" />
    </div>

    <div class="plr-20 mt-12 bg-white pt-20">
      <div class="fs-14 black">{{ $t('refund_message') }}</div>
      <van-field
        v-model="message"
        rows="2"
        :placeholder="$t('apply_for_instructions_tips_required')"
        type="textarea"
        class="plr-0"
        maxlength="170"
        :border="false"
      />

      <van-uploader class="mt-18" v-model="fileList" multiple :max-count="9" preview-size="1.58rem" :after-read="afterRead" @delete="onDeleteFile">
        <div class="custom-proof-upload tc">
          <van-icon name="plus" size="0.32rem" />
          <div class="mt-10 fs-12 lh-1">Up to 9 Pics</div>
        </div>
      </van-uploader>
      <p class="fs-14 orange mt-12">{{ $t('apply_after_sale_upload_tips') }}</p>

      <BmButton class="round-8 w-100 mt-100" :disabled="trackingNumber == '' || message == ''" @btnClick="onConfirm">{{ $t('submit') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { writeReturnOrder, getReturnDetail, updateLogisticsOrder } from '@/api/order';
import { Field, Uploader, Cell } from 'vant';
import { getPicUrl } from '@/api/user';

export default {
  middleware: 'authenticated',
  components: {
    vanField: Field,
    vanUploader: Uploader,
    vanCell: Cell
  },
  data() {
    return {
      trackingNumber: '',
      message: '',
      fileList: [],
      imgList: [],
      detail: {}
    }
  },
  activated() {
    if (this.$route.query.edit) {
      getReturnDetail(this.$route.params.id).then(res => {
        this.detail = res.data;
        this.message = res.data.deliveryNote;
        this.trackingNumber = res.data.deliverySn;
        this.fileList = res.data.deliveryPics.split(',').map(item => {
          return {
            url: item,
            isImage: true
          }
        });
        this.imgList = res.data.deliveryPics.split(',');
      })
    }
  },
  methods: {
    async afterRead(file) { // 上传图片
      if (Array.isArray(file)) { // 多张图片
        for (let i = 0; i < file.length; i++) {
          let formData = new FormData();
          formData.append('object', file[i].file);
          const data = await getPicUrl(formData);
          if (data.code != 0) return false;

          this.imgList.push(data.data);
        }
      } else {
        // 单张图片上传
        let formData = new FormData();
        formData.append('object', file.file);
        const data = await getPicUrl(formData);
        if (data.code != 0) return false;

        this.imgList.push(data.data);
      }
      
      this.fileList = this.imgList.map(item => {
        return {
          url: item,
          isImage: true
        }
      });
    },
    onConfirm() { // 提交
      const deliveryPics = this.imgList.length > 0 ? this.imgList.join(',') : [];
      if (this.$route.query.edit) {
        updateLogisticsOrder({ deliveryNote: this.message, deliveryPics: deliveryPics, deliverySn: this.trackingNumber, orderReturnId: this.$route.params.id }).then(() => {
          this.$router.go(-1);
        })
      } else {
        writeReturnOrder({ deliveryNote: this.message, orderReturnId: this.$route.params.id, deliverySn: this.trackingNumber, deliveryPics: deliveryPics }).then(() => {
          this.$router.go(-1);
        })
      }
    },
    onDeleteFile() { // 删除选择的图片
      this.imgList = this.fileList.map(item => {
        return item.url;
      })
    },
  },
}
</script>

<style lang="less" scoped>
.custom-proof-upload{
  padding: 23px 6px 15px;
  border: 1px dashed #ccc;
  border-radius: 3.5px;
  color: #ccc;
}
.mt-100{
  margin-top: 100px;
}
</style>