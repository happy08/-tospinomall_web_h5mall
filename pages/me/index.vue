<template>
  <div>
    我的
    <!-- 登录 -->
    <BmButton v-if="!$store.state.user.token" @click="login">登录</BmButton>
    <!-- 退出 -->
    <BmButton v-if="$store.state.user.token" @click="logout">退出</BmButton>
    <!-- 底部 -->
    <BmTabbar />
  </div>
</template>

<script>
import { logout } from '@/api/login';

export default {
  // middleware: 'authenticated',
  methods: {
    logout() { // 退出登录
      logout().then(res => {
        this.$store.commit('user/SET_TOKEN', null);
      })
    },
    login() {
      this.$router.push({
        name: 'login'
      })
    }
  },
}
</script>