<script setup>
import ModalViewComponent from "@/components/UI/ModalViewComponent.vue";
import PieChartComponent from "@/components/UI/PieChartComponent.vue";
import Dropdown from "primevue/dropdown";
import LoaderComponent from "@/components/UI/LoaderComponent.vue";
import Button from "primevue/button";
import FormMedicationComponent from "@/components/medications/FormMedicationComponent.vue";
import MedicationsComponent from "@/components/medications/MedicationsComponent.vue";
import {useMedicationStore} from "@/stores/medications.store.js";
import {ref} from "vue";
import PaginateComponent from "@/components/UI/PaginateComponent.vue";


const medicalStore = useMedicationStore();
const selectedFilterMed = ref({
  name: '',
  doctor: '',
  patient: ''
});

const sort = () => {
  medicalStore.filter(selectedFilterMed.value);
}
</script>

<template>
  <main>
    <div class="chart-box">
      <div class="total-head">
        <div class="btn-add mob-btn">
          <Button class="btn" label="Add new medication" @click="medicalStore.toggleShow"/>
        </div>
        <p>Expenses:</p><span>{{medicalStore.totalCount}} RUB</span>
      </div>
      <div class="pie-chart">
        <PieChartComponent :chart-data="medicalStore.chartMedicationsConfig"/>
      </div>
    </div>
    <div class="panel">
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
      <div class="btn-add desktop-btn">
        <Button class="btn" label="Add new medication" @click="medicalStore.toggleShow"/>
      </div>
    </div>
      <ModalViewComponent v-if="medicalStore.config.showForm"
                          @exit="medicalStore.toggleShow"
                          :config="medicalStore.config"
                          :title="'Fill fields below about medication:'">
        <FormMedicationComponent/>
      </ModalViewComponent>
      <div>
        <LoaderComponent v-if="medicalStore.config.showLoader"/>
        <MedicationsComponent/>
      </div>
    <PaginateComponent :num="medicalStore.getPages"
                       :chosenPage="medicalStore.config.paginatePage"
                       @paginate="medicalStore.changePaginate"
                       @change="medicalStore.changeItemsOnPage"/>
  </main>

</template>

<style scoped>
main{
  display: flex;
  flex-direction: column;

}
.title h3{
  margin: 0;
}
.panel{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
}
.panel div{
  margin-right: 5px;
}
.panel div span{
  font-size: 12px;
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
  .panel div{
    max-width: 140px;
  }
  .panel div input{
    padding: 7px;
  }

}
@media screen and (max-width: 488px){
  .pie-chart{
    max-width: 240px;
  }
  .panel div{
    max-width: 125px;
  }
}
@media screen and (max-width: 466px){
  .pie-chart{
    max-width: 180px;
  }
  .panel div{
    max-width: 110px;
  }
  .btn-add button{
    font-size: 12px;
    padding: 8px 6px;
  }
}
@media screen and (max-width: 425px){
  .panel div{
    max-width: 90px;
  }
}
</style>