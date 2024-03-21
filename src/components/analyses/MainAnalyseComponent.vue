<script setup>
import ModalViewComponent from "@/components/UI/ModalViewComponent.vue";
import Dropdown from "primevue/dropdown";
import AnalysesComponent from "@/components/analyses/AnalysesComponent.vue";
import FormAnalysisComponent from "@/components/analyses/FormAnalysisComponent.vue";
import LoaderComponent from "@/components/UI/LoaderComponent.vue";
import {useAnalysisStore} from "@/stores/analyses.store.js";
import {ref} from "vue";
import ChartBoxComponent from "@/components/widgets/ChartBoxComponent.vue";
import ButtonAddComponent from "@/components/UI/ButtonAddComponent.vue";

const selectedFilterAnalysis = ref('');
const analyseStore = useAnalysisStore();
const sort = () => {
  analyseStore.filter(selectedFilterAnalysis.value);
}

</script>

<template>
  <main>
    <ChartBoxComponent :total-count="+analyseStore.totalCount"
                       :chart-config="analyseStore.chartAnalysesConfig">

      <ButtonAddComponent :toggle-form="analyseStore.toggleShow"
                          :label="'Add new analysis'" :is-mobile="true" />
    </ChartBoxComponent>


      <div class="panel">
        <Dropdown v-model="selectedFilterAnalysis"
                  :options="analyseStore.filteredKeys"
                  @change="sort"
                  showClear placeholder="select analysis"
                  class="w-full md:w-14rem dropdown" />
        <ButtonAddComponent :toggle-form="analyseStore.toggleShow"
                            :label="'Add new analysis'" :is-mobile="false" />
      </div>

      <ModalViewComponent v-if="analyseStore.config.showForm"
                          @exit="analyseStore.toggleShow"
                          :config="analyseStore.config"
                          :title="'Fill fields below about analysis:'">
        <FormAnalysisComponent/>
      </ModalViewComponent>

      <div>
        <LoaderComponent v-if="analyseStore.config.showLoader"/>
        <AnalysesComponent v-else :total-count="+analyseStore.totalCount"
                          :filtered-analyses="analyseStore.filteredAnalyses"/>
      </div>

<!--      <PaginateComponent :num="analyseStore.getPages"
                       :chosenPage="analyseStore.config.paginatePage"
                       @paginate="analyseStore.changePaginate"
                       @change="analyseStore.changeItemsOnPage"/>-->

  </main>
</template>



<style scoped>
main{
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  overflow: visible;
}
.dropdown svg{
  margin: auto;
}
.title h3{
  margin: 0;
}

.panel{
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
}

.btn-add {
  display: flex;
  justify-content: end;
  margin: 0 20px;
}
.desktop-btn{
  display: flex;
}
.mob-btn{
  display: none;
}
.chart-box{
  max-width: 35%;
  max-height: 300px;
  margin: 0 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  align-self: end;
}
.total-head{
  border: none;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-head span {
  margin-left: 20px;
  color: red;
  font-weight: bold;
}
.dropdown{
  max-width: 300px;
  width: 100%;
  max-height: 40px;
  height: 100%;
}
@media screen and (max-width: 696px){
  .chart-box{
    flex-direction: row;
    justify-content: space-between;
    max-width: 100%;
    align-self: normal;
    margin: 0 ;
  }
  .desktop-btn{
    display: none;
  }
  .mob-btn{
    display: flex;
    margin: 0;
    align-self: start;
  }
  .mob-btn button{
    font-size: 14px;
    padding: 15px;
  }
  .total-head span{
    margin: 0;
  }
  .total-head{
    flex-direction: column;
    align-items: start;
  }
  td{
    padding: 0;
  }
  .pie-chart{
    max-width: 300px;
  }

}
@media screen and (max-width: 540px){
  .mob-btn button{
    padding: 10px;
  }
  .dropdown{
    max-width: 200px;
  }
  .dropdown span{
    font-size: 12px;
  }
}
@media screen and (max-width: 488px){
  .pie-chart{
    max-width: 240px;
  }
}
@media screen and (max-width: 466px){
  .pie-chart{
    max-width: 180px;
  }
  .btn-add button{
    font-size: 12px;
    padding: 8px 6px;
  }
}
</style>