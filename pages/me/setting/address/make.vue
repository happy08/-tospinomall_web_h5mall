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
          <div class="flex flex-wrap">
            <div class="fs-14 plr-12 bg-orange round-8 tag active mr-12 mb-20">Default</div>
            <div class="fs-14 plr-12 bg-orange round-8 tag mr-12 mb-20">Default</div>
            <!-- 添加标签按钮 -->
            <div @click="isEmit = 1" v-if="isEmit === 0" class="mb-20">
              <BmImage
                :url="require('@/assets/images/icon/add-icon.svg')"
                :width="'1.24rem'" 
                :height="'0.64rem'"
                :isLazy="false"
                :isShow="false"
              ></BmImage>
            </div>
            <!-- 添加标签时的展示样式 -->
            <van-field
              v-model="emitTag"
              placeholder="Input label name"
              :class="{'p-0 border round-8 hidden custom-field mb-20 vcenter': true}"
              v-else-if="isEmit === 1"
            >
              <template #button>
                <van-button size="small" type="primary" :class="{'bg-grey': emitTag.length === 0, 'bg-green': emitTag.length > 0}" @click="isEmit = 2">Add</van-button>
              </template>
            </van-field>
            <!-- 添加之后的标签展示样式 -->
            <div class="flex round-8 mb-20 hidden border-green" v-else-if="isEmit === 2">
              <span class="plr-12 fs-14 green ptb-3">{{ emitTag }}</span>
              <span class="plr-12 fs-14 bg-green white ptb-3" @click="isEmit = 1">editor</span>
            </div>
          </div>
        </template>
      </van-field>
      <!-- 设置默认地址 -->
      <van-cell title="Set as the default adress" label="Reminder: This address is recommended by default for each order" title-class="black" class="p-20" >
        <template #right-icon>
          <van-switch v-model="isDefault" active-color="#34C759" inactive-color="#dcdee0" size="0.45rem" />
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
      isDefault: true,
      emitTag: '',
      isEmit: 0 // 0 需要添加 1 添加中 2添加完成
    }
  },
  methods: {
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
  border: 1px solid #42B7AE;
}
.ptb-3{
  padding-top: 3px;
  padding-bottom: 3px;
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