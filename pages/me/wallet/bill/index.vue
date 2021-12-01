<template>
  <!-- 账单 -->
  <div class="bg-grey vh-100">
    <van-sticky :class="{'is-animate': isHeader, 'wallet-search-sticky': true}">
      <BmHeaderNav :left="{ isShow: true }" :border="false" :title="$t('bill')" :class="{'is-show': isHeader}" />

      <!-- 搜索框 -->
      <!-- <div class="bg-white plr-12 ptb-10 border-b">
        <van-search 
          v-model="searchVal" 
          :placeholder="$t('bill_search_placeholder')"
          shape="round"
          @focus="isHeader = true"
          :show-action="isHeader"
          @search="onSearch"
          @cancel="onCancel"
          maxlength="30"
        />
      </div> -->
    </van-sticky>

    <!-- 账单列表 -->
    <PullRefresh :refreshing="refreshing" @refresh="onRefresh" v-if="list.length> 0">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
      >
        <div v-for="(item, index) in list" :key="index">
          <p class="fs-14 black fw ptb-10 plr-20">{{ item.dateTime}}</p>
          <p class="bg-white fs-14 light-grey ptb-14 plr-20 border-b">{{ $t('expenses_income', { replace_tip: $store.state.rate.currency + item.expenditureAmount, replace_tip2: $store.state.rate.currency + item.incomeAmount }) }}</p>
          <nuxt-link :to="{ name: 'me-wallet-bill-id', params: { id: itemInfo.id } }" v-for="(itemInfo, itemInfoIndex) in item.infos" :key="'info-' + itemInfoIndex" class="bg-white plr-12 block">
            <div class="pb-12 pt-20 bg-white flex between vcenter border-b">
              <div class="flex">
                <BmImage 
                  :url="require('@/assets/images/icon/' + itemInfo.payTypeLabel)"
                  :width="'0.8rem'" 
                  :height="'0.8rem'"
                  :isLazy="false"
                  :isShow="false"
                  :round="true"
                />
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
    </PullRefresh>

    <empty-status v-else :image="require('@/assets/images/empty/order.png')" :description="$t('empty')" />
  </div>
</template>

<script>
import { Search, Sticky, List } from 'vant';
import Moment from 'moment';
import { getBillList } from '@/api/pay';
import EmptyStatus from '@/components/EmptyStatus';
import PullRefresh from '@/components/PullRefresh';

export default {
  middleware: 'authenticated',
  components: {
    vanSearch: Search,
    vanSticky: Sticky,
    vanList: List,
    EmptyStatus,
    PullRefresh
  },
  data() {
    return {
      searchVal: '',
      list: [],
      pageNum: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      refreshing: {
        isFresh: false
      },
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
    this.searchVal = '';
    this.getBillList();
  },
  methods: {
    getBillList(flag) { // 获取支付列表
      getBillList({ pageNum: this.pageNum, pageSize: this.pageSize, type: 0, title: this.searchVal }).then(res => {
        this.refreshing.isFresh = false;
        // 加载状态结束
        this.loading = false;
        if (res.code != 0) return false;
        this.total = parseFloat(res.data.total);
        let list = [];
        // 0:系统支付， 1:余额支付，2:UniwalletPay支付 3 TINGG支付 4:brij 支付 5, 货到付款签收支付 6, paySwitch 支付
        list = res.data.records.map(item => {
          return {
            ...item,
            infos: item.infos.map(infoItem => {
              return {
                ...infoItem,
                payTypeLabel: infoItem.payType == 2 ? 'MTN.png' : infoItem.payType == 3 ? 'Tingg.png' : infoItem.payType == 4 ? 'Brij.png' : infoItem.payType == 1 ? 'Balances.png' : 'SystemPay.png',
                statusLabel: infoItem.status == 1 ? this.$t('bill_success') : infoItem.status == 2 ? this.$t('bill_to_pay') : infoItem.status == 3 ? this.$t('cancelled') : this.$t('bill_fail'),
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
.is-animate{
  animation: all 1s;
}
</style>

<style lang="less">
.wallet-search-sticky .van-sticky{
  background-color: #fff;
}
</style>