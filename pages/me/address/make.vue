<template>
  <!-- 我的-设置-新建收货地址 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true, url: '/me/address' }" :title="$t('me.address.shipAddress')">
      <div slot="header-right" class="green" @click="deleteFn" v-if="$route.query.id">
        {{ $t('common.delete') }}
      </div>
    </BmHeaderNav>

    <!-- 收货地址 -->
    <div class="bg-white">
      <!-- 收货人姓名 -->
      <van-field v-model="form.name" class="p-20" placeholder="The consignee" />
      <!-- 收货人电话号码 -->
      <van-field
        v-model="form.phone"
        placeholder="Phpne number"
        class="p-20"
        type="tel"
      >
        <template #right-icon>
          <nuxt-link class="flex grey" :to="{ name: 'me-address-areacode' }">
            {{ form.phonePrefix }}
            <van-icon name="arrow" />
          </nuxt-link>
        </template>
      </van-field>
      <!-- 收货人地址 -->
      <van-field
        v-model="allAddress"
        placeholder="Address"
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
        placeholder="Detailed address:such as road,building number..."
      />
      <!-- 标签 -->
      <van-field v-model="form.tag" label="文本" label-width="0.72rem">
        <template #input>
          <div class="flex flex-wrap">
            <div :class="{'fs-14 plr-12 bg-orange round-8 tag mr-12 mb-20': true, 'active': form.tag == (index + 1)}" v-for="tag, index in $t('me.address.tag')" :key="index" @click="form.tag = (index + 1)">{{ tag }}</div>
            <!-- 添加标签按钮 -->
            <div @click="isEmit = 1" v-if="isEmit === 0" class="mb-20 bg-orange round-8 tag plr-24">+</div>
            <!-- 添加标签时的展示样式 -->
            <van-field
              v-model="form.tagEditor"
              placeholder="Input label name"
              :class="{'p-0 border round-8 hidden custom-field mb-20 vcenter': true}"
              v-else-if="isEmit === 1"
            >
              <template #button>
                <van-button size="small" type="primary" :class="{'bg-grey': form.tagEditor.length === 0, 'bg-green': form.tagEditor.length > 0}" @click="isEmit = 2">Add</van-button>
              </template>
            </van-field>
            <!-- 添加之后的标签展示样式 -->
            <div :class="{'flex round-8 border mb-20 hidden': true, 'border-green': form.tag == form.tagEditor}" v-else-if="isEmit === 2">
              <span :class="{'plr-12 fs-14 ptb-3': true, 'green': form.tag == form.tagEditor}" @click="form.tag = form.tagEditor">{{ form.tagEditor }}</span>
              <span class="plr-12 fs-14 bg-green white ptb-3" @click="isEmit = 1">editor</span>
            </div>
          </div>
        </template>
      </van-field>
      <!-- 设置默认地址 -->
      <van-cell title="Set as the default adress" label="Reminder: This address is recommended by default for each order" title-class="black" class="p-20" >
        <template #right-icon>
          <van-switch v-model="form.isDefault" active-color="#34C759" inactive-color="#dcdee0" size="0.45rem" />
        </template>
      </van-cell>
    </div>
    <!-- 添加地址 -->
    <div class="mlr-20 pb-20">
      <BmButton class="round-8 w-100 save-btn" @click="save" :disabled="isDisabled">{{ $t('me.address.addShipAddressBtn') }}</BmButton>
    </div>

    <!-- 修改地址 -->
    <van-popup v-model="addressShow" position="bottom" closeable class="ptb-20" style="min-height: 80%;">
      <h4 class="fs-18 black lh-20 tc plr-20">Choose a country or region</h4>
      <!-- 地址选择步骤条 -->
      <van-steps direction="vertical" :active="stepActive" class="mt-24" @click-step="stepClick">
        <van-step v-for="item, stepIndex in stepArr" :key="stepIndex">
          <template #active-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <template #inactive-icon>
            <BmIcon :name="'dot1'" :color="'#eee'"></BmIcon>
            <!-- <van-icon name="circle" color="#42b7ae" size="0.1rem" /> -->
          </template>
          <template #finish-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <!-- <p class="fs-16 black">{{ item.title ? item.title : item.desc }}</p> -->
          <p class="fs-16 black">{{ item.name ? item.name : chooseTitle }}</p>
        </van-step>
        <van-step v-if="isShowChooseTitle">
          <template #active-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <template #inactive-icon>
            <BmIcon :name="'dot1'" :color="'#eee'"></BmIcon>
            <!-- <van-icon name="circle" color="#42b7ae" size="0.1rem" /> -->
          </template>
          <template #finish-icon>
            <BmIcon :name="'dot1'" :color="'#42b7ae'"></BmIcon>
          </template>
          <p class="fs-16 black">{{ chooseTitle }}</p>
        </van-step>
      </van-steps>
      <div class="border-b mt-10 w-100"></div>
      <!-- 进行选择 -->
      <div class="mt-20 plr-24">
        <p class="fs-14 grey-1">{{ chooseTitle }}</p>
        <ul class="plr-24 fs-16 black">
          <li class="mt-20" v-for="city, cityIndex in chooseList" :key="cityIndex" @click="changeCity(city)">{{ city.name }}</li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Switch, Popup, Step, Steps } from 'vant';
