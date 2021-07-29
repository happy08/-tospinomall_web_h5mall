<template>
  <!-- 首页-头部-搜索页面 -->
  <div :class="{'vh-100': true, 'bg-grey': !isShowTip}">
    <BmHeaderNav :left="{ isShow: true }" :title="$t('common.search')" :border="false" />
    <!-- 搜索 -->
    <van-search
      v-model="searchVal"
      shape="round"
      :placeholder="hintName"
      class="plr-20 bg-white ptb-12 border-b"
      @input="inputChange"
      @search="onSearch"
      @focus="onFocus"
      ref="searchContainer"
    />
    <!-- 搜索列表展示 -->
    <template v-if="isShowTip === -1">
      <div class="bg-white">
        <van-cell class="ptb-20 plr-20" v-for="(pullItem, pullIndex) in searchPullList" :key="pullIndex" :title="pullItem.suggestion" :value="''" value-class="light-grey" title-class="black" @click="toSearch(pullItem)" />
      </div>
    </template>

    <template v-if="isShowTip != -1">
      <div class="mlr-20 mt-12" v-show="isShowTip">
        <!-- 搜索历史 -->
        <h2 class="fs-14 black flex between vcenter" v-if="searchHistoryList.length > 0">
          <span>{{ $t('search.history') }}</span>
          <BmIcon :name="'shanchu'" :width="'0.32rem'" :height="'0.32rem'" @iconClick="deleteFn" />
        </h2>
        <div class="mt-12 flex flex-wrap">
          <span class="plr-10 round-8 mr-10 iblock mb-10 lh-20 tag-name" v-for="(tagItem, tagIndex) in searchHistoryList" :key="tagIndex" @click="onSearch(tagItem)">{{ tagItem }}</span>
          <BmIcon :name="'down-icon'" :width="'0.64rem'" :height="'0.64rem'" v-if="historyNum" @iconClick="showMoreHistory" />
        </div>
        <!-- 搜索发现 -->
        <h2 class="fs-14 black mt-30">{{ $t('search.found') }}</h2>
        <div class="mt-12">
          <span class="plr-10 round-8 mr-12 iblock mb-10 tag-name" v-for="(tag, index) in searchFindList" :key="index" @click="onSearch(tag.name)">{{ tag.name }}</span>
        </div>
      </div>

      <div v-show="!isShowTip">
        <!-- 分类 -->
        <div class="flex between vcenter plr-20 bg-white">
          <van-tabs sticky swipeable animated :offset-top="104" color="#42B7AE"  @change="getSearchList" @disabled="filterPopup = true" class="customs-van-tabs" v-model="typeActive" line-height="0" :ellipsis="false">
            <van-tab v-for="(productItem, tabIndex) in tabs" :title="productItem.name" :key="'scroll-tab-' + tabIndex" title-class="p-0 pr-60" :name="productItem.type" :disabled="productItem.type == 2">
              <template #title="props" v-if="productItem.type === 0">
                {{ props }}
                <van-dropdown-menu active-color="#42B7AE" class="custom-dropdown-menu">
                  <van-dropdown-item v-model="dropdownVal" :options="dropdownOption" />
                </van-dropdown-menu>
              </template>
            </van-tab>
          </van-tabs>

          <!-- 展示一列或者两列 -->
          <van-icon :name="require('@/assets/images/icon/arrange-'+arrangeType+'.svg')" size="0.38rem" @click="changeArrange" />
        </div>

        <div :class="{'w-100': true, 'plr-20 bg-white': arrangeType == 1, 'plr-12': arrangeType == 2} ">
          <!-- 空状态  -->
          <empty-status v-if="list.length === 0" :image="require('@/assets/images/empty/order.png')" :description="$t('common.noRecord')"/>
          <div 
            :class="{'flex between flex-wrap w-100': arrangeType == 2}"
            v-else>
              <nuxt-link 
                v-for="(searchItem, searchIndex) in list" 
                :key="'search-list-' + searchIndex"
                :to="{ name: 'cart-product-id', params: { id: searchItem.productId } }"
                >
                <!-- 商品展示两列 -->
                <ProductTopBtmSingle
                  :img="{ url: searchItem.mainPictureUrl, width: '3.4rem', height: '3.4rem', loadImage: require('@/assets/images/product-bgd-170.png') }" 
                  :detail="{ desc: searchItem.productTitle, price: searchItem.productPrice, rate: searchItem.starLevel, volumn: searchItem.saleCount, ellipsis: 2, country: searchItem.supplyCountryName, country_url: searchItem.supplyCountryIcon }"
                  class="round-4 bg-white hidden mt-12"
                  v-if="arrangeType === 2"
                ></ProductTopBtmSingle>
                <!-- 商品展示一列 -->
                <div v-if="arrangeType === 1" :class="{'flex vcenter pt-20 pb-30 hidden bg-white': true, 'border-229': searchIndex !== list.length - 1} ">
                  <div>
                    <BmImage 
                      :url="searchItem.mainPictureUrl"
                      :width="'1.8rem'" 
                      :height="'1.8rem'"
                      :fit="'cover'"
                      class="border round-4"
                    ></BmImage>
                  </div>
                  <div class="ml-14 w-230 hidden-1">
                    <p class="fs-14 black hidden-1" v-html="searchItem.productTitle"></p>
                    <p class="mt-8 fs-14 light-grey">Ships from {{ searchItem.supplyCountryName }} </p>
                    <div class="mt-16 flex vcenter between">
                      <div>
                        <span class="red fs-18">{{ $store.state.rate.currency }}{{ searchItem.productPrice }}</span>
                        <span class="fs-10 line-through bg-grey ml-8">{{ $store.state.rate.currency }}{{ searchItem.promotionPrice }}</span>
                      </div>
                      <div class="fs-14 black">{{ searchItem.saleCount }}+Sold</div>
                    </div>
                  </div>
                </div>
              </nuxt-link>
          </div>

        </div>
      </div>
    </template>

    <!-- 弹窗筛选 -->
    <van-popup
      v-model="filterPopup"
      position="right"
      class="product-search"
    >
      <div class="v-100">
        <div class="plr-12 product-search-filter">
          <h3 class="fs-16 black fw">Price range</h3>
          <!-- 价格区间 -->
          <div class="mt-20 flex between vcenter">
            <van-field v-model="minPrice" type="number" size="small" class="bg-grey-f5 round-8 mr-8 lh-1 ptb-6" placeholder="minimum price" />
            -
            <van-field v-model="maxPrice" type="number" size="small" class="bg-grey-f5 round-8 ml-8 lh-1 ptb-6" placeholder="highest price" />
          </div>
          <!-- 服务/折扣 -->
          <div class="mt-32">
            <h3 class="fs-16 black fw">Service/Discount</h3>
            <div class="mt-6 flex flex-wrap">
              <span class="ptb-6 black fs-14 lh-20 tc w-130 mt-14 ml-10 odd-0 plr-4 hidden-1 bg-grey-f5 round-8">Tospino logistics</span>
              <span class="ptb-6 black fs-14 lh-20 tc w-130 mt-14 ml-10 odd-0 plr-4 hidden-1 bg-grey-f5 round-8">Only see stock</span>
              <span class="ptb-6 black fs-14 lh-20 tc w-130 mt-14 ml-10 odd-0 plr-4 hidden-1 bg-grey-f5 round-8">Tospino logistics</span>
            </div>
          </div>
          <!-- 品牌 -->
          <div class="mt-32">
            <h3 class="fs-16 black fw">品牌</h3>
            <div class="mt-6 flex flex-wrap">
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">士力架</span>
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">德芙</span>
            </div>
          </div>
          <!-- 所有类别 -->
          <div class="mt-32">
            <h3 class="fs-16 black fw">品牌</h3>
            <div class="mt-6 flex flex-wrap">
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">Tospino</span>
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">Only see stock</span>
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">logistics</span>
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">logistics</span>
            </div>
          </div>
          <!-- 所有类别 -->
          <div class="mt-32">
            <h3 class="fs-16 black fw">All Categories</h3>
            <div class="mt-6 flex flex-wrap">
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">Tospino logistics</span>
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">Only see stock</span>
              <span class="ptb-6 black fs-14 lh-20 tc w-84 mt-14 ml-10 odd-3 plr-4 hidden-1 bg-grey-f5 round-8">Tospino logistics</span>
            </div>
          </div>
        </div>
      </div>

      <div class="product-search__btn flex">
        <button class="red fw fs-16 product-search__btn--reset" @click="onReset">Reset</button>
        <button class="white fw fs-16 bg-green-linear" @click="onFilter">Determine</button>
      </div>
    </van-popup>
    
  </div>
