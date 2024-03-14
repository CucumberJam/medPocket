<script setup>
import InputText from "primevue/inputtext";
import 'primeicons/primeicons.css'
import {ref} from "vue";

const props = defineProps({
  id_user: String,
  mode: {
    type: String,
    default: 'Analyses'
  },
  filterAnalyses: Function,
  filterMedications: Function
});

const query = ref('');
const isSorting = ref(false);
const sort = () =>{
  isSorting.value = true;

  if(props.mode === 'Analyses'){
    props.filterAnalyses(query.value);
  } else{
    props.filterMedications({name: query.value, doctor: '', patient: ''});
  }
  isSorting.value = false;
}
</script>

<template>
  <div v-if="id_user" class="nav_item search-box">
    <label for="search" style="font-size: 12px; padding-top: 0"></label>
    <InputText class="input-search" id="search" placeholder="Search..."
               v-model="query"
               @input.prevent='sort'/>
    <div class="search-icon">
      <i v-if="!isSorting" class="pi pi-search" style="color: #708090"></i>
      <i v-else class="pi pi-spin pi-spinner" style="color: #708090"></i>
    </div>
  </div>
</template>

<style scoped>
.nav_item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
  overflow: visible;
}
.input-search{
  padding-left: 10px;
  max-width: 250px;
  width: 100%;
  min-height: 30px;
  height: 100%;
  min-width: 80px;
  outline: none;
  border: none;
  box-shadow: none;
  overflow: visible;
}
.search-box{
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline-color: transparent;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05);
  color: #334155;
  overflow: visible;
}
.search-icon{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  overflow: visible;
}
</style>