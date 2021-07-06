<template>
  <!-- 登录-验证码登录页面 -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" />
    <div class="mlr-20 pb-30 flex between column login-page">
      <div>
        <!-- 语言切换 -->
        <div class="clear">
          <van-dropdown-menu v-model="lang" :overlay="false" class="fr language-dropdown-menu">
            <van-dropdown-item get-container=".language-dropdown-menu" ref="dropdownLang">
              <template #title>
                <i class="iconfont fs-24 clr-blue mr-4">&#xe600;</i>{{ lang }}
              </template>
              <van-cell center :title="langItem.text" v-for="(langItem, index) in langOptions" :key="'lang-cell-' + index" @click="changeLang(langItem)">
                <template #icon>
                  <i class="iconfont fs-24 clr-blue mr-4">&#xe600;</i>
                </template>
              </van-cell>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <!-- title -->
        <h1 class="tc black lagin-page__title">{{ $t('login.loginTitle') }}</h1>
        <div class="login-page__container">
          <!-- 验证码 -->
          <van-field v-if="$route.query.changeWay === 'email'" class="field-container" v-model="account" :placeholder="$t('login.enterEmail')" />
          <!-- 手机验证码 -->
          <div v-else>
            <van-field
              v-model="account"
              :placeholder="$t('login.phoneNumber')"
              class="field-container phone-code-field"
              type="tel"
            >
              <template #label>
                <span @click="showPicker = true" class="iblock fs-14 black lh-20 prefix-container">
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
          </div>
          <van-field
            v-model="code"
            center
            clearable
            :placeholder="$t('login.enterCode')"
            class="field-container"
          >
            <template #button>
              <van-button class="fs-14 green lh-20 verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="account.length === 0">Get It</van-button>
              <button class="fs-14 lh-20 round-8 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
            </template>
          </van-field>
          <!-- 登录 -->
          <van-button
            class="mt-60 btn_h48 fw fs-16 w-100" 
            color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
            :disabled="account.length === 0 || code.length === 0"
            @click="login">
            {{ $t('login.loginBtn') }}
          </van-button>
        </div>
      </div>

      <!-- 其他登录方式及协议 -->
      <div class="login-page__btm">
        <van-divider>{{ $t('common.or') }}</van-divider>
        <div class="flex login-page__btm--concat">
          <!-- facebook -->
          <a href="">
            <i class="iconfont login-page__btm--concat--icon fs-32 clr-blue">&#xe600;</i>
          </a>
          <!-- 电话 -->
          <a href="">
            <i class="iconfont login-page__btm--concat--icon fs-32 clr-green">&#xe6cc;</i>
          </a>
          <!-- twitter -->
          <a href="">
            <i class="iconfont login-page__btm--concat--icon fs-32 clr-wathet">&#xe601;</i>
          </a>
          <!-- 手机 -->
          <nuxt-link :to="{ name: 'login-code' }">
            <i class="iconfont login-page__btm--concat--icon fs-32 clr-purple">&#xe617;</i>
          </nuxt-link>
          <!-- email -->
          <nuxt-link :to="{ name: 'login-code', query: { changeWay: 'email' } }">
            <i class="iconfont login-page__btm--concat--icon fs-32 clr-brownred">&#xe635;</i>
          </nuxt-link>
        </div>
        <p class="fs-14 tc mt-20 lh-20 login-page__btm--service">By loging in,you agree to <nuxt-link :to="{ name: 'services-register' }">Tospino's Terms of Service</nuxt-link> and <nuxt-link :to="{ name: 'services-privacy' }">Privacy Policy</nuxt-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { Divider, Field, Popup, DropdownMenu, DropdownItem, Cell } from 'vant';
import { getPhonePrefix, getPhoneCode, getEmailCode, authCodeLogin } from '@/api/login';

export default {
  components: {
    vanDivider: Divider,
    vanField: Field,
    vanPopup: Popup,
    vanDropdownMenu: DropdownMenu,
    vanDropdownItem: DropdownItem,
    vanCell: Cell
  },
  data() {
    return {
      account: '',
      code: '',
      phonePrefixs: [],
      showPicker: false,
      prefixCode: '',
      countdown: 0,
      langOptions: [
        { text: 'EN', value: 'en', icon: 'chat-o' },
        { text: 'China', value: 'zh-CN', icon: 'fire-o' }
      ]
    }
  },
  watch: {
    "$route"(e) {
      this.account = '';
      this.code = '';
      if (e.query.changeWay !== 'email' || !e.query.changeWay) {
        this.getPhonePrefix()
      }
    }
  },
  computed: {
    lang() { // 设置语言展示的文案
      return this.langOptions.filter(lang => {
        return lang.value === this.$store.state.locale;
      })[0].text;
    }
  },
  created() {
    // 手机号注册或者忘记密码时 需要先获取手机号前缀
    if (this.$route.query.changeWay !== 'email' || !this.$route.query.changeWay) {
      this.getPhonePrefix()
    }
  },
  methods: {
    getPhonePrefix() {
      getPhonePrefix().then(res => {
        this.phonePrefixs = res.data;
        this.prefixCode = res.data[0].phonePrefix;
      })
    },
    onConfirm(event) { // 选择手机号前缀
      this.prefixCode = event.phonePrefix;
      this.showPicker = false;
    },
    sendCode() { // 发送验证码
      if (this.isCodeFlag) {
        return false;
      }
      this.isCodeFlag = true;
      
      let _axios;
      if (this.$route.query.changeWay === 'email') { // 获取邮箱验证码
        _axios = getEmailCode({ email: this.account, userType: 'buyer' });
      } else { // 默认是获取手机验证码
        _axios = getPhoneCode({ phone: this.account, phonePrefix: this.prefixCode.split('+')[1], userType: 'buyer' });
      }
      // 接口返回操作
      _axios.then(res => {
        this.isCodeFlag = false;
        this.$toast(res.data); // 提示验证码
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
    login() { // 验证码登录
      authCodeLogin({
        code: this.code, 
        mobile: this.$route.query.changeWay === 'email' ? this.account : this.prefixCode.split('+')[1] + this.account, 
        userType: 'buyer' 
      }).then(res => {
        this.$store.commit('user/SET_USERINFO', res.data.user_info);
        this.$store.commit('user/SET_TOKEN', res.data.access_token);
        // 登录成功跳转到首页
        this.$router.push({
          name: 'home'
        })
      })
    },
    changeLang(lang) { // 切换语言
      this.$store.commit('SET_LANG', lang.value);
      this.$refs.dropdownLang.toggle();
    }
  }
}
</script>

<style lang="less" scoped>
.login-page{
  padding-top: 32px;
  height: calc(100vh - 46px);
  .lagin-page__title{
    font-size: 28px;
    line-height: 34px;
  }
  .login-page__btm{
    .login-page__btm--concat{
      margin: 0 auto;
      width: fit-content;
      a{
        margin-left: 18px;
        &:first-child{
          margin-left: 0;
        }
      }
    }
    .login-page__btm--service{
      color: #BFBFBF;
      a{
        color: #0F66DE;
      }
    }
  }
}
.prefix-container--icon{
  margin-left: 1px;
  width: 20px;
  height: 20px;
  object-fit: cover;
  vertical-align: top;
}
.verification-btn{
  padding: 5px 11px 6px 12px;
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
  background-color: #eee;
  border: none;
}
</style>