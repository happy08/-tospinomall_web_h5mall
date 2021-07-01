<template>
  <!-- 关于Tospino页面-->
  <div>
    <BmHeaderNav :left="{ isShow: true }" :title="'About Tospino'"></BmHeaderNav>
    <div class="mlr-20 plr-0">
      <van-cell class="ptb-20" title="Check for update" is-link value="New" value-class="light-grey" title-class="black" @click="checkUpdate" />
      <van-cell class="ptb-20" title="Term of Service" is-link value="" value-class="light-grey" title-class="black" to="" />
      <van-cell class="ptb-20" title="Privacy policy" value="" value-class="light-grey" title-class="black" to="" />
      <van-cell class="ptb-20" title="User agreement" value="" value-class="light-grey" title-class="black" to="" />
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
      this.$dialog.confirm({
        message: 'There is a new version, do you want to update it now',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#42B7AE',
        cancelButtonColor: '#383838'
      });
    }
  },
}
</script>