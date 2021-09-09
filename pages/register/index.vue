<template>
  <!-- 登录-注册 -->
  <div>
    <BmHeaderNav :left="{ isShow: true, url: '/login' }" :title="title" />
    
    <div class="mlr-20 pb-30 flex between column register-page">
      <div>
        <!-- 邮箱 -->
        <van-field
          v-model="account_email"
          :placeholder="$t('enter_your_email')"
          class="field-container phone-code-field"
          v-if="isType === 'email'"
          maxlength="254"
          type="email"
        />
        <!-- 手机号 --> 
        <div v-else class="border-b">
          <van-field
            v-model="account"
            :placeholder="$t('phone_number')"
            class="field-container phone-code-field"
            maxlength="30"
            type="number"
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
        <!-- 验证码 -->
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
            <van-button class="fs-14 green lh-20 round-8 verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="(isType == 'email' && account_email.length === 0) || (isType != 'email' && account.length === 0)">{{ $t('get_it') }}</van-button>
            <button class="fs-14 lh-20 round-8 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
          </template>
        </van-field>
        <!-- 注册，点击跳转到设置密码页面 -->
        <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)" :disabled="(isType == 'email' && account_email.length === 0) || (isType != 'email' && account.length === 0) || code.length === 0" @click="jumpPwd">
          {{ $t('next') }}
        </van-button> 
        <van-checkbox v-model="checked" class="mt-20">
          <template #icon="props">
            <BmImage
              :url="props.checked ? require('@/assets/images/icon/choose-icon.png') : require('@/assets/images/icon/choose-default-icon.png')"
              :width="'0.32rem'" 
              :height="'0.32rem'"
              :isLazy="false"
              :isShow="false"
              :alt="'Tospino choose icon'"
            />
          </template>
          <div v-html="login_service_privacy()"></div>
        </van-checkbox>
      </div> 
  
      <!-- 忘记密码时 可以切换手机和邮箱两种方式 -->
      <!-- <div class="login-page__btm" v-if="$route.query.type === 'forgot'"> -->
      <div class="login-page__btm">
        <van-divider>{{ $t('or') }}</van-divider>
        <div class="flex login-page__btm--concat">
          <!-- facebook -->
          <!-- <a href="#">
            <BmIcon :name="'facebook-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- 电话 -->
          <!-- <a href="#">
            <BmIcon :name="'phone-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- twitter -->
          <!-- <a href="#">
            <BmIcon :name="'twitter-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- google -->
          <!-- <a href="#">
            <BmIcon :name="'google-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- 微信 -->
          <!-- <a href="#">
            <BmIcon :name="'wechat-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </a> -->
          <!-- email -->
          <nuxt-link
            v-if="$route.query.changeWay === 'phone' || !$route.query.changeWay" 
            :to="{ name: 'register', query: { type: $route.query.type === 'forgot' ? 'forgot': 'phone', changeWay: 'email' } }"
          >
            <BmIcon :name="'email-icon'" :width="'0.64rem'" :height="'0.64rem'" />
          </nuxt-link>
          <!-- 手机 -->
          <nuxt-link v-if="$route.query.changeWay === 'email'" :to="{ name: 'register', query: { type: $route.query.type === 'forgot' ? 'forgot': 'phone', changeWay: 'phone' } }">
            <BmIcon :name="'cellphone'" :width="'0.64rem'" :height="'0.64rem'" />
          </nuxt-link>
        </div>
        <!-- <div class="fs-14 tc mt-20 lh-20 login-page__btm--service" v-html="login_service_privacy()"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Field, Divider, Picker, Popup, Checkbox } from 'vant';
import { getPhonePrefix, getPhoneCode, checkPhoneCode, getEmailCode, checkEmailCode } from '@/api/login';

