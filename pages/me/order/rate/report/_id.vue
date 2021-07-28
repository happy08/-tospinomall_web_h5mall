<template>
  <!-- 我的-订单-评价-举报 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.report.report')">
      <div slot="header-right" class="green fs-14" @click="onConfirm">{{ $t('common.confirm') }}</div>
    </BmHeaderNav> 

    <!-- 原因选择 -->
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in $t('me.report.reason')"
          clickable
          :key="index"
          class="p-20"
        >
          <template #icon>
            <van-radio :name="index" class="w-100">
              <template #icon="props">
                <BmImage
                  :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
                  :width="'0.34rem'" 
                  :height="'0.34rem'"
                  :isLazy="false"
                  :isShow="false"
                ></BmImage>
              </template>
              <p class="black fs-14">{{ item }}</p>
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
        :placeholder="$t('me.report.supplementTip')"
        class="border round-8"
      />
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Cell, CellGroup, Field } from 'vant';

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
      message: ''
    }
  },
  methods: {
    onConfirm() { // 提交

    }
  },
}
</script>