<template>
  <van-sku
    v-model="productShow.show"
    :sku="sku"
    :goods="goodSpuVo"
    :goods-id="goodSpuVo.id"
    :hide_stock="false"
    @sku-selected="getSkuInfo"
    :initial-sku="initialSku"
    hide-selected-text
    hide-stock
    ref="productSku"
    class="custom-sku-container"
  >
    <!-- 自定义头部价格/展示商品id -->
    <template #sku-header-price="props">
      <div class="fs-16 red fw flex vcenter">
        <span class="fm-menlo">{{ $store.state.rate.currency }}</span>
        <span class="fm-din">{{ props.price }}</span>
      </div>
      <div class="mt-14 fs-12 light-grey fm-pf-r" v-if="props.selectedSkuComb">ID: {{ props.selectedSkuComb.id }}</div>
    </template>

    <!-- 商品数量选择区域 -->
    <template #sku-stepper="props">
      <div class="tr plr-20 mt-24">
        <van-stepper
          v-model="props.selectedNum"
          input-width="0.796rem"
          button-size="0.42rem"
          :integer="true"
          class="custom-stepper"
          :max="props.selectedSkuComb ? props.selectedSkuComb.stock_num : 100000"
          @change="getSkuInfo(props, 'stepper')"
        />
        <div class="mt-20" v-if="props.selectedSkuComb">
          in stock: {{ props.selectedSkuComb.stock_num }}
        </div>
      </div>
    </template>

    <!-- 操作按钮区域 -->
    <template #sku-actions="props">
      <!-- 购物车-是修改商品sku -->
      <template v-if="type == 'cart' || type == 'product' || type == 'buy'">
        <div class="mlr-12 mb-30 mt-10" v-if="props.selectedSkuComb && props.selectedSkuComb.stock_num == 0">
          <BmButton class="fs-16 round-8 w-100 h-48 bg-ddd" @click="onOutStock">out of stock</BmButton>
        </div>
        <div class="mlr-12 mb-12 mt-10" v-else>
          <BmButton class="fs-16 round-8 w-100 h-48" @click="onChange">确认</BmButton>
        </div>
      </template>
      <template v-else>
        <!-- 缺货 -->
        <div class="mlr-12 mb-30 mt-10" v-if="props.selectedSkuComb && props.selectedSkuComb.stock_num == 0">
          <BmButton class="fs-16 round-8 w-100 h-48 bg-ddd" @click="onOutStock">out of stock</BmButton>
        </div>
        <div class="mlr-12 mb-12 mt-10 flex between" v-else>
          <!-- 加入购物车 -->
          <BmButton :type="'info'" class="fs-16 round-8 w-169 h-48 add-cart-btn" @click="onConfirm(false)">Add to cart</BmButton>
          <!-- 立即购买 -->
          <BmButton class="fs-16 round-8 w-169 h-48" @click="onConfirm(true)">Buy Now</BmButton>
        </div>
      </template>
    </template>
  </van-sku>
</template>

<script>
import { Sku, Stepper } from 'vant';
import { addCart, getSkuStock, modifySku } from '@/api/cart';

export default {
  components: {
    vanSku: Sku,
    vanStepper: Stepper
  },
  props: {
    sku: {
      type: Object,
      default: {}
    },
    initialSku: {
      type: Object,
      default: {}
    },
    goodSpuVo: {
      type: Object,
      default: {}
    },
    productShow: {
      type: Object,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectSku: {}
    }
  },
  activated() {
    console.log('进入')
  },
  methods: {
    async onConfirm(flag) { // 确认加入
      if (!this.selectSku.selectedSkuComb) {
        this.$toast('请先选择商品规格');
        return false;
      }
      const num = await this.getSkuStock();
      if (num > this.selectSku.selectedNum) {
        if (flag) { // 立即购买
          this.$router.push({
            name: 'cart-order-id',
            params: {
              id: JSON.stringify({skuItems: [{ quantity: this.selectSku.selectedNum, skuId: this.selectSku.selectedSkuComb.id }]})
            }
          })
          return false;
        }

        addCart({ quantity: this.selectSku.selectedNum, skuId: this.selectSku.selectedSkuComb.id }).then(res => {
          this.$toast.success('添加成功');
          this.productShow.show = false;
        })
      }
    },
    onOutStock() { // 售空
      this.productShow.show = false;
    },
    getSkuInfo(value, type) { // 获取选中的产品规格
      if (this.$refs.productSku) {
        this.selectSku = this.$refs.productSku.getSkuData(); // 得到已选择的商品属性
        if (type === 'stepper') {
          this.selectSku = {
            ...this.selectSku,
            selectedNum: value.selectedNum
          };
        }
        // 商品图片展示切换
        this.goodSpuVo.picture = value.selectedSkuComb ? value.selectedSkuComb.picture : this.goodSpuVo.picture;
        // 针对商品详情需要展示选中的规格属性
        let selectedSku = Object.values(value.selectedSku);
        selectedSku = selectedSku.filter(item => {
          return item != '';
        })
        this.$emit('onSkuInfo', selectedSku);
      }
    },
    getSkuStock() { // 判断库存是否充足
      this.selectSku = this.$refs.productSku.getSkuData();
      return new Promise(resolve => {
        getSkuStock(this.selectSku.selectedSkuComb.id).then(res => {
          resolve(res.data);
        })
      })
    },
    async onModifyConfirm() { // 修改商品属性
      const num = await this.getSkuStock();
      if (num > this.selectSku.selectedNum) { // 库存充足
        modifySku({ newSkuId: this.selectSku.selectedSkuComb.id, oldSkuId: this.initialSku.id }).then(res => {
          if (res.code != 0) return false;
          this.productShow.show = false;
          this.$emit('onRefresh');
        })
      }
    },
    onChange() {
      return this.type == 'product' ? this.onConfirm(false) : this.type == 'buy' ? this.onConfirm(true) : this.onModifyConfirm();
    }
  },
}
</script>

<style lang="less" scoped>
.w-169{
  width: 169px;
}
.h-48{
  height: 48px!important;
}
.add-cart-btn {
  border-color: #e5e5e5 !important;
  background-color: rgba(255, 118, 18, 0.05) !important;
  color: #ec500d !important;
}
.bg-ddd {
  background: #dddddd !important;
}
</style>