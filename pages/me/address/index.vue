<template>
  <!-- 我的-设置-收货地址 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.address.shipAddress')" />
    <!-- 地址列表 -->
    <div class="p-20 address-single" v-for="(item, index) in lists" :key="index">
      <!-- top姓名手机号标签 -->
      <div class="flex between vcenter address-single__top">
        <div class="flex vcenter fm-helvetica">
          <!-- <span class="white fs-12 p-4 bg-orange round-4 lh-18">Default</span>
          <span class="white fs-12 p-4 bg-green round-4 lh-18 ml-4 mr-12">Home</span> -->
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
      <div class="mt-12">
        <van-radio-group v-model="defaultVal">
          <van-radio name="1" icon-size="0.48rem">
            <template #icon="props">
              <div class="flex vcenter">
                <BmImage
                  :url="props.checked ? require('@/assets/images/icon/choose-icon.svg') : require('@/assets/images/icon/choose-default-icon.svg')"
                  :width="'0.48rem'" 
                  :height="'0.48rem'"
                  :isLazy="false"
                  :isShow="false"
                ></BmImage>
                <span :class="{'fm-helvetica fs-14 ml-8': true, 'red': props.checked}">{{ props.checked ? 'Default': 'Set as Default' }}</span>
              </div>
            </template>
          </van-radio>
        </van-radio-group>
      </div>
    </div>

    <div class="mlr-20">
      <BmButton class="round-8 w-100 address-btn" @click="addAddress">{{ $t('me.address.addShipAddressBtn') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio } from 'vant';
import { getAddressList } from '@/api/address';

export default {
  components: {
    vanRadioGroup: RadioGroup,
    vanRadio: Radio
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {
      lists: [],
      defaultVal: '1'
    }
  },
  mounted() {
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
        this.lists = res.data;
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