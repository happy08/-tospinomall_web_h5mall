<template>
  <!-- 我的-消息分类列表 -->
  <div class="v-percent-100 bg-grey pt-46">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('message')" :fixed="true">
      <div slot="header-right">
        <BmImage 
          :url="require('@/assets/images/icon/clear-icon.png')"
          :width="'0.48rem'" 
          :height="'0.48rem'"
          :isLazy="false"
          @onClick="deleteFn"
          :alt="'Tospino clear icon'"
        />
      </div>
    </BmHeaderNav>

    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" class="custom-min-height-46">
      <van-cell-group>
        <van-cell class="p-20" v-for="(messageItem, messageIndex) in messageList" :key="messageIndex" :value="messageItem.sendTime" :label="messageItem.title" label-class="light-grey fs-14 ml-36" title-class="flex-3" value-class="flex-2" @click="goCategoryList(messageItem.id)">
          <template #title>
            <div class="flex vcenter">
              <BmImage 
                :url="messageItem.icon"
                :width="'0.48rem'" 
                :height="'0.48rem'"
                :isLazy="false"
                :isShow="true"
                :alt="messageItem.categoryName"
              />
              <span class="ml-12 fs-16 black fw">{{ messageItem.categoryName }}</span>
              <van-badge :content="messageItem.msgCount" class="ml-12" v-if="messageItem.msgCount > 0"></van-badge>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </PullRefresh>
  </div>
</template>

<script>
import { List, Cell, CellGroup, Badge } from 'vant';
import { getMsgCategory, markedAsReadAll } from '@/api/message';
import PullRefresh from '@/components/PullRefresh';

export default {
  middleware: 'authenticated',
  components: {
    vanList: List,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanBadge: Badge,
    PullRefresh
  },
  data() {
    return {
      messageList: [],
      refreshing: {
        isFresh: false
      }
    }
  },
  activated() {
    this.getMsgCategory();
  },
  methods: {
    getMsgCategory() { // 查询消息分类列表
      getMsgCategory().then(res => {
        let stickArr = res.data.filter(item => { // id = 0 置顶
          return item.id == 0;
        });
        let list = res.data.filter(item => {
          return item.id != 0;
        });
        this.messageList = [
          ...stickArr,
          ...list
        ];
        let msgArr = this.messageList.filter(msgItem => {
          return parseFloat(msgItem.msgCount) > 0
        })
        if (msgArr.length == 0) {
          this.$store.commit('user/SET_ISNEWMESSAGE', false);
        }
        this.refreshing.isFresh = false;
      })
    },
    goCategoryList(id) {
      this.$router.push({
        name: 'me-message-category-id',
        params: {
          id: id
        }
      })
    },
    onRefresh() { // 下拉刷新
      this.getMsgCategory();
    },
    deleteFn() { // 清除未读消息
      markedAsReadAll().then(() => {
        this.getMsgCategory();
        this.$store.commit('user/SET_ISNEWMESSAGE', false);
      })
    }
  },
}
</script>

<style lang="less" scoped>
.ml-36{
  margin-left: 36px;
}
.flex-2{
  flex: 2;
}
.flex-3{
  flex: 3;
}
</style>