<template>
  <van-popup v-model="showPopup" position="bottom" closeable class="pt-20" style="height: 80%;" @close="closePopup">
    <h4 class="fs-18 black lh-20 tc plr-20 pb-10">{{ $t('choose_a_country_or_region') }}</h4>

    <div class="address-container-height">
      <!-- 地址选择步骤条 -->
      <van-steps direction="vertical" :active="stepActive" class="mt-14" @click-step="stepClick">
        <van-step v-for="item, stepIndex in stepArr" :key="stepIndex">
          <template #active-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <template #inactive-icon>
            <BmIcon :name="'dot1'" :color="'#eee'"></BmIcon>
          </template>
          <template #finish-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <p class="fs-16 black">{{ item.name ? item.name : chooseTitle }}</p>
        </van-step>
        <van-step v-if="isShowChooseTitle">
          <template #active-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <template #inactive-icon>
            <BmIcon :name="'dot1'" :color="'#eee'"></BmIcon>
          </template>
          <template #finish-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <p class="fs-16 black">{{ chooseTitle }}</p>
        </van-step>
      </van-steps>
      <div class="border-b mt-10 w-100"></div>
      <!-- 进行选择 -->
      <div class="mt-20 plr-24 pb-10">
        <p class="fs-14 grey-1">{{ chooseTitle }}</p>
        <ul class="plr-24 fs-16 black">
          <li :class="{'mt-20': true, 'green': stepArr.length > 0 && city.id == stepArr[stepArr.length - 1].id}" v-for="city, cityIndex in chooseList" :key="cityIndex" @click="changeCity(city)">{{ city.name }}</li>
        </ul>
      </div>
    </div>
    
  </van-popup>
</template>

<script>
import { Popup, Step, Steps } from 'vant';
import { getNextArea } from '@/api/address';

export default {
  name: 'BmAddress',
  components: {
    vanPopup: Popup,
    vanStep: Step,
    vanSteps: Steps
  },
  props: {
    stepArr: {
      type: Array,
      default: []
    },
    addressShow: {
      type: Boolean,
      default: false
    },
    haveAddress: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      stepActive: -1,
      isShowChooseTitle: true,
      isNext: true,
      form: {
        countryCode: '', //国家编码
        provinceCode: '', // 省份编码
        cityCode: '', // 市编码
        districtCode: '', //区编码
      },
      chooseList: [],
      showPopup: false
    }
  },
  watch: {
    addressShow(nVal, oVal) {
      this.showPopup = nVal;
      if (nVal) {
        if (Object.keys(this.haveAddress).length > 0) {
          this.getNextArea(this.haveAddress, false, true);
          this.isShowChooseTitle = false;
        } else if (this.stepArr.length == 0) {
          this.getNextArea({ id: 0 });
          this.isShowChooseTitle = true;
        }
        this.stepActive = this.stepArr.length - 1;
      }
    },
    stepArr(e) {
      this.stepActive = e.length - 1;
    }
  },
  computed: {
    chooseTitle() {
      if (this.stepArr.length == 0) {
        return this.$t('please_select_a_country');
      }
      if (this.stepArr.length == 1) {
        return this.$t('please_select_a_state_province_region');
      }
      if (this.stepArr.length == 2) {
        return this.$t('Please_select_city');
      }
      return this.$t('please_select_district_county');
    }
  },
  methods: {
    stepClick(step) {
      if (step == this.stepArr.length && this.isShowChooseTitle) return false;
      this.getNextArea(step == 0 ? {id: 0} : this.stepArr[step-1], 'step' + step); // 获取下一步选择
    },
    changeCity(city) { // 选择城市
      if (this.isNext == true) { // true 有下一级
        this.getNextArea(city, true);
      } else {
        this.$emit('update:addressShow', false);
        this.isShowChooseTitle = false;
        this.stepArr.splice(this.stepActive, 1, city);
      }
    },
    getNextArea(city, flag, isNext) {
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      getNextArea({ parentId: city.id }).then(res => {
        this.$toast.clear();
        if (res.data.length === 0) { // 没有下一级的数据处理
          if (!this.isNext) { // 已经是最后一级的话
            this.stepArr.splice(this.stepActive, 1, city);
          } else { // 如果还是true就要增加数据
            if (flag) { // 下一级处理
              this.stepActive += 1;
              this.stepArr.push(city);
            }
          }
          this.isNext = false;
          this.isShowChooseTitle = false;
          this.$emit('update:addressShow', false);
          return false;
        }
        this.isNext = isNext ? false : true;
        this.chooseList = res.data;

        if (flag == true) { // 下一级处理
          this.stepActive += 1;
          this.stepArr.push(city);
          return false;
        }

        if (flag && flag.indexOf('step') > -1) { // 点击跳转到选择的步骤
          this.stepArr.splice(flag.split('step')[1], this.stepActive + 1);
          this.stepActive = flag.split('step')[1] - 1;
          this.isShowChooseTitle = true;
          return false;
        }
      }).catch(error => {
        console.log(error);
      })
    },
    closePopup() { // 关闭修改地址弹窗时触发, 数据处理
      this.$emit('update:addressShow', false);
      if (!this.isNext) {
        let assgnStepList = this.stepArr; // 更新地址数据
        let _address = '';
        this.stepArr.map(item => {
          _address += item.name;
        })

        this.form = {
          ...this.form,
          countryCode: assgnStepList[0] ? assgnStepList[0].code : '',
          provinceCode: assgnStepList[1] ? assgnStepList[1].code : '',
          cityCode: assgnStepList[2] ? assgnStepList[2].code : '',
          districtCode: assgnStepList[3] ? assgnStepList[3].code : ''
        };
        
        this.$emit('close', this.form, _address);
      }
    },
  }
}
</script>

<style lang="less" scoped>
.address-container-height{
  height: calc(100% - 30px);
  overflow: scroll;
}
</style>