</template>

<script>
import { Search, Tab, Tabs, DropdownItem, DropdownMenu, Popup, Field, Cell } from 'vant';
import ProductTopBtmSingle from '@/components/ProductTopBtmSingle';
import EmptyStatus from '@/components/EmptyStatus';
import { getSearchPull } from '@/api/search';
function debounce (fn,wait) {
  var timer = null;
  return function(){
      if(timer !== null){
          clearTimeout(timer);
      }
      timer = setTimeout(fn,wait);
  }
}
export default {
  components: {
    vanSearch: Search,
    vanTab: Tab,
    vanTabs: Tabs,
    vanDropdownItem: DropdownItem,
    vanDropdownMenu: DropdownMenu,
    vanPopup: Popup,
    vanField: Field,
    vanCell: Cell,
    EmptyStatus,
    ProductTopBtmSingle
  },
  data() {
    return {
      arrangeType: 1,
      tabs: [
        {
          name: '综合排序',
          type: 0,
          key: ''
        },
        {
          name: '销量',
          type: 1,
          key: 'sale_count'
        },
        {
          name: '筛选',
          type: 2
        }
      ],
      typeActive: 0,
      dropdownOption: [
        { text: '综合排序', value: 0 },
        { text: '价格升序', value: 1 },
        { text: '价格降序', value: 2 }
      ],
      dropdownVal: 0,
      sortMap: {},
      filterPopup: false,
      minPrice: '',
      maxPrice: '',
      searchVal: '',
      isShowTip: true,
      list: [],
      historyNum: false,
      searchHistoryList: [],
      searchPullList: [],
      inputChange: null,
      searchFindList: [],
      hintName: ''
    }
  },
  async fetch() {
    this.searchVal = this.$route.query.val || ''; // 搜索value
    this.isShowTip = this.searchVal.length > 0 ? false : true;

    let _params = this.$route.query;
    delete _params.val;

    // 如果带着搜索的参数跳转过来的需要先获取相对应的搜索数据
    if (this.searchVal != '') {
      this.$store.commit('user/SET_SEARCHLIST', this.searchVal); // 搜索历史存储
      // 获取搜索列表数据
      const listData = await this.$api.getProductSearch(_params);
      // 数据列表需要格式化
      this.list = listData.data.items.map(item => {
        return {
          ...item,
          starLevel: parseFloat(item.starLevel)
        }
      });
      this.$store.commit('user/SET_SEARCHLIST', this.searchVal); // 搜索历史存储
      // 更新页面展示
      this.searchHistoryList = this.$store.state.user.searchList.filter((item, index) => {
        return index < 6;
      });
    }

    // 搜索发现数据
    const findList = await this.$api.getSearchHot();
    this.searchFindList = findList.data.result;

    // 获得底纹词
    const hintList = await this.$api.getHintResult();
    this.hintName = hintList.data.result[0].name;
  },
  watch: {
    '$route'(e) {
      this.$fetch();
    }
  },
  mounted() {
    if (this.searchVal == '') { // 没有带参数进来的时候，搜索输入框需要自动聚焦
      this.$nextTick(() => {
        this.$refs.searchContainer.querySelector('input').focus();
      })
    }
    this.searchHistoryList = this.$store.state.user.searchList.filter((item, index) => {
      return index < 6;
    });
    this.historyNum = this.$store.state.user.searchList.length > 6 ? true: false;
    // 搜索防抖
    this.inputChange = this.$utils.debounce((e) => {
      this.isShowTip = e[0].length > 0 && this.list.length === 0 ? -1 : e[0].length === 0;
      this.getSearchPull();
    }, 300);
  },
  activated() {
    this.$fetch();
  },
  methods: {
    deleteFn() { // 删除历史记录
      this.$dialog.confirm({
        message: '确认删除全部历史记录',
      }).then(() => { // 确认删除历史记录
        this.$store.commit('user/SET_SEARCHLIST', null);
        this.searchHistoryList = [];
      })
    },
    changeArrange() { // 切换展示样式 1列 2列
      this.arrangeType = this.arrangeType === 1 ? 2 : 1;
    },
    getSearchList(name, title) { // 获取分类列表
      console.log(name, title)
    },
    onSearch(val) { // 搜索
      let value = val;
      if (!val && this.hintName) value = this.hintName;
      this.$store.commit('user/SET_SEARCHLIST', value); // 搜索历史存储
      // 更新页面展示
      this.searchHistoryList = this.$store.state.user.searchList.filter((item, index) => {
        return index < 6;
      });
      this.searchVal = value;
      // 获取搜索列表
      this.$api.getProductSearch({ searchKeyword: value }).then(res => {
        this.list = res.data.items.map(item => {
          return {
            ...item,
            starLevel: parseFloat(item.starLevel)
          }
        });
        this.isShowTip = false;
      })
    },
    onFocus() { // 获取焦点之后，不展示数据列表和历史数据
      this.isShowTip = this.searchVal.length > 0 ? -1 : this.searchVal.length === 0;
    },
    onFilter() { // 筛选

    },
    onReset() { // 筛选重置

    },
    showMoreHistory() { // 展示更多的搜索历史
      this.historyNum = false;
      this.searchHistoryList = this.$store.state.user.searchList;
    },
    toSearch(item) {
      this.$store.commit('user/SET_SEARCHLIST', item.suggestion); // 搜索历史存储
      // 更新页面展示
      this.searchHistoryList = this.$store.state.user.searchList.filter((item, index) => {
        return index < 6;
      });
      this.$router.push({
        name: 'search',
        query: {
          val: item.suggestion,
          searchKeyword: item.suggestion
        } 
      })
    },
    getSearchPull() {
      getSearchPull({ queryName: this.searchVal, hits: 10 }).then(res => {
        this.searchPullList = res.data.suggestions;
        this.list = [];
      })
    }
  },
}
</script>

<style lang="less" scoped>
.tag-name{
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #F8F8F8;
}
.delete-style{
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
}
.w-230{
  width: 230px;
}
.product-search{
  width: 79%;
  height: 100%;
  .product-search-filter{
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .product-search__btn{
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    button{
      width: 50%;
      height: 48px;
      outline: none;
      border: none;
    }
    .product-search__btn--reset{
      background-color: rgba(255, 102, 102, 0.05);
    }
  }
}
.ptb-6{
  padding-top: 6px!important;
  padding-bottom: 6px!important;
}
.mt-32{
  margin-top: 32px;
}
.w-130{
  width: 130px;
}
.mt-6{
  margin-top: 6px;
}
.w-84{
  width: 84px;
}
.odd-0{
  &:nth-child(odd) {
    margin-left: 0!important;
  }
}
.odd-3{
  &:nth-child(3n+1) {
    margin-left: 0!important;
  }
}
.v-100{
  height: 100%;
  overflow: scroll;
}
</style>
<style lang="less">
.pr-60{
  padding-right: 60px!important;
}
</style>