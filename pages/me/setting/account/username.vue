<template>
  <!-- 我的-设置-账户设置-用户信息-修改昵称/姓名 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('me.userInfo.modifyNameTitle')">
      <div slot="header-right" class="green" @click="onConfirm">
        {{ $t('common.done') }}
      </div>
    </BmHeaderNav>

    <van-field v-model="name" class="p-20" clearable maxlength="30" />
    <p class="mt-10 fs-14 plr-20 username-tip">{{ $t('me.userInfo.characterTip') }}</p>
  </div>
</template>

<script>
import { Field } from 'vant';

export default {
  components: {
    vanField: Field
  },
  data() {
    return {
      name: '',
      type: ''
    }
  },
  created() {
    this.name = this.$route.query.name;
    this.type = this.$route.query.type; // name nickname
  },
  methods: {
    onConfirm() { // 提交信息
      if (this.nickname.length < 4) { // 长度要大于4
        return false;
      }
    }
  },
}
</script>

<style lang="less" scoped>
.username-tip{
  color: #BFBFBF;
}
</style>