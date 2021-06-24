<template>
  <div class="pb-30 register-page">
    <div>
      <BmHeaderNav :title="$t('forgot.title')"></BmHeaderNav>

      <div class="plr-20">
        <!-- 验证码 -->
        <van-field
          clickable
          :value="code"
          :placeholder="$t('login.phoneNumber')"
          class="phone-code-field"
        >
          <template #label>
            <span @click="showPicker = true" class="fs-14 prefix-container">
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
        >
          <template #button>
            <button class="fs-14 verification-btn" @click="sendCode">{{ $t('common.getIt') }}</button>
            <button class="fs-14 verification-countdown-btn">{{ countdown }}S</button>
          </template>
        </van-field>
        <!-- 登录 -->
        <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)">
          {{ $t('common.next') }}
        </van-button>
      </div>
    </div>

    <!-- 其他登录方式及协议 -->
    <div class="login-page__btm">
      <van-divider>{{ $t('common.or') }}</van-divider>
      <div class="login-page__btm--concat">
        <img src="@/assets/images/concat-facebook.png" alt="">
        <img src="@/assets/images/concat-facebook.png" alt="">
        <img src="@/assets/images/concat-facebook.png" alt="">
        <img src="@/assets/images/concat-facebook.png" alt="">
      </div>
      <p class="fs-14 login-page__btm--service">By loging in,you agree to <nuxt-link to="">Tospino's Terms of Service</nuxt-link> and <nuxt-link to="">Privacy Policy</nuxt-link></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      code: '',
      phonePrefixs: ['+233', '+86'],
      showPicker: false,
      prefixCode: '+233',
      countdown: 120
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
  display: inline-block;
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
  color: #42B7AE;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background-color: #fff;
  .login-page__btm{
    .login-page__btm--concat{
      display: flex;
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
      text-align: center;
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