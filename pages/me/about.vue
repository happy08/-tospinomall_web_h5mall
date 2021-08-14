<template>
  <!-- 我的-关于Tospino页面-->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.about.title')" />
    <div class="mlr-20">
      <!-- 服务协议 -->
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.termMenu')" is-link title-class="black" :to="{ name: 'service-type', params: { type: 'serve' }, query: { isH5: 1 } }" />
      <!-- 隐私政策 -->
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.privacyMenu')" is-link title-class="black" :to="{ name: 'service-type', params: { type: 'privacy' }, query: { isH5: 1 } }" />
      <!-- 版权信息 -->
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.userAgreementMenu')" is-link title-class="black" :to="{ name: 'service-type', params: { type: 'copyright' }, query: { isH5: 1 } }" />
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  }
}
</script>