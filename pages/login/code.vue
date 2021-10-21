<template>
  <!-- 登录-验证码登录页面 -->
  <div>
    <BmHeaderNav :left="{ isShow: true, url: '/home' }" :border="false" />
    <div class="mlr-20 pb-30 flex between column login-page">
      <div>
        <!-- 语言切换 -->
        <!-- <div class="clear">
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
        </div> -->
        <!-- title -->
        <h1 class="tc black lagin-page__title">{{ $t('log_in') }}</h1>
        <div class="login-page__container">
          <van-field v-if="$route.query.changeWay === 'email'" class="field-container" v-model="account" :placeholder="$t('enter_your_email')" />
          <!-- 手机验证码 -->
          <div v-else>
            <van-field
              v-model="account"
              :placeholder="$t('phone_number')"
              class="field-container phone-code-field"
              type="digit"
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
            :placeholder="$t('enter_verification_code')"
            class="field-container"
            type="digit"
            maxlength="6"
          >
            <template #button>
              <van-button class="fs-14 green lh-20 verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="account.length === 0">{{ $t('get_it') }}</van-button>
              <button class="fs-14 lh-20 round-8 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
            </template>
          </van-field>
          <!-- 登录 -->
          <van-button
            class="mt-60 btn_h48 fw fs-16 w-100" 
            color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
            :disabled="account.length === 0 || code.length === 0"
            @click="login">
            {{ $t('log_in') }}
          </van-button>
          <nuxt-link :to="{ name: 'login' }" replace class="tc green mt-10 block">{{ $t('password_login') }}</nuxt-link>
        </div>
      </div>

      <!-- 其他登录方式及协议 -->
      <div class="login-page__btm">
        <van-divider>{{ $t('or') }}</van-divider>
        <div class="flex login-page__btm--concat">
          <!-- facebook -->
           <!-- <a href="#"> -->
            <BmIcon :name="'facebook-icon'" :width="'0.64rem'" :height="'0.64rem'" @iconClick="fLogin" />
          <!-- </a>  -->
          <!-- 电话 -->
          <!-- <a href="#">
            <BmIcon :name="'phone-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- twitter -->
          <!-- <a href="#">
            <BmIcon :name="'twitter-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- google -->
          <!-- <a href="#"> -->
            <BmIcon :name="'google-icon'" :width="'0.64rem'" :height="'0.64rem'" class="ml-18" @iconClick="gLogin" />
          <!-- </a> -->
          <!-- 微信 -->
          <!-- <a href="#">
            <BmIcon :name="'wechat-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- email -->
          <nuxt-link :to="{ name: 'login-code', query: { changeWay: 'email' } }" replace v-if="this.$route.query.changeWay !== 'email'">
            <BmIcon :name="'email-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </nuxt-link>
          <!-- 手机 -->
          <nuxt-link :to="{ name: 'login-code' }" replace v-if="this.$route.query.changeWay">
            <BmIcon :name="'cellphone'" :width="'0.64rem'" :height="'0.64rem'" />
          </nuxt-link>
        </div>
        <div class="fs-14 tc mt-20 lh-20 login-page__btm--service">
          {{ $t('login_service_privacy') }}<nuxt-link class="clr-blue" :to="{ name: 'service-type', params: { type: 'serve' }, query: { isH5: 1 } }"> Tospino's {{ $t('term_of_service') }}</nuxt-link> {{ $t('with_and') }} <nuxt-link class="clr-blue" :to="{ name: 'service-type', params: { type: 'privacy' }, query: { isH5: 1 } }">{{ $t('privacy_policy') }}</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Divider, Field, Popup, DropdownMenu, DropdownItem, Cell, Picker } from 'vant';
import { getPhonePrefix, getPhoneCode, getEmailCode } from '@/api/login';

