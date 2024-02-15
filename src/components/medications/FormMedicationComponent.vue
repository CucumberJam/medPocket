<script setup>
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Checkbox from 'primevue/checkbox';
import {computed, ref} from "vue";
import {useMedicationStore} from "@/stores/medications.store.js";

const medicalStore = useMedicationStore();
const newMedication = ref({
  name: '',
  date: '',
  cost: '',
  doctor: '',
  patient: '',
  check: false
});
const add = async () => {
  if(checkFields.value){
    medicalStore.config.success = 'Thank you!';
    let corrected = formatData.value;
    await medicalStore.add(corrected);
  } else{
    medicalStore.config.error = checkFields.value.error;
  }
  clear();
}
const checkFields = computed(()=> {
  for(let key in newMedication.value){
    if(key === 'doctor' || key === 'patient') continue;
    if(newMedication.value[key] === '') {
      return {error: `Fill ${key} please!`};
    }
  }
  return true;
});
const formatData = computed(()=>{
  let object = {};
  for(let key in newMedication.value){
    if(key === 'name') {
      object[key] = newMedication.value[key].toUpperCase().trim();
    }
    else if(key === 'date') {
      let date = Date.parse(newMedication.value[key]);
      let dateCorrect = new Date(date);
      let year = dateCorrect.getFullYear();
      let month = dateCorrect.getMonth()+1;
      if(month < 10) month = '0'+ month;
      let day = dateCorrect.getDate();
      if(day < 10) day = '0'+ day;

      object[key] = `${day}.${month}.${year}`;
    } else object[key] = newMedication.value[key];
  }
  return object;
})
const clear = () => {
  medicalStore.config.error = '';
  medicalStore.config.success = '';

  for(let key in newMedication.value){
    if(key === 'check') newMedication.value[key] = false;
    else newMedication.value[key] = '';
  }
  medicalStore.toggleShow();
}
</script>

<template>
  <form>
    <div class="flex flex-column gap-2 form-item">
      <label for="medicationName">Medication name:</label>
      <InputText id="medicationName" v-model="newMedication.name" aria-describedby="analysis-help" />
    </div>
    <div class="form-item flex flex-column gap-2">
      <label for="medicationDate">Date of buying medication: </label>
      <div id="medicationDate">
        <Calendar v-model="newMedication.date" dateFormat="dd.mm.yy" />
      </div>
    </div>
    <div class="form-item flex flex-column gap-2">
      <label for="medicationCost">Cost: </label>
      <div id="medicationCost">
        <InputNumber v-model="newMedication.cost" inputId="locale-user" :minFractionDigits="2" />
      </div>
    </div>
    <div class="flex flex-column gap-2 form-item">
      <label for="medicationDoctor">Doctor that prescribed medication:</label>
      <span class="notrequired">(not required)</span>
      <InputText id="medicationDoctor" v-model="newMedication.doctor" aria-describedby="analysis-help" />
    </div>
    <div class="flex flex-column gap-2 form-item">
      <label for="medicationPatient">Patient name: <span class="notrequired">(not required)</span></label>
      <InputText id="medicationPatient" v-model="newMedication.patient" aria-describedby="analysis-help" />
    </div>
    <div class="flex flex-row gap-2 form-item ">
      <span>Do you have a check? </span>
      <Checkbox v-model="newMedication.check" :binary="true" />
    </div>
    <div class="form-item">
      <Button class="btn" label="Add" @click="add"/>
    </div>
  </form>

</template>

<style scoped>
.form-item{
  margin: 10px 0;
}
.btn{
  margin: 15px 0;
  width: 100%;
}
.notrequired{
  font-size: 10px;
  font-style: italic;
  color: blueviolet;
}
</style>