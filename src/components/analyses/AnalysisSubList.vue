<script setup>
import {useAnalysisStore} from "@/stores/analyses.store.js";
import {computed, ref} from "vue";

const analyseStore = useAnalysisStore();

const props = defineProps({
  analysisInSubList: {
    id: String,
    date: Date,
    min: {
      type: Number,
      required: false,
    },
    max: {
      type: Number,
      required: false,
    },
    value: Number,
    cost: Number,
    id_analysis: String,
  },
  minValue: {
    type: Number,
    required: false,
    default: 0,
  },
  maxValue: {
    type: Number,
    required: false,
    default: 0,
  }
});
const max = ref(props.maxValue);
const min = ref(props.minValue);
const value = ref(props.analysisInSubList.value);

const outOfRange = computed (()=> {
  if(min.value > 0 && max.value > 0){
    return (value.value < min.value || value.value > max.value);
  } else return false;
});

</script>

<template>
      <tr class="card-sub">
        <td>
          <div class="value-box">
            {{analysisInSubList.date}}
          </div>
        </td>
        <td>
          <div class="value-box">
            <span :class="{'in_danger': outOfRange}">{{analysisInSubList.value}}</span>
          </div>
        </td>
        <td>
          <div class="value-box">
            {{analysisInSubList.cost}}
          </div>
        </td>
        <td>
          <div class="icon">
            <i class="pi pi-trash" style="font-size: 1rem; color: #8B5CF6"
               @click="analyseStore.deleteAnalysis(analysisInSubList) "></i>
          </div>
        </td>
      </tr>

</template>

<style scoped>
.card-sub{
  border-top: 1px solid red;
}
td{
  max-width: 50px;
}
.btn{
  opacity: 80%;
  max-width: 85px;
  width: 100%;
  padding: 5px;
}
.icon{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
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