<template>
  <!-- 关于Tospino页面-->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.about.title')"></BmHeaderNav>
    <div class="mlr-20">
      <!-- <van-cell class="ptb-20" title="Check for update" is-link value="New" value-class="light-grey" title-class="black" @click="checkUpdate" /> -->
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.termMenu')" is-link title-class="black" :to="{ name: 'services-privacy' }" />
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.privacyMenu')" is-link title-class="black" :to="{ name: 'services-privacy' }" />
      <van-cell class="ptb-20 plr-0" :title="$t('me.about.userAgreementMenu')" is-link title-class="black" :to="{ name: 'services-about' }" />
    </div>

    <!-- 检查更新弹窗 -->
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
    checkUpdate() {
      // 检查更新
      this.$dialog.confirm({
        message: 'There is a new version, do you want to update it now',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#42B7AE',
        cancelButtonColor: '#383838',
        messageAlign: 'left'
      });
      // 
    }
  },
}
</script>