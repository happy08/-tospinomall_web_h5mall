<template>
  <!-- 我的-设置-账户设置-用户信息-修改昵称/姓名 -->
  <div class="bg-grey vh-100">
    <BmHeaderNav :left="{ isShow: true }" :title="$route.query.type == 'username' ? $t('modify_user_name') : $t('modify_nickname')">
      <div slot="header-right" class="green" @click="onConfirm">
        {{ $t('done') }}
      </div>
    </BmHeaderNav>

    <van-field v-model="name" class="p-20" clearable maxlength="30" />
    <p class="mt-10 fs-14 plr-20 username-tip">{{ $t('characters_limit') }}</p>
  </div>
</template>

<script>
import { Field } from 'vant';
import { updateUserInfo } from '@/api/user';

export default {
  middleware: 'authenticated',
  components: {
    vanField: Field
  },
  data() {
    return {
      name: '',
      type: ''
    }
  },
  activated() {
    this.name = this.$route.query.name;
    this.type = this.$route.query.type; // name nickname
  },
  methods: {
    onConfirm() { // 提交信息
      if (this.name.length < 4) { // 长度要大于4
        this.$toast({
          type: 'fail',
          message: this.$t('characters_limit'),
        })
        return false;
      }
      
      updateUserInfo({ [this.type]: this.name }).then(res => {
        this.$store.commit('user/SET_USERINFO', res.data);
        history.back();
        // this.$toast({
        //   type: 'success',
        //   message: '修改成功',
        //   onClose() { // 返回上一页
        //     history.back();
        //   }
        // })
      })
    }
  },
}
</script>

<style lang="less" scoped>
.username-tip{
  color: #BFBFBF;
}
</style>