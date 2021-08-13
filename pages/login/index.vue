<template>
  <!-- 登录-账号密码登录页面 -->
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
              <van-cell center :title="langItem.text" v-for="(langItem, index) in langOptions" :key="'lang-cell-' + index" @click="changeLang(langItem.value)">
                <template #icon>
                  <i class="iconfont fs-24 clr-blue mr-4">&#xe600;</i>
                </template>
              </van-cell>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div> -->
        <!-- title -->
        <h1 class="tc black lagin-page__title">{{ $t('login.loginTitle') }}</h1>
        <div class="tc login-page__container">
          <!-- 验证码 -->
          <van-field class="field-container" v-model="account" :placeholder="$t('login.accountPlaceholder')" />
          <van-field class="field-container" v-model="password" type="password" :placeholder="$t('login.pwdPlaceholder')" />
          <!-- 忘记密码 -->
          <nuxt-link :to="{ name: 'register', query: { type: 'forgot' } }" class="fs-14 tr block mt-12 lh-20 login-page__container--forgot">{{ $t('forgot.title') }}</nuxt-link>
          <!-- 登录 -->
          <van-button
            class="btn_h48 fw fs-16 w-100 login-btn"
            color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)"
            :disabled="account.length === 0 || password.length < 6"
            @click="login">
            {{ $t('login.loginBtn') }}
          </van-button>
          <nuxt-link class="green iblock mt-10 lh-20 login-page__container--register" :to="{ name: 'register' }">立即注册</nuxt-link>
        </div>
      </div>

      <!-- 其他登录方式及协议 -->
      <div class="login-page__btm">
        <van-divider>{{ $t('common.or') }}</van-divider>
        <div class="flex login-page__btm--concat">
          <!-- facebook -->
          <a href="#">
            <BmIcon :name="'facebook-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a>
          <!-- 电话 -->
          <a href="#">
            <BmIcon :name="'phone-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a>
          <!-- twitter -->
          <a href="#">
            <BmIcon :name="'twitter-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a>
          <!-- google -->
          <a href="#">
            <BmIcon :name="'google-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a>
          <!-- 微信 -->
          <a href="#">
            <BmIcon :name="'wechat-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a>
          <!-- email -->
          <nuxt-link :to="{ name: 'login-code', query: { changeWay: 'email' } }" replace>
            <BmIcon :name="'email-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </nuxt-link>
          <!-- 手机 -->
          <nuxt-link :to="{ name: 'login-code' }" replace>
            <BmIcon :name="'cellphone'" :width="'0.64rem'" :height="'0.64rem'" />
          </nuxt-link>
        </div>
        <p class="fs-14 tc mt-20 lh-20 login-page__btm--service">By loging in,you agree to <nuxt-link :to="{ name: 'service-type', params: { type: 'register' } }">Tospino's Terms of Service</nuxt-link> and <nuxt-link :to="{ name: 'service-type', params: { type: 'privacy' } }">Privacy Policy</nuxt-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { Divider, Field, DropdownMenu, DropdownItem, Cell } from 'vant';
import { authLogin } from '@/api/login';

export default {
  components: {
    vanDivider: Divider,
    vanField: Field,
    vanDropdownMenu: DropdownMenu,
    vanDropdownItem: DropdownItem,
    vanCell: Cell
  },
  data() {
    return {
      account: '',
      password: '',
      langOptions: [
        { text: 'EN', value: 'en', icon: 'chat-o' },
        { text: 'China', value: 'zh-CN', icon: 'fire-o' }
      ]
    }
  },
  computed: {
    lang() { // 设置语言展示的文案
      return this.langOptions.filter(lang => {
        return lang.value === this.$store.state.locale;
      })[0].text;
    }
  },
  methods: {
    login() {
      // 登录
      authLogin({ username: this.account, password: this.password, grant_type: 'password' }).then(res => {
        if (res.code != 0) return false;
        this.$store.commit('user/SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
        this.$store.commit('user/SET_REFRESHTOKEN', res.data.refresh_token);
        this.$store.commit('user/SET_SCOPE', res.data.scope);
        // 获取用户信息
        this.$store.dispatch('user/GetUserInfo', res.data.token_type + ' ' + res.data.access_token);
        // 登录成功跳转到首页
        setTimeout(() => {
          this.$router.push({
            name: 'home'
          })
        }, 300);
      })
    },
    changeLang(lang) { // 切换语言
      this.$store.commit('SET_LANG', lang);
      this.$refs.dropdownLang.toggle();
    }
  },
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
.login-page__container--forgot{
  color: #BFBFBF;
  padding-right: 2px;
}
.login-btn{
  margin-top: 28px;
}
</style>