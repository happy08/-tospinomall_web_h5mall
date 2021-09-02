<template>
  <!-- 我的-设置-安全认证-重新绑定电话/邮箱 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="title" />

    <div class="plr-20 bg-white">
      <h3 class="fs-16 black rebind-title">{{ rebindTip }}</h3>
      <!-- 邮箱绑定 -->
      <van-field
        v-model="account"
        :placeholder="$t('e_mail_address')"
        class="field-container phone-code-field"
        type="email"
        v-if="$route.query.changeWay === 'email'" 
      />
      <!-- 手机号 --> 
      <div v-else>
        <van-field
          v-model="account"
          :placeholder="$t('phone_number')"
          class="field-container phone-code-field"
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
          <van-button class="fs-14 green lh-20 round-8 verification-btn" v-show="countdown === 0" @click="sendCode" :disabled="account.length === 0">{{ $t('get_it') }}</van-button>
          <button class="fs-14 lh-20 round-8 verification-countdown-btn" v-show="countdown > 0">{{ countdown }}S</button>
        </template>
      </van-field>
    </div>

    <div class="plr-20 w-100">
      <!-- 下一步 -->
      <BmButton class="w-100 round-8 sms-btn" @click="jump" :disabled="account.length === 0 || code.length === 0">{{ $t('next') }}</BmButton>
      <!-- 其他认证方式 -->
      <p class="fs-14 green tc mt-24" @click="goback">{{ $t('use_other_authentication_method') }}</p>

      <!-- 温馨提示 -->
      <div class="fs-14 light-grey tip-container pre-wrap" v-html="$t('forgot_password_tips')"></div>
    </div>
  </div>
</template>

<script>
import { Field, Divider, Picker, Popup } from 'vant';
import { getPhonePrefix, getPhoneCode, checkPhoneCode, getEmailCode, checkEmailCode } from '@/api/login';
import { updateUserInfo } from '@/api/user';

export default {
  middleware: 'authenticated',
  components: {
    vanField: Field,
    vanDivider: Divider,
    vanPicker: Picker,
    vanPopup: Popup
  },
  data() {
    return {
      account: '',
      showPicker: false,
      countdown: 0,
      isCodeFlag: false,
      phonePrefixs: [],
      code: '',
      prefixCode: ''
    }
  },
  computed: {
    rebindTip() {
      return this.$route.query.changeWay === 'email' ? this.$t('bind_a_new_mailbox') : this.$t('bind_mobile_phone_number')
    },
    title() {
      return this.$route.query.changeWay === 'email' ? this.$t('associated_mailbox') : this.$t('associated_number')
    }
  },
  beforeRouteEnter(to, from, next) { // 从绑定或修改页面进入重置值为空
    next(vm => {
      if (from.name === 'me-account-bind' || from.name === 'me-account-verify-code') {
        vm.account = '';
        vm.code = '';
        vm.countdown = 0;
      }
    });
  },
  activated() {
    // 手机号注册或者忘记密码时 需要先获取手机号前缀
    if (this.$route.query.changeWay !== 'email' || !this.$route.query.changeWay) {
      this.getPhonePrefix();
    }
  },
  methods: {
    getPhonePrefix() { // 获取手机号前缀
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
      // 加载图标
      this.$toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      
      let _axios;
      if (this.$route.query.changeWay === 'email') { // 获取邮箱验证码
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (!reg.test(this.account_email)) {
          this.$toast(this.$t('email_format_error'));
          return false;
        }
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
    goback() { // 返回上一级目录
      if ((this.$store.state.user.userInfo.email == '' && this.$route.query.changeType == 'email') || (this.$store.state.user.userInfo.phone == '' && this.$route.query.changeType == 'phone')) { // 首次绑定邮箱和手机号选择其他方式时返回上一页
        this.$router.go(-1);
        return false;
      }
      this.$router.replace('/me/account/bind');
    },
    jump() { // 验证手机/邮箱号码，去绑定成功后跳转到重新绑定结果展示页面
      if (this.isNextFlag) {
        return false;
      }
      this.isNextFlag = true;

      let _axios;
      if (this.$route.query.changeWay == 'email') { // 校验邮箱验证码
        _axios = checkEmailCode({ code: this.code, email: this.account, userType: 'buyer', isDelCode: 0 });
      } else { // 校验手机验证码
        _axios = checkPhoneCode({ code: this.code, phone: this.account, phonePrefix: this.prefixCode.split('+')[1], userType: 'buyer', isDelCode: 0 });
      }

      _axios.then((res) => {
        this.isNextFlag = false;
        if (res.code != 0) return false;
        // 校验成功之后提交修改
        let _userinfoAjax = this.$route.query.changeWay == 'email' ? updateUserInfo({ email: this.account, code: this.code }) : updateUserInfo({ phone: this.account, phonePrefix: this.prefixCode.split('+')[1], code: this.code });
        _userinfoAjax.then(res => {
          this.$store.commit('user/SET_USERINFO', res.data); // 修改本地用户信息
          this.$router.push({
            name: 'me-account-bind-result',
            query: {
              changeWay: this.$route.query.changeWay == 'email' ? 'email' : 'phone'
            }
          })
        })

      }).catch(() => {
        this.isNextFlag = false;
      })
    },

  },
}
</script>

<style lang="less" scoped>
.rebind-title{
  padding-top: 18px;
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
.sms-tip{
  color: #666;
}
.sms-btn{
  margin-top: 27px;
}
.tip-container{
  margin-top: 70px;
  ul>li{
    list-style: auto;
    list-style-position: inside;
    line-height: 17px;
  }
}
</style>