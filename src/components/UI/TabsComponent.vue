<script setup>
import {RouterLink} from "vue-router";
import {ref} from "vue";

const props = defineProps({
  changeMode: Function
})
const activeTab = ref('Analyses');
const setTab = (nameTab) => {
  activeTab.value = nameTab;
  props.changeMode(nameTab);
}
</script>

<template>
  <div class="tabs">
    <RouterLink to="/analyses"  @click="setTab('Analyses')"
                :class="['btn-tabs', {'btn_green': activeTab === 'Analyses'}]">
      Analyses
    </RouterLink>
    <RouterLink to="/medications" @click="setTab('Medications')"
                :class="['btn-tabs', {'btn_green': activeTab === 'Medications'}]">
      Medications
    </RouterLink>
  </div>

</template>

<style scoped>
.btn-tabs {
  padding: 10px 0;
  text-decoration: none;
  text-align: center;
  border: none;
  width: 110px;
  max-height: 40px;
  height: 100%;
  font-size: 16px;
  margin: 0 3px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
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
@media screen and (max-width: 696px){
  .tabs{
    max-width: 250px;
    height: 100%;
  }
  .btn-tabs {
    max-width: 50%;
    min-height: 35px;
  }
  .mob-btn button{
    font-size: 14px;
    padding: 15px;
  }
  .total-head span{
    margin: 0;
  }
  td{
    padding: 0;
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
  .tabs{
    margin: 0 5px 1px 5px;
  }
  .btn-tabs{
    max-width: 100px;
    font-size: 13px;
  }
}
</style>