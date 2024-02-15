<script setup>
import 'primeicons/primeicons.css';
import AnalysisSubList from "@/components/analyses/AnalysisSubList.vue";
import {computed, ref} from "vue";
import InputText from "primevue/inputtext";
import {useAnalysisStore} from "@/stores/analyses.store.js";
import colors from "@/assets/colors.js";
import LineChartComponent from "@/components/UI/LineChartComponent.vue";

const analyseStore = useAnalysisStore();

const props = defineProps({
  analysis: {
    id: String,
    name: String,
    date_last: Date,
    value_avg: Number,
    min: {
      type: Number,
      required: false,
    },
    max: {
      type: Number,
      required: false,
    },
    total_cost: Number,
    list: {
      type: Array,
      default: () => [],
    }
  }
});
const showList = ref(false);

const maxAnalysis = ref(+props.analysis.max);
const minAnalysis = ref(+props.analysis.min);
const valueAnalysis = ref(+props.analysis.value_avg);
const idAnalysis = ref(props.analysis.id);
const analysisList = ref(props.analysis.list);
const analysisName = ref(props.analysis.name);

const outOfRange = computed (()=> {
  if(minAnalysis.value > 0 && maxAnalysis.value > 0){
    return (valueAnalysis.value < minAnalysis.value || valueAnalysis.value > maxAnalysis.value);
  } else return false;
});

const minIsEdit = ref(false);
const maxIsEdit = ref(false);

const toggleMinMax = (nameValue) => {
  if(nameValue === 'min') minIsEdit.value = !minIsEdit.value;
  else maxIsEdit.value = !maxIsEdit.value;
}
const changeMinMax = async(nameValue) => {
  if(nameValue === 'min') {
    await analyseStore.changeMinMax(idAnalysis.value, 'min', minAnalysis.value);
    toggleMinMax('min');
  }
  else {
    await analyseStore.changeMinMax(idAnalysis.value, 'max', maxAnalysis.value);
    toggleMinMax('max');
  }
}

const chartAnalysisConfig = computed(()=> {
  let dates = [];
  let values = [];

  //элементы отсортированы по датам от свежей к более старой
  // для графика нам нужно наоборот от старых к свежим:

  let reversed = [...analysisList.value].reverse();

  reversed.forEach(elem => {
    dates.push(elem.date);
    values.push(elem.value);
  });

  return {
    labels: dates,
    datasets: [
      {
        label: 'Minimum',
        borderColor: '#DD1B16',
        backgroundColor: '#DD1B16',
        data: Array(values.length).fill(minAnalysis.value)
      },
      {
        label: analysisName.value,
        borderColor: colors[0],
        backgroundColor: colors[0],
        data: values
      },
      {
        label: 'Maximum',
        backgroundColor: '#DD1B16',
        borderColor: '#DD1B16',
        data: Array(values.length).fill(maxAnalysis.value)
      }
    ]
  }

});

</script>

<template>
    <tr class="card-main">
      <td v-if="analysis.list" @click="showList = !showList">
        <i v-if="showList" class="pi pi-angle-down" style="color: #708090"></i>
        <i v-else class="pi pi-angle-up" style="color: #708090"></i>
      </td>
      <td v-else></td>
      <td>
        <div class="value-box">
          {{analysis.name}}
        </div>
      </td>
      <td>
        <div class="value-box">
          {{analysis.date_last}}
        </div>
      </td>
      <td>
        <div class="value-box">
          <span :class="{'in_danger': outOfRange}">
          {{analysis.value_avg}}
          </span>
        </div>
      </td>

      <td v-if="!minIsEdit">
        <div class="value-box">
          {{minAnalysis}}
        </div>
      </td>
      <td v-if="!minIsEdit">
        <div class="value-box">
          <i @click="toggleMinMax('min')" class="pi pi-pencil"
             style="font-size: 0.75rem"></i>
        </div>
      </td>
      <td v-else colspan="2">
        <div class="edit-box">
          <InputText class="edit-input" v-model="minAnalysis"
                     aria-describedby="analysis-help" />
            <i class="pi pi-check" @click="changeMinMax('min')"></i>
        </div>
      </td>

      <td v-if="!maxIsEdit">
        <div class="value-box" >
          {{maxAnalysis}}
        </div>
      </td>
      <td v-if="!maxIsEdit">
        <div class="value-box">
          <i @click="toggleMinMax('max')" class="pi pi-pencil" style="font-size: 0.75rem"></i>
        </div>
      </td>
      <td v-else colspan="2">
        <div class="edit-box">
          <InputText class="edit-input" v-model="maxAnalysis"
                     aria-describedby="analysis-help" />
          <i class="pi pi-check" @click="changeMinMax('max')"></i>
        </div>
      </td>

      <td>
        <div class="value-box">
          {{analysis.total_cost}}
        </div>
      </td>
    </tr>
    <Transition name="fade" >
      <tr v-show="showList" class="sublist">
        <td colspan="4">
<!--  LineChart        -->
        <div v-if="analysis.list.length > 1" class="line-chart">
          <LineChartComponent :chart-data="chartAnalysisConfig"/>
        </div>


        </td>
        <td colspan="5">
          <table class="subtable">
            <thead>
            <tr>
              <th>Date</th>
              <th>Value</th>
              <th colspan="2">Cost</th>
            </tr>
            </thead>
            <tbody>
              <AnalysisSubList  v-for="(elem) in analysis.list" :key="elem.id"
                              :analysisInSubList="elem"
              :min-value="+analysis.min" :max-value="+analysis.max"/>
            </tbody>
          </table>
        </td>
      </tr>
    </Transition>
</template>

<style scoped>
.card-main{
  font-weight: 500;
}
.sublist{
  background-color: white;
  border-radius: 5px;
  position: relative;
  top: 0;
  z-index: 3;
}
.subtable{
    border-bottom: 1px solid #ededeb;
}
.subtable thead{
  background-color: #8B5CF6;
  opacity: 80%;
}
tr{
  align-items: center;
}
td{
  max-width: 100px;
  word-wrap:break-word;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.value-box{
  display: flex;
  justify-content: center;
}
.in_danger{
  padding: 3px;
  background-color: red;
  opacity: 70%;
  border-radius: 50%;
}
.edit-input{
  position: relative;
  z-index: 3;
  max-width: 40px;
  margin-right: 3px;
  text-align: center;
  padding: 0;
}
.edit{
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.line-chart{
  border-top:1px solid grey;
  border-bottom:1px solid grey;
}
@media screen and (max-width: 696px){
  table thead th{
    padding: 8px 7px;
    font-size: 13px;
  }
  td{
    padding: 3px;
    font-size: 12px;
  }
}
@media screen and (max-width: 500px) {
  table thead th {
    padding: 6px 5px;
    font-size: 12px;
  }
  td {
    padding: 0;
    font-size: 10px;
  }
}
</style>