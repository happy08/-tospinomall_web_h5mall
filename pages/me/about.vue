<template>
  <!-- 我的-关于Tospino页面-->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.about.title')" />
    <div class="mlr-20">
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.termMenu')" is-link title-class="black" :to="{ name: 'services-type', params: { type: 'privacy' } }" />
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.privacyMenu')" is-link title-class="black" :to="{ name: 'services-type', params: { type: 'privacy' } }" />
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.userAgreementMenu')" is-link title-class="black" :to="{ name: 'services-type', params: { type: 'about' } }" />
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';

export default {
  middleware: 'authenticated',
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  }
}
</script>