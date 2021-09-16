<template>
  <!-- 我的-设置-语言设置 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('language_settings')" />

    <div>
      <van-cell class="p-20" :title="langItem.label" :title-class="['fm-pf-r fs-14', $store.state.locale == langItem.value ? 'green' : 'black']" @click="changeLang(langItem.value)" v-for="langItem in langList" :key="'lang-' + langItem.id" />
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
  data() {
    return {
      langList: []
    }
  },
  activated() {
    // 加载图标
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    });
    this.$api.getLangs().then(res => {
      this.$toast.clear();
      this.langList = res.data.localeList;
    });
  },
  methods: {
    changeLang(lang) { // 切换语言
      this.$store.commit('SET_LANG', lang);
    }
  },
}
</script>