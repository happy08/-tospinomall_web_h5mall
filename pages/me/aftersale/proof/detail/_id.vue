<template>
  <!-- 举证详情 -->
  <div class="pt-46">
    <BmHeaderNav :left="{ isShow: true }" title="举证详情" :fixed="true"/>

    <div class="plr-16 pt-16 pb-30">
      <!-- 申诉原因 -->
      <div class="fs-14 flex">
        <div class="black">申诉原因：</div>
        <p class="ml-12">{{ detail.workName }}</p>
      </div>

      <div v-for="(workItem, workIndex) in detail.omsOrderReturnWorkAlleges" :key="workIndex">
        <!-- 补充问题描述 -->
        <div class="mt-30">
          <p class="fs-14 black">补充问题描述：</p>
          <p class="mt-12">{{ workItem.workDesc }}</p>
        </div>

        <!-- 图片展示 -->
        <div class="mt-30">
          <h3>上传图片（不多于5张）</h3>
          <p class="mt-12 light-grey">*必须凭证：清晰退货内容物语牵手底单合同物流红章或者空包视频</p>
          <div class="flex flex-wrap">
            <BmImage
              v-for="(item, index) in workItem.workMustVoucher"
              :key="'must-' + index"
              :url="item"
              :width="'2.12rem'" 
              :height="'2.12rem'"
              :isLazy="false"
              :isShow="false"
              :class="{'border mt-10 round-2': true, 'ml-8': index % 3 != 0}"
            />
          </div>

          <template v-if="workItem.workOptionalVoucher.length > 0">
            <p class="mt-12 light-grey">可选凭证：在换货前有损坏的商品的相关字迹的聊天截图</p>
            <div class="flex flex-wrap">
              <BmImage
                v-for="(item, index) in workItem.workOptionalVoucher"
                :key="'must-' + index"
                :url="item"
                :width="'2.12rem'" 
                :height="'2.12rem'"
                :isLazy="false"
                :isShow="false"
                :class="{'border mt-10 round-2': true, 'ml-8': index % 3 != 0}"
              />
            </div>
          </template>
        </div>

        <!-- 提交时间 -->
        <div class="fs-14 mt-20 flex">
          <div class="black">提交时间：</div>
          <p class="ml-4 light-grey">{{ workItem.createTime }}</p>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { returnWorkDetail } from '@/api/order';

export default {
  data() {
    return {
      detail: {}
    }
  },
  activated() {
    returnWorkDetail(this.$route.params.id).then(res => {
      this.detail = {
        ...res.data,
        omsOrderReturnWorkAlleges: res.data.omsOrderReturnWorkAlleges.map(item => {
          return {
            ...item,
            workMustVoucher: item.workMustVoucher.split(','),
            workOptionalVoucher: item.workOptionalVoucher !== '' ? item.workOptionalVoucher.split(',') : []
          }
        })
      };
    })
  }
}
</script>