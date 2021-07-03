<template>
  <!-- 我的-设置-账户设置-语言设置 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('common.accountLang')"></BmHeaderNav>

    <div>
      <van-cell class="p-20" title="中文简体" title-class="black" @click="changeLang('zh-CN')" />
      <van-cell class="p-20" title="中文繁体" title-class="black" @click="changeLang('zh-CN')" />
      <van-cell class="p-20" title="English" title-class="black" @click="changeLang('en')" />
      <van-cell class="p-20" title="Bahasa Melayu" title-class="black" @click="changeLang('en')" />
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
  methods: {
    changeLang(lang) { // 切换语言
      this.$store.commit('SET_LANG', lang);
    }
  },
}
</script>