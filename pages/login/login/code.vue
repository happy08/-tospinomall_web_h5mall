<template>
  <div class="login-page__container">
    <!-- 验证码 -->
    <van-field
      clickable
      :value="code"
      :placeholder="$t('login.phoneNumber')"
      class="field-container phone-code-field"
    >
      <template #label>
        <span @click="showPicker = true" class="iblock fs-14 prefix-container">
          {{ prefixCode }}
          <img class="prefix-container--icon" src="@/assets/images/triangle-icon.png">
        </span>
      </template>
    </van-field>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="phonePrefixs"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-field
      v-model="code"
      center
      clearable
      :placeholder="$t('login.enterCode')"
      class="field-container"
    >
      <template #button>
        <button class="fs-14 green verification-btn" @click="sendCode">Get It</button>
      </template>
    </van-field>
    <!-- 登录 -->
    <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)">
      {{ $t('login.loginBtn') }}
    </van-button>
  </div>
</template>

<script>
import { Field, Popup } from 'vant';

export default {
  components: {
    vanField: Field,
    vanPopup: Popup
  },
  data() {
    return {
      account: '',
      code: '',
      phonePrefixs: ['+233', '+86'],
      showPicker: false,
      prefixCode: '+233'
    }
  },
  methods: {
    onConfirm(event) {
      this.prefixCode = event;
      this.showPicker = false;
    },
    sendCode() {
      console.log('send code');
    }
  },
}
</script>

<style lang="less" scoped>
.prefix-container{
  line-height: 20px;
  color: #383838;
  .prefix-container--icon{
    margin-left: 1px;
    width: 20px;
    height: 20px;
    object-fit: cover;
    vertical-align: top;
  }
}
.verification-btn{
  padding: 5px 11px 6px 12px;
  line-height: 20px;
  border-radius: 7.5px;
  background-color: rgba(61, 235, 220, .1);
  border: 1px solid #46B0B0;
}
</style>