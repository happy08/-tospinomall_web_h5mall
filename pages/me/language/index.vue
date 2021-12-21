<template>
  <!-- 我的-设置-语言设置 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('language_settings')">
      <div slot="header-right" class="green" @click="onConfirm">
        {{ $t('done') }}
      </div>
    </BmHeaderNav>

    <div>
      <van-cell class="p-20" :title="langItem.label" :title-class="['fm-pf-r fs-14', locale == langItem.value ? 'green' : 'black']" @click="locale = langItem.value" v-for="langItem in langList" :key="'lang-' + langItem.id" />
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
      langList: [],
      locale: this.$store.state.locale
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
      this.$store.commit('SET_LANGLIST', res.data.localeList.map(item => {
        return item.value;
      }));
      this.locale = this.$store.state.locale || res.data.defaultLocale;
    }).catch(error => {
      console.log(error);
    })
  },
  methods: {
    onConfirm() { // 切换语言
      this.$cookies.set('lang', this.locale);
      // this.$store.commit('SET_LANG', this.locale);
      location.href = '/';
    }
  },
}
</script>