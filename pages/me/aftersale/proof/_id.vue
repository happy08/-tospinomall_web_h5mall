<template>
  <!-- 我的-售后详情-举证 -->
  <div class="v-percent-100 pt-46 pb-20">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('adducing_evidence')" :fixed="true" />
    <van-notice-bar :text="$t('provide_proof_overtime_tips')" background="#FACE91" color="#fff" />

    <div class="bg-white plr-16 pt-16 pb-30">
      <!-- 倒计时 -->
      <div class="red fs-14 flex flex-wrap vcenter fw" v-if="detail.surplusTime > 0">
        <span>{{ $t('refund_countdown') }}</span>
        <van-count-down :time="detail.surplusTime" :format="$t('count_down_format_label')" class="ml-4 red" />
      </div>

      <!-- 申诉原因 -->
      <div class="fs-14 mt-30 flex">
        <div class="black">{{ $t('appeal_reason_') }}</div>
        <p class="ml-12" v-if="$route.query.add">{{ detail.workName }}</p>
        <div class="ml-12 flex-1 flex between" v-else @click="isChooseReason = true">
          <p>{{ currentReason.applyReason }}</p>
          <van-icon name="arrow-down" />
        </div>
      </div>

      <!-- 补充问题描述 -->
      <div class="mt-30">
        <p class="fs-14 black">{{ $t('question_desc') }}</p>
        <van-field
          v-model="question"
          rows="6"
          type="textarea"
          :placeholder="$t('please_enter_')"
          class="mt-10 bg-f8 fs-14"
        />
      </div>

      <!-- 必须凭证 -->
      <div class="mt-18">
        <p class="mt-12 light-grey">{{ $t('necessary_certificate_tips') }}</p>
        <van-uploader class="mt-18" v-model="fileList" multiple :max-count="5" preview-size="1.58rem" :after-read="requireProof" @delete="onDeleteFile">
          <div class="custom-proof-upload tc">
            <van-icon name="plus" size="0.32rem" />
            <div class="mt-10 fs-12 lh-1">{{ $t('add_picture_5') }}</div>
          </div>
        </van-uploader>
      </div>

      <!-- 可选凭证 -->
      <div class="mt-18">
        <p class="mt-12 light-grey">{{ $t('upload_certificate_tips') }}</p>
        <van-uploader class="mt-18" v-model="fileChangeList" multiple :max-count="5" preview-size="1.58rem" :after-read="chooseProof" @delete="onDeleteChangeFile">
          <div class="custom-proof-upload tc">
            <van-icon name="plus" size="0.32rem" />
            <div class="mt-10 fs-12 lh-1">{{ $t('add_picture_5') }}</div>
          </div>
        </van-uploader>
      </div>
    </div>

    <div class="mlr-20 mt-16">
      <BmButton class="round-8 w-100" @btnClick="onConfirm">{{ $t('submit') }}</BmButton>
    </div>

    <!-- 举证原因选择 -->
    <van-popup v-model="isChooseReason" round position="bottom">
      <van-picker
        show-toolbar
        :columns="reasonList"
        @confirm="onReasonConfirm"
        @cancel="isChooseReason = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { NoticeBar, Field, Uploader, CountDown, Picker, Popup } from 'vant';
import { getReturnDetail, applyMallIntervene, returnWorkDetail, addToProof, getOrderReasonList } from '@/api/order';
import { getPicUrl } from '@/api/user';

