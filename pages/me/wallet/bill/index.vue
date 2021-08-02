<template>
  <!-- 账单 -->
  <div class="bg-grey vh-100">
    <van-sticky>
      <BmHeaderNav :left="{ isShow: true }" :border="false" :title="$t('me.wallet.bill')" :class="{'is-show': isHeader}" />

      <!-- 搜索框 -->
      <div class="bg-white plr-12 pt-4 pb-10 border-b">
        <van-search 
          v-model="searchVal" 
          :placeholder="$t('me.wallet.searchBillPlaceholder')"
          shape="round"
          @focus="isHeader = true"
          :show-action="isHeader"
          @search="onSearch"
          @cancel="onCancel"
        />
      </div>
    </van-sticky>

    <!-- 账单列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="list.length> 0">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="(item, index) in list" :key="index">
          <p class="fs-14 black fw ptb-10 plr-20">{{ item.dateTime}}</p>
          <p class="bg-white fs-14 light-grey ptb-14 plr-20 border-b">Expenses{{ $store.state.rate.currency }}{{ item.expenditureAmount }} Income {{ $store.state.rate.currency }}{{ item.incomeAmount }}</p>
          <nuxt-link :to="{ name: 'me-wallet-bill-id', params: { id: itemInfo.id } }" v-for="(itemInfo, itemInfoIndex) in item.infos" :key="'info-' + itemInfoIndex" class="bg-white plr-12 block">
            <div class="pb-12 pt-20 bg-white flex between vcenter border-b">
              <div class="flex">
                <!-- <BmImage 
                  :url="require('@/assets/images/icon/' + item.payTypeLabel)"
                  :width="'0.48rem'" 
                  :height="'0.48rem'"
                  :isLazy="false"
                  :isShow="false"
                  :round="true"
                /> -->
                <!-- 名字和时间 -->
                <div class="ml-12 fm-helvetica">
                  <p class="fs-14 black">{{ itemInfo.title }}</p>
                  <p class="mt-4 fs-14 grey-45">{{ itemInfo.createTime}}</p>
                </div>
              </div>
              <!-- 成功/失败 金额 -->
              <div class="tr fm-helvetica">
                <p class="grey-45 fs-14">{{ itemInfo.statusLabel }}</p>
                <p class="mt-10 amount-color fs-12">{{ itemInfo.collectPaymentType == 1 ? '+' : '-' }}{{ $store.state.rate.currency }}{{ itemInfo.realAmount }}</p>
              </div>
            </div>
          </nuxt-link>
          
        </div>
      </van-list>
    </van-pull-refresh>

    <empty-status v-else :image="require('@/assets/images/empty/order.png')" />
  </div>
</template>

<script>
import { Search, Sticky, List, PullRefresh } from 'vant';
import Moment from 'moment';
import { getBillList } from '@/api/pay';
import EmptyStatus from '@/components/EmptyStatus';

export default {
  middleware: 'authenticated',
  components: {
    vanSearch: Search,
    vanSticky: Sticky,
    vanList: List,
    vanPullRefresh: PullRefresh,
    EmptyStatus
  },
  data() {
    return {
      searchVal: '',
      list: [],
      pageNum: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      refreshing: false,
      total: 0,
      isHeader: false,
      searchList: []
    }
  },
  filters: {
    dateFormat(val, isDay) {
      return isDay ? Moment(val).format('MMM.DD.YYYY') : Moment(val).format('MMM.YYYY');
    }
  },
  activated() {
    this.getBillList();
  },
  methods: {
    getBillList(flag) {
      getBillList({ pageNum: this.pageNum, pageSize: this.pageSize, type: 0, title: this.searchVal }).then(res => {
        this.refreshing = false;
        // 加载状态结束
        this.loading = false;
        if (res.code != 0) return false;
        this.total = parseFloat(res.data.total);
        let list = [];
        list = res.data.records.map(item => {
          return {
            ...item,
            infos: item.infos.map(infoItem => {
              return {
                ...infoItem,
                payTypeLabel: infoItem.payType == 2 ? 'MTN.png' : infoItem.payType == 3 ? 'VODAFONE.png' : infoItem.payType == 4 ? 'ARTLTIGO.png' : 'MTN.png',
                statusLabel: infoItem.status == 1 ? '成功' : infoItem.status == 2 ? '待支付' : infoItem.status == 3 ? '已取消' : '失败',
              }
            })
          }
        });

        if (flag === true) {
          this.list.concat(list);
        } else {
          this.list = list;
        }
        
      }).catch(() => {
        this.refreshing = false;
        this.loading = false;
      })
    },
    onRefresh() { // 下拉刷新
      this.pageNum = 1;
      this.getBillList();
    },
    onLoad() { // 加载更多
      if (this.total == this.list.length) { // 没有下一页了
        this.finished = true;
        this.loading = false;
        return false;
      }
      this.pageNum += 1;
      this.getBillList(true);
    },
    onSearch() {
      this.pageNum = 1;
      this.getBillList();
    },
    onCancel() {
      this.isHeader = false;
      this.searchVal = '';
      this.pageNum = 1;
      this.getBillList();
    }
  },
}
</script>

<style lang="less" scoped>
.pb-14{
  padding-bottom: 14px;
}
.ptb-14{
  padding-top: 14px;
  padding-bottom: 14px;
}
.amount-color{
  color: #EC500D;
}
.grey-45{
  color: rgba(0, 0, 0, .45);
}
.is-show{
  display: none;
  animation: all 1s;
}
</style>