export default {
  components: {
    vanDivider: Divider,
    vanField: Field,
    vanPopup: Popup,
    vanDropdownMenu: DropdownMenu,
    vanDropdownItem: DropdownItem,
    vanCell: Cell,
    vanPicker: Picker
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
  mounted() {
    let gScript = document.createElement('script');
    gScript.src = 'https://apis.google.com/js/platform.js';
    document.head.appendChild(gScript);

    let fScript = document.createElement('script');
    fScript.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.head.appendChild(fScript);
  },
  methods: {
    getPhonePrefix() {
      getPhonePrefix().then(res => {
        this.phonePrefixs = res.data;
        this.prefixCode = this.$t('prefix_tip');
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
        _axios = getEmailCode({ email: this.account, userType: 'buyer', type: 3 });
      } else { // 默认是获取手机验证码
        _axios = getPhoneCode({ phone: this.account, phonePrefix: this.prefixCode, userType: 'buyer', type: 3 });
      }
      // 接口返回操作
      _axios.then(res => {
        this.isCodeFlag = false;
        this.$toast(res.data); // 提示验证码
        this.countdown = 60; // 设置倒计时60s
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
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      this.$api.authCodeLogin({
        code: this.code, 
        mobile: this.$route.query.changeWay === 'email' ? this.account : this.prefixCode + this.account, 
        // userType: 'buyer'
      }).then(res => {
        this.$toast.clear();
        this.$store.commit('user/SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
        this.$store.commit('user/SET_REFRESHTOKEN', res.data.refresh_token);
        this.$store.commit('user/SET_SCOPE', res.data.scope);
        // 获取用户信息
        this.$store.dispatch('user/GetUserInfo', res.data.token_type + ' ' + res.data.access_token);
        // 获取消息信息
        this.$store.commit('user/SET_WEBSOCKET', res.data.user_info.passUrl);
        // 当前登录账号
        this.$store.commit('user/SET_ACCOUNT', { email: res.data.user_info.email, phone: res.data.user_info.phone });
        // 登录成功跳转到首页
        setTimeout(() => {
          this.account = '';
          this.code = '';
          this.$router.push({
            name: 'home'
          })
        }, 100);
      })
    },
    // changeLang(lang) { // 切换语言
    //   this.$store.commit('SET_LANG', lang.value);
    //   this.$refs.dropdownLang.toggle();
    // },
    gLogin() { // 谷歌登录
      gapi.load('auth2', () => {
        gapi.auth2.init({
          apiKey: 'Wfrc034S1dNn-nqPmLLbEGRG',
          clientId: '75328792168-dhmjntibom2p54u87gvg5qdekaaicuii.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.me'
        })
        const getAuthInstance = gapi.auth2.getAuthInstance();
        getAuthInstance.signIn().then(success => {
          console.log('success');
          // console.log(success);
          console.log(success.getAuthResponse())
          this.$toast.loading({
            forbidClick: true,
            loadingType: 'spinner',
            duration: 0
          });
          this.$api.thirdPartyLogin({ mobile: success.getAuthResponse().id_token, grant_type: 'google' }).then(res => {
            this.$store.commit('user/SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
            this.$store.commit('user/SET_REFRESHTOKEN', res.data.refresh_token);
            this.$store.commit('user/SET_SCOPE', res.data.scope);
            // 获取用户信息
            this.$store.dispatch('user/GetUserInfo', res.data.token_type + ' ' + res.data.access_token);
            // 获取消息信息
            this.$store.commit('user/SET_WEBSOCKET', res.data.user_info.passUrl);
            // 当前登录账号
            this.$store.commit('user/SET_ACCOUNT', res.data.user_info.email);
            this.$toast.clear();
            // 登录成功跳转到首页
            setTimeout(() => {
              this.account = '';
              this.password = '';
              this.$router.push({
                name: 'home'
              })
            }, 100);
          })
        }, err => {
          console.log('err: ');
          console.log(err);
        })
      })
    },
    fLogin() { // facebook登录
      console.log(FB)
      FB.init({
        appId: '231779648840263',
        scope: 'public_profile, email',
        version: 'v11.0'
      })

      FB.login(response => {
        console.log(response)
        if (response.status == 'connected') { // 连接成功
          FB.api('/me?fields=name,email', user => { // 获取用户信息
            console.log('user')
            console.log(user);
            this.$toast.loading({
              forbidClick: true,
              loadingType: 'spinner',
              duration: 0
            });
            this.$api.thirdPartyLogin({ mobile: { userId: user.id, email: user.email, name: user.name }, grant_type: 'facebook' }).then(res => {
              console.log(res)
              this.$toast.clear();
              if (res.code == 11001) {
                this.$router.push({
                  name: 'login-bind',
                  query: {
                    userId: user.id,
                    name: user.name
                  }
                })
                return false;
              }
              if (res.code != 0) {
                this.$toast(res.msg);
                return false;
              }
              this.$store.commit('user/SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
              this.$store.commit('user/SET_REFRESHTOKEN', res.data.refresh_token);
              this.$store.commit('user/SET_SCOPE', res.data.scope);
              // 获取用户信息
              this.$store.dispatch('user/GetUserInfo', res.data.token_type + ' ' + res.data.access_token);
              // 获取消息信息
              this.$store.commit('user/SET_WEBSOCKET', res.data.user_info.passUrl);
              // 当前登录账号
              this.$store.commit('user/SET_ACCOUNT', res.data.user_info.email);
              // 登录成功跳转到首页
              setTimeout(() => {
                this.account = '';
                this.password = '';
                this.$router.push({
                  name: 'home'
                })
              }, 100);
            }).catch(error => {
              console.log(error)
              this.$toast.clear();
              if (error.code == 11001) { // 未绑定邮箱 11001
                this.$router.push({
                  name: 'login-bind',
                  query: {
                    userId: user.id,
                    name: user.name
                  }
                })
              } else {
                this.$toast(error.msg);
              }
              
            })
          })
        }
      });
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
.login-page__container{
  margin-top: 50px;
}
.ml-18{
  margin-left: 18px;
}
</style>