import { getPhonePrefix } from '@/api/login';
import { addAddress, getAreasTree, getAddressDetail, getNextArea } from '@/api/address';

export default {
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
      stepActive: -1,
      stepArr: [],
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
      chooseList: [],
      addressList: [],
      isShowChooseTitle: true,
      chooseAddress: {},
      allAddress: ''
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
    },
    chooseTitle() {
      if (this.form.countryCode === '') {
        return '选择国家';
      }
      if (this.form.provinceCode === '') {
        return '选择州/省/地区';
      }
      if (this.form.cityCode === '') {
        return '选择城市';
      }
      return '选择街道或城镇';
    }
  },
  activated() {
    // 获取手机号前缀
    if (this.$route.query.phonePrefix) {
      this.form.phonePrefix = this.$route.query.phonePrefix;
    } else {
      this.getPhonePrefix();
    }

    // 修改地址时要先获取用户的数据
    if (this.$route.query.id) {
      this.getAddressDetail();
    } else {
      // 获取地区树
      this.getAreasTree();
    }
  },
  methods: {
    save() { // 新增/修改地址
      let _form = Object.assign({}, this.form);
      if (_form.tag == '') delete _form.tag;
      if (_form.tagEditor == '') delete _form.tagEditor;
      if (this.$route.query.id) { // 修改地址的时候需要传
        _form = {
          ..._form,
          id: this.$route.query.id
        }
      }

      addAddress(_form).then(() => {
        // 地址保存成功跳转到地址列表页面
        this.$router.replace({
          name: 'me-address'
        })
      })
    },
    deleteFn() { // 删除地址
      this.$dialog.confirm({
        title: this.$t('me.address.deleteTitle'),
        message: this.$t('me.address.deleteMessage'),
        confirmButtonText: this.$t('common.yes'),
        confirmButtonColor: '#42B7AE',
        cancelButtonText: this.$t('common.no'),
        cancelButtonColor: '#383838'
      }).then(res => { // 提交接口

      }).catch(() => {

      })
    },
    stepClick(step) { // step点击事件
      if (step == this.stepArr.length && this.isShowChooseTitle) return false;
      this.chooseList = step == 0 ? this.addressList : this.stepArr[step-1].aresChilds;
      this.stepArr.splice(step, this.stepActive + 1);
      this.stepActive = step;
      this.isShowChooseTitle = true;
      
      if (this.step == 0) { // 国家
        this.form.countryCode = '';
        this.form.provinceCode = '';
        this.form.cityCode = '';
        this.form.districtCode = '';
      }
      if (this.stepActive == 1) { // 省份
        this.form.provinceCode = '';
        this.form.cityCode = '';
        this.form.districtCode = '';
      }
      if (this.stepActive == 2) { // 市
        this.form.cityCode = '';
        this.form.districtCode = '';
      }
      if (this.stepActive == 3) { // 区/街道
        this.form.districtCode = '';
      }
    },
    changeCity(city) { // 选择城市
      console.log(city)
      if (this.stepActive == 0) { // 国家
        this.form.countryCode = city.code;
        this.chooseAddress.country = city.name;
      }
      if (this.stepActive == 1) { // 省份
        this.form.provinceCode = city.code;
        this.chooseAddress.province = city.name;
      }
      if (this.stepActive == 2) { // 市
        this.form.cityCode = city.code;
        this.chooseAddress.city = city.name;
      }
      if (this.stepActive == 3) { // 区/街道
        this.form.districtCode = city.code;
        this.chooseAddress.district = city.name;
      }
      if (this.stepActive == 3) {
        this.stepArr.splice(this.stepActive, 1, city);
        this.addressShow = false;
        this.isShowChooseTitle = false;
        let _address = '';
        for (const key in this.chooseAddress) {
          _address += this.chooseAddress[key];
        }
        this.allAddress = _address;
        return false;
      }
      this.stepArr.push(city);
      this.stepActive += 1;

      // 格式化数据列表
      let arr = [];
      this.chooseList.map(item => {
        if (city.code == item.code) {
          arr = item.aresChilds;
        }
      })
      if (arr.length === 0) {
        this.addressShow = false;
        this.isShowChooseTitle = false;
        let _address = '';
        for (const key in this.chooseAddress) {
          _address += this.chooseAddress[key];
        }
        this.allAddress = _address;
        return false;
      }
      this.chooseList = arr;
    },
    getPhonePrefix() { // 获取手机号前缀
      getPhonePrefix().then(res => {
        this.phonePrefixs = res.data;
        this.form.phonePrefix = res.data[0].phonePrefix;
      })
    },
    getAreasTree() { // 获取地区树
      getAreasTree().then(res => {
        this.addressList = res.data;
        this.chooseList = res.data;
        
        let arr = [];
        this.addressList.map(country => { // 国家
          if (country.code == this.stepArr[0].code) {
            arr.push(country);
            this.chooseAddress.country = country.name;
            if (country.aresChilds.length > 0 && this.stepArr[1]) {
              country.aresChilds.map(province => { // 省
                if (province.code == this.stepArr[1].code) {
                  arr.push(province);
                  this.chooseAddress.province = province.name;
                   if (province.aresChilds.length > 0 && this.stepArr[2]) {
                     province.aresChilds.map(city => { // 市
                      if (city.code == this.stepArr[2].code) {
                        arr.push(city);
                        this.chooseAddress.city = city.name;
                        if (city.aresChilds.length > 0 && this.stepArr[3]) {
                          city.aresChilds.map(district => { // 区
                            if (district.code == this.stepArr[3].code) {
                              arr.push(district);
                              this.chooseAddress.district = district.name;
                            }
                          })
                        }
                      }
                     })
                   }
                }
              })
            }
          }
        })

        this.stepArr = arr;
        this.chooseList = [arr[arr.length - 1]];
      })
    },
    getAddressDetail() { // 查看地址信息
      getAddressDetail(this.$route.query.id).then(res => {
        this.allAddress = res.data.completeAddress
        this.form = {
          name: res.data.name,
          phone: res.data.phone,
          phonePrefix: res.data.phonePrefix,
          address: res.data.address, // 详细地址
          countryCode: res.data.countryCode, //国家编码
          provinceCode: res.data.provinceCode, // 省份编码
          cityCode: res.data.cityCode, // 市编码
          districtCode: res.data.districtCode, //区编码
          isDefault: res.data.isDefault, // 是否为默认地址
          tag: res.data.tag, // 标签
          tagEditor: res.data.tagEditor, // 自定义标签
        }

        this.stepArr = res.data.areaList;
        this.stepActive = res.data.areaList.length - 1;
        this.isShowChooseTitle = false;

        this.getAreasTree();
      })
    },
    chooseAddressFn() {
      this.addressShow = true;
    },
    addressFormat(arr, step) {
      return arr.map(item => {
        return item.aresChilds;
      })
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
  margin-top: 116px;
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