<template>
  <!-- 我的-设置-账户设置-用户信息 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('account_settings')" />
    
    <!-- 用户头像 -->
    <van-cell class="ptb-20" center :title="$t('avatar')" title-class="black">
      <template #default>
        <!-- 上传头像 -->
        <van-uploader :after-read="uploadAvatar">
          <BmImage 
            :url="userInfo.headPictureUrl ? userInfo.headPictureUrl : require('@/assets/images/icon/user-icon.png')"
            :width="'1rem'" 
            :height="'1rem'"
            :isLazy="false"
            :isShow="false"
            class="mr-12"
            :round="true"
            :alt="'Tospino user icon'"
          />
        </van-uploader>
        <!-- <input type="file" @change="uploadAvatar"> -->
      </template>
    </van-cell>

    <!-- 其他信息 -->
    <div class="mt-12">
      <!-- 会员账户 -->
      <van-cell class="ptb-20 plr-20" :title="$t('member_account')" value-class="light-grey" center is-link title-class="black">
        <template #default>
          <div class="flex vcenter hend">
            <van-icon :name="require('@/assets/images/icon/copy-icon.png')" size="0.48rem" class="mr-10 copy-member" @click="copy" />
            <span>{{ userInfo.account }}</span>
          </div>
        </template>
      </van-cell>
      <!-- 姓名 -->
      <van-cell class="ptb-20 plr-20" :title="$t('name')" :value="userInfo.username" value-class="light-grey" is-link title-class="black" :to="{ name: 'me-account-username', query: { name: userInfo.username, type: 'username' } }" />
      <!-- 昵称 -->
      <van-cell class="ptb-20 plr-20" :title="$t('nick_name')" :value="userInfo.nickname" value-class="light-grey" is-link title-class="black" :to="{ name: 'me-account-username', query: { name: userInfo.nickname, type: 'nickname' } }" />
      <!-- 性别 -->
      <van-cell class="ptb-20 plr-20" :title="$t('gender')" :value="userInfo.sex" value-class="light-grey" title-class="black" @click="changeInfo('sex')" is-link />
      <!-- 生日 -->
      <van-cell class="ptb-20 plr-20" :title="$t('date_of_birth')" :value="userInfo.cellBirthday" value-class="light-grey" title-class="black" @click="changeInfo('birthday')" is-link />
      <!-- 婚姻状态 -->
      <van-cell class="ptb-20 plr-20" :title="$t('marital_status')" :value="userInfo.maritalStatus" value-class="light-grey" title-class="black" @click="changeInfo('maritalStatus')" is-link />
    </div>

    
    <van-popup v-model="isPickerShow" round position="bottom">
      <!-- 生日时间选择 -->
      <van-datetime-picker
        v-if="changeCurrentType === 'birthday'"
        v-model="userInfo.birthday"
        type="date"
        :confirm-button-text="$t('confirm')"
        :cancel-button-text="$t('cancel')"
        @confirm="onBirthdayConfirm"
        @cancel="isPickerShow = false"
        :min-date="minDate"
      />
      <!-- 性别选择 1男，2女，3双性，4保密-->
      <van-picker v-if="changeCurrentType === 'sex'" :default-index="$store.state.user.userInfo.sex - 1" show-toolbar :columns="$t('gander')" @confirm="onSexConfirm" @cancel="isPickerShow = false" />
      <!-- 婚姻状态选择 1：未婚，2：已婚，3：保密-->
      <van-picker v-if="changeCurrentType === 'maritalStatus'" show-toolbar :columns="$t('marital_status_list')" @confirm="onMaritalConfirm" @cancel="isPickerShow = false" />
    </van-popup>
    
  </div>
</template>

<script>
import { Cell, CellGroup, DatetimePicker, Popup, Picker, Uploader } from 'vant';
import ClipboardJS from 'clipboard';
import { updateUserInfo, getPicUrl } from '@/api/user';

export default {
  middleware: 'authenticated',
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
        headPictureUrl: require('@/assets/images/icon/user-icon.png')
      },
      isPickerShow: false,
      changeCurrentType: null,
      minDate: new Date(1900, 0, 1)
    }
  },
  activated() {
    this.userInfo = {
      ...this.$store.state.user.userInfo,
      sex: this.$t('gander')[this.$store.state.user.userInfo.sex-1],
      maritalStatus: this.$t('marital_status_list')[this.$store.state.user.userInfo.maritalStatus - 1],
      birthday: this.$store.state.user.userInfo.birthday ? this.$utils.formatStandardDate(this.$store.state.user.userInfo.birthday) : '',
      cellBirthday: this.$store.state.user.userInfo.birthday ? this.$utils.formatStandardDate(this.$store.state.user.userInfo.birthday) : ''
    };
  },
  methods: {
    changeInfo(type) { // 设置性别
      this.isPickerShow = true;
      this.changeCurrentType = type;
      // 如果是birthday,在没有设置的情况下默认当天
      if (type === 'birthday') { // 选择时间的时候要格式化
        this.userInfo.birthday = this.userInfo.birthday ? new Date(this.$store.state.user.userInfo.birthday) : new Date();
      }
      
    },
    onSexConfirm(val, index) { // 提交性别
      this.updateUserInfo({ sex: index+1 });
    },
    onMaritalConfirm(val, index) { // 提交婚姻状态
      this.updateUserInfo({ maritalStatus: index+1 });
    },
    onBirthdayConfirm(val) { // 提交信息
      this.userInfo.birthday = this.$utils.formatStandardDate(val);
      this.updateUserInfo({ birthday: this.$utils.formatStandardDate(val) });
      this.isPickerShow = false;
    },
    uploadAvatar(file) { // 上传头像
      let formData = new FormData();
      formData.append('object', file.file);

      getPicUrl(formData).then(res => {
        this.updateUserInfo({ headPictureUrl: res.data });
      }).catch(error => {
        console.log(error);
      })
    },
    copy() { // 复制会员账号
      let clipboard = new ClipboardJS('.copy-member', {
        text: () => {
          return this.userInfo.account;
        }
      })
      clipboard.on('success', () => {
        let msg = this.$t('t_copied_to_clipboard');
        this.$toast({
          message: msg,
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        let msg = this.$t('fail_copied_to_clipboard');
        this.$toast({
          message: msg,
          type: 'fail'
        })
        clipboard.destroy()
      })
    },
    updateUserInfo(data) { // 修改用户信息
      updateUserInfo(data).then(res => {
        this.$store.commit('user/SET_USERINFO', res.data);
        this.userInfo = {
          ...res.data,
          sex: this.$t('gander')[res.data.sex-1],
          maritalStatus: this.$t('marital_status_list')[res.data.maritalStatus - 1],
          birthday: res.data.birthday ? this.$utils.formatStandardDate(res.data.birthday) : null,
          cellBirthday: res.data.birthday ? this.$utils.formatStandardDate(res.data.birthday) : ''
        };
        this.isPickerShow = false;
      }).catch(error => {
        console.log(error);
      })
    }
  },
}
</script>