<template>
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('forgot.title')"></BmHeaderNav>

    <div class="mlr-20 pb-30 flex column between register-page">
      <div>
        <!-- 验证码 -->
        <van-field
          clickable
          v-model="cellphone"
          :placeholder="$t('login.phoneNumber')"
          class="field-container phone-code-field"
        >
          <template #label>
            <span @click="showPicker = true" class="fs-14 iblock prefix-container">
              {{ prefixCode }}
              <img class="prefix-container--icon" src="@/assets/images/triangle-icon.png">
            </span>
          </template>
        </van-field>
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="phonePrefixs"
            value-key="phonePrefix"
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
            <van-button class="fs-14 green verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="cellphone.length === 0">Get It</van-button>
            <button class="fs-14 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
          </template>
        </van-field>
        <!-- 下一步 -->
        <van-button
          class="mt-60 btn_h48 fw fs-16 w-100"
          color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
          @click="nextLogin">
          {{ $t('common.next') }}
        </van-button>
      </div>

      <!-- 其他登录方式及协议 -->
      <div class="login-page__btm">
        <van-divider>{{ $t('common.or') }}</van-divider>
        <div class="flex login-page__btm--concat">
          <!-- facebook -->
          <i class="iconfont login-page__btm--concat--icon clr-blue">&#xe600;</i>
          <!-- 电话 -->
          <i class="iconfont login-page__btm--concat--icon clr-green">&#xe6cc;</i>
          <!-- twitter -->
          <i class="iconfont login-page__btm--concat--icon clr-wathet">&#xe601;</i>
          <!-- 手机 -->
          <i class="iconfont login-page__btm--concat--icon clr-purple">&#xe665;</i>
        </div>
        <p class="fs-14 tc login-page__btm--service">By loging in,you agree to <nuxt-link to="">Tospino's Terms of Service</nuxt-link> and <nuxt-link to="">Privacy Policy</nuxt-link></p>
      </div>
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
      countdown: 0
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
    nextLogin() {
      if (this.isNextFlag) {
        return false;
      }
      this.isNextFlag = true;
      this.$api.checkPhoneCode({ code: this.code, phone: this.cellphone, phonePrefix: this.prefixCode.split('+')[1], userType: 'buyer' }).then(res => {
        this.isNextFlag = false;
        // 手机号验证通过之后跳转到设置密码页面
        this.$router.push({
          name: 'register-password',
          query: {
            code: this.code,
            phone: this.cellphone,
            phonePrefix: this.prefixCode.split('+')[1]
          }
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
  height: 31px;
  line-height: 20px;
  border-radius: 7.5px;
  background-color: rgba(61, 235, 220, .1);
  border: 1px solid #46B0B0;
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
      .login-page__btm--concat--icon{
        font-size: 32px;
        margin-left: 18px;
        &:first-child{
          margin-left: 0;
        }
        &.clr-blue{
          color: #1278F4;
        }
        &.clr-green{
          color: #25D366;
        }
        &.clr-wathet{
          color: #41AAE1;
        }
        &.clr-purple{
          color: #E85A84;
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