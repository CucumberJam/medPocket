<script setup>
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import {computed, ref} from "vue";
import {useAnalysisStore} from "@/stores/analyses.store.js";

const newAnalysis = ref({
  name: '',
  date: '',
  min: '',
  max: '',
  value: '',
  cost: ''
});
const analyseStore = useAnalysisStore();
const add = async () => {
  if(checkFields.value){
    analyseStore.config.success = 'Thank you!';
    let corrected = formatData.value;
    await analyseStore.add(corrected);
  }else{
    analyseStore.config.error = checkFields.value.error;
  }
  clear();
}
const checkFields = computed(()=> {
  for(let key in newAnalysis.value){
    if(key === 'min' || key === 'max') continue;
    if(newAnalysis.value[key] === '') {
      return {error: `Fill ${key} please!`};
    }
  }
  return true;
})
const formatData = computed(()=>{
  let object = {};
  for(let key in newAnalysis.value){
    if(key === 'name') {
      object[key] = newAnalysis.value[key].toUpperCase().trim();
    }
    else if(key === 'date') {
      let date = Date.parse(newAnalysis.value[key]);
      let dateCorrect = new Date(date);
      let year = dateCorrect.getFullYear();
      let month = dateCorrect.getMonth()+1;
      if(month < 10) month = '0'+ month;
      let day = dateCorrect.getDate();
      if(day < 10) day = '0'+ day;

      object[key] = `${year}/${month}/${day}`;
    }  else if(key === 'cost'){
      object[key] = +newAnalysis.value[key];
    } else object[key] = newAnalysis.value[key];
  }
  return object;
})
const clear = () => {
  analyseStore.config.error = '';
  analyseStore.config.success = '';
  for(let key in newAnalysis.value){
    newAnalysis.value[key] = '';
  }
}
</script>


<template>
  <form>
    <div class="flex flex-column gap-2">
      <label for="analysisName">Analysis name:</label>
      <InputText id="analysisName" v-model="newAnalysis.name" aria-describedby="analysis-help" />
    </div>
    <div>
      <p class="title">Date of the analysis: </p>
      <Calendar v-model="newAnalysis.date" dateFormat="dd/mm/yy" />
    </div>
    <div>
      <p class="title">Value: </p>
      <InputNumber v-model="newAnalysis.value" inputId="locale-user" :minFractionDigits="2" />
    </div>
    <div>
      <p class="title">Minimal accessible value: <span>(not required)</span></p>
      <InputNumber v-model="newAnalysis.min" inputId="locale-user" :minFractionDigits="2" />
    </div>
    <div>
      <p class="title">Maximal accessible value: <span>(not required)</span></p>
      <InputNumber v-model="newAnalysis.max" inputId="locale-user" :minFractionDigits="2" />
    </div>
    <div>
      <p class="title">Cost: </p>
      <InputNumber v-model="newAnalysis.cost" inputId="currency-germany" mode="currency" currency="RUB" locale="de-DE" />
    </div>
    <div>
      <Button class="btn" label="Add" @click="add"/>
    </div>
  </form>
</template>

<style scoped>
.btn{
  margin-top: 15px;
  width: 100%;
}
.title{
  font-size: 14px;
}
.title span{
  font-size: 10px;
  font-style: italic;
  color: blueviolet;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>