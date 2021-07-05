<template>
  <!-- 我的-设置-新建收货地址 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.address.shipAddress')">
      <div slot="header-right" class="green" @click="deleteFn">
        {{ $t('common.delete') }}
      </div>
    </BmHeaderNav>

    <!-- 收货地址 -->
    <div class="bg-white">
      <!-- 收货人姓名 -->
      <van-field v-model="name" class="p-20" placeholder="The consignee" />
      <!-- 收货人电话号码 -->
      <van-field
        v-model="phone"
        placeholder="Phpne number"
        class="p-20"
        type="tel"
      >
        <template #right-icon>
          <nuxt-link class="flex grey" :to="{ name: 'me-setting-address-areacode' }">
            {{ phonePref }}
            <van-icon name="arrow" />
          </nuxt-link>
        </template>
      </van-field>
      <!-- 收货人地址 -->
      <van-field
        v-model="address"
        placeholder="Address"
        class="p-20"
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
        v-model="detail"
        rows="4"
        type="textarea"
        class="p-20"
        placeholder="Detailed address:such as road,building number..."
      />
      <!-- 标签 -->
      <van-cell title="Label" title-class="light-grey" ></van-cell>
      <van-field v-model="tag" label="文本" label-width="0.72rem">
        <template #input>
          <span class="fs-14 plr-12 bg-orange round-8 lh-18 tag active mr-12">Default</span>
          <span class="fs-14 plr-12 bg-orange round-8 lh-18 tag mr-12">Default</span>
          <!-- 添加标签按钮 -->
          <BmImage
            :url="require('@/assets/images/icon/add-icon.svg')"
            :width="'1.24rem'" 
            :height="'0.64rem'"
            :isLazy="false"
            :isShow="false"
            @click="addTagFun"
          ></BmImage>
        </template>
      </van-field>
      <!-- 设置默认地址 -->
      <van-cell title="Set as the default adress" label="Reminder: This address is recommended by default for each order" title-class="black" class="p-20" >
        <template #right-icon>
          <van-switch v-model="isDefault" active-color="#34C759" inactive-color="#dcdee0" />
        </template>
      </van-cell>
    </div>

    <div class="mlr-20 pb-20">
      <BmButton class="round-8 w-100 save-btn" @click="save">{{ $t('me.address.addShipAddressBtn') }}</BmButton>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Switch } from 'vant';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanSwitch: Switch
  },
  data() {
    return {
      phonePref: '+86',
      name: '',
      phone: '',
      address: '',
      detail: '',
      tag: 'Home',
      isDefault: true
    }
  },
  methods: {
    addTagFun() { // 添加标签

    },
    save() { // 保存地址
      // 地址保存成功跳转到地址列表页面
      this.$router.replace({
        name: 'me-setting-address'
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
    }
  },
}
</script>

<style lang="less" scoped>
.lh-18{
  line-height: 18px;
}
.tag{
  border: 1px solid #BFBFBF;
  background-color: #fff;
  color: #666;
  padding-top: 6px;
  padding-bottom: 6px;
  &.active{
    background-color: rgba(66, 183, 174, 0.05);
    border: 1px solid #42B7AE;
    color: #42B7AE;
  }
}
.save-btn{
  margin-top: 116px;
}
</style>