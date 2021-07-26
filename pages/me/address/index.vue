<template>
  <!-- 我的-设置-收货地址 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.address.shipAddress')" />
    <!-- 地址列表 -->
    <div class="p-20 address-single" v-for="(item, index) in lists" :key="index">
      <div class="flex between vcenter address-single__top">
        <div class="flex vcenter fm-helvetica">
          <!-- 标签 -->
          <span class="white fs-12 p-4 bg-orange round-4 lh-18 mr-4" v-show="item.isDefault">Default</span>
          <span class="white fs-12 p-4 bg-green round-4 lh-18 mr-12" v-show="item.tag">{{ $t('me.address.tag')[item.tag-1] }}</span>
          <span class="white fs-12 p-4 bg-green round-4 lh-18 mr-12" v-show="item.tagEditor">{{ item.tagEditor }}</span>
          <!-- 姓名/手机号 -->
          <span class="black fs-14 lh-18">{{ item.name }}</span>
          <span class="black fs-14 lh-18 ml-10">{{ item.phone }}</span>
        </div>
        <div @click="onEdit(item)">
          <BmImage
            :url="require('@/assets/images/icon/emit-icon.svg')"
            :width="'0.48rem'" 
            :height="'0.48rem'"
            :isLazy="false"
            :isShow="false"
          ></BmImage>
        </div>
      </div>
      <!-- 地址 -->
      <div class="mt-10 fs-14 black fm-helvetica">{{ item.address }}</div>
      <div class="mt-10 fs-14 black fm-helvetica">{{ item.completeAddress }}</div>
      <div class="mt-12 flex vcenter" @click="onSetDeafult(item.id)">
        <BmImage
          :url="item.isDefault ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
          :width="'0.48rem'" 
          :height="'0.48rem'"
          :isLazy="false"
          :isShow="false"
        ></BmImage>
        <span :class="{'fm-helvetica fs-14 ml-8': true, 'red': item.isDefault}">{{ item.isDefault ? 'Default': 'Set as Default' }}</span>
      </div>
    </div>

    <div class="mlr-20">
      <BmButton class="round-8 w-100 address-btn" @click="addAddress">{{ $t('me.address.addShipAddressBtn') }}</BmButton>
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
      })
    },
    onSetDeafult(id) { // 设置默认地址
      updateDefaultAddress(id).then(() => {
        this.getAddressList();
      })
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