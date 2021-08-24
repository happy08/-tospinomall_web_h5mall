<template>
  <div class="p-20 algolia-container">
    <ais-instant-search index-name="demo_ecommerce" :search-client="searchClient">
      <!-- <div class="top-panel"> -->
        <!-- 清除按钮，清除当前的细化 -->
        <!-- <ais-clear-refinements /> -->
        <!-- <h2>Brands</h2> -->
        <!-- 显示品牌列表过滤搜索 -->
        <ais-refinement-list attribute="categories" :sortBy="['name']" searchable />
        <!-- 允许传递搜索参数，在这里设置每页显示的点击次数 -->
        <!-- 该ais-configure部件是renderless，没有做任何输出到DOM -->
        <!-- <ais-configure :hitsPerPage="8" /> -->
      <!-- </div> -->
      <div class="result-panel">
        <!-- 搜索框，供用户输入关键字查询 -->
        <!-- <ais-search-box /> -->
        <!-- 显示查询结果 -->
        <!-- <ais-hits> -->
          <!-- <div slot="item" class="result-panel__item" slot-scope="{ item }">
            <h2>{{ item.name }}</h2>
          </div> -->
        <!-- </ais-hits> -->
      </div>
    </ais-instant-search>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/reset.css';
import 'instantsearch.css/themes/satellite-min.css';

export default {
  data() {
    return {
      searchClient: algoliasearch(
        '62MLEBY33X',
        'b8f81ef6a145b0e57dd10b020d1c0c54',
        {
          timeout: {
            read: 20 // 时间设置为20秒
          }
        }
      ).initIndex('tospinoMall'),
    };
  },
  mounted() {
    // 覆盖默认的请求超时时间
    // this.searchClient.search('query string', {
    //   timeout: {
    //     read: 20 // 时间设置为20秒
    //   },
    //   headers: {
    //     // language: 'en'
    //   }
    // }).then(({ hits }) => {
    //   console.log('成功-')
    //   console.log(hits)
    // }).catch(error => {
    //   console.log('失败-')
    //   console.log(error)
    // })

  }
};
</script>

<style lang="less">
.algolia-container{
  .ais-RefinementList-searchBox, .ais-SearchBox{
    height: 40px;
    .ais-SearchBox-form{
      height: 100%;
      &::before{
        left: 10px;
        height: 20px;
        width: 20px;
        margin-top: 0;
        transform: translateY(-50%);
        background-repeat: no-repeat;
      }
      .ais-SearchBox-input{
        font-size: 14px;
        padding-left: 40px;
      }
    }
  }
  .ais-Hits-item{
    padding: 10px;
    font-size: 14px;
    h2{
      line-height: 20px;
    }
  }
  // .ais-HierarchicalMenu-item, .ais-Menu-item, .ais-NumericMenu-label, .ais-RatingMenu-item, .ais-RefinementList-item, .ais-ToggleRefinement-label{
  //   font-size: 16px;
  // }
  .ais-RefinementList-list{
    .ais-RefinementList-item, .ais-RefinementList-label{
      font-size: 16px;
    }
  }
}
</style>
