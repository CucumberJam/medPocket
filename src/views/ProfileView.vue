<script setup>
import {useAuthStore} from "@/stores/auth.js";
import {ref} from "vue";
import {RouterLink} from "vue-router";

const authStore = useAuthStore();

const activeTab = ref('Analyses');
const setTab = (nameTab) => {
  activeTab.value = nameTab;
}


</script>

<template>
  <div class="wrapper">
    <header class="head-profile">
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
      <div class="title">
        <h3>{{authStore.user.name}}</h3>
      </div>
    </header>
    <RouterView/>
  </div>
</template>

<style scoped>
main{
  display: flex;
  flex-direction: column;

}
.title{
  right: 10%;
  position: relative;
  top: 10px;
  font-size: 24px;
  color:#8B5CF6;
  text-shadow: 0px 0px 2px rgba(71,31,19,0.98);
}
.title h3{
  margin: 0;
}
.wrapper{
  margin: 0 auto;
}
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
.head-profile{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.total-head span {
  margin-left: 20px;
  color: red;
  font-weight: bold;
}
.filter-box div{
  margin-right: 5px;
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
  .title{
    right: 0;
  }
  .tabs{
    margin: 0 5px 1px 5px;
  }
  .btn-tabs{
    max-width: 100px;
    font-size: 13px;
  }
  .title{
    font-size:18px;
  }
}
</style>