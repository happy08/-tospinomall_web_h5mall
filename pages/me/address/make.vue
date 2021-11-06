<template>
  <!-- 我的-设置-新建收货地址 -->
  <div class="bg-grey v-percent-100 pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('shipping_address')" :fixed="true">
      <div slot="header-right" class="green" @click="deleteFn" v-if="$route.query.id">
        {{ $t('delete') }}
      </div>
    </BmHeaderNav>

    <!-- 收货地址 -->
    <div class="bg-white">
      <!-- 收货人姓名 -->
      <van-field v-model="form.name" class="p-20" :placeholder="$t('the_consignee')" maxlength="30" />
      <!-- 收货人电话号码 -->
      <van-field
        v-model="form.phone"
        :placeholder="$t('phone_number')"
        class="p-20"
        type="number"
        maxlength="20"
      >
        <template #right-icon>
          <nuxt-link class="flex grey" replace :to="{ name: 'me-address-areacode', query: $route.query }">
            {{ form.phonePrefix }}
            <van-icon name="arrow" />
          </nuxt-link>
        </template>
      </van-field>
      <!-- 收货人地址 -->
      <van-field
        v-model="allAddress"
        :placeholder="$t('region')"
        class="p-20"
        @click="chooseAddressFn"
      >
        <template #right-icon>
          <div class="flex">
            <van-icon name="location-o" class="mr-4" />
            <van-icon name="arrow" />
          </div>
        </template>
      </van-field>
      <!-- 详细地址 -->
      <van-field
        v-model="form.address"
        rows="4"
        type="textarea"
        class="p-20"
        :placeholder="$t('detailde_address_such_as_road_building_number')"
        maxlength="255"
      />
      <!-- 标签 -->
      <van-field v-model="form.tag" :label="$t('label')" label-width="0.72rem">
        <template #input>
          <div class="flex flex-wrap">
            <div :class="{'fs-14 plr-12 bg-orange round-8 tag mr-12 mb-20': true, 'active': form.tag == (index + 1)}" v-for="tag, index in $t('address_tag')" :key="index" @click="form.tag = (index + 1)">{{ tag }}</div>
            <!-- 添加标签按钮 -->
            <div @click="isEmit = 1" v-if="isEmit === 0" class="mb-20 bg-orange round-8 tag plr-24">+</div>
            <!-- 添加标签时的展示样式 -->
            <van-field
              v-model.trim="form.tagEditor"
              :placeholder="$t('input_label_name')"
              :class="{'p-0 border round-8 hidden custom-field mb-20 vcenter': true}"
              v-else-if="isEmit === 1"
            >
              <template #button>
                <van-button size="small" type="primary" :class="{'bg-grey': form.tagEditor == '', 'bg-green': form.tagEditor != ''}" :disabled="form.tagEditor == ''" @click="onAddTag">{{ $t('add') }}</van-button>
              </template>
            </van-field>
            <!-- 添加之后的标签展示样式 -->
            <div :class="{'flex round-8 border mb-20 hidden': true, 'border-green': form.tag == form.tagEditor}" v-else-if="isEmit === 2">
              <span :class="{'plr-12 fs-14 ptb-3': true, 'green': form.tag == form.tagEditor}" @click="form.tag = form.tagEditor">{{ form.tagEditor }}</span>
              <span class="plr-12 fs-14 bg-green white ptb-3" @click="isEmit = 1">{{ $t('edit') }}</span>
            </div>
          </div>
        </template>
      </van-field>
      <!-- 设置默认地址 -->
      <van-cell :title="$t('set_as_the_default_address')" :label="$t('set_default_order_tip')" title-class="black" class="p-20" >
        <template #right-icon>
          <van-switch v-model="form.isDefault" active-color="#34C759" inactive-color="#dcdee0" size="0.45rem" />
        </template>
      </van-cell>
    </div>
    <!-- 添加地址 -->
    <div class="mlr-20 pb-20">
      <BmButton class="round-8 w-100 save-btn" @click="save" :disabled="isDisabled">{{ $t('save') }}</BmButton>
    </div>

    <!-- 修改地址 -->
    <BmAddress :stepArr.sync="stepArr" :addressShow.sync="addressShow" @close="closePopup" :haveAddress="haveAddress"></BmAddress>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Switch, Popup, Step, Steps } from 'vant';
