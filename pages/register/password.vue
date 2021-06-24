<template>
  <div class="register-pwd">
    <BmHeaderNav :title="$t('register.title')"></BmHeaderNav>

    <div class="plr-20">
      <!-- 验证码 -->
      <van-field
        clickable
        :value="password"
        :placeholder="$t('register.enterPwd')"
        class="phone-code-field"
        type="password"
      />
      <p class="fs-14 register-pwd__tip">The password consists of 6-20 letters, numbers or symbols, and the letters should be case sensitive</p>
      <!-- 注册 -->
      <van-button class="mt-60 btn_h48 fw fs-16 w-100" color="linear-gradient(270deg, #3EB5AE 0%, #70CEB6 100%)">
        {{ $t('register.register') }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: ''
    }
  }
}
</script>

<style lang="less" scoped>
.register-pwd{
  height: 100vh;
  background-color: #fff;
  .register-pwd__tip{
    line-height: 21px;
    margin-top: 23px;
    color: rgba(153, 153, 153, .58);
  }
}
</style>