<template>
  <!-- 登录-账号密码登录页面 -->
  <div class="pt-46">
    <BmHeaderNav :left="{ isShow: true, url: '/home' }" :border="false" :fixed="true" />
    <div class="mlr-20 pb-30 flex between column login-page">
      <div>
        <!-- 语言切换 -->
        <!-- <div class="clear">
          <van-dropdown-menu v-model="lang" :overlay="false" class="fr language-dropdown-menu">
            <van-dropdown-item get-container=".language-dropdown-menu" ref="dropdownLang">
              <template #title>
                <i class="iconfont fs-24 clr-blue mr-4">&#xe600;</i>{{ lang }}
              </template>
              <van-cell center :title="langItem.text" v-for="(langItem, index) in langOptions" :key="'lang-cell-' + index" @click="changeLang(langItem.value)">
                <template #icon>
                  <i class="iconfont fs-24 clr-blue mr-4">&#xe600;</i>
                </template>
              </van-cell>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div> -->
        <!-- title -->
        <h1 class="tc black lagin-page__title">{{ $t('log_in') }}</h1>
        <div class="tc login-page__container">
          <!-- 账号 -->
          <van-field class="field-container phone-code-field" v-model="account" :placeholder="$t('phone_number_or_email')" @input="onInput" ref="loginAccountInputContainer" clearable>
            <template #label>
              <span @click="showPicker = true" v-show="isPhone" class="fs-14 black lh-20 prefix-container">
                {{ prefixCode }}
                <img class="prefix-container--icon" src="@/assets/images/triangle-icon.png">
              </span>
            </template>
          </van-field>
          <!-- 密码 -->
          <van-field class="field-container" v-model="password" type="password" :placeholder="$t('your_password_6_20')" maxlength="20" clearable />
          <!-- 忘记密码 -->
          <nuxt-link :to="{ name: 'register', query: { type: 'forgot' } }" class="fs-14 tr block mt-12 lh-20 login-page__container--forgot">{{ $t('forgot_password') }}</nuxt-link>
          <!-- 登录 -->
          <van-button
            class="btn_h48 fw fs-16 w-100 login-btn round-8"
            color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
            :disabled="account.length === 0 || password.length < 6"
            @click="login">
            {{ $t('log_in') }}
          </van-button>
          <nuxt-link class="green iblock mt-10 lh-20 fs-14 login-page__container--register" :to="{ name: 'register' }">{{ $t('sign_up_now') }}</nuxt-link>
        </div>
      </div>

      <!-- 其他登录方式及协议 -->
      <div class="login-page__btm">
        <van-divider>{{ $t('or') }}</van-divider>
        <div class="flex login-page__btm--concat">
          <!-- facebook -->
          <!-- <a href="#"> -->
            <BmIcon :name="'facebook-icon'" :width="'0.64rem'" :height="'0.64rem'" @iconClick="fLogin" />
          <!-- </a> -->
          <!-- 电话 -->
          <!-- <a href="#">
            <BmIcon :name="'phone-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- twitter -->
          <!-- <a href="#">
            <BmIcon :name="'twitter-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- google -->
          <BmIcon :name="'google-icon'" :width="'0.64rem'" :height="'0.64rem'" class="ml-18" @iconClick="gLogin" />
          
          <!-- <div class="g-signin2" data-onsuccess="gLogin"></div> -->
          <!-- 微信 -->
          <!-- <a href="#">
            <BmIcon :name="'wechat-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- email -->
          <nuxt-link :to="{ name: 'login-code', query: { changeWay: 'email' } }" replace>
            <BmIcon :name="'email-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </nuxt-link>
          <!-- 手机 -->
          <nuxt-link :to="{ name: 'login-code' }" replace>
            <BmIcon :name="'cellphone'" :width="'0.64rem'" :height="'0.64rem'" />
          </nuxt-link>
        </div>
        <div class="fs-14 tc mt-20 lh-20 login-page__btm--service">
          {{ $t('login_service_privacy') }}<nuxt-link class="clr-blue" :to="{ name: 'service-type', params: { type: 'serve' }, query: { isH5: 1 } }"> TospinoMall's {{ $t('term_of_service') }}</nuxt-link> {{ $t('with_and') }} <nuxt-link class="clr-blue" :to="{ name: 'service-type', params: { type: 'privacy' }, query: { isH5: 1 } }">{{ $t('privacy_policy') }}</nuxt-link>
        </div>
      </div>
    </div>

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
</template>

