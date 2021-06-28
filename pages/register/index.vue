<template>
  <div>
    <BmHeaderNav :left="{ isShow: true, url: '/login/login' }" :title="title"></BmHeaderNav>
    <div class="mlr-20 pb-30 flex between column register-page">
      <div>
        <!-- 邮箱 -->
        <van-field
          v-model="account"
          :placeholder="$t('login.enterEmail')"
          class="field-container phone-code-field"
          type="email"
          v-if="$route.query.changeWay === 'email'" 
        />
        <!-- 手机号 --> 
        <div v-else>
          <van-field
            v-model="account"
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
        </div>
        <!-- 验证码 -->
        <van-field
          v-model="code"
          center
          clearable
          :placeholder="$t('login.enterCode')"
          class="field-container"
        >
          <template #button>
            <van-button class="fs-14 green verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="account.length === 0">Get It</van-button>
            <button class="fs-14 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
          </template>
        </van-field>
        <!-- 注册，点击跳转到设置密码页面 -->
        <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)" :disabled="account.length === 0 || code.length === 0" @click="jumpPwd">
          {{ $t('common.next') }}
        </van-button> 
      </div>
  
      <!-- 忘记密码时 可以切换手机和邮箱两种方式 -->
      <div class="login-page__btm" v-if="$route.query.type === 'forgot'">
        <van-divider>{{ $t('common.or') }}</van-divider>
        <div class="flex login-page__btm--concat">
          <!-- facebook -->
          <i class="iconfont login-page__btm--concat--icon clr-blue">&#xe600;</i>
          <!-- 电话 -->
          <i class="iconfont login-page__btm--concat--icon clr-green">&#xe6cc;</i>
          <!-- twitter -->
          <i class="iconfont login-page__btm--concat--icon clr-wathet">&#xe601;</i>
          <!-- 手机 -->
          <nuxt-link v-if="$route.query.changeWay === 'email'" :to="{ name: 'register', query: { type: 'forgot' } }">
            <i class="iconfont login-page__btm--concat--icon clr-purple">&#xe617;</i>
          </nuxt-link>
          <!-- email -->
          <nuxt-link v-if="$route.query.changeWay === 'telephone' || !$route.query.changeWay" :to="{ name: 'register', query: { type: 'forgot', changeWay: 'email' } }">
            <i class="iconfont login-page__btm--concat--icon clr-brownred">&#xe635;</i>
          </nuxt-link>
        </div>
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
      account: '',
      code: '',
      phonePrefixs: [],
      showPicker: false,
      prefixCode: '',
      countdown: 0, // 120
      isCodeFlag: false,
      isNextFlag: false
    }
  },
  watch: {
    "$route"(e) {
      console.log(e.query.changeWay)
      if (e.query.changeWay !== 'email' || !e.query.changeWay) {
        this.getPhonePrefix()
      }
    }
  },
  computed: {
    title() {
      return this.$route.query.type === 'forgot' ? this.$t('forgot.title') : this.$t('register.register');
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
      this.$api.phonePrefix().then(res => {
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
        _axios = this.$api.getEmailCode(`email=${this.account}&userType=buyer`);
      } else { // 默认是获取手机验证码
        _axios = this.$api.getPhoneCode(`phone=${this.account}&phonePrefix=${this.prefixCode.split('+')[1]}&userType=buyer`);
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
    jumpPwd() { // 验证手机号码，成功后跳转到设置密码页面 userType: 'buyer' 买家 seller 卖家 operator 运营
      if (this.isNextFlag) {
        return false;
      }
      this.isNextFlag = true;

      let _axios;
      console.log(this.$route.query)
      if (this.$route.query.changeWay === 'email') { // 校验邮箱验证码
        _axios = this.$api.checkEmailCode({ code: this.code, email: this.account, userType: 'buyer' });
      } else { // 校验手机验证码
        _axios = this.$api.checkPhoneCode({ code: this.code, phone: this.account, phonePrefix: this.prefixCode.split('+')[1], userType: 'buyer' });
      }
      // 接口返回的操作处理
      _axios.then(res => {
        this.isNextFlag = false;
        // 如果是忘记密码，手机验证通过之后跳转到设置密码页面
        if (this.$route.query.type === 'forgot') {
          let changeObj = this.$route.query.changeWay === 'email' ? { email: this.account } : { phone: this.account, phonePrefix: this.prefixCode.split('+')[1] }
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
        this.$router.push({ 
          name: 'register-password',
          query: {
            code: this.code,
            phone: this.account,
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
  padding-top: 50px;
  height: calc(100vh - 46px);
  .login-page__btm{
    .login-page__btm--concat{
      margin: 0 auto;
      width: fit-content;
      .login-page__btm--concat--icon{
        font-size: 32px;
        margin-left: 18px;
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
        &.clr-brownred{
          color: #DB4437;
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