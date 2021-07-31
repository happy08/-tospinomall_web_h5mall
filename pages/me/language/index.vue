<template>
  <!-- 我的-设置-语言设置 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('common.accountLang')" />

    <div>
      <van-cell class="p-20" :title="langItem.label" :title-class="['fm-pf-r fs-14', $store.state.locale == langItem.value ? 'green' : 'black']" @click="changeLang(langItem.value)" v-for="langItem in langList" :key="'lang-' + langItem.id" />
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';
import { getLangList } from '@/api/user';

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
    this.getLangList();
  },
  methods: {
    changeLang(lang) { // 切换语言
      console.log(lang)
      this.$store.commit('SET_LANG', lang);
    },
    async getLangList() {
      const langData = await getLangList();
      if (langData.code != 0) return false;

      this.langList = langData.data;
    }
  },
}
</script>