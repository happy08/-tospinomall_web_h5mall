<template>
  <!-- 我的-设置-账户设置-用户信息 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.accountSetting.title')" />
    
    <!-- 用户头像 -->
    <van-cell class="ptb-20" center :title="$t('me.userInfo.avatar')" title-class="black">
      <template #default>
        <!-- 上传头像 -->
        <van-uploader :after-read="uploadAvatar">
          <BmImage 
            :url="require('@/assets/images/icon/user-icon.png')"
            :width="'1rem'" 
            :height="'1rem'"
            :isLazy="false"
            :isShow="false"
            class="mr-12"
          ></BmImage>
        </van-uploader>
      </template>
    </van-cell>

    <!-- 其他信息 -->
    <div class="mt-12">
      <!-- 会员账户 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.userInfo.memberAccount')" value-class="light-grey" is-link title-class="black" :to="{ name: '' }">
        <template #default>
          <i class="iconfont icon-fuzhi fs-24 mr-10 vc copy-member" @click="copy"></i>{{ userInfo.memberAccount }}
        </template>
      </van-cell>
      <!-- 姓名 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.userInfo.name')" :value="userInfo.name" value-class="light-grey mr-10" is-link title-class="black" :to="{ name: 'me-setting-account-username', query: { name: userInfo.name, type: 'name' } }" />
      <!-- 昵称 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.userInfo.nickname')" :value="userInfo.nickname" value-class="light-grey mr-10" is-link title-class="black" :to="{ name: 'me-setting-account-username', query: { name: userInfo.nickname, type: 'nickname' } }" />
      <!-- 性别 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.userInfo.gender')" :value="userInfo.gender" value-class="light-grey mr-10" title-class="black" @click="changeInfo('gender')" />
      <!-- 生日 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.userInfo.birth')" :value="userInfo.birth" value-class="light-grey mr-10" title-class="black" @click="changeInfo('birth')" />
      <!-- 婚姻状态 -->
      <van-cell class="ptb-20 plr-20" :title="$t('me.userInfo.maritalStatus')" :value="userInfo.maritalStatus" value-class="light-grey mr-10" title-class="black" @click="changeInfo('maritalStatus')" />
    </div>

    
    <van-popup v-model="isPickerShow" round position="bottom">
      <!-- 生日时间选择 -->
      <van-datetime-picker
        v-if="changeCurrentType === 'birth'"
        v-model="userInfo.birth"
        type="date"
        :confirm-button-text="$t('common.confirm')"
        :cancel-button-text="$t('common.cancel')"
        @confirm="onConfirm($event, 'birth')"
        @cancel="isPickerShow = false"
      />
      <!-- 性别选择 -->
      <van-picker v-if="changeCurrentType === 'gender'" show-toolbar :columns="$t('common.gander')" @confirm="onConfirm($event, 'gender')" @cancel="isPickerShow = false" />
      <!-- 婚姻状态选择 -->
      <van-picker v-if="changeCurrentType === 'maritalStatus'" show-toolbar :columns="$t('common.maritalStatus')" @confirm="onConfirm($event, 'maritalStatus')" @cancel="isPickerShow = false" />
    </van-popup>
    
  </div>
</template>

<script>
import { Cell, CellGroup, DatetimePicker, Popup, Picker, Uploader } from 'vant';
import ClipboardJS from 'clipboard';
import Moment from 'moment';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanDatetimePicker: DatetimePicker,
    vanPopup: Popup,
    vanPicker: Picker,
    vanUploader: Uploader
  },
  data() {
    return {
      userInfo: {
        avatar: '',
        memberAccount: 'APP-98450',
        name: 'LucyLucy',
        nickname: 'Cute baby',
        gender: 'Gender',
        birth: 'March-9-2020',
        maritalStatus: 'married'
      },
      isPickerShow: false,
      changeCurrentType: null
    }
  },
  methods: {
    changeInfo(type) { // 设置性别
      this.isPickerShow = true;
      this.changeCurrentType = type;
    },
    onConfirm(val, key) { // 提交信息
      console.log(val, key)
      this.userInfo[key] = key === 'birth' ? Moment(val).format('MMM-DD-YYYY') : val;
      this.isPickerShow = false;
    },
    uploadAvatar(file) { // 上传头像
      console.log(file);
    },
    copy() { // 复制会员账号
      let clipboard = new ClipboardJS('.copy-member', {
        text: () => {
          return this.userInfo.memberAccount;
        }
      })
      clipboard.on('success', () => {
        let msg = this.$t('common.copySuccess');
        this.$toast({
          message: msg,
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        let msg = this.$t('common.copyError');
        this.$toast({
          message: msg,
          type: 'fail'
        })
        clipboard.destroy()
      })
    }
  },
}
</script>