export default {
  components: {
    vanField: Field,
    vanDivider: Divider,
    vanPicker: Picker,
    vanPopup: Popup,
    vanCheckbox: Checkbox
  },
  data() {
    return {
      account: '',
      account_email: '',
      code: '',
      phonePrefixs: [],
      showPicker: false,
      prefixCode: '',
      countdown: 0, // 120
      isCodeFlag: false,
      isNextFlag: false,
      isType: '',
      checked: false
    }
  },
  watch: {
    "$route"(to, from) {
      this.isType = to.query.changeWay || '';
      if (to.name == 'register' && from.name == 'register') {
        this.account = '';
        this.account_email = '';
        this.code = '';
        this.countdown = 0;
      }
      
      if (to.query.changeWay !== 'email' || !to.query.changeWay) {
        this.getPhonePrefix();
      }
    }
  },
  computed: {
    title() {
      return this.$route.query.type === 'forgot' ? this.$t('forgot_password') : this.$t('individual_registration');
    }
  },
  beforeRouteEnter(to, from, next) { // 从绑定或修改页面进入重置值为空
    next(vm => {
      if (from.name === 'login') {
        vm.account = '';
        vm.account_email = '';
        vm.code = '';
        vm.countdown = 0;
      }
    });
  },
  activated() {
    // 手机号注册或者忘记密码时 需要先获取手机号前缀
    this.isType = this.$route.query.changeWay || '';
    if (this.$route.query.changeWay !== 'email' || !this.$route.query.changeWay) {
      this.getPhonePrefix()
    }
  },
  methods: {
    getPhonePrefix() { // 获取所有手机号前缀
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
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      let _axios;
      if (this.$route.query.changeWay === 'email') { // 获取邮箱验证码
        let reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
        if (!reg.test(this.account_email)) {
          this.$toast(this.$t('email_format_error'));
          return false;
        }
        _axios = getEmailCode({ email: this.account_email, userType: 'buyer', type: this.$route.query.type === 'forgot' ? 2 : 1 });
      } else { // 默认是获取手机验证码
        _axios = getPhoneCode({ phone: this.account, phonePrefix: this.prefixCode.split('+')[1], userType: 'buyer', type: this.$route.query.type === 'forgot' ? 2 : 1 });
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
    jumpPwd() { // 验证手机/邮箱号码，成功后跳转到设置密码页面 userType: 'buyer' 买家 seller 卖家 operator 运营
      if (!this.checked) {
        this.$toast({
          message: this.$t('please_read_checked')
        })
        return false;
      }
      if (this.isNextFlag) {
        return false;
      }
      this.isNextFlag = true;
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });

      let _axios;
      if (this.$route.query.changeWay === 'email') { // 校验邮箱验证码
        let reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
        if (!reg.test(this.account_email)) {
          this.$toast(this.$t('email_format_error'));
          return false;
        }
        _axios = checkEmailCode({ code: this.code, email: this.account_email, userType: 'buyer', isDelCode: 0 });
      } else { // 校验手机验证码
        _axios = checkPhoneCode({ code: this.code, phone: this.account, phonePrefix: this.prefixCode.split('+')[1], userType: 'buyer', isDelCode: 0 });
      }
      // 接口返回的操作处理
      _axios.then(() => {
        this.$toast.clear();
        this.isNextFlag = false;
        // 如果是忘记密码，手机验证通过之后跳转到设置密码页面
        if (this.$route.query.type === 'forgot') {
          let changeObj = this.$route.query.changeWay === 'email' ? { email: this.account_email } : { phone: this.account, phonePrefix: this.prefixCode.split('+')[1] }
          this.$router.push({
            name: 'register-changePwd',
            query: {
              code: this.code,
              ...changeObj
            }
          })
          return false;
        }
        // 注册手机号验证通过之后跳转到设置密码页面
        let registerQuery = this.$route.query.changeWay === 'email' ? { code: this.code, email: this.account_email } : { code: this.code,code: this.code, phone: this.account, phonePrefix: this.prefixCode.split('+')[1] };
        this.$router.push({ 
          name: 'register-password',
          query: registerQuery
        })
      }).catch(() => {
        this.isNextFlag = false;
      })
    },
    login_service_privacy() {
      return this.$t('me_read_and_agreen_server', { replace_tip: `<a class="clr-blue" href="/service/serve?isH5=1">Tospino's ${this.$t('term_of_service')}</a>`, replace_tip2: `<a class="clr-blue" href="/service/privacy?isH5=1">${this.$t('privacy_policy')}</a>` });
    }
  },
}
</script>

<style lang="less" scoped>
.prefix-container--icon{
  margin-left: 1px;
  width: 20px;
  height: 20px;
  object-fit: cover;
  vertical-align: top;
}
.verification-btn{
  padding: 5px 11px 6px 12px;
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
.register-page{
  height: calc(100vh - 46px);
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

</style>