<script setup>
import Button from "primevue/button";
import AnalysesComponent from "@/components/analyses/AnalysesComponent.vue";
import LoaderComponent from "@/components/UI/LoaderComponent.vue";
import Dropdown from 'primevue/dropdown';
import MedicationsComponent from "@/components/medications/MedicationsComponent.vue";
import ModalViewComponent from "@/components/UI/ModalViewComponent.vue";
import FormAnalysisComponent from "@/components/analyses/FormAnalysisComponent.vue";
import FormMedicationComponent from "@/components/medications/FormMedicationComponent.vue";
import PieChartComponent from "@/components/UI/PieChartComponent.vue";
import {useAnalysisStore} from "@/stores/analyses.store.js";
import {useMedicationStore} from "@/stores/medications.store.js";
import {useAuthStore} from "@/stores/auth.js";
import {ref} from "vue";


const analyseStore = useAnalysisStore();
const medicalStore = useMedicationStore();
const authStore = useAuthStore();

const activeTab = ref('Analyses');
const setTab = (nameTab) => {
  authStore.mode = nameTab;
  activeTab.value = nameTab;
}
const selectedFilterMed = ref({
  name: '',
  doctor: '',
  patient: ''
});
const selectedFilterAnalysis = ref('');

const sort = () => {
  if(authStore.mode === 'Analyses'){
    analyseStore.filter(selectedFilterAnalysis.value);
  } else{
    medicalStore.filter(selectedFilterMed.value);
  }
}

</script>

<template>
  <div class="wrapper">
    <header class="head-profile">
      <div class="title">
        <h3>{{authStore.user.name}}</h3>
      </div>
    </header>
    <main>
      <div class="chart-box" v-if="activeTab === 'Analyses'">
        <div class="total-head">
          <div class="btn-add mob-btn" v-if="activeTab === 'Analyses'">
            <Button class="btn" label="Add new analysis" @click="analyseStore.toggleShow"/>
          </div>
          <p>Expenses:</p><span>{{analyseStore.totalCount}} RUB</span>
        </div>
        <div class="pie-chart">
          <PieChartComponent :chart-data="analyseStore.chartAnalysesConfig"/>
        </div>
      </div>
      <div class="chart-box" v-else>
        <div class="total-head">
          <div class="btn-add mob-btn" v-if="activeTab === 'Medications'">
            <Button class="btn" label="Add new medication" @click="medicalStore.toggleShow"/>
          </div>
          <p>Expenses:</p><span>{{medicalStore.totalCount}} RUB</span>
        </div>
        <div class="pie-chart">
          <PieChartComponent :chart-data="medicalStore.chartMedicationsConfig"/>
        </div>
      </div>
      <div>
        <div class="panel">
          <div class="tabs">
            <button :class="['btn-tabs', {'btn_green': activeTab === 'Analyses'}]"
                    @click="setTab('Analyses')">Analyses
            </button>
            <button :class="['btn-tabs', {'btn_green': activeTab === 'Medications'}]"
                    @click="setTab('Medications')">Medications
            </button>
            <Dropdown v-if="activeTab === 'Analyses'"
                      v-model="selectedFilterAnalysis"
                      :options="analyseStore.filteredKeys"
                      @change="sort"
                      showClear placeholder="select analysis"
                      class="w-full md:w-14rem" />
            <div v-else class="filter-box">
              <Dropdown
                  v-model="selectedFilterMed.name"
                  :options="medicalStore.filteredKeys.names"
                  @change="sort"
                  showClear placeholder="medication:"
                  class="w-full md:w-14rem" />
              <Dropdown
                  v-model="selectedFilterMed.doctor"
                  :options="medicalStore.filteredKeys.doctors"
                  @change="sort"
                  showClear placeholder="doctor:"
                  class="w-full md:w-14rem" />
              <Dropdown
                  v-model="selectedFilterMed.patient"
                  :options="medicalStore.filteredKeys.patients"
                  @change="sort"
                  showClear placeholder="patient:"
                  class="w-full md:w-14rem" />
            </div>
          </div>
          <div class="btn-add desktop-btn" v-if="activeTab === 'Analyses'">
            <Button class="btn" label="Add new analysis" @click="analyseStore.toggleShow"/>
          </div>
          <div class="btn-add desktop-btn" v-else>
            <Button class="btn" label="Add new medication" @click="medicalStore.toggleShow"/>
          </div>
        </div>
        <ModalViewComponent v-if="analyseStore.config.showForm"
                            @exit="analyseStore.toggleShow"
                            :config="analyseStore.config"
                            :title="'Fill fields below about analysis:'">
          <FormAnalysisComponent/>
        </ModalViewComponent>
        <ModalViewComponent v-if="medicalStore.config.showForm"
                            @exit="medicalStore.toggleShow"
                            :config="medicalStore.config"
                            :title="'Fill fields below about medication:'">
          <FormMedicationComponent/>
        </ModalViewComponent>
        <div v-if="activeTab === 'Analyses'">
          <LoaderComponent v-if="analyseStore.config.showLoader"/>
          <AnalysesComponent v-else/>
        </div>
        <div v-else>
          <LoaderComponent v-if="medicalStore.config.showLoader"/>
          <MedicationsComponent/>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
main{
  display: flex;
  flex-direction: column;

}
.title{
  margin: 0 10% 0 30px;
  font-size: 24px;
}
.title h3{
  margin: 0;
}
.wrapper{
  margin: 0 auto;
  padding: 20px 0 0 0;
}
.panel{
  display: flex;
  justify-content: space-between;
}
.btn-tabs {
  border: none;
  width: 110px;
  max-height: 40px;
  height: 100%;
  font-size: 14px;
  margin: 0 3px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  cursor: pointer;
  background: #efefef;
}
.btn-tabs:hover {
  opacity: 0.7;
}
.btn_green {
  background: #37df5c;
}
.tabs {
  display: flex;
  align-items: end;
  margin: 0 10px 1px 10px;
}
.btn-add {
  display: flex;
  justify-content: end;
  margin: 0 20px;
  padding-bottom: 20px;
}
.desktop-btn{
  position: relative;
  bottom: 25px;
  display: flex;
}
.mob-btn{
  display: none;
}
.head-profile{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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
.filter-box{
  margin-left: 10px;
  max-width: 300px;
  display: flex;
  justify-content: space-between;
}
.filter-box div{
  margin-right: 5px;
}
@media screen and (max-width: 696px){
  .tabs{
    max-width: 250px;
    flex-wrap: wrap;
    height: 100%;
  }
  .btn-tabs {
    max-width: 50%;
    min-height: 35px;
  }
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
  .filter-box div{
    max-width: 100px;
    font-size: 10px;
  }
  .filter-box svg{
    width: 10px;
  }

}
@media screen and (max-width: 540px){
  .mob-btn button{
    padding: 10px;
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
}
</style>