export default {
  middleware: 'authenticated',
  components: {
    vanNoticeBar: NoticeBar,
    vanField: Field,
    vanUploader: Uploader,
    vanCountDown: CountDown,
    vanPicker: Picker,
    vanPopup: Popup
  },
  data() {
    return {
      question: '',
      fileList: [],
      fileChangeList: [],
      detail: {},
      reasonList: [],
      isChooseReason: false,
      currentReason: {},
      imgList: [],
      changeImgList: []
    }
  },
  async activated() {
    // 获取订单详情
    const detailData = await getReturnDetail(this.$route.params.id); // 主要获取倒计时
    this.detail = { // 订单详情
      ...detailData.data,
      surplusTime: detailData.data.surplusTime * 1000
    };

    if (this.$route.query.add) { // 追加举证
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      const returnData = await returnWorkDetail(this.$route.query.add);
      this.$toast.clear();
      this.detail = { // 订单详情
        ...this.detail,
        ...returnData.data
      };
      this.question = returnData.data.workDesc;
      this.imgList = returnData.data.omsOrderReturnWorkAlleges[0].workMustVoucher != '' ? returnData.data.omsOrderReturnWorkAlleges[0].workMustVoucher.split(',') : [];
      this.fileList = returnData.data.omsOrderReturnWorkAlleges[0].workMustVoucher != '' ? returnData.data.omsOrderReturnWorkAlleges[0].workMustVoucher.split(',').map(item => {
        return {
          url: item,
          isImage: true
        }
      }): []
      this.changeImgList = returnData.data.omsOrderReturnWorkAlleges[0].workOptionalVoucher != '' ? returnData.data.omsOrderReturnWorkAlleges[0].workOptionalVoucher.split(',') : [];
      this.fileChangeList = returnData.data.omsOrderReturnWorkAlleges[0].workOptionalVoucher != '' ? returnData.data.omsOrderReturnWorkAlleges[0].workOptionalVoucher.split(',').map(item => {
        return {
          url: item,
          isImage: true
        }
      }): []
    }
    
    
    // 获取举证原因
    getOrderReasonList({ orderType: 2, applyType: 0, goodsStatus: 0 }).then(res => {
      this.reasonList = res.data.map(item => {
        return {
          ...item,
          text: item.applyReason
        }
      });
    }).catch(error => {
      console.log(error);
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if ((from.name == 'me-aftersale-detail-id' || from.name == 'me-aftersale') && !to.query.add) {
        vm.imgList = [];
        vm.fileList = [];
      }
    })
  },
  methods: {
    onReasonConfirm(item) { // 确认选择原因
      this.currentReason = item;
      this.isChooseReason = false;
    },
    onConfirm() { // 提交举证
      if (!this.currentReason) {
        this.$toast(this.$t('choose_proof_reason'));
        return false;
      }
      if (this.question == '') {
        this.$toast(this.$t('proof_input_question'));
        return false;
      }
      if (this.fileList.length == 0) {
        this.$toast(this.$t('choose_proof_voucher'));
        return false;
      }

      let workMustVoucher = this.fileList.map(item => { // 必须凭证
        return item.url;
      })
      let workOptionalVoucher = this.fileChangeList.map(item => { // 可选凭证
        return item.url;
      })
      if (this.$route.query.add) {
        addToProof({ orderWorkId: this.$route.query.add, workDesc: this.question, workMustVoucher: workMustVoucher.join(','), workName: this.currentReason.applyReason, workOptionalVoucher: workOptionalVoucher.join(',') }).then(res => {
          this.fileList = [];
          this.imgList = [];
          this.$router.go(-1);
        }).catch(error => {
          console.log(error);
        })
      } else {
        applyMallIntervene({ returnApplyId: this.detail.id, workDesc: this.question, workMustVoucher: workMustVoucher.join(','), workName: this.currentReason.applyReason, workOptionalVoucher: workOptionalVoucher.join(',') }).then(() => {
          this.fileList = [];
          this.imgList = [];
          this.$router.go(-1);
        }).catch(error => {
          console.log(error);
        })
      }
      
    },
    async afterRead(file, type) { // 上传图片
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
            if (type == 1) {
              this.imgList.push(data.data);
            } else {
              this.changeImgList.push(data.data);
            }
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
          if (type == 1) {
            this.imgList.push(data.data);
          } else {
            this.changeImgList.push(data.data);
          }
        }
      }
      this.$toast.clear();
      if (type == 1) {
        this.fileList = this.imgList.map(item => {
          return {
            url: item,
            isImage: true
          }
        });
      }
      if (type == 2) {
        this.fileChangeList = this.changeImgList.map(item => {
          return {
            url: item,
            isImage: true
          }
        });
      }
    },
    requireProof(file) { // 必选凭证
      this.afterRead(file, 1);
    },
    chooseProof(file) { // 可选凭证
      this.afterRead(file, 2);
    },
    onDeleteFile() { // 删除选择的图片
      this.imgList = this.fileList.map(item => {
        return item.url;
      })
    },
    onDeleteChangeFile() {
      this.changeImgList = this.fileChangeList.map(item => {
        return item.url;
      })
    }
  },
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
.flex-1{
  flex: 1;
}
</style>