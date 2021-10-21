<template>
  <!-- 我的-订单-评价-举报 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('report')" /> 

    <!-- 原因选择 -->
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in reasonList"
          clickable
          :key="index"
          class="p-20"
        >
          <template #icon>
            <van-radio :name="item.id" class="w-100">
              <template #icon="props">
                <BmImage
                  :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                  :width="'0.32rem'" 
                  :height="'0.32rem'"
                  :isLazy="false"
                  :isShow="false"
                  :alt="'Tospino choose icon'"
                />
              </template>
              <p class="black fs-14">{{ item.description }}</p>
            </van-radio>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <div class="mt-20 mlr-20">
      <van-field
        v-model="message"
        rows="5"
        type="textarea"
        :placeholder="$t('can_supplement_your_complaint_content_optional')"
        class="border round-8"
      />
      <!-- 提交 -->
      <BmButton class="fs-14 round-8 w-100 mt-20" :disabled="radio == 0" @btnClick="onConfirm">{{ $t('submit') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Cell, CellGroup, Field } from 'vant';
import { getDictList } from '@/api/user';
import { reportEvaluate } from '@/api/product';

export default {
  middleware: 'authenticated',
  components: {
    vanRadio: Radio,
    vanRadioGroup: RadioGroup,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanField: Field
  },
  data() {
    return {
      radio: 0,
      message: '',
      reasonList: []
    }
  },
  activated() {
    getDictList('product_goods_evaluate_scene').then(res => {
      this.reasonList = res.data;
    }).catch(error => {
      console.log(error);
    })
  },
  methods: {
    onConfirm() { // 提交
      let reportingScene = this.reasonList.filter(item => { // 举报场景
        return item.id == this.radio;
      })[0].value;
      reportEvaluate({ evaluateId: this.$route.params.id, reportingContent: this.message, reportingScene: reportingScene }).then(res => {
        this.$router.go(-1);
      }).catch(error => {
        console.log(error);
      })
    }
  },
}
</script>