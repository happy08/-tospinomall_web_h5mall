<template>
  <!-- 消息列表查询 -->
  <div class="pt-46 v-percent-100 bg-grey">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('message')" :fixed="true" />

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
      >
        <div v-for="(item, index) in lists" :key="index">
          <div class="bg-light-dd ptb-10 plr-12 fs-12 white round-16 message-time">{{ item.sendTime }}</div>
          <div class="bg-white plr-12 ptb-20 round-8 mlr-12">
            <h3 class="black fs-16">{{ item.title }}</h3>
            <p class="mt-12 fs-14 light-grey word-break">{{ item.content }}</p>
          </div>
        </div>
      </van-list>
    </PullRefresh>
  </div>
</template>

<script>
import { getMsgList, markedSingleAsRead } from '@/api/message';
import { List } from 'vant';
import PullRefresh from '@/components/PullRefresh';

export default {
  components: {
    vanList: List,
    PullRefresh
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      lists: [],
      refreshing: {
        isFresh: false
      },
      loading: false,
      finished: false,
      total: 0
    }
  },
  activated() {
    this.getMsgList();
  },
  methods: {
    getMsgList() { // 获取消息列表
      getMsgList({categoryId: this.$route.params.id, pageNum: this.pageNum, pageSize: this.pageSize}).then(res => {
        this.lists = this.pageNum == 1 ? res.data.records : this.lists.concat(res.data.records);
        this.total = res.data.total;
        this.loading = false;
        this.refreshing.isFresh = false;
        // 标记为已读
        markedSingleAsRead(this.$route.params.id);
      })
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      this.getMsgList();
    },
    onLoad() { // 加载更多
      if (this.total == this.lists.length) {
        this.loading = false;
        this.finished = true;
        return false;
      }
      this.pageNum += 1;
      this.getMsgList();
    }
  },
}
</script>

<style lang="less" scoped>
.bg-light-dd{
  background-color: #ddd;
}
.round-16{
  border-radius: 16px;
}
.message-time{
  width: fit-content;
  margin: 22px auto 8px;
}
.word-break{
  word-break: break-all;
}
</style>