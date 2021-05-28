<template>
  <div class="container">
    <BmButton @click="changeLocale('en')">{{ $t("app.search") }}</BmButton>
    <BmButton @click="click">{{ $t("app.search") }}</BmButton>
  </div>
</template>

<script>
import { Dialog } from "vant";

export default {
  components: {},
  methods: {
    click() {
      this.$api.nuxtApi();
      Dialog({ message: "提示" });
    },

    // 切换语言
    changeLocale(locale) {
      this.$i18n.locale = locale;
      this.$store.commit("SET_LANG", locale);
    }
  }
};
</script>

<style></style>
