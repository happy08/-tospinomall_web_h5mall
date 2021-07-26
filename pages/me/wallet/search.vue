<template>
  <!-- 账单的搜索页面  -->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :border="false" :title="$t('common.search')" />

    <!-- 搜索框 -->
    <div class="bg-white plr-12 pb-14 border-b">
      <van-search 
        v-model="searchVal" 
        :placeholder="$t('me.wallet.searchBillPlaceholder')"
        shape="round"
      />
    </div>
  </div>
</template>

<script>
import { Search } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanSearch: Search
  },
  data() {
    return {
      searchVal: ''
    }
  }
}
</script>