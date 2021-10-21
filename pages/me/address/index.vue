<template>
  <!-- 我的-设置-收货地址 -->
  <div class="pt-46 pb-10">
    <BmHeaderNav :left="{ isShow: true, isEmit: true }" :title="$t('harvest_address')" @leftClick="leftClick" :fixed="true" />
    <!-- 地址列表 -->
    <div class="p-20 address-single" v-for="(item, index) in lists" :key="index" @click="onClick(item)">
      <div class="flex between vcenter address-single__top">
        <div class="flex vcenter fm-helvetica">
          <!-- 标签 -->
          <span class="white fs-12 p-4 bg-orange round-4 lh-18 mr-4" v-show="item.isDefault">{{ $t('defaultText') }}</span>
          <span class="white fs-12 p-4 bg-green round-4 lh-18 mr-12" v-show="item.tag">{{ $t('address_tag')[item.tag-1] }}</span>
          <span class="white fs-12 p-4 bg-green round-4 lh-18 mr-12" v-show="item.tagEditor">{{ item.tagEditor }}</span>
          <!-- 姓名/手机号 -->
          <span class="black fs-14 lh-18">{{ item.name }}</span>
          <span class="black fs-14 lh-18 ml-10">{{ item.phone }}</span>
        </div>
        <div @click="onEdit(item)">
          <BmImage
            :url="require('@/assets/images/icon/edit-icon.svg')"
            :width="'0.48rem'" 
            :height="'0.48rem'"
            :isLazy="false"
            :isShow="false"
            :alt="'Tospino edit icon'"
          />
        </div>
      </div>
      <!-- 地址 -->
      <div class="mt-10 fs-14 black fm-helvetica word-break">{{ item.address }}</div>
      <div class="mt-10 fs-14 black fm-helvetica word-break">{{ item.completeAddress }}</div>
      <div class="mt-12 flex vcenter" @click="onSetDeafult(item.id)">
        <BmImage
          :url="item.isDefault ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
          :width="'0.32rem'" 
          :height="'0.32rem'"
          :isLazy="false"
          :isShow="false"
          :alt="'Tospino choose icon'"
        />
        <span :class="{'fm-helvetica fs-14 ml-8': true, 'red': item.isDefault}">{{ item.isDefault ? $t('defaultText'): $t('set_as_default') }}</span>
      </div>
    </div>

    <div class="mlr-20">
      <BmButton class="round-8 w-100 address-btn" @click="addAddress">{{ $t('add_shipping_address') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio } from 'vant';
import { getAddressList, updateDefaultAddress } from '@/api/address';

export default {
  middleware: 'authenticated',
  components: {
    vanRadioGroup: RadioGroup,
    vanRadio: Radio
  },
  data() {
    return {
      lists: []
    }
  },
  activated() {
    this.getAddressList();
  },
  methods: {
    addAddress() { // 添加收货地址
      this.$router.push({
        name: 'me-address-make'
      })
    },
    onEdit(address) { // 修改收货地址
      this.$router.push({
        name: 'me-address-make',
        query: {
          id: address.id
        }
      })
    },
    getAddressList() { // 获取地址列表
      getAddressList().then(res => {
        this.lists = res.data.map(item => {
          return {
            ...item,
            isDefault: item.isDefault == 1 ? true: false
          }
        })
      }).catch(error => {
        console.log(error);
      })
    },
    onSetDeafult(id) { // 设置默认地址
      updateDefaultAddress(id).then(() => {
        this.getAddressList();
      }).catch(error => {
        console.log(error);
      })
    },
    onClick(item) { // 主要是为了点击跳转返回售后申请页面
      if (!this.$route.query.back) {
        return false;
      }

      if (this.$route.query.cartOrderId) { // 确认订单页面
        this.$router.replace({
          name: 'cart-order-id',
          params: {
            id: this.$route.query.cartOrderId
          },
          query: {
            ...this.$route.query.otherQuery,
            address: JSON.stringify({
              name: item.name,
              phone: item.phone,
              completeAddress: item.completeAddressDetail,
              id: item.id,
              phonePrefix: item.phonePrefix
            })
          }
        })
        return false;
      }
      
      this.$router.replace({
        name: 'me-aftersale-apply-type',
        params: {
          type: this.$route.query.applyType
        },
        query: {
          ...JSON.parse(this.$route.query.back),
          address: JSON.stringify({
            name: item.name,
            phone: item.phone,
            completeAddress: item.completeAddressDetail,
            id: item.id,
            areaCode: item.districtCode,
            cityCode: item.cityCode,
            countryCode: item.countryCode,
            provinceCode: item.provinceCode,
            phonePrefix: item.phonePrefix
          })
        }
      })
    },
    leftClick() {
      if (this.$route.query.backName && this.$route.query.backName == 'me-aftersale-apply-type') {
        this.$router.replace({
          name: this.$route.query.backName,
          params: {
            type: this.$route.query.applyType
          },
          query: {
            ...JSON.parse(this.$route.query.back)
          }
        })
        return false;
      }

      if(window.history.length < 3){ //解决部分机型拿不到history
        console.log('go home');
        this.$router.replace('/');
      }else{
        console.log('back');
        history.back();
      }
    }
  },
}
</script>

<style lang="less" scoped>
.lh-18 {
  line-height: 18px;
}
.address-single{
  border-top: 1px solid #eee;
  &:first-child{
    border-top: none;
  }
}
.address-btn{
  margin-top: 54px;
}
</style>