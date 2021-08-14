<template>
  <!-- 我的-消息列表 -->
  <div class="vh-100 bg-grey pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="'消息'" :fixed="true" />
  </div>
</template>

<script>
import { List } from 'vant';
import { getMsgList } from '@/api/message';

export default {
  comments: {
    vanList: List
  },
  data() {
    return {
      messageList: [],
      pageNum: 1,
      pageSize: 10
    }
  },
  activated() {
    getMsgList({ pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
      console.log(res)
    })
  }
}
</script>