<script>
import { Divider, Field, DropdownMenu, DropdownItem, Cell, Popup, Picker } from 'vant';
import { getPhonePrefix } from '@/api/login';

export default {
  components: {
    vanDivider: Divider,
    vanField: Field,
    vanDropdownMenu: DropdownMenu,
    vanDropdownItem: DropdownItem,
    vanCell: Cell,
    vanPopup: Popup,
    vanPicker: Picker
  },
  data() {
    return {
      account: '',
      password: '',
      langOptions: [
        { text: 'EN', value: 'en', icon: 'chat-o' },
        { text: 'China', value: 'zh-CN', icon: 'fire-o' }
      ],
      prefixCode: '',
      showPicker: false,
      phonePrefixs: [],
      isPhone: false
    }
  },
  computed: {
    lang() { // 设置语言展示的文案
      return this.langOptions.filter(lang => {
        return lang.value === this.$store.state.locale;
      })[0].text;
    }
  },
  activated() {
    this.prefixCode = this.$t('prefix_tip');
    this.getPhonePrefix();
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
    login() {
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      // 登录
      this.$api.authLogin({ username: this.isPhone ? this.prefixCode + this.account : this.account, password: this.password, grant_type: 'password' }).then(res => {
        if (res.code != 0) return false;
        this.$store.commit('user/SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
        this.$store.commit('user/SET_REFRESHTOKEN', res.data.refresh_token);
        this.$store.commit('user/SET_SCOPE', res.data.scope);
        // 获取用户信息
        this.$store.dispatch('user/GetUserInfo', res.data.token_type + ' ' + res.data.access_token);
        // 获取消息信息
        this.$store.commit('user/SET_WEBSOCKET', res.data.user_info.passUrl);
        // 当前登录账号
        this.$store.commit('user/SET_ACCOUNT', { email: res.data.user_info.email, phone: res.data.user_info.phone });
        this.$toast.clear();
        // 登录成功跳转到首页
        setTimeout(() => {
          this.account = '';
          this.password = '';
          this.$router.push({
            name: 'home'
          })
        }, 100);
      }).catch(error => {
        console.log(error);
      })
    },
    changeLang(lang) { // 切换语言
      this.$store.commit('SET_LANG', lang);
      this.$refs.dropdownLang.toggle();
    },
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
          }).catch(error => {
            console.log(error);
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
    },
    getPhonePrefix() {
      getPhonePrefix().then(res => {
        this.phonePrefixs = res.data;
        this.prefixCode = this.$t('prefix_tip');
      }).catch(error => {
        console.log(error);
      })
    },
    onConfirm(event) { // 选择手机号前缀
      this.prefixCode = event.phonePrefix;
      this.showPicker = false;
    },
    onInput(value) {
      let reg = /^\d{1,}$/;
      this.isPhone = reg.test(value) ? true : false;
    }
  },
}
</script>

<style lang="less" scoped>
.login-page{
  // position: fixed;
  padding-top: 20px;
  // min-height: 100%;
  // padding-bottom: 10px;
  .lagin-page__title{
    font-size: 28px;
    line-height: 34px;
  }
  .login-page__btm{
    margin-top: 36px;
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
.login-page__container{
  margin-top: 50px;
}
.login-page__container--forgot{
  color: #BFBFBF;
  padding-right: 2px;
}
.login-btn{
  margin-top: 28px;
}
.ml-18{
  margin-left: 18px;
}
.prefix-container--icon{
  margin-left: 1px;
  width: 20px;
  height: 20px;
  object-fit: cover;
  vertical-align: top;
}
</style>