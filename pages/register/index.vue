<template>
  <div class="pb-30 flex between column register-page">
    <div>
      <BmHeaderNav :left="{ isShow: true }" :title="$t('register.title')"></BmHeaderNav>

      <div class="mlr-20">
        <!-- 手机号 -->
        <van-field
          v-model="cellphone"
          :placeholder="$t('login.phoneNumber')"
          class="field-container phone-code-field"
          type="tel"
        >
          <template #label>
            <span @click="showPicker = true" class="iblock fs-14 prefix-container">
              {{ prefixCode }}
              <img class="prefix-container--icon" src="@/assets/images/triangle-icon.png">
            </span>
          </template>
        </van-field>
        <!-- 手机前缀选择 -->
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="phonePrefixs"
            value-key="phonePrefix"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
        <!-- 验证码 -->
        <van-field
          v-model="code"
          center
          clearable
          :placeholder="$t('login.enterCode')"
          class="field-container"
        >
          <template #button>
            <van-button class="fs-14 green verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="cellphone.length === 0">Get It</van-button>
            <button class="fs-14 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
          </template>
        </van-field>
        <!-- 注册，点击跳转到设置密码页面 -->
        <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)" :disabled="cellphone.length === 0 || code.length === 0" @click="jumpPwd">
          {{ $t('common.next') }}
        </van-button>
      </div>
    </div>

    <!-- 其他登录方式及协议 -->
    <div class="mlr-20 login-page__btm">
      <van-divider>{{ $t('common.or') }}</van-divider>
      <div class="flex login-page__btm--concat">
        <img src="@/assets/images/concat-facebook.png" alt="">
        <img src="@/assets/images/concat-facebook.png" alt="">
        <img src="@/assets/images/concat-facebook.png" alt="">
        <img src="@/assets/images/concat-facebook.png" alt="">
      </div>
      <p class="fs-14 tc login-page__btm--service">By loging in,you agree to <nuxt-link to="">Tospino's Terms of Service</nuxt-link> and <nuxt-link to="">Privacy Policy</nuxt-link></p>
    </div>
  </div>
</template>

<script>
import { Field, Divider, Picker, Popup } from 'vant';

export default {
  components: {
    vanField: Field,
    vanDivider: Divider,
    vanPicker: Picker,
    vanPopup: Popup
  },
  data() {
    return {
      cellphone: '',
      code: '',
      phonePrefixs: [],
      showPicker: false,
      prefixCode: '',
      countdown: 0, // 120
      isCodeFlag: false,
      isNextFlag: false
    }
  },
  created() {
    // 获取手机号前缀
    this.$api.phonePrefix().then(res => {
      this.phonePrefixs = res.data;
      this.prefixCode = res.data[0].phonePrefix;
    })
  },
  methods: {
    onConfirm(event) { // 选择手机号前缀
      this.prefixCode = event.phonePrefix;
      this.showPicker = false;
    },
    sendCode() { // 发送验证码
      if (this.isCodeFlag) {
        return false;
      }
      this.isCodeFlag = true;
      const params = `phone=${this.cellphone}&phonePrefix=${this.prefixCode.split('+')[1]}&userType=buyer`;
      this.$api.getPhoneCode(params).then(res => {
        this.isCodeFlag = false;
        // if (res.code !== 0) return;
        this.$toast(res.data);
        this.countdown = 120; // 设置倒计时120s
        let timer = setInterval(() => {
          if (this.countdown === 0) {
            clearInterval(timer);
            return false;
          }
          this.countdown --;
        }, 1000);
      }).catch(() => {
        this.isCodeFlag = false;
      })
    },
    jumpPwd() { // 验证手机号码，成功后跳转到设置密码页面 userType: 'buyer' 买家 seller 卖家 operator 运营
      if (this.isNextFlag) {
        return false;
      }
      this.isNextFlag = true;
      this.$api.checkPhoneCode({ code: this.code, phone: this.cellphone, phonePrefix: this.prefixCode.split('+')[1], userType: 'buyer' }).then(res => {
        this.isNextFlag = false;
        // 手机号验证通过之后跳转到设置密码页面
        this.$router.push({
          name: 'register-password'
        })
      }).catch(() => {
        this.isNextFlag = false;
      })
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
  .van-button__content, &.van-button{
    height: auto!important;
  }
}
.verification-countdown-btn{
  padding: 5px 16px 6px 12px;
  height: 31px;
  color: #BFBFBF;
  line-height: 20px;
  border-radius: 7.5px;
  background-color: #eee;
  border: none;
}
.register-page{
  height: 100vh;
  background-color: #fff;
  .login-page__btm{
    .login-page__btm--concat{
      margin: 0 auto;
      width: fit-content;
      img{
        width: 32px;
        height: 32px;
        object-fit: cover;
        margin-left: 18px;
        &:first-child{
          margin-left: 0;
        }
      }
    }
    .login-page__btm--service{
      margin-top: 20px;
      line-height: 20px;
      color: #BFBFBF;
      a{
        color: #0F66DE;
      }
    }
  }
}

</style>