import { getPhonePrefix } from '@/api/login';
import { addAddress, getAddressDetail, updateAddress, deleteAddress } from '@/api/address';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanSwitch: Switch,
    vanPopup: Popup,
    vanStep: Step,
    vanSteps: Steps
  },
  data() {
    return {
      isEmit: 0, // 0 需要添加 1 添加中 2添加完成
      addressShow: false,
      stepArr: [],
      assgnStepList: [],
      phonePrefixs: [],
      form: {
        name: '',
        phone: '',
        phonePrefix: '',
        address: '', // 详细地址
        countryCode: '', //国家编码
        provinceCode: '', // 省份编码
        cityCode: '', // 市编码
        districtCode: '', //区编码
        isDefault: 0, // 是否为默认地址
        tag: '', // 标签
        tagEditor: '', // 自定义标签
      },
      allAddress: '',
      haveAddress: {}
    }
  },
  computed: {
    isDisabled() {
      let emptyArr = [];
      for (const key in this.form) {
        if (key !== 'tag' && key !== 'tagEditor' && this.form[key].length == 0) {
          emptyArr.push(key)
        }
      }
      return emptyArr.length > 0 ? true : false;
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'me-address-areacode') { // 从选择手机号前缀页面回退
        vm.form = {
          name: '',
          phone: '',
          phonePrefix: '',
          address: '', // 详细地址
          countryCode: '', //国家编码
          provinceCode: '', // 省份编码
          cityCode: '', // 市编码
          districtCode: '', //区编码
          isDefault: false, // 是否为默认地址
          tag: '', // 标签
          tagEditor: '', // 自定义标签
        }
        vm.allAddress = '';
        vm.stepArr = [];
      }
    });
  },
  activated() {
    // 修改地址时要先获取用户的数据
    if (this.$route.query.id) {
      this.getAddressDetail();
    } else { // 新建页面
      this.isEmit = 0;
      // 获取手机号前缀
      if (this.$route.query.phonePrefix) {
        this.form.phonePrefix = this.$route.query.phonePrefix;
      } else {
        this.getPhonePrefix();
      }
      this.haveAddress = {}; // 新建页面没有地址
    }
  },
  methods: {
    save() { // 新增/修改地址
      let _form = {
        ...this.form,
        isDefault: this.form.isDefault ? 1 : 0
      };
      if (_form.tag == '') delete _form.tag;
      if (_form.tagEditor == '') delete _form.tagEditor;
      if (_form.tag === _form.tagEditor) _form.tag = '';

      if (this.$route.query.id) { // 修改地址的时候需要传
        _form = {
          ..._form,
          id: this.$route.query.id
        }
      }
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      
      let _ajax = this.$route.query.id ? updateAddress(_form) : addAddress(_form);
      _ajax.then(() => {
        this.$toast.clear();
        // 地址保存成功跳转到地址列表页面
        this.$router.go(-1);
      }).catch(error => {
        console.log(error);
      })
    },
    deleteFn() { // 删除地址
      this.$dialog.confirm({
        title: this.$t('are_you_sure_to_delete_the_address'),
        message: this.$t('delete_address_tip'),
        confirmButtonText: this.$t('confirm'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('cancel'),
        cancelButtonColor: '#383838'
      }).then(res => { // 提交接口
        deleteAddress(this.$route.query.id).then(res => {
          this.$router.go(-1);
        })
      }).catch(error => {
        console.log(error);
      })
    },
    getPhonePrefix() { // 获取手机号前缀
      getPhonePrefix().then(res => {
        this.phonePrefixs = res.data;
        this.form.phonePrefix = this.$t('prefix_tip');
      }).catch(error => {
        console.log(error);
      })
    },
    getAddressDetail() { // 查看地址信息
      getAddressDetail(this.$route.query.id).then(res => {
        this.allAddress = res.data.completeAddress;
        this.form = {
          name: res.data.name,
          phone: res.data.phone,
          phonePrefix: res.data.phonePrefix,
          address: res.data.address, // 详细地址
          countryCode: res.data.countryCode, //国家编码
          provinceCode: res.data.provinceCode, // 省份编码
          cityCode: res.data.cityCode, // 市编码
          districtCode: res.data.districtCode, //区编码
          isDefault: res.data.isDefault == 1 ? true : false, // 是否为默认地址
          tag: res.data.tagEditor ? res.data.tagEditor : res.data.tag, // 标签
          tagEditor: res.data.tagEditor, // 自定义标签
        }

        this.isEmit = res.data.tagEditor ? 2 : 0;
        // 获取手机号前缀
        if (this.$route.query.phonePrefix) {
          this.form.phonePrefix = this.$route.query.phonePrefix;
        }

        this.stepArr = res.data.areaList;
        this.assgnStepList = res.data.areaList;
        // 获取地址的时候默认是最后一级
        this.haveAddress = res.data.areaList[res.data.areaList.length - 2];
      }).catch(error => {
        console.log(error);
      })
    },
    chooseAddressFn() {
      this.addressShow = true;
    },
    addressFormat(arr, step) {
      return arr.map(item => {
        return item.aresChilds;
      })
    },
    closePopup(form, completeAddress) { // 关闭修改地址弹窗时触发, 数据处理
      if (form) {
        this.allAddress = completeAddress;
        this.form = {
          ...this.form,
          ...form
        };
      }
    },
    onAddTag() {
      this.isEmit = 2;
      this.form.tag = this.form.tagEditor;
    }
  },
}
</script>

<style lang="less" scoped>
.tag{
  border: 1px solid #BFBFBF;
  background-color: #fff;
  color: #666;
  padding-top: 6px;
  padding-bottom: 6px;
  line-height: 18px;
  height: 32px;
  &.active{
    background-color: rgba(66, 183, 174, 0.05);
    border: 1px solid #42B7AE;
    color: #42B7AE;
  }
}
.save-btn{
  margin-top: 70px;
}
.border-green{
  border: 1px solid #42B7AE!important;
}
.ptb-3{
  padding-top: 3px;
  padding-bottom: 3px;
}
.mt-42{
  margin-top: 42px;
}
.grey-1{
  color: #909AA2;
}
</style>

<style lang="less">
.custom-field{
  width: 256px;
  height: 32px;
  .van-button{
    width: 60px;
    height: 32px;
    border: none;
  }
  .van-field__control{
    padding-left: 10px;
  }
}
</style>